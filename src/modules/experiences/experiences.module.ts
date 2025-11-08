import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExperiencesEntity } from './entities/experiences.entity';
import { ExperienceService } from './experiences.service';
import ExperiencesController from './experiences.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ExperiencesEntity])],
  providers: [ExperienceService],
  controllers: [ExperiencesController],
  exports: [ExperienceService],
})
export class ExperiencesModule {}
