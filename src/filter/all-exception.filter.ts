import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, LoggerService } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import * as requestIp from 'request-ip';

// 捕获所有异常
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService,
              private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const httpStatus = exception instanceof HttpException ?
      exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const msg: string = exception['response'] || 'Internal Server Error';

    const responseBody = {
      headers: request.headers,
      query: request.query,
      body: request.body,
      params: request.params,
      timestamp: new Date().toISOString(),
      ip: requestIp.getClientIp(request),
      // 对于unknown类型或者索引签名,用方括号来访问
      exception: exception['name'],
      error: msg,
    };

    this.logger.error(exception);
    httpAdapter.reply(response, responseBody, httpStatus);
  }
}

