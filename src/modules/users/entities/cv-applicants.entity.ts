import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersEntity } from './users.entity';
import { ApplicationEntity } from 'src/modules/job-application/entities/application.entity';

@Entity('cv_applicants')
export class CvApplicantsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UsersEntity, (user) => user.cvApplicants)
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;

  @Column('text', { nullable: false })
  cvUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ApplicationEntity, (application) => application.cv)
  applications: ApplicationEntity[];
}
