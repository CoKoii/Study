import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserAccount } from './user.entity';

@Entity()
export class UserRole {
  @PrimaryGeneratedColumn({ comment: '角色ID' })
  id: number;

  @Column({ comment: '角色名称' })
  name: string;

  @ManyToOne(() => UserAccount, (userAccount) => userAccount.roles)
  @JoinColumn()
  user: UserAccount;
}
