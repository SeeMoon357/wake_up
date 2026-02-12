#!/bin/bash
# ============================================
# WakeUp 项目上传到 GitHub 脚本
# ============================================

cd /home/moons/projects/wake_up

echo "🔍 当前 Git 状态："
git log --oneline -3
echo ""

echo "📝 修改 commit 信息（WakeUp → WakeUp）..."
# 使用 filter-branch 批量替换
git filter-branch -f --msg-filter 'sed "s/WakeUp/WakeUp/g"' HEAD~2..HEAD

echo ""
echo "✅ Commit 信息已修改！"
echo ""
git log --oneline -3
echo ""

echo "📤 准备推送到 GitHub..."
echo ""
echo "⚠️  需要你的 GitHub Personal Access Token"
echo "   获取地址: https://github.com/settings/tokens"
echo ""
read -p "请输入你的 GitHub Token: " GITHUB_TOKEN
echo ""

# 使用 token 推送
git push https://${GITHUB_TOKEN}@github.com/SeeMoon357/wake_up.git master

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 推送成功！"
    echo ""
    echo "🔗 仓库地址: https://github.com/SeeMoon357/wake_up"
    echo ""
    echo "📋 下一步："
    echo "   1. 访问 GitHub 查看代码"
    echo "   2. 准备好后，告诉我：修改打卡阈值18H，任务开始！"
    echo ""
else
    echo ""
    echo "❌ 推送失败！请检查："
    echo "   1. Token 是否正确"
    echo "   2. Token 是否有 repo 权限"
    echo "   3. 网络连接是否正常"
    echo ""
fi
