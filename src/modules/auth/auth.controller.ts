import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UsePipes,
  Inject,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginSchema } from './dto/auth.dto';
import type { LoginDto } from './dto/auth.dto';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import type { LoggerService } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UsePipes(new ZodValidationPipe(LoginSchema))
  async signIn(@Body() logInDto: LoginDto) {
    this.logger.log(
      `Login attempt for email: ${logInDto.email}`,
      'AuthController',
    );

    try {
      const result = await this.authService.logIn(
        logInDto.email,
        logInDto.password,
      );

      this.logger.log(
        `Login successful for email: ${logInDto.email}`,
        'AuthController',
      );

      return result;
    } catch (error) {
      this.logger.error(
        `Login failed for email: ${logInDto.email} — ${error}`,
        'AuthController',
      );
      throw error;
    }
  }
}
