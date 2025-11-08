import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CvApplicantsEntity } from './cv-applicants.entity';
import { UsersSkillsEntity } from './users-skills.entity';
import { ExperiencesEntity } from 'src/modules/experiences/entities/experiences.entity';
import { CompaniesEntity } from 'src/modules/companies/entities/companies.entity';
import { UserRole } from 'src/common/enums/role.enums';
import { RecruiterDtlEntity } from './recruiter-dtl.entity';
import { JobPostEntity } from 'src/modules/job-posts/entities/job.entity';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { unique: true, length: 255, nullable: false })
  email: string;

  @Column('varchar', { length: 255, nullable: false })
  password: string;

  @Column('varchar', { length: 100, nullable: false })
  firstName: string;

  @Column('varchar', { length: 100, nullable: false })
  lastName: string;

  @Column('varchar', { length: 15, nullable: true })
  number: string;

  @Column('text', { nullable: true })
  profilePicture: string;

  @Column('boolean', { default: false })
  isVerified: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.APPLICANT,
  })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => CvApplicantsEntity, (cvApplicant) => cvApplicant.user, {
    eager: true,
  })
  cvApplicants: CvApplicantsEntity[];

  @OneToOne(() => UsersSkillsEntity, (usersSkills) => usersSkills.user)
  usersSkills: UsersSkillsEntity;

  @OneToOne(() => CompaniesEntity, (company) => company.created_by)
  company_created: CompaniesEntity;

  @OneToOne(() => RecruiterDtlEntity, (recruiterDtl) => recruiterDtl.user)
  recruiterDtl: RecruiterDtlEntity;

  @OneToOne(() => CompaniesEntity, (company) => company.updated_by)
  company_updated: CompaniesEntity;

  @OneToMany(() => ExperiencesEntity, (experience) => experience.user)
  experiences: ExperiencesEntity[];

  @OneToMany(() => JobPostEntity, (jobPost) => jobPost.recruiter)
  jobPosts: JobPostEntity[];
}
