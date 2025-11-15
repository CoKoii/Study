import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigEnum } from './enum/config.enum';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Profile } from './user/entities/profile.entity';
import { Logs } from './logs/logs.entity';
import { Roles } from './roles/roles.entity';
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
          entities: [User, Profile, Roles, Logs],
          synchronize: true,
          logging: ['error'],
        }) as TypeOrmModuleOptions,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
