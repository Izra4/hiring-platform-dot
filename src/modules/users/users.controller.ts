import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UsePipes,
  Inject,
} from '@nestjs/common';
import { UsersService } from './users.service';
import type { RegisterDto } from './dto/register.dto';
import { RegisterSchema, userRegisterResponseSchema } from './dto/register.dto';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { AddSkillsSchema } from './dto/skills.dto';
import type { AddSkillsDto } from './dto/skills.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import type { LoggerService } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(RegisterSchema))
  async register(@Body() request: RegisterDto) {
    this.logger.log(
      `Attempting to register new user: ${request.email}`,
      'UsersController',
    );

    const user = await this.usersService.create(request);

    this.logger.log(
      `User registered successfully: ${user.id}`,
      'UsersController',
    );

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
    this.logger.log(
      `Fetching profile for user: ${userInfo.sub} (${userInfo.role})`,
      'UsersController',
    );

    const userData = await this.usersService.findbyId(userInfo.sub);
    const response = userRegisterResponseSchema.parse(userData);

    this.logger.log(
      `Profile data retrieved for user: ${userInfo.sub}`,
      'UsersController',
    );

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
        company: userData?.company_created?.id ?? null,
      },
    };
  }

  @UseGuards(AuthGuard)
  @Post('skills')
  @UsePipes(new ZodValidationPipe(AddSkillsSchema))
  async addSkills(@Req() req: Request, @Body() request: AddSkillsDto) {
    const userInfo = (req as JwtPayload).user;
    this.logger.log(
      `User ${userInfo.sub} adding skills: ${request.skills || 'none'}`,
      'UsersController',
    );

    const data = await this.usersService.addSkills(
      userInfo.sub,
      request,
      userInfo.role,
    );

    this.logger.log(`Skills added for user ${userInfo.sub}`, 'UsersController');

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
    this.logger.log(
      `User ${userInfo.sub} uploading CV: ${cv_url}`,
      'UsersController',
    );

    const data = await this.usersService.uploadCv(userInfo.sub, cv_url);

    this.logger.log(
      `CV uploaded successfully for user ${userInfo.sub}`,
      'UsersController',
    );

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
    this.logger.log(`Fetching CV for user ${userInfo.sub}`, 'UsersController');

    const data = await this.usersService.getCvByUserId(userInfo.sub);

    this.logger.log(
      `CV data retrieved for user ${userInfo.sub}`,
      'UsersController',
    );

    return {
      status: HttpStatus.CREATED,
      message: 'Data fetched',
      data,
    };
  }
}
