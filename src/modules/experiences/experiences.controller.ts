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
  Inject,
} from '@nestjs/common';
import { ExperienceService } from './experiences.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { ExperiencesSchema } from './dto/experiences.dto';
import type { ExperienceDto } from './dto/experiences.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import type { LoggerService } from '@nestjs/common';

@Controller('experiences')
export default class ExperiencesController {
  constructor(
    private readonly experienceService: ExperienceService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @Get()
  async findAll() {
    this.logger.log('Fetching all experiences', 'ExperiencesController');
    const data = await this.experienceService.findAll();
    this.logger.log(
      `Fetched ${data.length} experiences`,
      'ExperiencesController',
    );
    return data;
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async findByUser(@Req() req: Request) {
    const userInfo = (req as JwtPayload).user;
    this.logger.log(
      `User ${userInfo.sub} fetching their experiences`,
      'ExperiencesController',
    );

    const data = await this.experienceService.findByUserId(userInfo.sub);

    this.logger.log(
      `User ${userInfo.sub} retrieved ${data.length} experiences`,
      'ExperiencesController',
    );

    return {
      status: HttpStatus.OK,
      message: 'Experiences found',
      data,
    };
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findById(@Req() req: Request, @Param('id') id: string) {
    const userInfo = (req as JwtPayload).user;
    this.logger.log(
      `User ${userInfo.sub} fetching experience with ID: ${id}`,
      'ExperiencesController',
    );

    const data = await this.experienceService.findById(userInfo.sub, id);

    if (!data) {
      this.logger.warn(
        `Experience not found for user ${userInfo.sub} with ID: ${id}`,
        'ExperiencesController',
      );
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Experience not found',
          data: null,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    this.logger.log(
      `Experience ${id} found for user ${userInfo.sub}`,
      'ExperiencesController',
    );

    return new HttpException(
      {
        status: HttpStatus.OK,
        message: 'Experience found',
        data,
      },
      HttpStatus.OK,
    );
  }

  @UseGuards(AuthGuard)
  @Post()
  @UsePipes(new ZodValidationPipe(ExperiencesSchema))
  async addExperience(@Req() req: Request, @Body() request: ExperienceDto) {
    const userInfo = (req as JwtPayload).user;
    this.logger.log(
      `User ${userInfo.sub} adding a new experience: ${request.title || 'unknown title'}`,
      'ExperiencesController',
    );

    try {
      const data = await this.experienceService.create(userInfo.sub, request);
      this.logger.log(
        `Experience created successfully for user ${userInfo.sub} with ID: ${data.id}`,
        'ExperiencesController',
      );

      return new HttpException(
        {
          status: HttpStatus.CREATED,
          message: 'Experience created',
          data,
        },
        HttpStatus.CREATED,
      );
    } catch (error) {
      this.logger.error(
        `Failed to create experience for user ${userInfo.sub}: ${error}`,
        'ExperiencesController',
      );
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to create experience',
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
