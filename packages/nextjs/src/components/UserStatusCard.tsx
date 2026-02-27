'use client';

import { useWakeUp } from '@/hooks/useWakeUp';
import { formatETH, getUserStatusText, getUserStatusColor, getUserStatusBgColor } from '@/utils/formatters';
import { formatTimestamp, timeUntil } from '@/utils/timeUtils';

/**
 * 用户状态卡片
 * 显示用户当前的挑战状态、押金、连胜等信息
 */
export function UserStatusCard() {
  const { userData, userStatus } = useWakeUp();

  if (!userData) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const status = userStatus?.status;
  const isStatusLoading = userData.isActive && status === undefined;
  const statusText = isStatusLoading ? '同步中' : getUserStatusText(status ?? 0);
  const statusColor = isStatusLoading ? 'text-amber-700' : getUserStatusColor(status ?? 0);
  const statusBgColor = isStatusLoading ? 'bg-amber-100' : getUserStatusBgColor(status ?? 0);

  return (
    <div className="card space-y-6">
      {/* 标题 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">我的挑战</h2>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusBgColor} ${statusColor}`}>
          {statusText}
        </span>
      </div>

      {!userData.isActive ? (
        // 未加入挑战
        <div className="text-center py-8">
          <span className="text-6xl mb-4 block">😴</span>
          <p className="text-gray-600">你还没有加入挑战</p>
          <p className="text-sm text-gray-500 mt-2">点击右侧卡片开始你的早起之旅！</p>
        </div>
      ) : (
        // 已加入挑战
        <div className="space-y-4">
          {/* 押金信息 */}
          <div className="bg-gradient-to-r from-primary-50 to-orange-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">💰 押金</span>
              <span className="text-2xl font-bold text-primary-600">
                {formatETH(userData.deposit)} ETH
              </span>
            </div>
          </div>

          {/* 连胜信息 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="text-sm text-gray-600 mb-1">🔥 当前连胜</div>
              <div className="text-3xl font-bold text-blue-600">
                {userData.streak.toString()}
              </div>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <div className="text-sm text-gray-600 mb-1">🎯 目标</div>
              <div className="text-3xl font-bold text-green-600">3</div>
            </div>
          </div>

          {/* 下次打卡时间 */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">⏰ 下次打卡时间</span>
              {status === 2 && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full animate-pulse-slow">
                  可以打卡了！
                </span>
              )}
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {formatTimestamp(Number(userData.nextCheckIn))}
            </div>
            {status === 1 && (
              <div className="text-sm text-gray-500 mt-1">
                还有 {timeUntil(Number(userData.nextCheckIn))}
              </div>
            )}
            {status === 3 && (
              <div className="text-sm text-red-500 mt-1">
                已错过，需要重启挑战
              </div>
            )}
          </div>

          {/* 进度条 */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">📊 完成进度</span>
              <span className="text-sm font-semibold text-gray-900">
                {userData.streak.toString()}/3
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-primary-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(Number(userData.streak) / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* 成功提示 */}
          {status === 4 && (
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">🎉</span>
                <div>
                  <div className="font-bold text-yellow-900">恭喜完成挑战！</div>
                  <div className="text-sm text-yellow-700">
                    你可以提现 {formatETH(userData.deposit)} ETH 了
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
