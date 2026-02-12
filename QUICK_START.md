# 🚀 WakeUp 快速启动指南

## 📋 前置准备

- ✅ 合约已部署到 Sepolia: `0x2F1e7B4BBEf1797f8E81fead4ef7913Ba2D23A9d`
- ✅ 前端代码已完成
- ⏳ 需要配置 WalletConnect Project ID

---

## 🎯 5 分钟启动应用

### 步骤 1: 获取 WalletConnect Project ID（2 分钟）

1. 访问 https://cloud.walletconnect.com
2. 点击右上角 "Sign Up" 或 "Log In"
3. 创建新项目（Project Name: "WakeUp"）
4. 复制 **Project ID**（类似：`a1b2c3d4e5f6...`）

### 步骤 2: 配置环境变量（1 分钟）

```bash
cd packages/nextjs

# 编辑 .env.local 文件
# 找到这一行：
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=

# 粘贴你的 Project ID：
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=a1b2c3d4e5f6...
```

### 步骤 3: 安装依赖（1 分钟）

```bash
npm install
```

### 步骤 4: 启动应用（1 分钟）

```bash
npm run dev
```

看到这个输出就成功了：
```
✓ Ready in 2.5s
○ Local:   http://localhost:3000
```

### 步骤 5: 打开浏览器

访问 http://localhost:3000

---

## 🎮 第一次使用

### 1. 连接钱包

1. 点击右上角 "Connect Wallet"
2. 选择 MetaMask
3. 确认连接

### 2. 切换到 Sepolia 网络

如果 MetaMask 提示切换网络，点击"切换"。

### 3. 加入挑战

1. 在右侧卡片输入押金（如 0.01 ETH）
2. 选择明天的起床时间（如 07:00）
3. 点击"加入挑战"
4. 在 MetaMask 中确认交易

### 4. 等待打卡窗口

- 页面会显示倒计时
- 窗口开启前 15 分钟，按钮会激活

### 5. 打卡签到

1. 输入下次起床时间
2. 点击"立即打卡"
3. 确认交易

### 6. 完成挑战

连续打卡 3 次后，点击"提现押金"即可取回 ETH！

---

## 🐛 常见问题

### Q: 安装依赖失败？
```bash
# 清除缓存重试
rm -rf node_modules package-lock.json
npm install
```

### Q: 启动失败？
检查：
1. Node.js 版本 >= 18
2. 端口 3000 是否被占用
3. `.env.local` 是否配置正确

### Q: 钱包连接失败？
确保：
1. WalletConnect Project ID 已填写
2. MetaMask 已安装
3. 网络连接正常

### Q: 交易失败？
检查：
1. 是否连接到 Sepolia 网络
2. 钱包是否有足够的 ETH
3. 押金金额是否在 0.001-1 ETH 范围内

---

## 📱 移动端测试

### 使用 MetaMask Mobile

1. 在手机上打开 MetaMask App
2. 点击左上角菜单 → 浏览器
3. 输入你的本地 IP（如 `http://192.168.1.100:3000`）
4. 使用应用

**获取本地 IP**:
```bash
# macOS/Linux
ifconfig | grep "inet "

# Windows
ipconfig
```

---

## 🚀 部署到线上

### 使用 Vercel（推荐，免费）

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录
vercel login

# 3. 部署
cd packages/nextjs
vercel

# 4. 添加环境变量
vercel env add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
# 输入你的 Project ID

# 5. 重新部署
vercel --prod
```

### 手动部署到 Vercel

1. 推送代码到 GitHub
2. 访问 https://vercel.com
3. 导入仓库
4. 设置根目录为 `packages/nextjs`
5. 添加环境变量
6. 点击 Deploy

---

## 📊 项目文件清单

```
wake_up/
├── packages/
│   ├── foundry/              # 智能合约 ✅
│   │   ├── src/WakeUp.sol
│   │   ├── test/WakeUp.t.sol
│   │   └── script/Deploy.s.sol
│   │
│   └── nextjs/               # 前端应用 ✅
│       ├── src/
│       │   ├── app/          # 页面
│       │   ├── components/   # 组件
│       │   ├── hooks/        # Hooks
│       │   ├── utils/        # 工具
│       │   ├── config/       # 配置
│       │   └── contracts/    # ABI
│       ├── package.json
│       └── .env.local        # 环境变量
│
├── README.md                 # 项目总览
├── STAGE1_SUMMARY.md         # Stage 1 总结
├── STAGE2_COMPLETE.md        # Stage 2 总结
└── QUICK_START.md            # 本文件
```

---

## 🎉 成功标志

当你看到以下内容时，说明一切正常：

✅ 浏览器打开 http://localhost:3000  
✅ 看到 "WakeUp" 标题和欢迎页面  
✅ 点击 "Connect Wallet" 能弹出钱包选择  
✅ 连接钱包后能看到统计信息  
✅ 能看到"加入挑战"表单  

---

## 📞 获取帮助

遇到问题？检查：

1. **浏览器控制台**（F12）- 查看错误信息
2. **终端输出** - 查看 Next.js 日志
3. **网络请求** - 查看 RPC 调用是否成功

---

## 🎊 恭喜！

你的 WakeUp 应用已经启动成功！

现在你可以：
- 🎮 测试所有功能
- 🎨 自定义 UI 样式
- 🚀 部署到线上
- 📢 分享给朋友

**开始你的早起挑战吧！** 🌅

---

**Built with ❤️ by WakeUp Team**  
*让每个早晨都充满可能*
