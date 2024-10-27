import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ExchangeService } from './exchange.service';
import { BtcToEthExRate, TokenHistoryResponse, TokenPriceHistoryRequestParam } from './exchange.dtos';

@Controller('exchange')
@ApiTags('Exchange')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @Get('/eth-to-btc/:amount')
  @ApiOperation({
    summary: 'Check the eth to btc exchange rate with constant fee of 0.3%',
  })
  @ApiResponse({
    type: BtcToEthExRate,
  })
  getExchangeRate(@Param('amount') ethAmount: string): Promise<BtcToEthExRate> {
    const amount = parseInt(ethAmount);
    return this.exchangeService.calcExchangeRate(amount);
  }

  @Get('/token-history/:token')
  @ApiResponse({})
  @ApiParam({
    name: 'token',
    type: TokenPriceHistoryRequestParam,
  })
  getTokenPriceHistory(@Param() { token }: TokenPriceHistoryRequestParam): Promise<TokenHistoryResponse[]> {
    return this.exchangeService.getTokenHistory(token);
  }
}
