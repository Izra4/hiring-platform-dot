import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './entity/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  findAll(): Promise<UsersEntity[]> {
    return this.usersRepository.find();
  }

  findbyId(id: string): Promise<UsersEntity | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  findByEmail(email: string): Promise<UsersEntity | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async createUser(userData: Partial<UsersEntity>): Promise<UsersEntity> {
    const newUser = this.usersRepository.create(userData);
    return this.usersRepository.save(newUser);
  }
}
