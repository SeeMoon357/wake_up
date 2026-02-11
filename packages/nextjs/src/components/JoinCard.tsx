'use client';

import { useState } from 'react';
import { useWakeUp } from '@/hooks/useWakeUp';
import { parseETHInput } from '@/utils/formatters';
import { timeStringToTimestamp } from '@/utils/timeUtils';
import { formatEther } from 'viem';

/**
 * 加入挑战卡片
 * 让用户设定押金金额和首次打卡时间
 */
export function JoinCard() {
  const { join, isPending, isConfirming, minDeposit, maxDeposit } = useWakeUp();
  
  const [depositAmount, setDepositAmount] = useState('0.01');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [error, setError] = useState('');

  // 处理加入挑战
  const handleJoin = () => {
    setError('');

    // 验证押金金额
    const depositWei = parseETHInput(depositAmount);
    if (depositWei === 0n) {
      setError('请输入有效的押金金额');
      return;
    }

    if (minDeposit && depositWei < minDeposit) {
      setError(`押金不能少于 ${formatEther(minDeposit)} ETH`);
      return;
    }

    if (maxDeposit && depositWei > maxDeposit) {
      setError(`押金不能超过 ${formatEther(maxDeposit)} ETH`);
      return;
    }

    // 验证时间
    if (!wakeTime.match(/^\d{2}:\d{2}$/)) {
      setError('请输入有效的时间格式（HH:mm）');
      return;
    }

    // 转换为时间戳（明天的指定时间）
    const targetTimestamp = BigInt(timeStringToTimestamp(wakeTime, 1));

    // 调用合约
    join(targetTimestamp, depositWei);
  };

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <span className="text-3xl">🚀</span>
        <div>
          <h3 className="text-xl font-bold text-gray-900">加入挑战</h3>
          <p className="text-sm text-gray-500">开始你的早起之旅</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* 押金金额输入 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            💰 押金金额（ETH）
          </label>
          <input
            type="number"
            step="0.001"
            min={minDeposit ? formatEther(minDeposit) : '0.001'}
            max={maxDeposit ? formatEther(maxDeposit) : '1'}
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className="input"
            placeholder="0.01"
            disabled={isPending || isConfirming}
          />
          <div className="mt-1 text-xs text-gray-500">
            最小 {minDeposit ? formatEther(minDeposit) : '0.001'} ETH，
            最大 {maxDeposit ? formatEther(maxDeposit) : '1'} ETH
          </div>
        </div>

        {/* 起床时间输入 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ⏰ 明天的起床时间
          </label>
          <input
            type="time"
            value={wakeTime}
            onChange={(e) => setWakeTime(e.target.value)}
            className="input"
            disabled={isPending || isConfirming}
          />
          <div className="mt-1 text-xs text-gray-500">
            你需要在这个时间前后 15 分钟内打卡
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* 提交按钮 */}
        <button
          onClick={handleJoin}
          disabled={isPending || isConfirming}
          className="btn-primary w-full"
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
            '🚀 加入挑战'
          )}
        </button>

        {/* 说明 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <div className="font-semibold mb-2">💡 温馨提示</div>
          <ul className="space-y-1 text-xs">
            <li>• 押金将被锁定在智能合约中</li>
            <li>• 连续打卡 3 天后可全额提现</li>
            <li>• 错过打卡可以重启挑战（押金不扣除）</li>
            <li>• 打卡窗口为目标时间前后 15 分钟</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
