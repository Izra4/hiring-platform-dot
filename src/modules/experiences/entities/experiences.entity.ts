import { UsersEntity } from 'src/modules/users/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('experiences')
export class ExperiencesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UsersEntity, (user) => user.experiences)
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;

  @Column('varchar', { length: 100, nullable: false })
  title: string;

  @Column('varchar', { length: 100, nullable: false })
  company_name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('date', { nullable: false })
  start_date: Date;

  @Column('date', { nullable: true })
  end_date: Date;

  @Column('boolean', { default: false })
  is_current: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
