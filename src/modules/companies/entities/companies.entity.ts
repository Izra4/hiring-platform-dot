import { RecruiterDtlEntity } from 'src/modules/users/entities/recruiter-dtl.entity';
import { UsersEntity } from 'src/modules/users/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('companies')
export class CompaniesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { unique: true, length: 255, nullable: false })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('varchar', { length: 100, nullable: true })
  industry: string;

  @Column('varchar', { length: 255, nullable: true })
  location: string;

  @Column('varchar', { length: 255, nullable: true })
  website: string;

  @Column('integer', { nullable: true })
  founded_year: number;

  @Column('boolean', { default: false })
  is_verified: boolean;

  @Column('bool', { default: false })
  is_premium: boolean;

  @Column('date', { nullable: true })
  premium_expiry_date: Date;

  @OneToOne(() => UsersEntity, (user) => user.id)
  @JoinColumn({ name: 'created_by' })
  created_by: UsersEntity;

  @OneToOne(() => UsersEntity, (user) => user.id)
  @JoinColumn({ name: 'updated_by' })
  updated_by: UsersEntity;

  @OneToOne(() => RecruiterDtlEntity, (recruiter) => recruiter.id)
  recruiter: RecruiterDtlEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
