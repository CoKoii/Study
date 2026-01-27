import { Controller, Get, Logger, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  private logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {
    this.logger.log('UserController initialized');
  }
  @Get()
  getUsers() {
    this.logger.log('Fetching all users');
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
