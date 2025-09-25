import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { createHash } from 'crypto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async login(username: string, password: string) {
    const user = await this.userService.findByUsername(username);
    const md5Password = createHash('md5')
      .update(password)
      .digest('hex')
      .toUpperCase();
    if (user?.password !== md5Password) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    const payload = { username: user.username, userId: user.id };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
