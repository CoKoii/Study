import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from 'src/enum/config.enum';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}
  @Get()
  getHello(): string {
    const data = this.configService.get<string>(ConfigEnum.DB);
    console.log('Database Host:', data);
    return this.userService.getHello();
  }
}
