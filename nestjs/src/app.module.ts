import { Module } from '@nestjs/common';
import { ConfigFactory, ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import Configuration from './configuration';
import * as Joi from 'joi';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      load: [Configuration as ConfigFactory],
      validationSchema: Joi.object({
        // 对环境配置进行校验
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(3306),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
      }),
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
