'use client';

import { useState, useEffect } from 'react';
import { useWakeUp } from '@/hooks/useWakeUp';
import { timeStringToTimestamp, formatCountdown, getCurrentTimestamp } from '@/utils/timeUtils';
import { TimePicker } from './TimePicker';

/**
 * 打卡/重启卡片
 * 根据用户状态显示打卡或重启界面
 */
export function CheckInCard({ isRestart = false }: { isRestart?: boolean }) {
  const { checkIn, restart, isPending, isConfirming, userData, userStatus } = useWakeUp();
  
  const [nextWakeTime, setNextWakeTime] = useState('07:00');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  // 倒计时逻辑
  useEffect(() => {
    if (!userData || !userStatus) return;

    const updateCountdown = () => {
      const now = getCurrentTimestamp();
      const target = Number(userData.nextCheckIn);
      
      if (userStatus.status === 1) {
        // 等待中：显示距离窗口开启的时间
        const windowStart = target - 15 * 60; // 目标时间前 15 分钟
        setCountdown(Math.max(0, windowStart - now));
      } else if (userStatus.status === 2) {
        // 窗口开启：显示距离窗口关闭的时间
        const windowEnd = target + 15 * 60; // 目标时间后 15 分钟
        setCountdown(Math.max(0, windowEnd - now));
      } else {
        setCountdown(0);
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [userData, userStatus]);

  // 处理打卡
  const handleCheckIn = () => {
    setError('');

    // 验证时间格式
    if (!nextWakeTime.match(/^\d{2}:\d{2}$/)) {
      setError('请输入有效的时间格式（HH:mm）');
      return;
    }

    // 转换为时间戳（明天的指定时间）
    const targetTimestamp = BigInt(timeStringToTimestamp(nextWakeTime, 1));

    // 调用合约
    checkIn(targetTimestamp);
  };

  // 处理重启
  const handleRestart = () => {
    setError('');

    // 验证时间格式
    if (!nextWakeTime.match(/^\d{2}:\d{2}$/)) {
      setError('请输入有效的时间格式（HH:mm）');
      return;
    }

    // 转换为时间戳（明天的指定时间）
    const targetTimestamp = BigInt(timeStringToTimestamp(nextWakeTime, 1));

    // 调用合约
    restart(targetTimestamp);
  };

  if (isRestart) {
    // 重启模式
    return (
      <div className="card border-2 border-red-200">
        <div className="flex items-center space-x-3 mb-6">
          <span className="text-3xl">🔄</span>
          <div>
            <h3 className="text-xl font-bold text-gray-900">重启挑战</h3>
            <p className="text-sm text-red-500">你错过了打卡窗口</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* 说明 */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
            <div className="font-semibold mb-2">😢 错过了打卡时间</div>
            <p className="text-xs mb-2">
              没关系！你可以重启挑战，押金不会被扣除，但连胜会重置为 0。
              设定一个新的起床时间，重新开始吧！
            </p>
            <p className="text-xs text-red-700">
              ⏰ 提示：建议选择一个固定的起床时间，避免频繁调整
            </p>
          </div>

          {/* 新的起床时间 */}
          <TimePicker
            label="⏰ 新的起床时间（明天）"
            value={nextWakeTime}
            onChange={setNextWakeTime}
            disabled={isPending || isConfirming}
          />

          {/* 错误提示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* 提交按钮 */}
          <button
            onClick={handleRestart}
            disabled={isPending || isConfirming}
            className="btn-primary w-full bg-red-500 hover:bg-red-600"
          >
            {isPending || isConfirming ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {isPending ? '等待签名...' : '交易确认中...'}
              </span>
            ) : (
              '🔄 重启挑战'
            )}
          </button>
        </div>
      </div>
    );
  }

  // 打卡模式
  const canCheckIn = userStatus?.status === 2;

  return (
    <div className={`card ${canCheckIn ? 'border-2 border-green-300 shadow-green-100' : ''}`}>
      <div className="flex items-center space-x-3 mb-6">
        <span className="text-3xl">{canCheckIn ? '✅' : '⏰'}</span>
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {canCheckIn ? '立即打卡' : '等待打卡'}
          </h3>
          <p className="text-sm text-gray-500">
            {canCheckIn ? '窗口已开启，快来打卡！' : '打卡窗口还未开启'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* 倒计时 */}
        {countdown > 0 && (
          <div className={`rounded-xl p-6 text-center ${canCheckIn ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'}`}>
            <div className={`text-sm mb-2 ${canCheckIn ? 'text-green-600' : 'text-blue-600'}`}>
              {canCheckIn ? '⏱️ 窗口关闭倒计时' : '⏱️ 窗口开启倒计时'}
            </div>
            <div className={`text-4xl font-mono font-bold ${canCheckIn ? 'text-green-700' : 'text-blue-700'}`}>
              {formatCountdown(countdown)}
            </div>
          </div>
        )}

        {/* 下次起床时间设置 */}
        <TimePicker
          label="⏰ 下次起床时间（明天）"
          value={nextWakeTime}
          onChange={setNextWakeTime}
          disabled={isPending || isConfirming || !canCheckIn}
          description="打卡的同时需要设定下一次的起床时间"
        />

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* 打卡按钮 */}
        <button
          onClick={handleCheckIn}
          disabled={isPending || isConfirming || !canCheckIn}
          className={`btn-primary w-full ${canCheckIn ? 'animate-pulse-slow' : ''}`}
        >
          {isPending || isConfirming ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {isPending ? '等待签名...' : '交易确认中...'}
            </span>
          ) : canCheckIn ? (
            '✅ 立即打卡'
          ) : (
            '⏰ 等待窗口开启'
          )}
        </button>

        {/* 提示 */}
        {!canCheckIn && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <div className="font-semibold mb-2">💡 温馨提示</div>
            <p className="text-xs mb-2">
              打卡窗口将在目标时间前 15 分钟开启。请耐心等待，或者设置闹钟提醒自己！
            </p>
            <p className="text-xs text-blue-700">
              ⏰ 注意：下次打卡时间需距离本次打卡 ≥ 18 小时
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
