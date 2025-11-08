import { Module } from '@nestjs/common';
import { JobsController } from './job.controller';
import { JobService } from './job.service';

@Module({
  imports: [],
  controllers: [JobsController],
  providers: [JobService],
  exports: [JobService],
})
export class JobModule {}
