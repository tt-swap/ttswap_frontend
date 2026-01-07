import { toast } from "sonner";

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 * @param successMessage 成功提示信息
 */
export async function copyToClipboard(
  text: string,
  successMessage: string = "已复制到剪贴板"
): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(successMessage);
  } catch (error) {
    console.error("复制失败:", error);
    toast.error("复制失败");
  }
}

/**
 * 格式化地址（显示前6位和后4位）
 * @param address 完整地址
 * @returns 格式化后的地址
 */
export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

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
 * 格式化百分比
 * @param value 数值
 * @param decimals 小数位数
 * @returns 格式化后的百分比字符串
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}
