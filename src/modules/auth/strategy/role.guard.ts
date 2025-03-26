import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '@services/prisma.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const getRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest();
    const { id } = request.user;

    const roles = await this.prisma.pivotUserRole.findMany({
      where: {
        userId: id,
        role: {
          name: {
            in: [...getRoles],
          },
        },
      },
    });

    if (roles.length === 0) {
      throw new UnauthorizedException('User does not have the right roles');
    }

    return true;
  }
}
