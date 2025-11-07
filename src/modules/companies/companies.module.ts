import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesEntity } from './entities/companies.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompaniesEntity])],
  providers: [],
  controllers: [],
  exports: [],
})
export class CompaniesModule {}
