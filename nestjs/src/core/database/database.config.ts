import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { join } from 'path';
import { ConfigEnum } from '../../common/enum/config.enum';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.get<string>(
        ConfigEnum.DB_TYPE,
      ) as TypeOrmModuleOptions['type'],
      host: this.configService.get<string>(ConfigEnum.DB_HOST),
      port: this.configService.get<number>(ConfigEnum.DB_PORT),
      username: this.configService.get<string>(ConfigEnum.DB_USERNAME),
      password: this.configService.get<string>(ConfigEnum.DB_PASSWORD),
      database: this.configService.get<string>(ConfigEnum.DB_DATABASE),
      entities: [join(__dirname, '..', '..', '**', '*.entity.{ts,js}')],
      synchronize: this.configService.get<boolean>(ConfigEnum.DB_SYNC),
      retryAttempts: Infinity,
      retryDelay: 5000,
    } as TypeOrmModuleOptions;
  }
}
