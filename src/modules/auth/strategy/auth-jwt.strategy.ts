import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { PrismaService } from '@services/prisma.service';
import { ExtractJwt, Strategy } from 'passport-jwt';

import type { IAuthLogin } from '@modules/interfaces/auth.interface';

@Injectable()
export class AuthJwtStrategy extends PassportStrategy(Strategy, 'auth') {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(payload: IAuthLogin) {
    if (!payload.userLoginId || !payload.userEmail) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const user = await this.prisma.user.findFirst({
      where: { id: payload.userLoginId, email: payload.userEmail },
      include: {
        pivotUserRole: {
          include: {
            role: true,
          },
        },
      },
      ...{ ignoreParanoids: ['pivotUserRole'] },
    });

    if (!user)
      throw new UnauthorizedException('User not found or access denied');

    return user;
  }
}
