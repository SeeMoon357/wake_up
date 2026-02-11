import { format, formatDistanceToNow, addDays, addHours } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/**
 * 将本地时间转换为 UTC 时间戳（秒）
 * @param date - Date 对象或时间字符串
 * @returns Unix 时间戳（秒）
 */
export function localToUTC(date: Date | string): number {
  const d = typeof date === 'string' ? new Date(date) : date;
  return Math.floor(d.getTime() / 1000);
}

/**
 * 将 UTC 时间戳（秒）转换为本地 Date 对象
 * @param timestamp - Unix 时间戳（秒）
 * @returns Date 对象
 */
export function utcToLocal(timestamp: number): Date {
  return new Date(timestamp * 1000);
}

/**
 * 格式化时间戳为可读字符串
 * @param timestamp - Unix 时间戳（秒）
 * @param formatStr - 格式字符串，默认 'yyyy-MM-dd HH:mm'
 * @returns 格式化的时间字符串
 */
export function formatTimestamp(timestamp: number, formatStr: string = 'yyyy-MM-dd HH:mm'): string {
  return format(utcToLocal(timestamp), formatStr, { locale: zhCN });
}

/**
 * 计算距离现在的相对时间
 * @param timestamp - Unix 时间戳（秒）
 * @returns 相对时间字符串，如 "3 小时后"
 */
export function timeUntil(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = timestamp - now;
  
  if (diff <= 0) return '已过期';
  
  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days} 天后`;
  }
  
  if (hours > 0) {
    return `${hours} 小时 ${minutes} 分钟后`;
  }
  
  return `${minutes} 分钟后`;
}

/**
 * 计算从某个时间到现在经过了多久
 * @param timestamp - Unix 时间戳（秒）
 * @returns 相对时间字符串，如 "3 小时前"
 */
export function timeAgo(timestamp: number): string {
  return formatDistanceToNow(utcToLocal(timestamp), { 
    addSuffix: true,
    locale: zhCN 
  });
}

/**
 * 获取明天指定时间的时间戳
 * @param hours - 小时（0-23）
 * @param minutes - 分钟（0-59）
 * @returns Unix 时间戳（秒）
 */
export function getTomorrowTimestamp(hours: number, minutes: number = 0): number {
  const tomorrow = addDays(new Date(), 1);
  tomorrow.setHours(hours, minutes, 0, 0);
  return localToUTC(tomorrow);
}

/**
 * 获取指定天数后的时间戳
 * @param days - 天数
 * @param hours - 小时（0-23）
 * @param minutes - 分钟（0-59）
 * @returns Unix 时间戳（秒）
 */
export function getFutureTimestamp(days: number, hours: number, minutes: number = 0): number {
  const future = addDays(new Date(), days);
  future.setHours(hours, minutes, 0, 0);
  return localToUTC(future);
}

/**
 * 检查时间戳是否在未来
 * @param timestamp - Unix 时间戳（秒）
 * @returns 是否在未来
 */
export function isFuture(timestamp: number): boolean {
  return timestamp > Math.floor(Date.now() / 1000);
}

/**
 * 获取当前时间戳（秒）
 * @returns Unix 时间戳（秒）
 */
export function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * 格式化倒计时
 * @param seconds - 剩余秒数
 * @returns 格式化的倒计时字符串，如 "02:30:45"
 */
export function formatCountdown(seconds: number): string {
  if (seconds <= 0) return '00:00:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * 将时间字符串转换为时间戳
 * @param timeStr - 时间字符串，格式 "HH:mm"
 * @param daysFromNow - 从现在开始的天数，默认 1（明天）
 * @returns Unix 时间戳（秒）
 */
export function timeStringToTimestamp(timeStr: string, daysFromNow: number = 1): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return getFutureTimestamp(daysFromNow, hours, minutes);
}
