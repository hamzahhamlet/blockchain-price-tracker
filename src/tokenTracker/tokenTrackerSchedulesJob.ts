import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DataSource, Repository } from 'typeorm';

import { TokenTrackerEntity } from '../database/entities/tokenTracker.entity';
import { AlertEntity } from '../database/entities/alerts.entity';
import { ETokenName, TTokenPriceResponse } from '../blockchain/types';
import { TTokenTrackNode } from './types';
import { BlockchainDomain } from '../blockchain/blockchain.domain';
import { EmailAlertsDomain } from '../alerts/emailAlerts.domain';
import { TAlert } from '../alerts/types';

@Injectable()
export class TokenTrackerScheduledJob {
  private readonly tokenTrackerRepo: Repository<TokenTrackerEntity>;
  private readonly userAlertRepo: Repository<AlertEntity>;
  private static readonly CRON_SCHEDULE = '*/5 * * * *';

  constructor(
    private readonly blockchainService: BlockchainDomain,
    private readonly emailAlertingService: EmailAlertsDomain,
    dataSource: DataSource
  ) {
    console.log(
      `Tracking service initiated. Next job in less than 5 minutes ${TokenTrackerScheduledJob.CRON_SCHEDULE}`
    );
    this.tokenTrackerRepo = dataSource.getRepository(TokenTrackerEntity);
    this.userAlertRepo = dataSource.getRepository(AlertEntity);
  }

  private async saveTokenPrice(data: TTokenTrackNode[]): Promise<TokenTrackerEntity[]> {
    const tokenPrice: TokenTrackerEntity[] = data.map((ele) => this.tokenTrackerRepo.create(ele));
    return this.tokenTrackerRepo.save(tokenPrice);
  }

  @Cron(TokenTrackerScheduledJob.CRON_SCHEDULE)
  async syncTokenPrices() {
    console.log('Running scheduled job at: ', new Date().toISOString());
    // Fetch current token prices
    const tokenDetailsLive = await Promise.all(
      Object.values(ETokenName).map((ele) => this.blockchainService.getLatestBlock(ele))
    );
    // Save token prices in database
    await this.saveTokenPrice(tokenDetailsLive);

    // Fetch 1 hour old token prices
    const tokenDetailsHistory = await Promise.all(
      Object.values(ETokenName).map((ele) => this.blockchainService.getBlockInHistory(ele))
    );

    this.sendAdminAlerts(tokenDetailsLive, tokenDetailsHistory);
    this.sendUserAlerts(tokenDetailsLive, tokenDetailsHistory);
  }

  private async sendAdminAlerts(tokenDetailsLive: TTokenPriceResponse[], tokenDetailsHistory: TTokenPriceResponse[]) {
    // Check for token prices 1 hour ago, trigger email if |price_change|% > 3%
    const adminAlerts = tokenDetailsLive.reduce<TAlert[]>((acc, { tokenName, usdPrice: currentPriceInUsd }) => {
      const { usdPrice: oldPrice } = tokenDetailsHistory.find((token) => token.tokenName === tokenName);
      // Calculate the percentage difference
      const percentageDiff = ((currentPriceInUsd - oldPrice) / oldPrice) * 100;

      // Check if the difference is greater than 3%
      if (Math.abs(percentageDiff) > 3) {
        acc.push({
          tokenName,
          percentageDiff,
          currentPriceInUsd,
          priceDiffInUsd: currentPriceInUsd - oldPrice,
        });
      }

      return acc;
    }, []);

    // we prefer not awaiting this. so problem with mailing service doesn't crashes us
    this.emailAlertingService.alertAdmin(adminAlerts);
  }

  private async sendUserAlerts(tokenDetailsLive: TTokenPriceResponse[], tokenDetailsHistory: TTokenPriceResponse[]) {
    // Check for token prices 1 hour ago, trigger email if |price_change|% > 3%
    const changeInTokens = tokenDetailsLive.reduce<TAlert[]>((acc, { tokenName, usdPrice: currentPriceInUsd }) => {
      const { usdPrice: oldPrice } = tokenDetailsHistory.find((token) => token.tokenName === tokenName);
      // Calculate the percentage difference
      const percentageDiff = ((currentPriceInUsd - oldPrice) / oldPrice) * 100;

      // Check if the difference is greater than 3%
      acc.push({
        tokenName,
        percentageDiff,
        currentPriceInUsd,
        priceDiffInUsd: currentPriceInUsd - oldPrice,
      });

      return acc;
    }, []);

    const alertsToNotify = (
      await Promise.all(
        changeInTokens.map(({ tokenName, priceDiffInUsd }) =>
          this.userAlertRepo
            .createQueryBuilder('alert')
            .where('alert.tokenName = :tokenName', { tokenName })
            .andWhere('alert.dollarChange <= :priceDiffInUsd', { priceDiffInUsd: Math.abs(priceDiffInUsd) })
            .getMany()
        )
      )
    ).flat();

    const alerts = alertsToNotify.map((item) => {
      const oldBlock = tokenDetailsHistory.find((historyItem) => historyItem.tokenName === item.tokenName);
      const newBlock = tokenDetailsLive.find((liveItem) => liveItem.tokenName === item.tokenName);

      const percentageDiff = ((newBlock.usdPrice - oldBlock.usdPrice) / oldBlock.usdPrice) * 100;

      return {
        email: item.email,
        tokenName: item.tokenName,
        priceDiffInUsd: newBlock.usdPrice - oldBlock.usdPrice,
        currentPriceInUsd: newBlock.usdPrice,
        percentageDiff: percentageDiff,
      };
    });

    this.emailAlertingService.alertUser(alerts);
  }
}
