import { Injectable } from '@nestjs/common';
import { ETokenName, TTokenPriceResponse } from './types';

@Injectable()
export abstract class BlockchainDomain {
  abstract getLatestBlock(token: ETokenName): Promise<TTokenPriceResponse>;

  abstract getBlockInHistory(token: ETokenName): Promise<TTokenPriceResponse>;
}
