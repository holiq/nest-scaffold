import {
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

export const PrismaError = (constraint: any): never => {
  console.log('Error constraint:', {
    code: constraint?.code,
    clientVersion: constraint?.clientVersion,
    meta: constraint?.meta,
    message: constraint?.message,
  });

  // https://www.prisma.io/docs/orm/reference/error-reference
  if (constraint instanceof Prisma.PrismaClientKnownRequestError) {
    if (constraint.code === 'P1001') {
      throw new InternalServerErrorException('Failed to reach connection');
    }
    if (constraint.code === 'P2002') {
      const { target } = constraint.meta;
      throw new UnprocessableEntityException(`The ${target} is already in use`);
    }
    if (constraint.code === 'P2025') {
      const { modelName } = constraint.meta;
      throw new NotFoundException(`${modelName} data not found`);
    }
  }

  let message = 'Something went wrong, we can fix it later';
  if (constraint?.meta?.message) {
    message = constraint?.meta?.message;
  }

  throw new UnprocessableEntityException(message);
};
