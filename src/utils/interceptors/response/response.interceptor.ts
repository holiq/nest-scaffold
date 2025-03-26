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
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly vm: Type<unknown>) {}

  intercept(
    ctx: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        return {
          status: true,
          data: plainToInstance(this.vm, data, {
            excludeExtraneousValues: true,
            enableImplicitConversion: true,
          }),
        };
      }),
    );
  }
}
