import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import type { RegisterDto } from './dto/register.dto';
import { RegisterSchema, userRegisterResponseSchema } from './dto/register.dto';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    const userInfo = (req as JwtPayload).user;
    const userData = await this.usersService.findbyId(userInfo.sub);
    const response = userRegisterResponseSchema.parse(userData);

    return {
      status: HttpStatus.OK,
      message: 'User found',
      data: {
        ...response,
        cvApplicants: userData?.cvApplicants,
      },
    };
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
