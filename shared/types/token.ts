export type Token = { currency: string; file: string };

export interface TokenPayload {
  token: string;
  amount: number;
}

export interface SwapState {
  from: TokenPayload;
  to: TokenPayload;
}
