import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JobService } from './job.service';
import { JobsSchema } from './dto/job.dto';
import type { JobsDto } from './dto/job.dto';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobService: JobService) {}

  @UseGuards(AuthGuard)
  @Post()
  @UsePipes(new ZodValidationPipe(JobsSchema))
  async create(@Req() req: Request, @Body() dto: JobsDto) {
    const userInfo = (req as JwtPayload).user;

    if (userInfo.role !== 'recruiter') {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Only Recruiter',
          data: null,
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return await this.jobService.create(dto, userInfo.sub);
  }
}
