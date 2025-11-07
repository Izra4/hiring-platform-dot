import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExperiencesEntity } from './entities/experiences.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExperiencesEntity])],
  providers: [],
  controllers: [],
  exports: [],
})
export class ExperiencesModule {}
