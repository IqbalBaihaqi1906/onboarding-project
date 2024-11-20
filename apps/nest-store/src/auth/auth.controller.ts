import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { BaseResponseDto } from '../common/dto/base-response.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from '../common/decorators/public.decorator';

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
