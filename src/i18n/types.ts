/**
 * 国际化类型定义
 */

export type Language = 'zh' | 'en';

export interface TranslationKeys {
  // 通用
  common: {
    confirm: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    search: string;
    loading: string;
    noData: string;
    error: string;
    success: string;
    submit: string;
    reset: string;
    close: string;
    back: string;
    next: string;
    previous: string;
    total: string;
    actions: string;
    view: string;
    copy: string;
    copied: string;
  };

  // 导航
  nav: {
    home: string;
    trading: string;
    publicSale: string;
    tokens: string;
    portfolio: string;
    transactions: string;
    statistics: string;
    commission: string;
    records: string;
    referrals: string;
  };

  // 投资组合
  portfolio: {
    title: string;
    totalValue: string;
    totalProfit: string;
    profitRate: string;
    todayProfit: string;
    investmentCount: string;
    overview: string;
  };

  // 代币
  token: {
    name: string;
    symbol: string;
    price: string;
    change24h: string;
    volume24h: string;
    marketCap: string;
    netValue: string;
    yearlyReturn: string;
    value: string;
    swap: string;
    invest: string;
    withdraw: string;
    createToken: string;
    selectToken: string;
    tokenList: string;
    tokenDetails: string;
    noTokens: string;
    update: string;
  };

  // 投资
  investment: {
    title: string;
    proof: string;
    id: string;
    asset: string;
    shares: string;
    marketValue: string;
    amount: string;
    netValuePerShare: string;
    profit: string;
    profitRate: string;
    operations: string;
    noInvestments: string;
    totalInvestment: string;
    investmentGroup: string;
  };

  // 交易
  transaction: {
    title: string;
    type: string;
    time: string;
    amount: string;
    status: string;
    hash: string;
    from: string;
    to: string;
    fee: string;
    noTransactions: string;
    pending: string;
    completed: string;
    failed: string;
    buy: string;
    sell: string;
    transfer: string;
  };

  // 统计
  statistics: {
    title: string;
    tradingVolume: string;
    tradingCount: string;
    avgTradeValue: string;
    winRate: string;
    totalProfit: string;
    totalLoss: string;
    period: string;
    today: string;
    week: string;
    month: string;
    year: string;
    all: string;
  };

  // 佣金
  commission: {
    title: string;
    rate: string;
    earned: string;
    pending: string;
    withdrawn: string;
    totalEarned: string;
    noCommissions: string;
  };

  // 推荐人
  referral: {
    title: string;
    referralCode: string;
    totalReferrals: string;
    activeReferrals: string;
    totalCommission: string;
    noReferrals: string;
    invitee: string;
    joinDate: string;
    tradingVolume: string;
    commission: string;
  };

  // 对话框
  dialog: {
    createToken: {
      title: string;
      name: string;
      symbol: string;
      description: string;
      initialPrice: string;
      totalSupply: string;
      create: string;
    };
    swap: {
      title: string;
      from: string;
      to: string;
      amount: string;
      balance: string;
      max: string;
      exchangeRate: string;
      estimatedReceive: string;
      slippage: string;
      fee: string;
      confirm: string;
    };
    withdraw: {
      title: string;
      asset: string;
      amount: string;
      available: string;
      address: string;
      fee: string;
      actualReceive: string;
      confirm: string;
    };
    updateToken: {
      title: string;
      tokenConfig: string;
      commissionConfig: string;
      tokenName: string;
      tokenSymbol: string;
      tokenDescription: string;
      tokenPrice: string;
      tokenSupply: string;
      buyFeeRate: string;
      sellFeeRate: string;
      investFeeRate: string;
      withdrawFeeRate: string;
      commissionRate: string;
      referralRate: string;
      update: string;
      feeUnit: string;
    };
  };

  // 表单验证
  validation: {
    required: string;
    invalidEmail: string;
    invalidAddress: string;
    insufficientBalance: string;
    minAmount: string;
    maxAmount: string;
    invalidNumber: string;
  };

  // 消息提示
  messages: {
    success: {
      swapCompleted: string;
      withdrawCompleted: string;
      tokenCreated: string;
      copied: string;
    };
    error: {
      swapFailed: string;
      withdrawFailed: string;
      tokenCreationFailed: string;
      copyFailed: string;
      networkError: string;
    };
  };

  // 英雄区块
  hero: {
    title: string;
    subtitle: string;
    cta: string;
    features: {
      title: string;
      feature1: string;
      feature2: string;
      feature3: string;
    };
  };

  // 市场概览
  market: {
    title: string;
    trending: string;
    gainers: string;
    losers: string;
    volume: string;
  };
}
