import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import winston, { createLogger } from 'winston';
import { utilities, WinstonModule } from 'nest-winston';
import 'winston-daily-rotate-file';
import { HttpExceptionFilter } from './filters/http-exception.filter';
async function bootstrap() {
  const instance = createLogger({
    transports: [
      new winston.transports.Console({
        level: 'info',
        format: winston.format.combine(
          winston.format.timestamp(),
          utilities.format.nestLike(),
        ),
      }),
      new winston.transports.DailyRotateFile({
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
      }),
      new winston.transports.DailyRotateFile({
        level: 'info',
        dirname: 'logs',
        filename: 'info-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.simple(),
        ),
      }),
    ],
  });
  const logger = WinstonModule.createLogger({
    instance,
  });
  const app = await NestFactory.create(AppModule, {
    logger,
  });
  app.setGlobalPrefix('api/v1');
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
