import { Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from 'src/enum/config';
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {}
  @Get()
  getUser() {
    const data = this.configService.get<string>(ConfigEnum.DB);
    console.log('Config DB Value:', data);
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
