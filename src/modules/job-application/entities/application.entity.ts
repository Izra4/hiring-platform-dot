import { ApplicationStatus } from 'src/common/enums/application-status.enum';
import { JobPostEntity } from 'src/modules/job-posts/entities/job.entity';
import { CvApplicantsEntity } from 'src/modules/users/entities/cv-applicants.entity';
import { UsersEntity } from 'src/modules/users/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('job_application')
export class ApplicationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UsersEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;

  @ManyToOne(() => JobPostEntity, (job) => job.id)
  @JoinColumn({ name: 'job_id' })
  job: JobPostEntity;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    nullable: false,
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;

  @ManyToOne(() => CvApplicantsEntity, (cv) => cv.id)
  @JoinColumn({ name: 'cv_id' })
  cv: CvApplicantsEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
