import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';
import { ConfigEnum } from 'src/enum/config.enum';
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly configService: ConfigService,
  ) {}
  @Get()
  getUsers(): any {
    const data = this.configService.get<object>(ConfigEnum.DB);
    return data;
  }
}
