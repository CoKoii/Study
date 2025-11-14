import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;
@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
