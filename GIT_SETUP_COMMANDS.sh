#!/bin/bash
# ============================================
# WakeUp DAO - Git 初始化脚本
# ============================================
# 
# 使用方法:
# chmod +x GIT_SETUP_COMMANDS.sh
# ./GIT_SETUP_COMMANDS.sh
#
# ============================================

echo "🚀 开始配置 Git 仓库..."

cd /home/moons/projects/wake_up

# 1. 移除 foundry 的 git 子模块
echo "📦 处理 Foundry 子模块..."
cd packages/foundry
rm -rf .git .gitmodules
cd ../..

# 2. 初始化 Git 仓库（如果还没有）
if [ ! -d ".git" ]; then
    echo "🔧 初始化 Git 仓库..."
    git init
    git branch -M main
fi

# 3. 添加所有文件
echo "📝 添加文件到 Git..."
git add -A

# 4. 创建初始提交
echo "💾 创建初始提交..."
git commit -m "feat: 初始化 WakeUp DAO 项目

✅ 智能合约开发完成
  - WakeUp.sol (326 行)
  - 29/29 测试通过
  - 已部署到 Sepolia

✅ 前端应用开发完成
  - Next.js 14 + TypeScript
  - RainbowKit 钱包连接
  - 5 个核心组件
  - 完整的用户体验

✅ 文档系统完善
  - README.md
  - 快速启动指南
  - API 文档
  - 部署指南

合约地址: 0x2F1e7B4BBEf1797f8E81fead4ef7913Ba2D23A9d
"

echo ""
echo "✅ Git 仓库配置完成！"
echo ""
echo "📌 下一步："
echo "1. 在 GitHub 创建新仓库（不要初始化 README/License）"
echo "2. 运行以下命令推送代码："
echo ""
echo "   git remote add origin https://github.com/你的用户名/wake_up.git"
echo "   git push -u origin main"
echo ""
echo "🎉 完成后，你的项目就在 GitHub 上了！"
