import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ExperienceService } from './experiences.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { ExperiencesSchema } from './dto/experiences.dto';
import type { ExperienceDto } from './dto/experiences.dto';

@Controller('experiences')
export default class ExperiencesController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Get()
  findAll() {
    return this.experienceService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async findByUser(@Req() req: Request) {
    const userInfo = (req as JwtPayload).user;
    const data = await this.experienceService.findByUserId(userInfo.sub);

    return {
      status: HttpStatus.OK,
      message: 'Experiences found',
      data,
    };
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findById(@Req() req: Request, @Param('id') id: string) {
    const userInfo = (req as JwtPayload).user;
    const data = this.experienceService.findById(userInfo.sub, id);

    if (data == null) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Experience not found',
          data: null,
        },
        HttpStatus.NOT_FOUND,
      );
    } else {
      return new HttpException(
        {
          status: HttpStatus.OK,
          message: 'Experience found',
          data,
        },
        HttpStatus.OK,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  @UsePipes(new ZodValidationPipe(ExperiencesSchema))
  async addExperience(@Req() req: Request, @Body() request: ExperienceDto) {
    const userInfo = (req as JwtPayload).user;
    const data = await this.experienceService.create(userInfo.sub, request);

    return new HttpException(
      {
        status: HttpStatus.CREATED,
        message: 'Experience created',
        data,
      },
      HttpStatus.CREATED,
    );
  }
}
