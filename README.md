# 🌅 WakeUp DAO

> 用区块链的力量，帮你战胜起床困难症

[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue)](https://soliditylang.org/)
[![Foundry](https://img.shields.io/badge/Built%20with-Foundry-orange)](https://getfoundry.sh/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Tests](https://img.shields.io/badge/Tests-29%20Passing-brightgreen)](./packages/foundry/test)
[![License](https://img.shields.io/badge/License-MIT-yellow)](./LICENSE)

## 📖 项目简介

WakeUp DAO 是一个基于以太坊智能合约的去中心化早起挑战应用。通过**质押 ETH** 作为承诺机制，利用区块链的**不可篡改性**和**强制执行力**，帮助"起床困难户"养成早起习惯。

### 🎯 核心功能

- 🔒 **真正的承诺**: 质押 0.001-1 ETH，不是说说而已
- ⏰ **精确验证**: 智能合约自动验证打卡时间（±15 分钟窗口）
- 🌐 **完全去中心化**: 无需信任第三方，规则由代码保证
- 👥 **社交激励**: 看到有多少人和你一起挑战
- 💰 **零抽成**: 连续打卡 3 天后全额退还押金

## 🚀 快速开始

### 前置要求

- [Node.js](https://nodejs.org/) 18+
- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- MetaMask 钱包
- Sepolia 测试网 ETH ([获取测试币](https://sepoliafaucet.com))

### 克隆项目

```bash
git clone https://github.com/你的用户名/wake_up.git
cd wake_up
```

### 智能合约（后端）

```bash
cd packages/foundry

# 安装依赖
forge install

# 运行测试
forge test

# 部署到 Sepolia（需先配置 .env）
cp .env.example .env
# 编辑 .env 填入你的私钥和 RPC URL
forge script script/Deploy.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast --verify
```

### 前端应用

```bash
cd packages/nextjs

# 安装依赖
npm install

# 配置环境变量
cp .env.local.example .env.local
# 编辑 .env.local 填入配置

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

## 📁 项目结构

```
wake_up/
├── packages/
│   ├── foundry/              # 智能合约（Solidity）
│   │   ├── src/              # 合约源码
│   │   ├── test/             # 测试文件
│   │   ├── script/           # 部署脚本
│   │   └── README.md         # 合约文档
│   │
│   └── nextjs/               # 前端应用（Next.js）
│       ├── src/              # 源码
│       │   ├── app/          # 页面
│       │   ├── components/   # 组件
│       │   ├── hooks/        # Hooks
│       │   ├── utils/        # 工具
│       │   └── contracts/    # 合约 ABI
│       └── README.md         # 前端文档
│
├── README.md                 # 项目总览（本文件）
├── QUICK_START.md            # 快速启动指南
├── STAGE1_SUMMARY.md         # 合约开发总结
├── STAGE2_COMPLETE.md        # 前端开发总结
└── LICENSE                   # MIT 许可证
```

## 🎮 使用流程

1. **连接钱包** - 使用 MetaMask 连接到 Sepolia 测试网
2. **加入挑战** - 质押 ETH，设定明天的起床时间
3. **打卡签到** - 在目标时间前后 15 分钟内打卡
4. **连续 3 天** - 保持连胜，完成挑战
5. **提现押金** - 取回全额押金，获得成就徽章

## 📊 技术栈

### 智能合约
- **Solidity** 0.8.20 - 合约语言
- **Foundry** - 开发框架
- **OpenZeppelin** - 安全库（未来使用）

### 前端
- **Next.js** 14 - React 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **RainbowKit** - 钱包连接
- **Wagmi + Viem** - 链交互

### 基础设施
- **Sepolia** - 以太坊测试网
- **Vercel** - 前端部署
- **Alchemy** - RPC 节点

## 🔒 安全特性

- ✅ 重入攻击防护（Checks-Effects-Interactions 模式）
- ✅ 整数溢出防护（Solidity 0.8.20+）
- ✅ 访问控制（onlyOwner 修饰符）
- ✅ 时间戳操纵防护（15 分钟窗口）
- ✅ 押金限制（0.001-1 ETH）

## 🧪 测试

### 合约测试

```bash
cd packages/foundry

# 运行所有测试
forge test

# 详细输出
forge test -vvv

# Gas 报告
forge test --gas-report
```

**测试结果**: 29/29 通过 ✅

### 前端测试

```bash
cd packages/nextjs

# 类型检查
npm run type-check

# 代码检查
npm run lint
```

## 🚢 部署

### 智能合约部署

**已部署到 Sepolia 测试网**:
- 合约地址: `0x2F1e7B4BBEf1797f8E81fead4ef7913Ba2D23A9d`
- Etherscan: [查看合约](https://sepolia.etherscan.io/address/0x2F1e7B4BBEf1797f8E81fead4ef7913Ba2D23A9d)

### 前端部署（Vercel）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/你的用户名/wake_up)

手动部署步骤：
1. Fork 本仓库
2. 在 [Vercel](https://vercel.com) 导入项目
3. 设置根目录为 `packages/nextjs`
4. 添加环境变量（见下方）
5. 点击 Deploy

**环境变量配置**:
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_CONTRACT_ADDRESS=0x2F1e7B4BBEf1797f8E81fead4ef7913Ba2D23A9d
```

## 📚 文档

- 📖 [快速启动指南](./QUICK_START.md)
- 📋 [合约文档](./packages/foundry/README.md)
- 🎨 [前端文档](./packages/nextjs/README.md)
- 📊 [Stage 1 总结](./STAGE1_SUMMARY.md)
- 📊 [Stage 2 总结](./STAGE2_COMPLETE.md)

## 🛣️ 路线图

### ✅ Phase 1: MVP（已完成）
- [x] 智能合约开发
- [x] 完整测试套件
- [x] 前端应用开发
- [x] Sepolia 部署

### 🚧 Phase 1.5: 产品化（进行中）
- [ ] 邮件/Telegram 提醒
- [ ] 奖励池机制
- [ ] 数据分析面板
- [ ] 部署到 Base L2

### 🔮 Phase 2: 生态扩展
- [ ] 多种挑战模式（7/30/90 天）
- [ ] 成就 NFT 系统
- [ ] DAO 治理
- [ ] 移动端 App

## 🤝 贡献

欢迎贡献！请查看 [贡献指南](./CONTRIBUTING.md)（待创建）。

### 开发流程

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](./LICENSE) 文件

## 🙏 致谢

- [Foundry](https://getfoundry.sh/) - 优秀的 Solidity 开发工具
- [RainbowKit](https://www.rainbowkit.com/) - 最佳的钱包连接体验
- [Wagmi](https://wagmi.sh) - 强大的 React Hooks
- [Base](https://base.org/) - 低成本的 L2 解决方案

## 📞 联系方式

- **项目主页**: https://github.com/你的用户名/wake_up
- **问题反馈**: [GitHub Issues](https://github.com/你的用户名/wake_up/issues)
- **讨论**: [GitHub Discussions](https://github.com/你的用户名/wake_up/discussions)

## 🌟 Star History

如果这个项目对你有帮助，请给我们一个 Star ⭐️

---

**Built with ❤️ by WakeUp DAO Team**

*让每个早晨都充满可能*
