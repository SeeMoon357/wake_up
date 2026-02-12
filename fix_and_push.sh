#!/bin/bash
# 修改 commit 信息并推送到 GitHub

cd /home/moons/projects/wake_up

echo "🔧 修改 commit 信息..."
git rebase -i HEAD~2

# 注意：这会打开编辑器，需要手动操作
# 如果想自动化，使用下面的命令：

echo ""
echo "📝 自动修改最早的 commit..."
git filter-branch -f --msg-filter 'sed "s/WakeUp/WakeUp/g"' HEAD~2..HEAD

echo ""
echo "📤 推送到 GitHub..."
git push -u origin master

echo ""
echo "✅ 完成！"
