/**
 * 格式化工具函数
 */

/**
 * 格式化数字（添加千分位分隔符）
 * @param value 数字
 * @param decimals 小数位数
 * @returns 格式化后的数字字符串
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * 格式化货币
 * @param value 数值
 * @param currency 货币符号
 * @param decimals 小数位数
 * @returns 格式化后的货币字符串
 */
export function formatCurrency(
  value: number,
  currency: string = 'USDT',
  decimals: number = 2
): string {
  return `${formatNumber(value, decimals)} ${currency}`;
}

/**
 * 格式化百分比
 * @param value 数值（0.05 表示 5%）
 * @param decimals 小数位数
 * @param showSign 是否显示正负号
 * @returns 格式化后的百分比字符串
 */
export function formatPercentage(
  value: number,
  decimals: number = 2,
  showSign: boolean = false
): string {
  const percentage = (value * 100).toFixed(decimals);
  if (showSign && value > 0) {
    return `+${percentage}%`;
  }
  return `${percentage}%`;
}

/**
 * 格式化万分号（‱）
 * @param value 数值（0.0008 表示 8‱）
 * @param decimals 小数位数
 * @returns 格式化后的万分号字符串
 */
export function formatBasisPoint(value: number, decimals: number = 2): string {
  const basisPoint = (value * 10000).toFixed(decimals);
  return `${basisPoint}‱`;
}

/**
 * 格式化地址（显示前6位和后4位）
 * @param address 完整地址
 * @param prefixLength 前缀长度
 * @param suffixLength 后缀长度
 * @returns 格式化后的地址
 */
export function formatAddress(
  address: string,
  prefixLength: number = 6,
  suffixLength: number = 4
): string {
  if (!address || address.length <= prefixLength + suffixLength) {
    return address;
  }
  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
}

/**
 * 格式化时间戳
 * @param timestamp 时间戳或日期字符串
 * @returns 格式化后的时间字符串
 */
export function formatDateTime(timestamp: number | string | Date): string {
  const date = new Date(timestamp);
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * 格式化相对时间（如 "3 hours ago"）
 * @param timestamp 时间戳或日期字符串
 * @returns 相对时间字符串
 */
export function formatRelativeTime(timestamp: number | string | Date): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
  
  return formatDateTime(date);
}

/**
 * 格式化大数字（如 1.2K, 1.5M, 2.3B）
 * @param value 数值
 * @param decimals 小数位数
 * @returns 格式化后的字符串
 */
export function formatCompactNumber(value: number, decimals: number = 1): string {
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  
  if (absValue >= 1e9) {
    return `${sign}${(absValue / 1e9).toFixed(decimals)}B`;
  }
  if (absValue >= 1e6) {
    return `${sign}${(absValue / 1e6).toFixed(decimals)}M`;
  }
  if (absValue >= 1e3) {
    return `${sign}${(absValue / 1e3).toFixed(decimals)}K`;
  }
  return `${sign}${absValue.toFixed(decimals)}`;
}

/**
 * 解析数量字符串（如 "119,806.97 / 119,806.97"）
 * @param quantityStr 数量字符串
 * @param index 取第几个值（0或1）
 * @returns 数值
 */
export function parseQuantity(quantityStr: string, index: number = 0): number {
  const parts = quantityStr.split(' / ');
  const value = parts[index] || parts[0];
  return parseFloat(value.replace(/,/g, ''));
}

/**
 * 解析净值字符串（如 "1.001052 / 1.000267"）
 * @param netValueStr 净值字符串
 * @param index 取第几个值（0或1）
 * @returns 数值
 */
export function parseNetValue(netValueStr: string, index: number = 0): number {
  const parts = netValueStr.split(' / ');
  const value = parts[index] || parts[0];
  return parseFloat(value);
}
