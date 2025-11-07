import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './modules/users/entity/users.entity';
import { CvApplicantsEntity } from './modules/users/entity/cv-applicants.entity';
import { UsersSkillsEntity } from './modules/users/entity/users-skills.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
      entities: [UsersEntity, CvApplicantsEntity, UsersSkillsEntity],
    }),
    UsersModule,
  ],
})
export class AppModule {}
