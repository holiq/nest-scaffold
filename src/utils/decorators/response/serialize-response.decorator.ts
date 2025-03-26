import { Reflector } from '@nestjs/core';
import { Type, UseInterceptors, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ResponsePaginationInterceptor } from '@utils/interceptors/response/response-pagination.interceptor';
import { ResponseInterceptor } from '@utils/interceptors/response/response.interceptor';
import { ApiPrismaFilter } from '@utils/decorators/base-filter.decorator';

type ResponseType = 'pagination' | 'default';

export function SerializeResponse(vm: Type<unknown>, type?: ResponseType) {
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
