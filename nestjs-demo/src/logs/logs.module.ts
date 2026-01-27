import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import winston from 'winston';
import {
  utilities,
  WinstonModule,
  type WinstonModuleOptions,
} from 'nest-winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { Console } from 'winston/lib/winston/transports';
import { LogEnum } from '../enum/config';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const consoleTransports = new Console({
          level: 'info',
          format: winston.format.combine(
            winston.format.timestamp(),
            utilities.format.nestLike(),
          ),
        });
        const dailyTransports = new DailyRotateFile({
          level: 'warn',
          dirname: 'logs',
          filename: 'application-%DATE%.log',
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple(),
          ),
        });
        const dailyInfoTransports = new DailyRotateFile({
          level: configService.get<string>(LogEnum.LOG_LEVEL),
          dirname: 'logs',
          filename: 'application-%DATE%.log',
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple(),
          ),
        });
        return {
          transports: [
            consoleTransports,
            ...(configService.get<boolean>(LogEnum.LOG_ON)
              ? [dailyTransports, dailyInfoTransports]
              : []),
          ],
        } as WinstonModuleOptions;
      },
    }),
  ],
})
export class LogsModule {}
