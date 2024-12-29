import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './filter/all-exception.filter';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NextFunction } from 'express';
import { RoleGuard } from './role.guard';
import { TimeInterceptor } from './time.interceptor';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.setGlobalPrefix('api/v1');

  // 以下声明方式不会将对象放入ioc容器
  // 声明全局异常处理器
  // app.useGlobalFilters(new AllExceptionFilter(logger, httpAdapterHost));

  // 声明全局中间件
  /* app.use(function(req: Request, res: Response, next: NextFunction) {
    console.log('before', req.url);
    next();
    console.log('after');
  }) */

  // 声明全局拦截器
  // app.useGlobalInterceptors(new TimeInterceptor());

  // 声明全局守卫
  // app.useGlobalGuards(new LoginGuard());

  app.use(session({
    secret: 'foobar',
    cookie: {maxAge: 30000}
  }));

  await app.listen(3000);

  /* setTimeout(() => {
    app.close();
  }, 3000); */
}

bootstrap();
