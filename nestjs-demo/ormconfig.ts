import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Logs } from './src/logs/logs.entity';
import { Roles } from './src/roles/roles.entity';
import { Profile } from './src/user/entities/profile.entity';
import { User } from './src/user/entities/user.entity';
import { DataSource, type DataSourceOptions } from 'typeorm';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { ConfigEnum } from './src/enum/config';
const getEnv = (env: string) => {
  if (fs.existsSync(env)) {
    return dotenv.parse(fs.readFileSync(env));
  }
  return {};
};
const buildConnectionOptions = () => {
  const defaultConfig = getEnv('.env');
  const envConfig = getEnv(`.env.${process.env.NODE_ENV}`);
  const config = { ...defaultConfig, ...envConfig };
  return {
    type: config[ConfigEnum.DB_TYPE],
    host: config[ConfigEnum.DB_HOST],
    port: Number(config[ConfigEnum.DB_PORT]),
    username: config[ConfigEnum.DB_USERNAME],
    password: config[ConfigEnum.DB_PASSWORD],
    database: config[ConfigEnum.DB_DATABASE],
    entities: [User, Profile, Logs, Roles],
    synchronize: true,
    logging: false,
  } as TypeOrmModuleOptions;
};
export const connectionParams = buildConnectionOptions();

export default new DataSource({
  ...connectionParams,
  migrations: ['src/migration/**'],
  subscribers: [],
} as DataSourceOptions);
