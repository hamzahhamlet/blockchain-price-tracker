import Moralis from 'moralis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ETokenName, TChainInfo, TTokenPriceResponse } from '../types';
import { BlockchainDomain } from '../blockchain.domain';

function calculateBlockNumber(hoursInHistory: number, currentBlock: number, blockTimeInSec: number) {
  return currentBlock - Math.floor((3600 * hoursInHistory) / blockTimeInSec);
}

function formatMoralisResponse(tokenName: ETokenName, data: any): TTokenPriceResponse {
  return {
    tokenName,
    usdPrice: data.usdPrice,
    blockNumber: data.priceLastChangedAtBlock,
  };
}

@Injectable()
export class BlockchainMoralisService implements BlockchainDomain {
  private connectionDetails: Partial<Record<ETokenName, TChainInfo>> = {};

  constructor(configService: ConfigService) {
    Object.values(ETokenName).forEach((tokenName) => {
      this.connectionDetails[tokenName] = {
        chain: configService.get<string>(`${tokenName}_CHAIN`),
        address: configService.get<string>(`${tokenName}_ADDRESS`),
        blockTime: configService.get<number>(`${tokenName}_BLOCK_TIME`),
      };
    });

    Moralis.start({
      apiKey: configService.get<string>('MORALIS_API_KEY'),
    });
  }

  getLatestBlock(token: ETokenName): Promise<TTokenPriceResponse> {
    return this.fetchBlockDetails(token);
  }

  getBlockInHistory(token: ETokenName): Promise<TTokenPriceResponse> {
    return this.fetchBlockDetails(token, 1);
  }

  private async fetchBlockDetails(token: ETokenName, hoursBefore?: number): Promise<TTokenPriceResponse> {
    const { address, blockTime, chain } = this.connectionDetails[token];

    const latestBlockRes = await Moralis.EvmApi.token.getTokenPrice({ chain, address });
    const latestBlockData = latestBlockRes.toJSON();

    if (!hoursBefore) {
      return formatMoralisResponse(token, latestBlockData);
    }

    const targetBlockNumber = calculateBlockNumber(1, latestBlockData['priceLastChangedAtBlock'], blockTime);
    const oldBlockRes = await Moralis.EvmApi.token.getTokenPrice({
      chain,
      address,
      toBlock: targetBlockNumber,
    });
    const oldBlockData = oldBlockRes.toJSON();

    return formatMoralisResponse(token, oldBlockData);
  }
}
