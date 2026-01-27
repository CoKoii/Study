import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
// import Configuration from './configuration';
import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import { TypeOrmModule, type TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigEnum } from './enum/config';
import { User } from './user/entities/user.entity';
import { Profile } from './user/entities/profile.entity';
import { Logs } from './logs/logs.entity';
import { Roles } from './roles/roles.entity';
const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // load: [Configuration],
      envFilePath,
      load: [() => dotenv.config({ path: '.env' })],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        DB_TYPE: Joi.string().default('mysql'),
        DB_HOST: Joi.string().ip(),
        DB_PORT: Joi.number().default(3306),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_SYNC: Joi.boolean().default(false),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ({
          type: configService.get(ConfigEnum.DB) as 'mysql',
          host: configService.get<string>(ConfigEnum.DB_HOST),
          port: configService.get<number>(ConfigEnum.DB_PORT),
          username: configService.get<string>(ConfigEnum.DB_USERNAME),
          password: configService.get<string>(ConfigEnum.DB_PASSWORD),
          database: configService.get<string>(ConfigEnum.DB_NAME),
          entities: [User, Profile, Logs, Roles],
          synchronize: configService.get<boolean>(ConfigEnum.DB_SYNC),
          logging: process.env.NODE_ENV === 'development',
        }) as TypeOrmModuleOptions,
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
