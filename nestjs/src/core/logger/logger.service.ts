import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { HttpExceptionFilter } from '../../common/filters/http-exception.filter';

export function setupAppLogging(app: INestApplication) {
  const configService = app.get(ConfigService);
  const logsEnabled = configService.get<boolean>('logs.enabled');
  if (logsEnabled === false) return;

  const logger = app.get(Logger);
  app.useLogger(logger);
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptionFilter(logger, httpAdapterHost));
}
