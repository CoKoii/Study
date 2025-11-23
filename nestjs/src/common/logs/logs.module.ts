import { Module, INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerModule, Logger } from 'nestjs-pino';
import { ServerResponse } from 'http';
import { join } from 'path';
import { Request, Response } from 'express';
import { HttpExceptionFilter } from '../filters/http-exception.filter';
import { HttpAdapterHost } from '@nestjs/core';
@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport: {
          targets:
            process.env.NODE_ENV !== 'production'
              ? [
                  {
                    level: 'debug',
                    target: 'pino-pretty',
                    options: {
                      colorize: true,
                      translateTime: 'SYS:standard',
                      singleLine: true,
                    },
                  },
                ]
              : [
                  // info 级别日志
                  {
                    level: 'info',
                    target: 'pino-roll',
                    options: {
                      file: join(
                        process.cwd(),
                        'logs',
                        'info',
                        `${new Date().toISOString().slice(0, 10)}.log`,
                      ),
                      frequency: 'daily',
                      size: '10m',
                      mkdir: true,
                    },
                  },
                  // warn 级别日志
                  {
                    level: 'warn',
                    target: 'pino-roll',
                    options: {
                      file: join(
                        process.cwd(),
                        'logs',
                        'warn',
                        `${new Date().toISOString().slice(0, 10)}.log`,
                      ),
                      frequency: 'daily',
                      size: '10m',
                      mkdir: true,
                    },
                  },
                  // error 级别日志
                  {
                    level: 'error',
                    target: 'pino-roll',
                    options: {
                      file: join(
                        process.cwd(),
                        'logs',
                        'error',
                        `${new Date().toISOString().slice(0, 10)}.log`,
                      ),
                      frequency: 'daily',
                      size: '10m',
                      mkdir: true,
                    },
                  },
                  // 所有级别的完整日志(可选)
                  {
                    level: 'info',
                    target: 'pino-roll',
                    options: {
                      file: join(
                        process.cwd(),
                        'logs',
                        'all',
                        `${new Date().toISOString().slice(0, 10)}.log`,
                      ),
                      frequency: 'daily',
                      size: '10m',
                      mkdir: true,
                    },
                  },
                ],
        },
        redact: [
          'req.headers.authorization',
          'req.headers.cookie',
          'req.body.password',
          'req.body.token',
          'res.headers["set-cookie"]',
        ],
        serializers: {
          req(req: Request): { method: string; url: string } {
            return {
              method: req.method,
              url: req.url,
            };
          },
          res(res: ServerResponse) {
            return {
              statusCode: res.statusCode,
            };
          },
        },

        customLogLevel(req: Request, res: Response, error: Error | undefined) {
          if (error || res.statusCode >= 500) return 'error';
          if (res.statusCode >= 400) return 'warn';
          return 'info';
        },
      },
    }),
  ],
  exports: [LoggerModule],
})
export class LogsModule {}

export function setupAppLogging(app: INestApplication) {
  const configService = app.get(ConfigService);
  const logsEnabled = configService.get<boolean>('logs.enabled');
  if (logsEnabled === false) return;

  const logger = app.get(Logger);
  app.useLogger(logger);
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptionFilter(logger, httpAdapterHost));
}
