import { ETokenName } from '../blockchain/types';

export type TAlertSetup = {
  tokenName: ETokenName;
  dollarChange: number;
  email: string;
};

export type TAlert = {
  tokenName: ETokenName;
  priceDiffInUsd: number;
  currentPriceInUsd: number;
  percentageDiff: number;
};
