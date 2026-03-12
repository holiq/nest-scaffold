import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '@services/prisma.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const getPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    if (!getPermissions || getPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { id } = request.user;

    const userRolePermissions = await this.prisma.pivotRolePermission.findMany({
      where: {
        role: {
          pivotUserRole: {
            some: { userId: id },
          },
        },
      },
      include: {
        permission: true,
      },
    });

    const allPermissions = userRolePermissions
      .map((rp) => rp.permission?.name)
      .filter(Boolean);

    const hasPermission = getPermissions.some((p) =>
      allPermissions.includes(p),
    );

    if (!hasPermission) {
      throw new UnauthorizedException(
        'User does not have the right permissions',
      );
    }

    return true;
  }
}
