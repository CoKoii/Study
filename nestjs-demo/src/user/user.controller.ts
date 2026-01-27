import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import type { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  getUsers() {
    return this.userService.findAll();
  }

  @Post()
  addUser() {
    const user = { username: 'test', password: 'test' } as Partial<User>;
    return this.userService.create(user);
  }

  @Get('profile')
  getUserProfile() {
    return this.userService.findProfile(2);
  }

  @Get('logs')
  getUserLogs() {
    return this.userService.findLogs(2);
  }

  @Get('logsByGrop')
  async getUserLogsByGrop(): Promise<any> {
    const res = await this.userService.findLogsByGroup(2);
    return res.map((item: { result: string; count: number }) => ({
      result: item.result,
      count: item.count,
    }));
  }
}
