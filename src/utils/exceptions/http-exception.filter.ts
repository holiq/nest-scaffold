import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuditLogService } from '@services/audit-log.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly auditLog: AuditLogService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    let exceptionMsg = exception.message || 'Unknown error message';
    if ((exception as any)?.response) {
      exceptionMsg = (exception as any)?.response?.message;
    }

    const jsonReq = {
      method: request.method,
      path: request.url,
      body: request.body,
      params: request.params,
      query: request.query,
      headers: request.headers,
    };
    const jsonRes = {
      status: false,
      message: exceptionMsg,
      meta: {
        path: request.url,
        method: request.method,
        timestamp: new Date().toISOString(),
      },
    };

    if (request.user) {
      const user: any = request.user;

      this.auditLog.createLog({
        userId: user.id,
        userEmail: user.email,
        request: JSON.stringify(jsonReq),
        exceptions: JSON.stringify(jsonRes),
      });
    } else {
      this.auditLog.createLog({
        request: JSON.stringify(jsonReq),
        exceptions: JSON.stringify(jsonRes),
      });
    }

    response.status(status).json(jsonRes);
  }
}
