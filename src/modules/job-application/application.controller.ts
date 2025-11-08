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
import { ApplicationService } from './applcation.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { ApplicationSchema } from './dto/application.dto';
import type { ApplicationDto } from './dto/application.dto';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly appService: ApplicationService) {}

  @UseGuards(AuthGuard)
  @Post()
  @UsePipes(new ZodValidationPipe(ApplicationSchema))
  async createApplication(@Req() req: Request, @Body() dto: ApplicationDto) {
    const userInfo = (req as JwtPayload).user;

    if (userInfo.role !== 'applicant') {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Only Applicant',
          data: null,
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return this.appService.create(userInfo.sub, dto.job_id, dto);
  }
}
