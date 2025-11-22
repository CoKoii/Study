import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAccount } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserProfile } from './entities/profile.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserAccount)
    private readonly userRepository: Repository<UserAccount>,
    @InjectRepository(UserProfile)
    private readonly profileRepository: Repository<UserProfile>,
  ) {}
  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }

  async findProfile(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    const profile = await this.profileRepository.findOne({
      where: { user: { id: user?.id } },
    });
    return {
      ...user,
      info: profile,
    };
  }
}
