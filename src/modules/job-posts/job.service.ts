import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobPostEntity } from './entities/job.entity';
import { Repository } from 'typeorm';
import { JobsDto } from './dto/job.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(JobPostEntity)
    private readonly jobRepository: Repository<JobPostEntity>,
    private readonly userService: UsersService,
  ) {}

  async create(dto: JobsDto, userId: string): Promise<JobPostEntity> {
    const userData = await this.userService.findbyId(userId);

    if (userData?.company_created == null) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Make a company first',
          data: null,
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const data = this.jobRepository.create({
      title: dto.title,
      job_type: dto.job_type,
      location: dto.location,
      salary_range: dto.salary_range,
      description: dto.description,
      is_open: dto.is_open,
      company: { id: userData?.company_created.id },
      recruiter: { id: userId },
    });

    return await this.jobRepository.save(data);
  }

  async findAll(): Promise<JobPostEntity[]> {
    return await this.jobRepository.find();
  }
}
