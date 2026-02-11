'use client';

import { useWakeUp } from '@/hooks/useWakeUp';
import { formatETH } from '@/utils/formatters';

/**
 * 提现卡片
 * 用户完成挑战后提现押金
 */
export function WithdrawCard() {
  const { withdraw, isPending, isConfirming, userData } = useWakeUp();

  const handleWithdraw = () => {
    withdraw();
  };

  return (
    <div className="card border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="text-center space-y-6">
        {/* 庆祝图标 */}
        <div className="text-8xl animate-bounce">🎉</div>

        {/* 标题 */}
        <div>
          <h3 className="text-2xl font-bold text-purple-900 mb-2">
            恭喜完成挑战！
          </h3>
          <p className="text-purple-700">
            你已经连续打卡 3 天，可以提现押金了
          </p>
        </div>

        {/* 押金金额 */}
        <div className="bg-white rounded-xl p-6 border-2 border-purple-200">
          <div className="text-sm text-gray-600 mb-2">💰 可提现金额</div>
          <div className="text-4xl font-bold text-purple-600">
            {userData ? formatETH(userData.deposit) : '0'} ETH
          </div>
        </div>

        {/* 提现按钮 */}
        <button
          onClick={handleWithdraw}
          disabled={isPending || isConfirming}
          className="btn-primary w-full bg-purple-500 hover:bg-purple-600"
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
            '💎 提现押金'
          )}
        </button>

        {/* 成就徽章 */}
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 border border-yellow-300">
          <div className="flex items-center justify-center space-x-3">
            <span className="text-3xl">🏆</span>
            <div className="text-left">
              <div className="font-bold text-yellow-900">早起勇士</div>
              <div className="text-sm text-yellow-700">连续打卡 3 天成就</div>
            </div>
          </div>
        </div>

        {/* 继续挑战提示 */}
        <div className="text-sm text-gray-600">
          提现后，你可以再次加入挑战，继续养成早起习惯！
        </div>
      </div>
    </div>
  );
}
