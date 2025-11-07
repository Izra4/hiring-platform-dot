import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { error } from 'console';

@Controller('users')
export class UsersController {
  @Get()
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
}
