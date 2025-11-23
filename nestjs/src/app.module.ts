import { Module } from '@nestjs/common';
import { ConfigFactory, ConfigModule } from '@nestjs/config';
import Configuration from './config/configuration';
import * as Joi from 'joi';
import { UserModule } from './modules/user/user.module';
import { LogsModule } from './core/logger/logger.modules';
import { DatabaseModule } from './core/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `src/config/.env.${process.env.NODE_ENV}`,
        'src/config/.env',
      ],
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
    DatabaseModule,
    UserModule,
    LogsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
