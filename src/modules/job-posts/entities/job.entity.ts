import { JobType } from 'src/common/enums/job.enum';
import { CompaniesEntity } from 'src/modules/companies/entities/companies.entity';
import { ApplicationEntity } from 'src/modules/job-application/entities/application.entity';
import { UsersEntity } from 'src/modules/users/entities/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('job_post')
export class JobPostEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CompaniesEntity, (company) => company.jobPosts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'company_id' })
  company: CompaniesEntity;

  @ManyToOne(() => UsersEntity, (recruiter) => recruiter.jobPosts, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'recruiter_id' })
  recruiter: UsersEntity;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({
    type: 'enum',
    enum: JobType,
    nullable: false,
  })
  job_type: JobType;

  @Column({ type: 'varchar', length: 100, nullable: true })
  location?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  salary_range?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'boolean', default: true })
  is_open: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => ApplicationEntity, (application) => application.job)
  applications: ApplicationEntity[];
}
