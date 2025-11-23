import { Request, Response } from 'express';
import { ServerResponse } from 'http';
import { Params } from 'nestjs-pino';
import { join } from 'path';

export const loggerConfig: Params = {
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
};
