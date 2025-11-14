import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigEnum } from './enum/config.enum';
const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ({
          type: configService.get<'mysql'>(ConfigEnum.DB_TYPE),
          host: configService.get<string>(ConfigEnum.DB_HOST),
          port: configService.get<number>(ConfigEnum.DB_PORT),
          username: configService.get<string>(ConfigEnum.DB_USERNAME),
          password: configService.get<string>(ConfigEnum.DB_PASSWORD),
          database: configService.get<string>(ConfigEnum.DB_NAME),
          entities: [],
          synchronize: true,
          logging: ['error'],
        }) as TypeOrmModuleOptions,
    }),
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
