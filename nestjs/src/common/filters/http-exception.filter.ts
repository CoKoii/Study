import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request, Response } from 'express';
import { Logger } from 'nestjs-pino';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: Logger,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      headers: request.headers,
      query: request.query,
      body: request.body as unknown,
      params: request.params,
      timestamp: new Date().toISOString(),
      ip: request.ip || request.socket.remoteAddress,
      exception: (exception as Error)?.name,
      error: (exception as Error)?.message || 'Internal Server Error',
    };
    this.logger.error('[Exception]', responseBody);
    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
