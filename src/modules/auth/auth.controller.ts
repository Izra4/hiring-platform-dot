import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginSchema } from './dto/auth.dto';
import type { LoginDto } from './dto/auth.dto';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UsePipes(new ZodValidationPipe(LoginSchema))
  signIn(@Body() logInDto: LoginDto) {
    return this.authService.logIn(logInDto.email, logInDto.password);
  }
}
