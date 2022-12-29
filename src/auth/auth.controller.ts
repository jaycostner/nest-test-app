import { AuthDto } from './../dto';
import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';


@Controller('auth')
export class AuthController {
  constructor(private AuthService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
  return this.AuthService.signup(dto);
  }

  @Post('signin')
  signin() {
    return this.AuthService.signin();
  }
}
