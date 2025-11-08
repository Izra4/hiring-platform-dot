import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { CompaniesSchema } from './dto/companies.dto';
import type { CompaniesDto } from './dto/companies.dto';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  async findAll() {
    return await this.companiesService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.companiesService.findById(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  @UsePipes(new ZodValidationPipe(CompaniesSchema))
  async create(@Req() req: Request, @Body() dto: CompaniesDto) {
    const userInfo = (req as JwtPayload).user;
    return await this.companiesService.create(userInfo.sub, dto);
  }
}
