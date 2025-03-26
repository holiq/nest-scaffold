import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
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
        let response: Record<string, any> = {};

        if (data['rows'] !== undefined && data['count'] !== undefined) {
          const page =
            query?.page && query?.page > 0 ? parseInt(query.page) : 1;
          const limit = query?.limit ? parseInt(query.limit) : 10;

          response = {
            data: data.rows.map((row) =>
              plainToInstance(this.vm, row, {
                excludeExtraneousValues: true,
                enableImplicitConversion: true,
              }),
            ),
            meta: {
              currentPage: page,
              perPage: limit,
              totalPage: Math.ceil(data.count / limit),
              totalRecord: data.count,
            },
          };
        } else {
          response = {
            data: plainToInstance(this.vm, data?.data ?? data, {
              excludeExtraneousValues: true,
              enableImplicitConversion: true,
            }),
          };
        }

        return {
          status: true,
          ...(data?.message && { message: data.message }),
          ...response,
        };
      }),
    );
  }
}
