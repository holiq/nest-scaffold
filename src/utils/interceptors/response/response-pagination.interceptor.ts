import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Type,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ResponsePaginationInterceptor implements NestInterceptor {
  constructor(private readonly vm: Type<unknown>) {}

  intercept(
    ctx: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;

    return next.handle().pipe(
      map((data) => {
        let response = {};

        if (data['rows'] !== undefined && data['count'] !== undefined) {
          const page =
            query?.page && query?.page > 0 ? parseInt(query.page) : 1;
          const limit = query?.limit ? parseInt(query.limit) : 10;

          const rows = data.rows.map((row) => {
            return plainToInstance(this.vm, row, {
              excludeExtraneousValues: true,
              enableImplicitConversion: true,
            });
          });

          response = {
            data: rows,
            meta: {
              currentPage: page,
              perPage: limit,
              totalPage: Math.ceil(data.count / limit),
              totalRecord: data.count,
            },
          };
        } else {
          response = {
            data: data,
          };
        }

        return {
          status: true,
          ...response,
        };
      }),
    );
  }
}
