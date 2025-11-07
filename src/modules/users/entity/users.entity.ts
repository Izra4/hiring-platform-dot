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

export enum UserRole {
  RECRUITER = 'recruiter',
  APPLICANT = 'applicant',
}

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
}
