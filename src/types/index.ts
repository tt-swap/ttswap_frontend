/**
 * 全局类型定义
 */

// 从服务模块导出类型
// export type {
//   Token,
//   TokenDetail,
// } from '../services/modules/tokenService';

// export type {
//   Investment,
//   InvestmentStats,
// } from '../services/modules/investmentService';

// export type {
//   Transaction,
//   TransactionType,
//   SwapParams,
// } from '../services/modules/transactionService';

// 通用类型定义

export interface Referral {
  id: number;
  address: string;
  totalExchangeValue: number;
  totalInvestmentValue: number;
  totalWithdrawValue: number;
  registrationDate: string;
  referralLevel: number;
}

export interface Commission {
  id: number;
  name: string;
  symbol: string;
  icon: string;
  color: string;
  totalFeeAmount: number;
  totalFeeValue: number;
  myFeeAmount: number;
  myFeeValue: number;
}

export interface PortfolioOverview {
  totalTradeValue: number;
  totalInvestmentValue: number;
  totalSimpleValue: number;
  miningValue: number;
  totalProfitValue: number;
  totalLossValue: number;
  financedTTSAmount: number;
  miningTTSAmount: number;
}

// UI状态类型
export type TabValue = 'home' | 'tokens' | 'trading' | 'public-sale';
export type SubTabValue = 'investment' | 'tokens' | 'statistics' | 'idle' | 'records' | 'referrals';

// 对话框相关类型
export type DialogType = 'swap' | 'staking' | 'create-token' | 'withdraw';
