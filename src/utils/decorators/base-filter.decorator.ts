import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export const PrismaFilter = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;

    const page = query?.page && query?.page > 0 ? parseInt(query.page) : 1;
    const limit = query?.limit ? parseInt(query.limit) : 10;

    let args = {};

    args = {
      ...args,
      skip: (page - 1) * limit,
      take: limit,
    };

    return args;
  },
);

export const ApiPrismaFilter = () => {
  const decorators = Object.values(['page', 'limit']).map((val) =>
    ApiQuery({
      name: val,
      type: 'number',
      required: false,
    }),
  );

  return applyDecorators(...decorators);
};
