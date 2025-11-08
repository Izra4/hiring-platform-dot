import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompaniesEntity } from './entities/companies.entity';
import { DataSource, Repository } from 'typeorm';
import { CompaniesDto } from './dto/companies.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(CompaniesEntity)
    private companiesRepository: Repository<CompaniesEntity>,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<CompaniesEntity[]> {
    return await this.companiesRepository.find();
  }

  async findById(id: string): Promise<CompaniesEntity | null> {
    const company = await this.companiesRepository.findOne({ where: { id } });

    if (company == null) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Company not found',
          data: null,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return company;
  }

  async create(userId: string, dto: CompaniesDto): Promise<CompaniesEntity> {
    return await this.dataSource.transaction(async (manager) => {
      const companiesRepo = manager.getRepository(CompaniesEntity);

      const newCompany = companiesRepo.create({
        name: dto.name,
        description: dto.description || '',
        industry: dto.industry,
        location: dto.location || '',
        website: dto.website || '',
        founded_year: dto.founded_year || 0,
        created_by: { id: userId },
        updated_by: { id: userId },
      });

      const company = await companiesRepo.save(newCompany);

      await this.usersService.addRecruiterDetailTransactional(
        manager,
        userId,
        company.id,
      );

      return company;
    });
  }
}
