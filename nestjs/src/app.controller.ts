import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  UseFilters,
} from '@nestjs/common';
import { AppService } from './app.service';
import { HttpExceptionFilter } from './exception/http-exception.filter';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/data/:subId')
  @UseFilters(new HttpExceptionFilter())
  getData(@Param() params: { id: string; subId: string }): string {
    if (!params.id) {
      throw new HttpException('必须包含id参数', HttpStatus.BAD_REQUEST);
    }
    return params.id;
  }
}
