import { TransactionStatus } from 'src/common/enums/trx-status.enum';
import { CompaniesEntity } from 'src/modules/companies/entities/companies.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('premium_transactions')
export class TrxEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 255, nullable: false })
  trx_id: string;

  @ManyToOne(() => CompaniesEntity, (company) => company.trx)
  @JoinColumn({ name: 'company_id' })
  company: CompaniesEntity;

  @Column('decimal', { nullable: false })
  amount: number;

  @Column('varchar', { length: 20, nullable: true })
  payment_type: string;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Column('date', { nullable: true })
  payment_date: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
