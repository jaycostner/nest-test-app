import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';


@Controller('auth')
export class AuthController {
  constructor(private AuthService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: any) {
    console.log({
      dto,
    });

    return this.AuthService.signup();
  }

  @Post('signin')
  signin() {
    return this.AuthService.signin();
  }
}
