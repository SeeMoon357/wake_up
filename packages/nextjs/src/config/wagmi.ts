import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, mainnet } from 'wagmi/chains';

// 从环境变量获取配置
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

if (!projectId) {
  console.warn('⚠️ NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID 未设置');
}

// Wagmi 配置
export const config = getDefaultConfig({
  appName: 'WakeUp DAO',
  projectId,
  chains: [sepolia, mainnet],
  ssr: true, // 支持服务端渲染
});

// 合约地址
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

// 网络配置
export const SUPPORTED_CHAINS = {
  sepolia: {
    id: 11155111,
    name: 'Sepolia',
    network: 'sepolia',
    nativeCurrency: {
      decimals: 18,
      name: 'Sepolia ETH',
      symbol: 'ETH',
    },
    rpcUrls: {
      default: {
        http: ['https://rpc.sepolia.org'],
      },
      public: {
        http: ['https://rpc.sepolia.org'],
      },
    },
    blockExplorers: {
      default: { name: 'Etherscan', url: 'https://sepolia.etherscan.io' },
    },
    testnet: true,
  },
};
