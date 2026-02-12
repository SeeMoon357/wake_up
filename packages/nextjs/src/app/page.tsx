'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWakeUp } from '@/hooks/useWakeUp';
import { UserStatusCard } from '@/components/UserStatusCard';
import { JoinCard } from '@/components/JoinCard';
import { CheckInCard } from '@/components/CheckInCard';
import { StatsView } from '@/components/StatsView';
import { WithdrawCard } from '@/components/WithdrawCard';
import { useState, useEffect } from 'react';

export default function Home() {
  const { isConnected, userData, userStatus } = useWakeUp();
  const [isLoading, setIsLoading] = useState(true);

  // 添加最小加载时间，避免页面闪烁
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // 至少显示 800ms

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* 头部导航 */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🌅</span>
              <div>
                <h1 className="text-xl font-bold text-gray-900">醒了吗</h1>
                <p className="text-xs text-gray-500">用区块链战胜起床困难症</p>
              </div>
            </div>

            {/* 连接钱包按钮 + 网络标识 */}
            <div className="flex items-center space-x-3">
              {/* Sepolia 网络标识 */}
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-gray-100 rounded-lg border border-gray-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Sepolia Testnet</span>
              </div>
              
              <ConnectButton />
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容区 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          // 加载状态
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
            <p className="text-gray-600">加载中...</p>
          </div>
        ) : !isConnected ? (
          // 未连接钱包时的欢迎页面
          <div className="text-center py-20 animate-fadeIn">
            <span className="text-8xl mb-6 block">🌅</span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              欢迎来到「醒了吗」
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              通过质押 ETH 和智能合约的强制力，帮助你养成早起习惯。
              <br />
              连续打卡 3 天，取回全额押金！
            </p>
            <div className="flex justify-center">
              <ConnectButton />
            </div>

            {/* 功能介绍 */}
            <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
              <div className="card text-center">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="font-bold text-lg mb-2">真正的承诺</h3>
                <p className="text-gray-600 text-sm">
                  质押真金白银，不是说说而已
                </p>
              </div>
              <div className="card text-center">
                <div className="text-4xl mb-4">⏰</div>
                <h3 className="font-bold text-lg mb-2">精确验证</h3>
                <p className="text-gray-600 text-sm">
                  智能合约自动验证，无法作弊
                </p>
              </div>
              <div className="card text-center">
                <div className="text-4xl mb-4">🌐</div>
                <h3 className="font-bold text-lg mb-2">完全去中心化</h3>
                <p className="text-gray-600 text-sm">
                  无需信任第三方，规则由代码保证
                </p>
              </div>
            </div>
          </div>
        ) : (
          // 已连接钱包时的主界面
          <div className="space-y-6 animate-fadeIn">
            {/* 统计信息 */}
            <StatsView />

            {/* 用户状态和操作区域 */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* 左侧：用户状态 */}
              <div>
                <UserStatusCard />
              </div>

              {/* 右侧：操作卡片 */}
              <div className="space-y-6">
                {!userData?.isActive ? (
                  // 未加入挑战：显示加入卡片
                  <JoinCard />
                ) : userStatus?.status === 4 ? (
                  // 已完成挑战：显示提现卡片
                  <WithdrawCard />
                ) : userStatus?.status === 3 ? (
                  // 错过窗口：显示重启卡片
                  <CheckInCard isRestart />
                ) : (
                  // 等待中或可打卡：显示打卡卡片
                  <CheckInCard />
                )}
              </div>
            </div>

            {/* 使用说明 */}
            <div className="card">
              <h3 className="font-bold text-lg mb-4">📖 使用说明</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <span className="font-bold text-primary-500">1.</span>
                  <p>质押 0.001-1 ETH，设定明天的起床时间</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-bold text-primary-500">2.</span>
                  <p>在目标时间前后 15 分钟内打卡（共 30 分钟窗口）</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-bold text-primary-500">3.</span>
                  <p>连续打卡 3 次，即可提现全额押金</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-bold text-primary-500">4.</span>
                  <p>错过窗口？没关系，可以重启挑战（押金不扣除）</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 页脚 */}
      <footer className="border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p className="mb-2">Built with ❤️ by 醒了吗团队</p>
            <p>让每个早晨都充满可能</p>
            <div className="mt-4 space-x-4">
              <a
                href="https://sepolia.etherscan.io/address/0x2F1e7B4BBEf1797f8E81fead4ef7913Ba2D23A9d"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 hover:text-primary-600"
              >
                查看合约
              </a>
              <span>•</span>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 hover:text-primary-600"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
