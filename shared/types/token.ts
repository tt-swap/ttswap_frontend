export type Token = { currency: string; file: string };

export interface TokenAmount {
  id: string | number | '';
  token: string;
  amount: number | '';
  price:number;
  currentQuantity: number;
  currentValue: number;
}

export interface AmountState {
  from: TokenAmount;
  to: TokenAmount;
}
export interface TokenPayload {
  id: string | number;
  symbol: string;
  decimals: number;
  buyFee: number;
  sellFee: number;
  price: number;
  logo_url: string;
  address: string;
  currentQuantity: number;
  currentValue: number;
}

export interface SwapState {
  from: TokenPayload;
  to: TokenPayload;
}
export interface SwapStateF {
  from: TokenPayload;
}
export interface SwapStateT {
  to: TokenPayload;
}

export interface SwapTokenValue {
  id: string | number;
  name: string;
  decimals: number;
  symbol: string;
  currentQuantity: number;
  currentValue: number;
  buyFee: number;
  sellFee: number;
  price: number;
  logo_url: string;
  address: string;
}

export interface SwapToken {
  id: string | number;
  name: string;
  symbol: string;
  logo_url: string;
  address: string;
  children?: SwapTokenValue[];
}

export interface SwapTokens {
  tokenValue: SwapTokenValue[];
  tokens: SwapToken[];
  
}


export interface InvestToken {
  id: string | number;
  name: string;
  symbol: string;
  investFee: number;
  price: number;
  logo_url: string;
  address: string;
  isvaluegood: boolean;
  decimals: number;
}

export interface InvestTokenValue {
  id: string | number;
  name: string;
  decimals: number;
  symbol: string;
  investQuantity: number;
  disinvestFee: number;
  investFee: number;
  price: number;
  logo_url: string;
  address: string;
  isvaluegood: boolean;
}

export interface InvestTokens {
  id: string | number;
  name: string;
  symbol: string;
  logo_url: string;
  address: string;
  children?: InvestTokenValue[];
}

export interface InvestState {
  from: InvestToken;
  to: InvestToken;
}
export interface InvestTokenD {
  tokenValue: InvestTokenValue[];
  tokens: InvestTokens[];
  
}