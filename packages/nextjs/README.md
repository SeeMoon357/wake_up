# 🌅 WakeUp DAO 前端

基于 Next.js 14 + RainbowKit + Wagmi 构建的去中心化早起挑战应用前端。

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 2. 配置环境变量

```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 文件，填入以下配置：

```env
# WalletConnect Project ID
# 获取地址: https://cloud.walletconnect.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# 合约地址（已自动填入 Sepolia 部署地址）
NEXT_PUBLIC_CONTRACT_ADDRESS=0x2F1e7B4BBEf1797f8E81fead4ef7913Ba2D23A9d

# 可选：Alchemy API Key（用于更稳定的 RPC）
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key_here
```

### 3. 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📁 项目结构

```
src/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx          # 全局布局
│   ├── page.tsx            # 主页面
│   ├── providers.tsx       # Wagmi & RainbowKit 提供者
│   └── globals.css         # 全局样式
├── components/             # React 组件
│   ├── UserStatusCard.tsx  # 用户状态卡片
│   ├── StatsView.tsx       # 统计信息视图
│   ├── JoinCard.tsx        # 加入挑战卡片
│   ├── CheckInCard.tsx     # 打卡/重启卡片
│   └── WithdrawCard.tsx    # 提现卡片
├── hooks/                  # 自定义 Hooks
│   └── useWakeUp.ts        # 合约交互 Hook
├── utils/                  # 工具函数
│   ├── timeUtils.ts        # 时间处理工具
│   └── formatters.ts       # 格式化工具
├── config/                 # 配置文件
│   └── wagmi.ts            # Wagmi 配置
└── contracts/              # 合约 ABI
    └── WakeUp.json         # WakeUp 合约 ABI
```

## 🎨 主要功能

### 1. 钱包连接
- 使用 RainbowKit 提供优雅的钱包连接体验
- 支持 MetaMask、WalletConnect、Coinbase Wallet 等

### 2. 加入挑战
- 设定押金金额（0.001-1 ETH）
- 选择明天的起床时间
- 实时验证输入

### 3. 打卡签到
- 实时倒计时显示
- 窗口状态提示（等待中/可打卡/已错过）
- 设定下次起床时间

### 4. 重启挑战
- 错过打卡后重新开始
- 押金不扣除，连胜重置

### 5. 提现
- 完成 3 次打卡后提现
- 显示成就徽章

### 6. 统计信息
- 显示活跃用户数
- 显示总锁仓量

## 🔧 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **钱包连接**: RainbowKit
- **链交互**: Wagmi + Viem
- **状态管理**: Zustand (可选)
- **时间处理**: date-fns

## 📝 开发指南

### 添加新组件

```tsx
// src/components/NewComponent.tsx
'use client';

import { useWakeUp } from '@/hooks/useWakeUp';

export function NewComponent() {
  const { userData } = useWakeUp();
  
  return (
    <div className="card">
      {/* 组件内容 */}
    </div>
  );
}
```

### 调用合约函数

```tsx
import { useWakeUp } from '@/hooks/useWakeUp';

function MyComponent() {
  const { join, checkIn, withdraw, isPending } = useWakeUp();
  
  // 加入挑战
  const handleJoin = () => {
    const targetTime = BigInt(Math.floor(Date.now() / 1000) + 86400);
    const deposit = parseEther('0.01');
    join(targetTime, deposit);
  };
  
  // ...
}
```

### 时间处理

```tsx
import { 
  timeStringToTimestamp, 
  formatTimestamp, 
  timeUntil 
} from '@/utils/timeUtils';

// 将 "07:00" 转换为明天 7:00 的时间戳
const timestamp = timeStringToTimestamp('07:00', 1);

// 格式化时间戳
const formatted = formatTimestamp(timestamp); // "2026-02-12 07:00"

// 计算距离时间
const until = timeUntil(timestamp); // "8 小时 30 分钟后"
```

## 🚢 部署到 Vercel

### 1. 推送到 GitHub

```bash
git add .
git commit -m "feat: 完成前端开发"
git push origin main
```

### 2. 在 Vercel 导入项目

1. 访问 [vercel.com](https://vercel.com)
2. 点击 "New Project"
3. 导入你的 GitHub 仓库
4. 设置根目录为 `packages/nextjs`
5. 添加环境变量（复制 `.env.local` 的内容）
6. 点击 "Deploy"

### 3. 配置环境变量

在 Vercel 项目设置中添加：

```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=xxx
NEXT_PUBLIC_CONTRACT_ADDRESS=0x2F1e7B4BBEf1797f8E81fead4ef7913Ba2D23A9d
NEXT_PUBLIC_ALCHEMY_API_KEY=xxx (可选)
```

## 🐛 常见问题

### Q: 钱包连接失败？
A: 确保 `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` 已正确配置。

### Q: 合约调用失败？
A: 检查：
1. 钱包是否连接到 Sepolia 网络
2. 钱包是否有足够的 ETH
3. 合约地址是否正确

### Q: 时间显示不正确？
A: 检查系统时区设置，时间工具会自动处理 UTC 转换。

### Q: 交易一直 Pending？
A: 可能是 Gas 价格太低，可以在 MetaMask 中加速交易。

## 📚 相关文档

- [Next.js 文档](https://nextjs.org/docs)
- [RainbowKit 文档](https://www.rainbowkit.com/docs/introduction)
- [Wagmi 文档](https://wagmi.sh)
- [Viem 文档](https://viem.sh)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

**Built with ❤️ by WakeUp DAO Team**
