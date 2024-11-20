import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { BaseResponseDto } from '@app/dto';
import { Public } from '@app/decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<BaseResponseDto> {
    return this.authService.register(registerDto);
  }

  @Public()
  @HttpCode(200)
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<BaseResponseDto> {
    return this.authService.login(loginDto);
  }
}
