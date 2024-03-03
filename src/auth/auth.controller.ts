import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() reqBody: AuthDto) {
    return this.authService.register(reqBody);
  }

  @Post('login')
  login(@Body() reqBody: AuthDto) {
    return this.authService.login(reqBody);
  }
}
