import {
  createParamDecorator,
  ExecutionContext,
  PipeTransform,
} from '@nestjs/common';

export const UserAccess = createParamDecorator(
  async (
    data: unknown,
    context: ExecutionContext,
  ): Promise<PipeTransform<any>[]> => {
    const request = context.switchToHttp().getRequest();

    return request.user;
  },
);
