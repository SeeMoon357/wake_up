#!/bin/bash
# ============================================
# 推送代码到 GitHub 脚本
# ============================================

echo "🚀 开始推送代码到 GitHub..."
echo ""

cd /home/moons/projects/wake_up

# 检查远程仓库
echo "📡 检查远程仓库..."
git remote -v

# 推送到 master 分支
echo ""
echo "📤 推送代码到 GitHub (master 分支)..."
git push -u origin master

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 推送成功！"
    echo ""
    echo "🎉 你的代码已上传到："
    echo "   https://github.com/SeeMoon357/wake_up"
    echo ""
    echo "📋 下一步："
    echo "   1. 访问 GitHub 仓库查看代码"
    echo "   2. 在仓库设置中将默认分支设为 master（如果需要）"
    echo "   3. 准备好后，告诉我开始修改合约（18小时逻辑）"
    echo ""
else
    echo ""
    echo "❌ 推送失败！"
    echo ""
    echo "可能的原因："
    echo "   1. 网络问题"
    echo "   2. 需要 GitHub 认证"
    echo "   3. 仓库权限问题"
    echo ""
    echo "解决方法："
    echo "   1. 确保已登录 GitHub"
    echo "   2. 检查网络连接"
    echo "   3. 如果需要，使用 Personal Access Token"
    echo ""
fi
