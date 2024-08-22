import { Module } from '@nestjs/common';
import { utilities, WinstonModule, WinstonModuleOptions } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import { LogEnum } from '../enum/config.enum';
import { LogController } from './log.controller';
import { LogService } from './log.service';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const consoleTransport = new winston.transports.Console({
          level: 'info',
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.ms(),
            utilities.format.nestLike('demo', {
              colors: true,
              prettyPrint: true,
              processId: true,
              appName: true,
            }),
          ),
        });

        return {
          transports: [
            consoleTransport,
            ...(configService.get(LogEnum.ROLLING_FILE_ON) ? [] : []),
          ],
        } as WinstonModuleOptions;
      },
    }),
  ],
  controllers: [LogController],
  providers: [LogService],
})
export class LogModule {
}
