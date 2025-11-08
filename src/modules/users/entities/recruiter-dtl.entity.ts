import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersEntity } from './users.entity';
import { CompaniesEntity } from 'src/modules/companies/entities/companies.entity';

@Entity('recuiter_details')
export class RecruiterDtlEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => UsersEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;

  @OneToOne(() => CompaniesEntity, (company) => company.id)
  @JoinColumn({ name: 'company_id' })
  company: CompaniesEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
