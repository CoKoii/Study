import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccount } from './entities/user.entity';
import { UserProfile } from './entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserAccount, UserProfile])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
