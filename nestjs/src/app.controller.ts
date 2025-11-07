import { Body, Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('app')
  getApp(): string {
    return 'Hello Nestjs';
  }

  @Get('range')
  getRange(@Query() query: { num: number }): number[] {
    const arr: number[] = [];
    for (let i = 0; i < query.num; i++) {
      arr.push(i + 1);
    }
    return arr;
  }
}
