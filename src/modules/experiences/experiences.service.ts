import { InjectRepository } from '@nestjs/typeorm';
import { ExperiencesEntity } from './entities/experiences.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExperienceDto } from './dto/experiences.dto';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(ExperiencesEntity)
    private experiencesRepository: Repository<ExperiencesEntity>,
  ) {}

  create(userId: string, dto: ExperienceDto): Promise<ExperiencesEntity> {
    const data = this.experiencesRepository.create({
      title: dto.title,
      user: { id: userId },
      company_name: dto.company_name,
      description: dto.description,
      start_date: dto.start_date,
      end_date: dto.end_date,
      is_current: dto.is_current,
    });

    return this.experiencesRepository.save(data);
  }

  findAll(): Promise<ExperiencesEntity[]> {
    return this.experiencesRepository.find({ relations: ['user'] });
  }

  async findById(
    userId: string,
    id: string,
  ): Promise<ExperiencesEntity | HttpException> {
    const exp = await this.experiencesRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (exp?.user.id !== userId) {
      return new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return exp;
  }

  async findByUserId(userId: string): Promise<ExperiencesEntity[]> {
    return this.experiencesRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }
}
