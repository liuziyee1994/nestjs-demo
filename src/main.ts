import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './filter/all-exception.filter';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);
  const httpAdapterHost = app.get(HttpAdapterHost);
  // 注册全局过滤器
  app.useGlobalFilters(new AllExceptionFilter(logger, httpAdapterHost));
  app.setGlobalPrefix('api/v1');
  await app.listen(3000);
}

bootstrap();
