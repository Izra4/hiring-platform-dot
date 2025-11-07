import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './entities/users.entity';
import { Repository } from 'typeorm';
import { RegisterDto, userRegisterResponseSchema } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

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
}
