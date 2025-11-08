import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import type { LoggerService } from '@nestjs/common';
import { ApplicationService } from './applcation.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { ApplicationSchema } from './dto/application.dto';
import type { ApplicationDto } from './dto/application.dto';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Controller('applications')
export class ApplicationController {
  constructor(
    private readonly appService: ApplicationService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  @UsePipes(new ZodValidationPipe(ApplicationSchema))
  async createApplication(@Req() req: Request, @Body() dto: ApplicationDto) {
    const userInfo = (req as JwtPayload).user;

    this.logger.log(
      `User ${userInfo.sub} (${userInfo.role}) attempting to apply for job ${dto.job_id}`,
      'ApplicationController',
    );

    if (userInfo.role !== 'applicant') {
      this.logger.warn(
        `Unauthorized role: ${userInfo.role} tried to create application`,
        'ApplicationController',
      );

      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Only Applicant',
          data: null,
        },
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      const result = await this.appService.create(
        userInfo.sub,
        dto.job_id,
        dto,
      );
      this.logger.log(
        `Application created successfully by user ${userInfo.sub} for job ${dto.job_id}`,
        'ApplicationController',
      );
      return result;
    } catch (err) {
      this.logger.error(
        `Failed to create application for user ${userInfo.sub}: ${err}`,
        'ApplicationController',
      );
      throw err;
    }
  }
}
