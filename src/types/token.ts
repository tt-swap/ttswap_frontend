import { DEFAULT_TOKEN } from "@/types/common";

export type Token = { currency: string; file: string };

export interface TokenAmount {
  id: string;
  token: string;
  amount: number | '';
  price: number;
  currentQuantity: number;
  currentValue: number;
}

export interface AmountState {
  from: TokenAmount;
  to: TokenAmount;
}
export interface TokenPayload {
  id: string;
  name: string;
  symbol: string;
  decimals: number;
  buyFee?: number;
  sellFee?: number;
  investFee?: number;
  price: number;
  logo_url: string;
  address: string;
  currentQuantity: number;
  currentValue: number;
  isvaluegood: boolean;
  no: number;
  type: number;
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
  buyFee?: number;
  sellFee?: number;
  investFee?: number;
  price: number;
  logo_url: string;
  address: string;
  isvaluegood: boolean;
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
  from: TokenPayload;
  to: TokenPayload;
}
export interface InvestTokenD {
  tokenValue: InvestTokenValue[];
  tokens: InvestTokens[];

}


export const initDefaultinvest = (): InvestState => ({
  from: {
    id: 0,
    name: "",
    symbol: DEFAULT_TOKEN,
    investFee: 0,
    price: 0,
    logo_url: "",
    address: "",
    isvaluegood: false,
    currentQuantity: 0,
    currentValue: 0,
    decimals: 0,
    no: 0,
    type: 0
  },
  to: {
    id: 0,
    name: "",
    symbol: DEFAULT_TOKEN,
    investFee: 0,
    price: 0,
    logo_url: "",
    address: "",
    isvaluegood: false,
    currentQuantity: 0,
    currentValue: 0,
    decimals: 0,
    no: 0,
    type: 0
  },
});

export const initDefaultSwap = (): SwapState => ({
  from: {
    symbol: DEFAULT_TOKEN,
    id: 0,
    name: "",
    buyFee: 0,
    sellFee: 0,
    price: 0,
    logo_url: "",
    address: "",
    currentQuantity: 0,
    currentValue: 0,
    decimals: 0,
    isvaluegood: false,
    no: 0,
    type: 0
  },
  to: {
    symbol: DEFAULT_TOKEN,
    id: 0,
    name: "",
    buyFee: 0,
    sellFee: 0,
    price: 0,
    logo_url: "",
    address: "",
    currentQuantity: 0,
    currentValue: 0,
    decimals: 0,
    isvaluegood: false,
    no: 0,
    type: 0
  },
});