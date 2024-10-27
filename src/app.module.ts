import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Imports
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AlertsModule } from './alerts/alerts.module';

import { TokenTrackerModule } from './tokenTracker/tokenTracker.module';
import { ExchangeService } from './exchangeOpenApis/exchange.service';
import { ExchangeController } from './exchangeOpenApis/exchange.controller';
import { BlockchainModule } from './blockchain/blockchain.module';
import { DatabasePool } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabasePool,
    ScheduleModule.forRoot(),
    AlertsModule,
    TokenTrackerModule,
    BlockchainModule,
  ],
  controllers: [AppController, ExchangeController],
  providers: [AppService, ExchangeService],
})
export class AppModule {}
