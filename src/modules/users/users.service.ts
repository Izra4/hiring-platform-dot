import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './entities/users.entity';
import { EntityManager, Repository } from 'typeorm';
import { RegisterDto, userRegisterResponseSchema } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { AddSkillsDto } from './dto/skills.dto';
import { UsersSkillsEntity } from './entities/users-skills.entity';
import { RecruiterDtlEntity } from './entities/recruiter-dtl.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
    @InjectRepository(UsersSkillsEntity)
    private usersSkillsRepository: Repository<UsersSkillsEntity>,
    @InjectRepository(RecruiterDtlEntity)
    private recruiterDtlRepository: Repository<RecruiterDtlEntity>,
  ) {}

  findAll(): Promise<UsersEntity[]> {
    return this.usersRepository.find();
  }

  findbyId(id: string): Promise<UsersEntity | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['usersSkills', 'company_created'],
    });
  }

  findByEmail(email: string): Promise<UsersEntity | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(data: RegisterDto): Promise<UsersEntity> {
    const isUserExist = await this.usersRepository.findOne({
      where: { email: data.email },
    });

    if (isUserExist) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User with this email already exists',
          data: null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPass = await bcrypt.hash(data.password, 10);

    const user = this.usersRepository.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPass,
      role: data.role,
      number: data.number,
      profilePicture: data.profilePictureUrl,
    });

    const savedUser = await this.usersRepository.save(user);
    const response = userRegisterResponseSchema.parse(savedUser);

    return response as UsersEntity;
  }

  async addSkills(
    userId: string,
    dto: AddSkillsDto,
    role: string,
  ): Promise<UsersSkillsEntity | HttpException> {
    if (role != 'applicant') {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Only Applicant',
          data: null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const existing = await this.usersSkillsRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    let savedSkill: UsersSkillsEntity;

    if (existing) {
      existing.skills = dto.skills;
      savedSkill = await this.usersSkillsRepository.save(existing);
    } else {
      const userSkills = this.usersSkillsRepository.create({
        user: { id: userId },
        skills: dto.skills,
      });
      savedSkill = await this.usersSkillsRepository.save(userSkills);
    }

    return savedSkill;
  }

  async addRecruiterDetailTransactional(
    manager: EntityManager,
    userId: string,
    companyId: string,
  ): Promise<RecruiterDtlEntity> {
    const repo = manager.getRepository(RecruiterDtlEntity);

    const data = repo.create({
      user: { id: userId },
      company: { id: companyId },
    });

    return await repo.save(data);
  }
}
