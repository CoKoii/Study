import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { Public } from './public.decorator';
import { AuthService } from './auth.service';
import { HttpExceptionFilter } from 'src/exception/http-exception.filter';
import { error, success } from 'src/utils';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('login')
  @UseFilters(new HttpExceptionFilter())
  async login(@Body() params: { username: string; password: string }) {
    return this.authService
      .login(params.username, params.password)
      .then((data) => success(data, '登录成功'))
      .catch((err: { message: string }) => {
        return error(err.message);
      });
  }
}
