import { Module } from '@nestjs/common';
import { ConfigFactory, ConfigModule, ConfigService } from '@nestjs/config';
import Configuration from './config/configuration';
import * as Joi from 'joi';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigEnum } from './common/enum/config.enum';
import { UserModule } from './modules/user/user.module';
import { LoggerModule } from 'nestjs-pino';
import { join } from 'path';
import { ServerResponse } from 'http';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      load: [Configuration as ConfigFactory],
      // 对环境配置进行校验
      validationSchema: Joi.object({
        DB_TYPE: Joi.string().valid('mysql').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(3306),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        DB_SYNC: Joi.boolean().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ({
          type: configService.get<string>(ConfigEnum.DB_TYPE),
          host: configService.get<string>(ConfigEnum.DB_HOST),
          port: configService.get<number>(ConfigEnum.DB_PORT),
          username: configService.get<string>(ConfigEnum.DB_USERNAME),
          password: configService.get<string>(ConfigEnum.DB_PASSWORD),
          database: configService.get<string>(ConfigEnum.DB_DATABASE),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: configService.get<boolean>(ConfigEnum.DB_SYNC),
          retryAttempts: Infinity,
          retryDelay: 5000,
        }) as TypeOrmModuleOptions,
    }),

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

        customLogLevel(req, res, error) {
          if (error || res.statusCode >= 500) return 'error';
          if (res.statusCode >= 400) return 'warn';
          return 'info';
        },
      },
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
