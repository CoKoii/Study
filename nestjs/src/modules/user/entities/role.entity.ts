import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserAccount } from './user.entity';

@Entity()
export class UserRole {
  @PrimaryGeneratedColumn({ comment: '角色ID' })
  id: number;

  @Column({ comment: '角色名称' })
  name: string;

  @ManyToMany(() => UserAccount, (userAccount) => userAccount.roles)
  user: UserAccount[];
}
