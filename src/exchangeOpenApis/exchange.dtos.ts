import { IsNotEmpty, IsNumberString, IsString, IsDecimal, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ETokenName } from '../blockchain/types';

export class BtcToEthExRate {
  @IsNumber()
  @ApiProperty({ description: 'Amount you receive after exchange' })
  btcAmount: number;

  @IsNumber()
  @ApiProperty({ description: 'Fee deducted (Eth Representation)' })
  feeInEth: number;

  @IsNumber()
  @ApiProperty({ description: 'Fee deducted (USD Representation)' })
  feeInUsd: number;
}

export class TokenPriceHistoryRequestParam {
  @IsEnum(ETokenName)
  @ApiProperty({ description: `Token name to get history for (options: ${Object.values(ETokenName).join(', ')})` })
  token: ETokenName;
}

export type TokenHistoryResponse = {
  time: string;
  priceInUsd: number;
};

export class CreateTokenPriceDto {
  @IsString()
  @IsNotEmpty()
  tokenName: string;

  @IsString()
  @IsNotEmpty()
  tokenSymbol: string;

  @IsString()
  @IsNotEmpty()
  tokenAddress: string;

  @IsDecimal()
  @IsNotEmpty()
  usdPrice: number;

  @IsString()
  @IsNotEmpty()
  percentChangeInLast24hr: string;

  @IsNumberString()
  @IsNotEmpty()
  blockTimestamp: string;
}
