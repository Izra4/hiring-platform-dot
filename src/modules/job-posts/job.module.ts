import { Module } from '@nestjs/common';
import { JobsController } from './job.controller';
import { JobService } from './job.service';
import { UsersModule } from '../users/users.module';
import { JobPostEntity } from './entities/job.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([JobPostEntity]), UsersModule],
  controllers: [JobsController],
  providers: [JobService],
  exports: [JobService],
})
export class JobsModule {}
