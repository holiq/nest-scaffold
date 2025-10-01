import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '@services/prisma.service';
import {
  AuthLoginRequest,
  AuthRegisterRequest,
  RefreshTokenRequest,
} from '@requests/auth.request';
import { PrismaError } from '@utils/exceptions/prisma-error.exception';
import { RoleEnum } from '@modules/interfaces/role.interface';
import type {
  IAuthLogin,
  ITokens,
  IRefreshTokenPayload,
} from '@modules/interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(body: AuthLoginRequest): Promise<ITokens> {
    const email = body.email.toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(body.password, user.password))) {
      throw new BadRequestException('Invalid email or password');
    }

    await this.prisma.userLoginInfo.create({
      data: { userId: user.id, userEmail: user.email },
    });

    return this.generateTokens(user);
  }

  async register(body: AuthRegisterRequest): Promise<User> {
    const email = body.email.toLowerCase();
    const exists = await this.prisma.user.findUnique({ where: { email } });

    if (exists) throw new BadRequestException('Email already exists');

    return await this.prisma.$transaction(async (trx) => {
      const user = await trx.user
        .create({
          data: {
            fullname: body.fullname,
            username: body.username,
            email: email,
            password: await bcrypt.hash(body.password, 12),
          },
        })
        .catch((e) => PrismaError(e));

      const role = await trx.role.findFirst({
        where: { name: RoleEnum.USER },
      });

      await trx.pivotUserRole
        .create({
          data: {
            userId: user.id,
            roleId: role.id,
          },
        })
        .catch((e) => PrismaError(e));

      return user;
    });
  }

  async refreshToken(body: RefreshTokenRequest): Promise<ITokens> {
    const tokenPayload = await this.verifyRefresh(body.refreshToken);

    const refreshTokenRecord = await this.prisma.refreshToken.findUnique({
      where: { id: tokenPayload.tokenId },
      include: { user: true },
    });

    if (
      !refreshTokenRecord ||
      refreshTokenRecord.revokedAt ||
      refreshTokenRecord.expiresAt < new Date()
    ) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const isValidHash = await bcrypt.compare(
      body.refreshToken,
      refreshTokenRecord.token,
    );
    if (!isValidHash) {
      await this.logoutAll(refreshTokenRecord.userId);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    await this.revokeToken(refreshTokenRecord.id);

    return this.generateTokens(refreshTokenRecord.user);
  }

  async logout(refreshToken: string): Promise<void> {
    const tokenPayload = await this.verifyRefresh(refreshToken);

    const refreshTokenRecord = await this.prisma.refreshToken.findUnique({
      where: { id: tokenPayload.tokenId },
    });

    if (!refreshTokenRecord || refreshTokenRecord.revokedAt) return;

    const isValidHash = await bcrypt.compare(
      refreshToken,
      refreshTokenRecord.token,
    );
    if (isValidHash) await this.revokeToken(refreshTokenRecord.id);
  }

  async logoutAll(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });
  }

  private async generateTokens(user: User): Promise<ITokens> {
    const role = await this.prisma.pivotUserRole.findFirst({
      where: { userId: user.id },
      include: { role: true },
    });

    const accessExpiresIn = Number(process.env.JWT_EXPIRES_IN);
    const refreshExpiresIn = Number(process.env.JWT_REFRESH_EXPIRES_IN);

    const accessTokenPayload: IAuthLogin = {
      userLoginId: user.id,
      userEmail: user.email,
      userRole: role?.role.name === RoleEnum.ADMIN ? role.role.name : undefined,
    };

    const tokenId = crypto.randomUUID();
    const refreshTokenPayload: IRefreshTokenPayload = {
      userId: user.id,
      tokenId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(accessTokenPayload, {
        expiresIn: accessExpiresIn,
        subject: user.id,
      }),
      this.jwt.signAsync(refreshTokenPayload, {
        expiresIn: refreshExpiresIn,
        subject: user.id,
      }),
    ]);

    const refreshExpiresAt = new Date(Date.now() + refreshExpiresIn * 1000);

    await this.prisma.refreshToken.create({
      data: {
        id: tokenId,
        token: await bcrypt.hash(refreshToken, 12),
        userId: user.id,
        expiresAt: refreshExpiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: accessExpiresIn,
      refreshExpiresIn,
    };
  }

  private async verifyRefresh(jwtToken: string) {
    try {
      return await this.jwt.verifyAsync<IRefreshTokenPayload>(jwtToken);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async revokeToken(id: string) {
    await this.prisma.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }

  async cleanupExpiredTokens(): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: {
        OR: [{ expiresAt: { lt: new Date() } }, { revokedAt: { not: null } }],
      },
    });
  }
}
