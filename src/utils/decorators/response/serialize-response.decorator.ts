import { Reflector } from '@nestjs/core';
import { applyDecorators, Type, UseInterceptors } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ResponsePaginationInterceptor } from '@utils/interceptors/response/response-pagination.interceptor';
import { ResponseInterceptor } from '@utils/interceptors/response/response.interceptor';
import { ApiPrismaFilter } from '@utils/decorators/base-filter.decorator';

type ResponseType = 'pagination' | 'default';

export function SerializeResponse(options: {
  vm: Type<unknown>;
  type?: ResponseType;
  hasMessage?: boolean;
}) {
  const { vm, type, hasMessage } = options;
  const reflector = new Reflector();
  const isArray = reflector.get<boolean>('ApiReturnArray', vm) || false;

  return applyDecorators(
    type === 'pagination'
      ? applyDecorators(
          UseInterceptors(new ResponsePaginationInterceptor(vm)),
          ApiPrismaFilter(),
          ApiExtraModels(vm),
          ApiOkResponse({
            schema: {
              allOf: [
                {
                  properties: {
                    status: { type: 'boolean' },
                    ...(hasMessage ? { message: { type: 'string' } } : {}),
                    data: {
                      type: 'array',
                      items: { $ref: getSchemaPath(vm) },
                    },
                    meta: {
                      properties: {
                        currentPage: { type: 'number' },
                        perPage: { type: 'number' },
                        totalPage: { type: 'number' },
                        totalRecord: { type: 'number' },
                      },
                    },
                  },
                },
              ],
            },
          }),
        )
      : applyDecorators(
          UseInterceptors(new ResponseInterceptor(vm)),
          ApiExtraModels(vm),
          ApiOkResponse({
            schema: {
              allOf: [
                {
                  properties: {
                    status: { type: 'boolean' },
                    ...(hasMessage ? { message: { type: 'string' } } : {}),
                    data: isArray
                      ? {
                          type: 'array',
                          items: {
                            $ref: getSchemaPath(vm.prototype.constructor),
                          },
                        }
                      : { $ref: getSchemaPath(vm) },
                  },
                },
              ],
            },
          }),
        ),
  );
}
