import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { TokenTrackerEntity } from './entities/tokenTracker.entity';
import { AlertEntity } from './entities/alerts.entity';
import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';

function getDatabaseConfig(configService: ConfigService): TypeOrmModuleOptions {
  return {
    entities: [AlertEntity, TokenTrackerEntity],
    namingStrategy: new SnakeNamingStrategy(),
    logging: false,
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: parseInt(configService.get<string>('DB_PORT'), 10),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_DATABASE'),
    synchronize: true,
    autoLoadEntities: true,
  };
}

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (appConfigService: ConfigService) => getDatabaseConfig(appConfigService),
      inject: [ConfigService],
    }),
  ],
})
export class DatabasePool {}
