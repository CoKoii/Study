import { Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  getUser() {
    return this.userService.getUser();
  }
  @Post()
  addUser() {
    return this.userService.addUser();
  }
  @Get('range')
  getUserRange(@Query('num') num: string) {
    const arr: number[] = [];
    for (let i = 1; i <= Number(num); i++) {
      arr.push(i);
    }
    return { code: '0', msg: '请求成功', data: arr };
  }
}
