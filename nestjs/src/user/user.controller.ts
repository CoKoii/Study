import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';
import { ConfigEnum } from 'enum/config.enum';
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly configService: ConfigService,
  ) {}
  @Get()
  getUsers(): any {
    const db = this.configService.get<string>(ConfigEnum.DB);
    const dbHost = this.configService.get<string>(ConfigEnum.DB_HOST);
    return { message: `Database in use is ${db} at host ${dbHost}` };
  }
}
