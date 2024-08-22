import { Global, Module } from '@nestjs/common';
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

const envFilePath = `.env.${process.env.NODE_ENV || 'dev'}`;

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      // 注册为全局模块
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
  ],
  controllers: [],
  providers: [Logger],
  // 要让其它模块导入的话,先导出,再加上该模块是全局模块,其它模块可以省去导入,直接使用
  exports: [Logger],
})
export class AppModule {
}
