import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from './role.entity';

@Entity()
export class UserAccount {
  @PrimaryGeneratedColumn({ comment: '用户ID' })
  id: number;

  @Column({ comment: '用户名' })
  username: string;

  @Column({ comment: '密码' })
  password: string;

  @Column({ comment: '状态' })
  status: string;

  @Column({ comment: '最后登录时间' })
  last_login_at: Date;

  @Column({ comment: '创建时间' })
  created_at: Date;

  @ManyToMany(() => UserRole, (userRole) => userRole.user)
  @JoinTable({ name: 'users_roles' })
  roles: UserRole[];
}
