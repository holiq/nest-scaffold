import { applyDecorators, UseGuards } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';
import { PermissionGuard } from '@modules/strategy/permission.guard';

export const Permission = (permissions: string[]) =>
  applyDecorators(
    SetMetadata('permissions', permissions),
    UseGuards(PermissionGuard),
  );
