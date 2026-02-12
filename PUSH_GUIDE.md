# 📤 推送到 GitHub 指南

## 🎯 当前状态

✅ 代码已全部提交到本地 Git  
✅ "WakeUp DAO" 已全部改为 "WakeUp"  
⏳ 等待推送到 GitHub  

---

## 🔑 步骤 1: 获取 GitHub Token（2 分钟）

### 为什么需要 Token？
GitHub 已废弃密码认证，必须使用 Personal Access Token。

### 获取步骤：

1. 访问：https://github.com/settings/tokens/new

2. 填写信息：
   ```
   Note: wake_up_project
   Expiration: 90 days
   Select scopes: 勾选 ✅ repo（完整仓库权限）
   ```

3. 点击底部绿色按钮 "Generate token"

4. **立即复制 token**（格式类似：`ghp_xxxxxxxxxxxx`）
   ⚠️ 只显示一次，离开页面就看不到了！

---

## 🚀 步骤 2: 推送代码（1 分钟）

### 方式 1: 一次性推送（推荐）

```bash
cd /home/moons/projects/wake_up

# 替换 YOUR_TOKEN 为你刚才复制的 token
git push https://YOUR_TOKEN@github.com/SeeMoon357/wake_up.git master
```

**示例**：
```bash
git push https://ghp_abc123def456@github.com/SeeMoon357/wake_up.git master
```

### 方式 2: 配置后推送（永久使用）

```bash
cd /home/moons/projects/wake_up

# 配置 Git 记住凭证
git config credential.helper store

# 推送（会提示输入用户名和密码）
git push -u origin master

# 输入：
# Username: SeeMoon357
# Password: 粘贴你的 token（ghp_xxxx）
```

---

## ✅ 成功标志

看到这个输出就成功了：

```
Enumerating objects: 123, done.
Counting objects: 100% (123/123), done.
Delta compression using up to 8 threads
Compressing objects: 100% (95/95), done.
Writing objects: 100% (123/123), 45.67 KiB | 2.28 MiB/s, done.
Total 123 (delta 28), reused 0 (delta 0), pack-reused 0
To https://github.com/SeeMoon357/wake_up.git
 * [new branch]      master -> master
Branch 'master' set up to track remote branch 'master' from 'origin'.
```

---

## 🎊 推送成功后

访问你的仓库：https://github.com/SeeMoon357/wake_up

你会看到：
- ✅ 所有代码已上传
- ✅ README 自动显示
- ✅ 3 个 commits
- ✅ 完整的项目结构

---

## 🐛 常见问题

### Q: Token 输入错误？
```bash
# 重新推送即可
git push https://正确的TOKEN@github.com/SeeMoon357/wake_up.git master
```

### Q: 提示 "fatal: Authentication failed"？
- 检查 token 是否完整复制
- 检查 token 是否有 `repo` 权限
- 检查 token 是否过期

### Q: 想保存 token 避免每次输入？
```bash
# 使用 credential helper
git config --global credential.helper store
# 下次推送输入一次后就会记住
```

---

## 📋 快速命令（复制粘贴）

```bash
cd /home/moons/projects/wake_up
git push https://你的TOKEN@github.com/SeeMoon357/wake_up.git master
```

**替换 `你的TOKEN` 为实际 token，然后执行！**

---

**准备好了吗？获取 token 后直接推送吧！** 🚀
