import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '@modules/prisma.module';
import { AuthService } from '@services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { AuthJwtStrategy } from './strategy/auth-jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {
        expiresIn: Number(process.env.JWT_EXPIRES_IN),
      },
    }),
    PrismaModule,
  ],
  providers: [AuthService, AuthJwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
