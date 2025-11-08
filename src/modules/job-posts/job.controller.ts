import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UsePipes,
  Inject,
} from '@nestjs/common';
import { JobService } from './job.service';
import { JobsSchema } from './dto/job.dto';
import type { JobsDto } from './dto/job.dto';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import type { LoggerService } from '@nestjs/common';

@Controller('jobs')
export class JobsController {
  constructor(
    private readonly jobService: JobService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    this.logger.log('Fetching all job listings', 'JobsController');

    const jobs = await this.jobService.findAll();

    this.logger.log(
      `Fetched ${Array.isArray(jobs) ? jobs.length : 0} job(s)`,
      'JobsController',
    );

    return jobs;
  }

  @UseGuards(AuthGuard)
  @Post()
  @UsePipes(new ZodValidationPipe(JobsSchema))
  async create(@Req() req: Request, @Body() dto: JobsDto) {
    const userInfo = (req as JwtPayload).user;

    this.logger.log(
      `User ${userInfo.sub} (${userInfo.role}) attempting to create a job: ${dto.title}`,
      'JobsController',
    );

    if (userInfo.role !== 'recruiter') {
      this.logger.warn(
        `Access denied: user ${userInfo.sub} (role: ${userInfo.role}) tried to create a job`,
        'JobsController',
      );

      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Only Recruiter',
          data: null,
        },
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      const job = await this.jobService.create(dto, userInfo.sub);

      this.logger.log(
        `Job created successfully by recruiter ${userInfo.sub} with ID: ${job.id}`,
        'JobsController',
      );

      return job;
    } catch (error) {
      this.logger.error(
        `Failed to create job by user ${userInfo.sub}: ${error}`,
        'JobsController',
      );

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to create job',
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
