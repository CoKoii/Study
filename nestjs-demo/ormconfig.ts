import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Logs } from './src/logs/logs.entity';
import { Roles } from './src/roles/roles.entity';
import { Profile } from './src/user/entities/profile.entity';
import { User } from './src/user/entities/user.entity';
import { DataSource, type DataSourceOptions } from 'typeorm';

export const connectionParams = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'CaoKai1026',
  database: 'test_db',
  entities: [User, Profile, Logs, Roles],
  synchronize: true,
  logging: false,
} as TypeOrmModuleOptions;

export default new DataSource({
  ...connectionParams,
  migrations: ['src/migration/**'],
  subscribers: [],
} as DataSourceOptions);
