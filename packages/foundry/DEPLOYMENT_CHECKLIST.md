# 🚀 WakeUp DAO 部署检查清单

## Stage 1: 本地测试 ✅

- [x] 合约编译成功 (`forge build`)
- [x] 所有测试通过 (`forge test`)
- [x] Gas 报告生成 (`forge test --gas-report`)
- [x] 代码审查完成

## Stage 2: Sepolia 部署准备

### 2.1 环境配置

- [ ] 复制 `.env.example` 到 `.env`
- [ ] 填入 `PRIVATE_KEY` (从 MetaMask 导出)
- [ ] 填入 `SEPOLIA_RPC_URL` (从 Alchemy/Infura 获取)
- [ ] 填入 `ETHERSCAN_API_KEY` (用于合约验证)

### 2.2 钱包准备

- [ ] 确认钱包地址有 Sepolia ETH (至少 0.1 ETH)
- [ ] 获取测试币: https://sepoliafaucet.com
- [ ] 备份私钥到安全位置

### 2.3 部署执行

```bash
# 1. 测试部署 (不广播)
forge script script/Deploy.s.sol --rpc-url $SEPOLIA_RPC_URL

# 2. 正式部署
forge script script/Deploy.s.sol \
  --rpc-url $SEPOLIA_RPC_URL \
  --broadcast \
  --verify

# 3. 记录合约地址
# 输出示例: Contract Address: 0x1234...5678
```

- [ ] 部署成功
- [ ] 合约地址已记录: `_______________________`
- [ ] Etherscan 验证成功

### 2.4 部署后验证

```bash
# 检查合约 owner
cast call <CONTRACT_ADDRESS> "owner()" --rpc-url $SEPOLIA_RPC_URL

# 检查配置
cast call <CONTRACT_ADDRESS> "MIN_DEPOSIT()" --rpc-url $SEPOLIA_RPC_URL
cast call <CONTRACT_ADDRESS> "MAX_DEPOSIT()" --rpc-url $SEPOLIA_RPC_URL
cast call <CONTRACT_ADDRESS> "CHECKIN_WINDOW()" --rpc-url $SEPOLIA_RPC_URL

# 检查初始状态
cast call <CONTRACT_ADDRESS> "activeUsers()" --rpc-url $SEPOLIA_RPC_URL
```

- [ ] Owner 地址正确
- [ ] 配置参数正确
- [ ] 初始状态为 0

### 2.5 手动测试 (使用 MetaMask)

#### 测试 1: 加入挑战
```bash
# 计算明天 7:00 的时间戳
date -d "tomorrow 07:00:00" +%s

# 使用 cast 调用 (或通过 Etherscan)
cast send <CONTRACT_ADDRESS> \
  "join(uint256)" <TIMESTAMP> \
  --value 0.01ether \
  --rpc-url $SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY
```

- [ ] 交易成功
- [ ] activeUsers = 1
- [ ] 押金已锁定

#### 测试 2: 查询状态
```bash
cast call <CONTRACT_ADDRESS> \
  "getUserStatus(address)" <YOUR_ADDRESS> \
  --rpc-url $SEPOLIA_RPC_URL
```

- [ ] 返回状态 1 (Waiting)
- [ ] 时间信息正确

#### 测试 3: 打卡 (需要时间旅行或等待)
```bash
# 等到打卡窗口开启后
cast send <CONTRACT_ADDRESS> \
  "checkIn(uint256)" <NEXT_TIMESTAMP> \
  --rpc-url $SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY
```

- [ ] 打卡成功
- [ ] streak = 1

#### 测试 4: 提现 (完成 3 次打卡后)
```bash
cast send <CONTRACT_ADDRESS> \
  "withdraw()" \
  --rpc-url $SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY
```

- [ ] 提现成功
- [ ] 押金已退回
- [ ] activeUsers = 0

## Stage 3: 前端集成准备

### 3.1 合约信息导出

- [ ] 复制合约地址到 `.env.local`
- [ ] 导出 ABI: `forge inspect WakeUp abi > ../nextjs/contracts/WakeUp.json`
- [ ] 更新 `scaffold.config.ts` 中的合约地址

### 3.2 前端环境准备

- [ ] 安装 Node.js 18+
- [ ] 获取 WalletConnect Project ID
- [ ] 配置 Vercel 账号 (可选)

## Stage 4: 生产部署 (未来)

### 4.1 主网部署前检查

- [ ] 完成专业安全审计 (Sherlock/Code4rena)
- [ ] 购买合约保险 (Nexus Mutual)
- [ ] 准备至少 0.5 ETH 用于部署 Gas
- [ ] 设置多签钱包作为 owner (Gnosis Safe)

### 4.2 L2 部署 (推荐 Base)

```bash
# 部署到 Base
forge script script/Deploy.s.sol \
  --rpc-url $BASE_RPC_URL \
  --broadcast \
  --verify
```

- [ ] Base 部署成功
- [ ] 合约验证成功
- [ ] 前端切换到 Base 网络

## 紧急情况处理

### 发现严重漏洞
1. 立即调用 `setEmergencyMode(true)`
2. 通知所有用户提现
3. 暂停前端服务
4. 修复漏洞后重新部署

### 私钥泄露
1. 立即转移 owner 权限到新地址
2. 开启紧急模式
3. 更换所有密钥

## 联系方式

- **技术支持**: [待填写]
- **安全问题**: [待填写]

---

**最后更新**: 2026-02-11
**当前阶段**: Stage 1 完成，准备部署到 Sepolia
