import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationEntity } from './entities/application.entity';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './applcation.service';

@Module({
  controllers: [ApplicationController],
  providers: [ApplicationService],
  exports: [ApplicationService],
  imports: [TypeOrmModule.forFeature([ApplicationEntity])],
})
export class ApplicationModule {}
