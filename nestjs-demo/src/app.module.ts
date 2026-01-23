import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
// import Configuration from './configuration';
import * as dotenv from 'dotenv';
import * as Joi from 'joi';
const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      // load: [Configuration],
      envFilePath,
      load: [() => dotenv.config({ path: '.env' })],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        DB_PORT: Joi.number().default(3306),
        DB_URL: Joi.string().domain(),
        DB_HOST: Joi.string().ip(),
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
