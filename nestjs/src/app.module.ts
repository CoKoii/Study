import { Module } from '@nestjs/common';
import { ConfigFactory, ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import Configuration from './configuration';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      load: [Configuration as ConfigFactory],
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
