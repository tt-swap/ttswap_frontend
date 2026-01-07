/**
 * 全局常量定义
 */

// 颜色常量
export const COLORS = {
  PRIMARY: '#0fb981',
  PRIMARY_HOVER: '#22c55e',
  USDT: '#26a17b',
  USDC: '#2775ca',
  WBTC: '#f7931a',
  ETH: '#627eea',
  SOL: '#9945ff',
} as const;

// 有价值代币列表（用于特殊标记和动画）
export const VALUE_TOKENS = ['USDT', 'ETH', 'WBTC', 'SOL'] as const;

// 代币图标映射
export const TOKEN_ICONS: Record<string, string> = {
  USDT: '₮',
  USDC: '○',
  WBTC: '₿',
  ETH: 'Ξ',
  SOL: '◎',
  DAI: '◈',
  BNB: '♦',
};

// 代币颜色映射
export const TOKEN_COLORS: Record<string, string> = {
  USDT: COLORS.USDT,
  USDC: COLORS.USDC,
  WBTC: COLORS.WBTC,
  ETH: COLORS.ETH,
  SOL: COLORS.SOL,
};

// 交易类型标签
export const TRANSACTION_TYPE_LABELS: Record<string, string> = {
  buy: '买入',
  sell: '卖出',
  invest: '投资',
  divest: '撤资',
  init: '初始化',
  meta: '元交易',
};

// 交易类型颜色
export const TRANSACTION_TYPE_COLORS: Record<string, string> = {
  buy: 'text-green-600',
  sell: 'text-red-600',
  invest: 'text-blue-600',
  divest: 'text-yellow-600',
  init: 'text-purple-600',
  meta: 'text-gray-600',
};

// 费率相关
export const FEE_RATES = {
  DEFAULT_BUY: 0.0008,    // 8‱
  DEFAULT_SELL: 0.0008,   // 8‱
  DEFAULT_INVESTMENT: 0.0008,  // 8‱
  DEFAULT_WITHDRAW: 0.0008,    // 8‱
} as const;

// 滑点相关
export const SLIPPAGE = {
  MIN: 0.001,    // 0.1%
  DEFAULT: 0.005, // 0.5%
  MAX: 0.05,     // 5%
} as const;

// 分页相关
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

// 时间格式
export const DATE_FORMATS = {
  FULL: 'YYYY-MM-DD HH:mm:ss',
  DATE: 'YYYY-MM-DD',
  TIME: 'HH:mm:ss',
  SHORT: 'MM-DD HH:mm',
} as const;

// 数字格式
export const NUMBER_FORMATS = {
  CURRENCY_DECIMALS: 2,
  TOKEN_DECIMALS: 6,
  PERCENTAGE_DECIMALS: 2,
  PRICE_DECIMALS: 2,
} as const;

// 本地存储键名
export const STORAGE_KEYS = {
  THEME: 'app_theme',
  LANGUAGE: 'app_language',
  WALLET_ADDRESS: 'wallet_address',
  RECENT_TOKENS: 'recent_tokens',
  SLIPPAGE_TOLERANCE: 'slippage_tolerance',
} as const;

// API端点（示例）
export const API_ENDPOINTS = {
  TOKENS: '/api/tokens',
  INVESTMENTS: '/api/investments',
  TRANSACTIONS: '/api/transactions',
  REFERRALS: '/api/referrals',
  COMMISSIONS: '/api/commissions',
} as const;

// 主题配置
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

// 语言配置
export const LANGUAGES = {
  ZH_CN: 'zh-CN',
  EN_US: 'en-US',
} as const;

// 钱包地址长度
export const WALLET = {
  ADDRESS_LENGTH: 42,
  ADDRESS_PREFIX: '0x',
  DISPLAY_PREFIX_LENGTH: 6,
  DISPLAY_SUFFIX_LENGTH: 4,
} as const;

// 投资配置
export const INVESTMENT = {
  MIN_AMOUNT: 0.01,
  MAX_AMOUNT: 1000000,
  DEFAULT_MULTIPLIER: 1,
  DEFAULT_WITHDRAW_SLICES: 20,
} as const;

// 交易配置
export const TRADING = {
  MIN_SWAP_AMOUNT: 0.01,
  MAX_SWAP_AMOUNT: 1000000,
  DEFAULT_SLIPPAGE: 0.005,
} as const;
