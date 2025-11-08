import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicationEntity } from './entities/application.entity';
import { Repository } from 'typeorm';
import { ApplicationDto } from './dto/application.dto';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(ApplicationEntity)
    private applicationRepository: Repository<ApplicationEntity>,
  ) {}

  async create(userId: string, jobId: string, dto: ApplicationDto) {
    const data = this.applicationRepository.create({
      user: { id: userId },
      job: { id: jobId },
      status: dto.status,
      cv: { id: dto.cv_id },
    });
    return await this.applicationRepository.save(data);
  }
}
