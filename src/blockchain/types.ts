export type TTokenPriceResponse = {
  tokenName: ETokenName;
  usdPrice: number;
  blockNumber: number;
};

export type TChainInfo = {
  chain: string;
  address: string;
  blockTime: number;
};

export enum ETokenName {
  ETHEREUM = 'ETHEREUM',
  POLYGON = 'POLYGON',
  BITCOIN = 'BITCOIN',
}
