import { Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  getUser() {
    return this.userService.getUsers();
  }
  @Post()
  addUser() {
    return this.userService.addUser();
  }
  @Get('range')
  getUserRange(@Query('num') num: number) {
    return this.userService.rangeUser(num);
  }
}
