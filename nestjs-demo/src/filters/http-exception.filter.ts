import {
  Catch,
  HttpException,
  ArgumentsHost,
  ExceptionFilter,
  type LoggerService,
} from '@nestjs/common';
import { Response, Request } from 'express';
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    this.logger.error(exception.message, exception.stack);
    response.status(status).json({
      code: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: exception.message || HttpException.name,
    });
  }
}
