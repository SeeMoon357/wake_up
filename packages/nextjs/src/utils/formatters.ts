import { formatEther, parseEther } from 'viem';

/**
 * 格式化 ETH 金额
 * @param value - Wei 值（bigint）
 * @param decimals - 小数位数，默认 4
 * @returns 格式化的 ETH 字符串
 */
export function formatETH(value: bigint, decimals: number = 4): string {
  const eth = formatEther(value);
  const num = parseFloat(eth);
  return num.toFixed(decimals);
}

/**
 * 格式化地址（缩短显示）
 * @param address - 完整地址
 * @param startLength - 开头保留长度，默认 6
 * @param endLength - 结尾保留长度，默认 4
 * @returns 缩短的地址，如 "0x1234...5678"
 */
export function formatAddress(address: string, startLength: number = 6, endLength: number = 4): string {
  if (!address) return '';
  if (address.length <= startLength + endLength) return address;
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

/**
 * 将 ETH 字符串转换为 Wei（bigint）
 * @param eth - ETH 数量字符串
 * @returns Wei 值（bigint）
 */
export function parseETHInput(eth: string): bigint {
  try {
    return parseEther(eth);
  } catch {
    return 0n;
  }
}

/**
 * 格式化数字（添加千位分隔符）
 * @param num - 数字
 * @returns 格式化的字符串
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('zh-CN').format(num);
}

/**
 * 获取用户状态的中文描述
 * @param status - 状态码（0-4）
 * @returns 状态描述
 */
export function getUserStatusText(status: number): string {
  const statusMap: Record<number, string> = {
    0: '未加入',
    1: '等待中',
    2: '可打卡',
    3: '已错过',
    4: '已完成',
  };
  return statusMap[status] || '未知';
}

/**
 * 获取用户状态的颜色类名
 * @param status - 状态码（0-4）
 * @returns Tailwind 颜色类名
 */
export function getUserStatusColor(status: number): string {
  const colorMap: Record<number, string> = {
    0: 'text-gray-500',
    1: 'text-blue-500',
    2: 'text-green-500',
    3: 'text-red-500',
    4: 'text-purple-500',
  };
  return colorMap[status] || 'text-gray-500';
}

/**
 * 获取用户状态的背景颜色类名
 * @param status - 状态码（0-4）
 * @returns Tailwind 背景颜色类名
 */
export function getUserStatusBgColor(status: number): string {
  const colorMap: Record<number, string> = {
    0: 'bg-gray-100',
    1: 'bg-blue-100',
    2: 'bg-green-100',
    3: 'bg-red-100',
    4: 'bg-purple-100',
  };
  return colorMap[status] || 'bg-gray-100';
}
