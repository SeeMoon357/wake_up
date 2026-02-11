# 📦 GitHub 发布指南

## 🎯 将项目推送到 GitHub

### 步骤 1: 在 GitHub 创建仓库

1. 访问 https://github.com/new
2. 填写仓库信息：
   - **Repository name**: `wake_up` 或 `wakeup-dao`
   - **Description**: `🌅 用区块链战胜起床困难症 - 去中心化早起挑战 DApp`
   - **Visibility**: Public（开源）
   - ❌ **不要**勾选 "Add a README file"（我们已经有了）
   - ❌ **不要**勾选 ".gitignore" 和 "license"（我们已经有了）
3. 点击 "Create repository"

### 步骤 2: 推送代码到 GitHub

GitHub 会显示推送指令，使用第二段（推送现有仓库）：

```bash
cd /home/moons/projects/wake_up

# 添加远程仓库（替换为你的 GitHub 用户名）
git remote add origin https://github.com/你的用户名/wake_up.git

# 重命名分支为 main（GitHub 默认）
git branch -M main

# 推送代码
git push -u origin main
```

### 步骤 3: 验证推送成功

刷新 GitHub 页面，应该看到：
- ✅ 所有文件已上传
- ✅ README.md 自动显示
- ✅ LICENSE 文件被识别

---

## 🚀 部署到 Vercel

### 方式 1: 使用 Vercel GitHub 集成（推荐）

1. 访问 https://vercel.com
2. 点击 "New Project"
3. 选择 "Import Git Repository"
4. 授权 Vercel 访问你的 GitHub
5. 选择 `wake_up` 仓库
6. 配置项目：

```
Framework Preset: Next.js
Root Directory: packages/nextjs
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

7. 添加环境变量：
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: 你的 WalletConnect ID
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`: `0x2F1e7B4BBEf1797f8E81fead4ef7913Ba2D23A9d`

8. 点击 "Deploy"

### 方式 2: 使用 Vercel CLI

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 进入前端目录
cd packages/nextjs

# 部署
vercel

# 添加环境变量（在 Vercel Dashboard 或使用 CLI）
vercel env add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
vercel env add NEXT_PUBLIC_CONTRACT_ADDRESS

# 重新部署到生产环境
vercel --prod
```

---

## 📝 发布清单

### 推送前检查

- [x] 代码已提交到 Git
- [x] .gitignore 已配置（敏感文件不会被提交）
- [x] .env 文件已被忽略
- [x] README.md 已更新
- [x] LICENSE 文件已添加

### GitHub 仓库设置

创建仓库后，建议设置：

1. **About** 部分：
   - Website: 填入 Vercel 部署地址
   - Topics: `web3`, `blockchain`, `dapp`, `ethereum`, `nextjs`, `solidity`, `habittracker`
   - Description: `🌅 用区块链战胜起床困难症 - 去中心化早起挑战 DApp`

2. **Settings → General**:
   - Features: 启用 Issues、Discussions
   - Pull Requests: 启用 "Squash merging"

3. **创建 GitHub Pages**（可选）:
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: main, folder: / (root)

---

## 🎨 美化你的 README

GitHub README 已包含：
- ✅ Badges（技术栈标签）
- ✅ 项目简介
- ✅ 功能特色
- ✅ 快速开始
- ✅ 项目结构
- ✅ 技术栈
- ✅ 部署指南
- ✅ 路线图
- ✅ 许可证

你可以添加：
- 📸 项目截图
- 🎥 Demo 视频
- 📊 架构图
- 🏆 成就徽章

---

## 🔐 安全注意事项

### ⚠️ 确保以下文件被 .gitignore 忽略

```
packages/foundry/.env          ✅ 已忽略（包含私钥）
packages/nextjs/.env.local     ✅ 已忽略（包含 API Keys）
node_modules/                  ✅ 已忽略
```

### 检查方法

```bash
cd /home/moons/projects/wake_up

# 检查哪些文件会被提交
git status

# 检查 .env 是否被忽略
git check-ignore packages/foundry/.env
# 应该输出: packages/foundry/.env

git check-ignore packages/nextjs/.env.local
# 应该输出: packages/nextjs/.env.local
```

如果这些文件出现在 `git status` 中，立即执行：
```bash
git rm --cached packages/foundry/.env
git rm --cached packages/nextjs/.env.local
git commit -m "chore: 移除敏感文件"
```

---

## 📢 发布后的推广

### 1. 社交媒体
- Twitter: 发布项目介绍 + GitHub 链接
- Reddit: r/ethereum, r/ethdev
- Discord: Web3 开发者社区

### 2. 提交到目录
- [DappRadar](https://dappradar.com)
- [State of the Dapps](https://www.stateofthedapps.com)
- [Awesome Web3](https://github.com/topics/awesome-web3)

### 3. 写博客
- Mirror.xyz
- Medium
- Dev.to

---

## 🎉 完成！

现在你的项目已经：
- ✅ 托管在 GitHub 上
- ✅ 自动部署到 Vercel
- ✅ 可以被全世界访问
- ✅ 开源供他人学习

---

**下一步**: 邀请朋友试用，收集反馈，持续改进！

**GitHub 地址**: https://github.com/你的用户名/wake_up  
**线上地址**: https://你的项目.vercel.app

---

**Built with ❤️ for WakeUp DAO**
