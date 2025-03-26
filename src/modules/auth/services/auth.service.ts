import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '@services/prisma.service';
import { AuthLoginRequest, AuthRegisterRequest } from '@requests/auth.request';
import { PrismaError } from '@utils/exceptions/prisma-error.exception';
import { RoleEnum } from '@modules/interfaces/role.interface';
import type { IAuthLogin } from '@modules/interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(body: AuthLoginRequest) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: {
          contains: body.email.toLocaleLowerCase(),
          mode: 'insensitive',
        },
      },
    });

    if (!user || !(await bcrypt.compare(body.password, user.password))) {
      throw new BadRequestException('Invalid email or password');
    }

    await this.prisma.userLoginInfo.create({
      data: {
        userId: user.id,
        userEmail: user.email,
        createdAt: new Date(),
      },
    });

    const role = await this.prisma.pivotUserRole.findFirst({
      where: { userId: user.id },
      include: { role: true },
    });

    const token = await this.jwt.signAsync({
      userLoginId: user.id,
      userEmail: user.email,
      userRole: role.role.name == RoleEnum.ADMIN ? role.role.name : undefined,
    } as IAuthLogin);

    return {
      token,
      expiresIn: Number(process.env.JWT_EXPIRES_IN),
    };
  }

  async register(body: AuthRegisterRequest): Promise<User> {
    const email = body.email.toLocaleLowerCase();

    const emailAlready = await this.prisma.user.count({
      where: {
        email: {
          contains: email,
          mode: 'insensitive',
        },
      },
    });

    if (emailAlready > 0) {
      throw new BadRequestException('Email already exists');
    }

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
}
