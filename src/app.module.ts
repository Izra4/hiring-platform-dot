import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './modules/users/entities/users.entity';
import { CvApplicantsEntity } from './modules/users/entities/cv-applicants.entity';
import { UsersSkillsEntity } from './modules/users/entities/users-skills.entity';
import { ExperiencesEntity } from './modules/experiences/entities/experiences.entity';
import { CompaniesEntity } from './modules/companies/entities/companies.entity';
import { AuthModule } from './modules/auth/auth.module';
import { ExperiencesModule } from './modules/experiences/experiences.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { RecruiterDtlEntity } from './modules/users/entities/recruiter-dtl.entity';
import { JobPostEntity } from './modules/job-posts/entities/job.entity';
import { JobsModule } from './modules/job-posts/job.module';
import { ApplicationEntity } from './modules/job-application/entities/application.entity';
import { SupabaseModule } from './modules/supabase/supabase.module';
import { UploadModule } from './modules/upload/upload.module';
import { ApplicationModule } from './modules/job-application/application.module';

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
      entities: [
        UsersEntity,
        CvApplicantsEntity,
        UsersSkillsEntity,
        ExperiencesEntity,
        CompaniesEntity,
        RecruiterDtlEntity,
        JobPostEntity,
        ApplicationEntity,
      ],
    }),
    UsersModule,
    AuthModule,
    ExperiencesModule,
    CompaniesModule,
    JobsModule,
    SupabaseModule,
    UploadModule,
    ApplicationModule,
  ],
})
export class AppModule {}
