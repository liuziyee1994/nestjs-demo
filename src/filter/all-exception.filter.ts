import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Inject, LoggerService } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as requestIp from 'request-ip';

// 声明处理哪些异常
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    // ArgumentHost用于切换上下文
    if (host.getType() === 'http') {
      // _httpAdapter是私有的,要通过get函数来获取
      const { httpAdapter } = this.httpAdapterHost;
      const ctx = host.switchToHttp();
      const request = ctx.getRequest();
      const response = ctx.getResponse();

      const httpStatus = exception instanceof HttpException ?
        exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

      const msg = exception['response'] || exception['message'] || 'Internal Server Error';

      const responseData = {
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

      this.logger.error("异常信息: ", exception);
      httpAdapter.reply(response, responseData, httpStatus);
      // response.status(httpStatus).json(responseData);
    } else if (host.getType() === 'rpc') {

    } else if (host.getType() === 'ws') {

    }
  }
}

