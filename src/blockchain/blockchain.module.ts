import { Global, Module } from '@nestjs/common';
import { BlockchainMoralisService } from './adapters/blockchainMoralis.adapter';
import { BlockchainDomain } from './blockchain.domain';

@Global()
@Module({
  providers: [
    {
      provide: BlockchainDomain,
      useClass: BlockchainMoralisService,
    },
  ],
  exports: [
    {
      provide: BlockchainDomain,
      useClass: BlockchainMoralisService,
    },
  ],
})
export class BlockchainModule {}
