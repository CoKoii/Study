import {
  Controller,
  Get,
  ParseIntPipe,
  Param,
  Post,
  Body,
  Delete,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './create-user.dto';
import { wrapperResponse } from 'src/utils';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('info')
  getUserByToken(@Request() request: { user: { username: string } }) {
    return wrapperResponse(
      this.userService.findByUsername(request.user.username),
      '获取用户信息成功',
    );
  }
  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }
  @Get()
  getAllUsers() {
    return this.userService.findAll();
  }

  @Post()
  createUser(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }

  @Delete(':id')
  removeUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
