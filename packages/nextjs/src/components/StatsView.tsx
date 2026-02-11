'use client';

import { useWakeUp } from '@/hooks/useWakeUp';
import { formatETH, formatNumber } from '@/utils/formatters';

/**
 * 统计信息视图
 * 显示全局统计数据：活跃用户数、总锁仓量
 */
export function StatsView() {
  const { stats } = useWakeUp();

  if (!stats) {
    return null;
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* 活跃用户数 */}
      <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-blue-600 mb-1">🔥 正在挑战的用户</div>
            <div className="text-3xl font-bold text-blue-900">
              {formatNumber(Number(stats.activeUsers))} 人
            </div>
          </div>
          <div className="text-5xl opacity-20">👥</div>
        </div>
        <div className="mt-3 text-xs text-blue-700">
          和他们一起养成早起习惯！
        </div>
      </div>

      {/* 总锁仓量 */}
      <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-green-600 mb-1">💎 总锁仓量</div>
            <div className="text-3xl font-bold text-green-900">
              {formatETH(stats.totalLocked, 3)} ETH
            </div>
          </div>
          <div className="text-5xl opacity-20">💰</div>
        </div>
        <div className="mt-3 text-xs text-green-700">
          所有用户的承诺总和
        </div>
      </div>
    </div>
  );
}
