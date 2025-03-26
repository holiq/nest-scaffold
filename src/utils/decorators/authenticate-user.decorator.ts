import { RoleGuard } from '@modules/strategy/role.guard';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Role } from './role.decorator';

import { RoleEnum } from '@modules/interfaces/role.interface';

export const AuthenticatedUser = () => {
  return applyDecorators(ApiBearerAuth(), UseGuards(AuthGuard('auth')));
};

export const AuthenticatedAdmin = () => {
  return applyDecorators(UseGuards(RoleGuard), Role([RoleEnum.ADMIN]));
};
