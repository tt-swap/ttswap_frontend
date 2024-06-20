export type Token = { currency: string; file: string };

export interface TokenPayload {
  token: string;
  amount: number;
}

export interface SwapState {
  from: TokenPayload;
  to: TokenPayload;
}

export interface SwapTokenValue {
  id: string | number;
  name: string;
  decimals: number;
  symbol: string;
  currentQuantity: number;
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


// 创建实现Item接口的类
// export class SwapTokensClass implements SwapTokens {
//   tokenValue: SwapTokenValue[];
//   tokens: SwapToken[];

//   // 构造函数初始化对象的属性
//   constructor() {
//       this.tokenValue = [{ id: "", name: "", decimals: 0, symbol: "", currentQuantity: 0,
//       buyFee: 0, sellFee: 0, price: 0, logo_url: "", address: "" }];
//       this.tokens = [{ id: "", name: "", symbol: "", logo_url: "", address: "", children: [{ id: "", name: "", decimals: 0, symbol: "", currentQuantity: 0,
//       buyFee: 0, sellFee: 0, price: 0, logo_url: "", address: "" }] }];
//   }
// }