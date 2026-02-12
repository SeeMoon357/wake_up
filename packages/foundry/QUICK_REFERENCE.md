# 🎯 WakeUp 快速参考

## 一键命令

### 开发环境
```bash
# 测试
forge test                    # 运行所有测试
forge test -vvv               # 详细输出
forge test --gas-report       # Gas 报告

# 构建
forge build                   # 编译合约
forge build --sizes           # 查看合约大小

# 格式化
forge fmt                     # 格式化代码
```

### 部署
```bash
# Sepolia 测试网
forge script script/Deploy.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast --verify

# 本地测试网 (Anvil)
anvil                         # 启动本地节点
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast
```

### 合约交互
```bash
# 读取函数
cast call <CONTRACT> "activeUsers()" --rpc-url $SEPOLIA_RPC_URL
cast call <CONTRACT> "getUser(address)" <USER_ADDRESS> --rpc-url $SEPOLIA_RPC_URL

# 写入函数
cast send <CONTRACT> "join(uint256)" <TIMESTAMP> --value 0.01ether --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY
```

## 合约接口速查

### 核心函数

| 函数 | 参数 | 说明 | Gas |
|------|------|------|-----|
| `join(uint256)` | 首次打卡时间戳 | 加入挑战 | ~115k |
| `checkIn(uint256)` | 下次打卡时间戳 | 签到打卡 | ~54k |
| `restart(uint256)` | 新的打卡时间戳 | 重启挑战 | ~33k |
| `withdraw()` | 无 | 提现押金 | ~44k |

### 查询函数

| 函数 | 返回值 | 说明 |
|------|--------|------|
| `getUser(address)` | User 结构体 | 获取用户数据 |
| `getUserStatus(address)` | (status, timeInfo) | 获取用户状态 |
| `getStats()` | (activeUsers, totalLocked, emergencyMode) | 获取统计数据 |
| `activeUsers()` | uint256 | 当前活跃用户数 |

### 用户状态码

| 状态码 | 名称 | 说明 |
|--------|------|------|
| 0 | Idle | 未加入 |
| 1 | Waiting | 等待打卡窗口 |
| 2 | WindowOpen | 可以打卡 |
| 3 | Missed | 错过窗口 |
| 4 | Success | 完成挑战 |

## 时间戳计算

### JavaScript/TypeScript
```javascript
// 明天 7:00 AM
const tomorrow7am = Math.floor(
  new Date().setHours(24 + 7, 0, 0, 0) / 1000
);

// 当前时间 + 1 天
const oneDayLater = Math.floor(Date.now() / 1000) + 86400;
```

### Bash
```bash
# 明天 7:00 AM
date -d "tomorrow 07:00:00" +%s

# 当前时间 + 1 天
echo $(($(date +%s) + 86400))
```

### Python
```python
from datetime import datetime, timedelta

# 明天 7:00 AM
tomorrow_7am = int((datetime.now() + timedelta(days=1)).replace(
    hour=7, minute=0, second=0, microsecond=0
).timestamp())
```

## 常见错误及解决方案

| 错误 | 原因 | 解决方案 |
|------|------|---------|
| `InvalidDeposit` | 押金不在 0.001-1 ETH 范围 | 检查发送的 ETH 数量 |
| `AlreadyActive` | 已在挑战中 | 先完成或重启当前挑战 |
| `TooEarly` | 打卡时间太早 | 等到窗口开启 (目标时间 -15 分钟) |
| `TooLate` | 打卡时间太晚 | 调用 `restart()` 重新开始 |
| `IntervalTooShort` | 下次目标时间太近 | 至少设置 12 小时后 |
| `NotQualified` | 未完成 3 次打卡 | 继续打卡或等待紧急模式 |

## 测试场景

### 场景 1: 完整 3 天挑战
```solidity
// Day 0: Join
join(day1_timestamp) with 0.01 ETH

// Day 1: Check-in
warp to day1_timestamp
checkIn(day2_timestamp)

// Day 2: Check-in
warp to day2_timestamp
checkIn(day3_timestamp)

// Day 3: Check-in
warp to day3_timestamp
checkIn(day4_timestamp)

// Withdraw
withdraw() → Get 0.01 ETH back
```

### 场景 2: 失败重启
```solidity
// Join
join(day1_timestamp) with 0.01 ETH

// Miss day 1
warp to day1_timestamp + 20 minutes (past window)

// Restart
restart(new_timestamp) → streak reset to 0, deposit still locked
```

## 安全检查清单

- [ ] 私钥已安全保存 (不要提交到 Git)
- [ ] `.env` 文件在 `.gitignore` 中
- [ ] 测试网部署前先在本地测试
- [ ] 主网部署前完成安全审计
- [ ] Owner 地址使用多签钱包 (Gnosis Safe)
- [ ] 紧急模式功能已测试

## 有用的链接

### 开发工具
- Foundry Book: https://book.getfoundry.sh
- Solidity Docs: https://docs.soliditylang.org
- Etherscan Sepolia: https://sepolia.etherscan.io

### 测试资源
- Sepolia Faucet: https://sepoliafaucet.com
- Alchemy Dashboard: https://dashboard.alchemy.com
- Tenderly Debugger: https://tenderly.co

### 安全审计
- Slither: `pip install slither-analyzer && slither .`
- Mythril: `pip install mythril && myth analyze src/WakeUp.sol`
- Sherlock: https://www.sherlock.xyz

## Gas 价格参考 (2026-02-11)

| 网络 | Gas Price | 完整挑战成本 |
|------|-----------|-------------|
| Sepolia | 免费 | $0 |
| Ethereum Mainnet | ~20 gwei | ~$20 |
| Base L2 | ~0.001 gwei | ~$0.15 |
| Optimism L2 | ~0.001 gwei | ~$0.15 |

## 紧急联系

- **合约 Owner**: [待填写]
- **技术支持**: [待填写]
- **安全问题**: [待填写]

---

**提示**: 将此文件加入书签，开发时随时查阅！
