import { Global, Injectable } from '@nestjs/common';
import { Between, DataSource, Repository } from 'typeorm';

import { ETokenName } from '../blockchain/types';
import { BlockchainDomain } from '../blockchain/blockchain.domain';
import { TokenTrackerEntity } from '../database/entities/tokenTracker.entity';

@Global()
@Injectable()
export class ExchangeService {
  private readonly tokenTrackerRepo: Repository<TokenTrackerEntity>;

  constructor(private readonly blockchainService: BlockchainDomain, dataSource: DataSource) {
    this.tokenTrackerRepo = dataSource.getRepository(TokenTrackerEntity);
  }

  async calcExchangeRate(ethAmount: number): Promise<{
    btcAmount: number;
    feeInEth: number;
    feeInUsd: number;
  }> {
    const [ethInfo, btcInfo] = await Promise.all([
      this.blockchainService.getLatestBlock(ETokenName.ETHEREUM),
      this.blockchainService.getLatestBlock(ETokenName.BITCOIN),
    ]);

    const ethToUsd = ethInfo.usdPrice;
    const btcToUsd = btcInfo.usdPrice;

    const totalEthValueInUsd = ethAmount * ethToUsd;

    const feePercentage = 0.03;
    const totalFeeUsd = totalEthValueInUsd * feePercentage;
    const totalFeeEth = totalFeeUsd / ethToUsd;

    const valueAfterFee = totalEthValueInUsd - totalFeeUsd;

    const btcAmount = valueAfterFee / btcToUsd;

    return {
      btcAmount,
      feeInEth: totalFeeEth,
      feeInUsd: totalFeeUsd,
    };
  }

  async getTokenHistory(tokenName: ETokenName): Promise<{ time: string; priceInUsd: number }[]> {
    const currentTime = new Date();
    const minutesMark = currentTime.getMinutes() - (currentTime.getMinutes() % 5);
    const seconds = currentTime.getSeconds();
    const hourlyTimestamps: Date[] = [];

    // Generate timestamps for the past 24 hours at the same minute and second
    for (let i = 1; i <= 24; i++) {
      const pastHour = new Date(currentTime);
      pastHour.setHours(currentTime.getHours() - i);
      pastHour.setMinutes(minutesMark);
      pastHour.setSeconds(seconds);
      hourlyTimestamps.push(pastHour);
    }

    // Fetch data from the database for each timestamp
    const results = await Promise.all(
      hourlyTimestamps.map(async (timestamp) => {
        const startRange = new Date(timestamp.getTime() - 2.5 * 60 * 1000); // 2.5 minutes before
        const endRange = new Date(timestamp.getTime() + 2.5 * 60 * 1000); // 2.5 minutes after

        const record = await this.tokenTrackerRepo.findOne({
          where: {
            tokenName,
            createdAt: Between(startRange, endRange),
          },
          order: { createdAt: 'DESC' },
        });

        return record
          ? { time: record.createdAt.toISOString(), priceInUsd: parseFloat(record.usdPrice.toString()) }
          : null;
      })
    );

    // Filter out any null values if no data was found for that hour
    return results.filter((result) => result !== null) as Array<{ time: string; priceInUsd: number }>;
  }
}
