import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './entities/users.entity';
import { UsersService } from './users.service';
import { CvApplicantsEntity } from './entities/cv-applicants.entity';
import { UsersSkillsEntity } from './entities/users-skills.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersEntity,
      CvApplicantsEntity,
      UsersSkillsEntity,
    ]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
