import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as process from 'node:process';
import { LoggerModule } from 'nestjs-pino';
import { join } from 'path';
import { Logger } from '@nestjs/common';
import { LogModule } from './log/log.module';
import { RoleModule } from './role/role.module';
import { dbParams } from '../ormconfig';
import { OrderModule } from './order/order.module';
import { LogMiddleware } from './log.middleware';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RoleGuard } from './role.guard';
import { TimeInterceptor } from './time.interceptor';
import { AllExceptionFilter } from './filter/all-exception.filter';
import { CouponModule } from './coupon/coupon.module';

const envFilePath = `.env.${process.env.NODE_ENV || 'dev'}`;

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      // 声明为全局模块
      isGlobal: true,
      envFilePath,
      load: [() => dotenv.config({ path: '.env' })],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod').default('dev'),
        DB_TYPE: Joi.string().valid('mysql', 'postgres', 'mongodb'),
        DB_HOST: Joi.alternatives().try(
          Joi.string().ip(),
          Joi.string().domain(),
        ),
        DB_PORT: Joi.number().default(3306),
        DB_DATABASE: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_SYNC: Joi.boolean().default(false),
      }),
    }),
    TypeOrmModule.forRoot(dbParams),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          targets: [
            process.env.NODE_ENV === 'dev' ?
              {
                level: 'info',
                target: 'pino-pretty',
                options: { colorize: true },
              } :
              {
                level: 'info',
                target: 'pino-roll',
                options: { file: join('logs', 'log.txt'), frequency: 'daily', size: '10m', mkdir: true },
              },
          ],
        },
      },
    }),
    UserModule,
    LogModule,
    RoleModule,
    OrderModule,
    CouponModule.register({
      min: 10,
      max: 50,
      isGlobal: true,
    })
  ],
  controllers: [],
  providers: [
    Logger,
    // 声明全局守卫,该方式会将其放入ioc容器,这样就可以在守卫里注入其他的provider
    {
      provide: APP_GUARD,
      useClass: RoleGuard
    },
    // 声明全局拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeInterceptor
    },
    // 声明全局异常处理器
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter
    }
  ],
  // 其他模块只能注入导出的provider
  // 其它模块可以不用导入全局模块,直接注入使用
  exports: [Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 声明路由中间件,配置其生效的路由
    consumer.apply(LogMiddleware).forRoutes('/order/*');
  }
}
