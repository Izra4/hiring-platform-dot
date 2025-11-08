import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
  Inject,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { CompaniesSchema } from './dto/companies.dto';
import type { CompaniesDto } from './dto/companies.dto';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import type { LoggerService } from '@nestjs/common';

@Controller('companies')
export class CompaniesController {
  constructor(
    private readonly companiesService: CompaniesService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @Get()
  async findAll() {
    this.logger.log('Fetching all companies...', 'CompaniesController');
    const result = await this.companiesService.findAll();
    this.logger.log(
      `Fetched ${result.length} companies`,
      'CompaniesController',
    );
    return result;
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    this.logger.log(`Fetching company with ID: ${id}`, 'CompaniesController');
    const company = await this.companiesService.findById(id);
    if (!company) {
      this.logger.warn(
        `Company with ID ${id} not found`,
        'CompaniesController',
      );
    }
    return company;
  }

  @UseGuards(AuthGuard)
  @Post()
  @UsePipes(new ZodValidationPipe(CompaniesSchema))
  async create(@Req() req: Request, @Body() dto: CompaniesDto) {
    const userInfo = (req as JwtPayload).user;
    this.logger.log(
      `User ${userInfo.sub} is creating a company: ${dto.name}`,
      'CompaniesController',
    );

    const company = await this.companiesService.create(userInfo.sub, dto);

    this.logger.log(
      `Company created successfully with ID: ${company.id}`,
      'CompaniesController',
    );

    return company;
  }
}
