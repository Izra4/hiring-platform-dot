import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
import { error } from 'console';
import { UsersService } from './users.service';
import type { RegisterDto } from './dto/register.dto';
import { RegisterSchema } from './dto/register.dto';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  findById() {
    throw new HttpException(
      {
        status: HttpStatus.NOT_FOUND,
        error: 'User not found',
        data: null,
      },
      HttpStatus.NOT_FOUND,
      {
        cause: error,
      },
    );
  }

  @Post('register')
  @UsePipes(new ZodValidationPipe(RegisterSchema))
  async register(@Body() request: RegisterDto) {
    const user = await this.usersService.create(request);
    return {
      status: HttpStatus.CREATED,
      message: 'User created successfully',
      data: user,
    };
  }
}
