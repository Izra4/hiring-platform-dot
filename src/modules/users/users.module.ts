import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './entities/users.entity';
import { UsersService } from './users.service';
import { CvApplicantsEntity } from './entities/cv-applicants.entity';
import { UsersSkillsEntity } from './entities/users-skills.entity';
import { RecruiterDtlEntity } from './entities/recruiter-dtl.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersEntity,
      CvApplicantsEntity,
      UsersSkillsEntity,
      RecruiterDtlEntity,
    ]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
