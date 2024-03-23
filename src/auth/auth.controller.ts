import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginCredentials } from './interface/interface';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<LoginCredentials> {
    return this.authService.login(loginDto);
  }
}
