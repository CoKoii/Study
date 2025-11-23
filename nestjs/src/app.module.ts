import { Module } from '@nestjs/common';
import { ConfigFactory, ConfigModule, ConfigService } from '@nestjs/config';
import Configuration from './config/configuration';
import * as Joi from 'joi';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigEnum } from './common/enum/config.enum';
import { UserModule } from './modules/user/user.module';
import { LogsModule } from './common/logs/logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      load: [Configuration as ConfigFactory],
      // 对环境配置进行校验
      validationSchema: Joi.object({
        DB_TYPE: Joi.string().valid('mysql').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(3306),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        DB_SYNC: Joi.boolean().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ({
          type: configService.get<string>(ConfigEnum.DB_TYPE),
          host: configService.get<string>(ConfigEnum.DB_HOST),
          port: configService.get<number>(ConfigEnum.DB_PORT),
          username: configService.get<string>(ConfigEnum.DB_USERNAME),
          password: configService.get<string>(ConfigEnum.DB_PASSWORD),
          database: configService.get<string>(ConfigEnum.DB_DATABASE),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: configService.get<boolean>(ConfigEnum.DB_SYNC),
          retryAttempts: Infinity,
          retryDelay: 5000,
        }) as TypeOrmModuleOptions,
    }),

    UserModule,
    LogsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
