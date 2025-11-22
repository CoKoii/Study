import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserAccount } from './user.entity';

@Entity()
export class UserProfile {
  @PrimaryGeneratedColumn({ comment: '用户资料ID' })
  id: number;

  @Column({ comment: '昵称' })
  nickname: string;

  @Column({ comment: '头像' })
  avatar: string;

  @Column({ comment: '个人简介' })
  bio: string;

  @Column({ comment: '性别' })
  gender: string;

  @Column({ comment: '年龄' })
  age: number;

  @Column({ comment: '职业' })
  job: string;

  // 关联的用户账号
  @OneToOne(() => UserAccount)
  @JoinColumn()
  user: UserAccount;
}
