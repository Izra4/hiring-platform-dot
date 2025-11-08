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
import { AddSkillsSchema } from './dto/skills.dto';
import type { AddSkillsDto } from './dto/skills.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    const userInfo = (req as JwtPayload).user;
    const userData = await this.usersService.findbyId(userInfo.sub);
    const response = userRegisterResponseSchema.parse(userData);

    if (userInfo.role === 'applicant') {
      return {
        status: HttpStatus.OK,
        message: 'User found',
        data: {
          ...response,
          cvApplicants: userData?.cvApplicants,
          skills: userData?.usersSkills,
        },
      };
    }

    return {
      status: HttpStatus.OK,
      message: 'User found',
      data: {
        ...response,
        company: userData?.company_created.id,
      },
    };
  }

  @UseGuards(AuthGuard)
  @Post('skills')
  @UsePipes(new ZodValidationPipe(AddSkillsSchema))
  async addSkills(@Req() req: Request, @Body() request: AddSkillsDto) {
    const userInfo = (req as JwtPayload).user;
    const data = await this.usersService.addSkills(
      userInfo.sub,
      request,
      userInfo.role,
    );

    return {
      status: HttpStatus.CREATED,
      message: 'Skills Added',
      data,
    };
  }

  @UseGuards(AuthGuard)
  @Post('cv')
  async uploadCv(@Req() req: Request, @Body('cv_url') cv_url: string) {
    const userInfo = (req as JwtPayload).user;
    const data = await this.usersService.uploadCv(userInfo.sub, cv_url);

    return {
      status: HttpStatus.CREATED,
      message: 'CV uploaded',
      data,
    };
  }

  @UseGuards(AuthGuard)
  @Get('cv')
  async getCv(@Req() req: Request) {
    const userInfo = (req as JwtPayload).user;
    const data = await this.usersService.getCvByUserId(userInfo.sub);

    return {
      status: HttpStatus.CREATED,
      message: 'Data fetched',
      data,
    };
  }
}
