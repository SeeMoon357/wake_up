import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESS } from '@/config/wagmi';
import WakeUpABI from '@/contracts/WakeUp.json';
import { useEffect, useState } from 'react';

// 用户数据类型
export interface UserData {
  deposit: bigint;
  nextCheckIn: bigint;
  streak: bigint;
  isActive: boolean;
}

// 用户状态类型
export interface UserStatus {
  status: number; // 0=Idle, 1=Waiting, 2=WindowOpen, 3=Missed, 4=Success
  timeInfo: bigint;
}

// 合约统计数据类型
export interface ContractStats {
  activeUsers: bigint;
  totalLocked: bigint;
  emergencyMode: boolean;
}

/**
 * WakeUp 合约交互 Hook
 * 提供读取和写入合约的所有功能
 */
export function useWakeUp() {
  const { address, isConnected } = useAccount();
  const [localUserData, setLocalUserData] = useState<UserData | null>(null);

  // ==================== 读取函数 ====================

  // 读取用户数据
  const { data: userData, refetch: refetchUser } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: WakeUpABI.abi,
    functionName: 'getUser',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  }) as { data: UserData | undefined; refetch: () => void };

  // 读取用户状态
  const { data: userStatus, refetch: refetchStatus } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: WakeUpABI.abi,
    functionName: 'getUserStatus',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  }) as { data: [number, bigint] | undefined; refetch: () => void };

  // 读取合约统计
  const { data: stats, refetch: refetchStats } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: WakeUpABI.abi,
    functionName: 'getStats',
  }) as { data: [bigint, bigint, boolean] | undefined; refetch: () => void };

  // 读取常量
  const { data: minDeposit } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: WakeUpABI.abi,
    functionName: 'MIN_DEPOSIT',
  });

  const { data: maxDeposit } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: WakeUpABI.abi,
    functionName: 'MAX_DEPOSIT',
  });

  const { data: successThreshold } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: WakeUpABI.abi,
    functionName: 'SUCCESS_THRESHOLD',
  });

  // ==================== 写入函数 ====================

  const { writeContract, data: hash, isPending, error } = useWriteContract();

  // 等待交易确认
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // ==================== 本地缓存 ====================

  // 缓存用户数据到 localStorage
  useEffect(() => {
    if (userData && address) {
      const cacheKey = `wakeup_user_${address}`;
      localStorage.setItem(cacheKey, JSON.stringify({
        deposit: userData.deposit.toString(),
        nextCheckIn: userData.nextCheckIn.toString(),
        streak: userData.streak.toString(),
        isActive: userData.isActive,
      }));
      setLocalUserData(userData);
    }
  }, [userData, address]);

  // 从 localStorage 加载缓存
  useEffect(() => {
    if (address && !userData) {
      const cacheKey = `wakeup_user_${address}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setLocalUserData({
            deposit: BigInt(parsed.deposit),
            nextCheckIn: BigInt(parsed.nextCheckIn),
            streak: BigInt(parsed.streak),
            isActive: parsed.isActive,
          });
        } catch (e) {
          console.error('解析缓存数据失败:', e);
        }
      }
    }
  }, [address, userData]);

  // ==================== 合约交互函数 ====================

  /**
   * 加入挑战
   * @param firstTarget - 首次打卡时间戳（秒）
   * @param depositAmount - 押金金额（Wei）
   */
  const join = (firstTarget: bigint, depositAmount: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: WakeUpABI.abi,
      functionName: 'join',
      args: [firstTarget],
      value: depositAmount,
    });
  };

  /**
   * 打卡签到
   * @param nextTarget - 下次打卡时间戳（秒）
   */
  const checkIn = (nextTarget: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: WakeUpABI.abi,
      functionName: 'checkIn',
      args: [nextTarget],
    });
  };

  /**
   * 重启挑战
   * @param newTarget - 新的首次打卡时间戳（秒）
   */
  const restart = (newTarget: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: WakeUpABI.abi,
      functionName: 'restart',
      args: [newTarget],
    });
  };

  /**
   * 提现
   */
  const withdraw = () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: WakeUpABI.abi,
      functionName: 'withdraw',
    });
  };

  /**
   * 刷新所有数据
   */
  const refetchAll = () => {
    refetchUser();
    refetchStatus();
    refetchStats();
  };

  // 交易确认后自动刷新
  useEffect(() => {
    if (isConfirmed) {
      // 延迟 2 秒刷新，等待区块确认
      setTimeout(() => {
        refetchAll();
      }, 2000);
    }
  }, [isConfirmed]);

  // ==================== 返回值 ====================

  return {
    // 连接状态
    address,
    isConnected,

    // 用户数据（优先使用链上数据，否则使用缓存）
    userData: userData || localUserData,
    userStatus: userStatus ? {
      status: userStatus[0],
      timeInfo: userStatus[1],
    } : null,

    // 合约统计
    stats: stats ? {
      activeUsers: stats[0],
      totalLocked: stats[1],
      emergencyMode: stats[2],
    } : null,

    // 常量
    minDeposit: minDeposit as bigint | undefined,
    maxDeposit: maxDeposit as bigint | undefined,
    successThreshold: successThreshold as bigint | undefined,

    // 写入函数
    join,
    checkIn,
    restart,
    withdraw,

    // 交易状态
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash,

    // 刷新函数
    refetchAll,
  };
}
