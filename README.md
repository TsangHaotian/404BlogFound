# 404 Blog Not Found

> TsangHaotian 的个人技术博客 —— 记录学习与思考 / 热爱技术 / 持续成长

🌐 **在线访问：** https://tsanghaotian.github.io/404BlogFound

一个纯静态的个人博客网站，无需后端、无需数据库，直接部署在 GitHub Pages 上。博客文章通过 **GitHub Issues** 管理，配合 GitHub Actions 自动同步到网站。

---

## ✨ 功能特性

- 📝 **博客系统** — 文章列表、归档、标签、Markdown 渲染、代码高亮
- 🔍 **归档搜索** — 按年份分组的时间线布局，支持标题/简介即时搜索
- 📖 **阅读体验** — 顶部阅读进度条、图片点击放大灯箱、上一篇/下一篇导航
- 🎨 **作品集** — GitHub 项目自动同步，按语言分类展示，精选项目详情页
- 🏆 **证书展示** — 竞赛获奖证书点击查看大图
- 🌙 **深色主题** — 紫色调暗夜风格，全站统一视觉
- 📱 **响应式** — 适配手机、平板、桌面端

---

## 📂 项目结构

```
404BlogFound/
├── index.html          # 首页（个人简介 + 最新文章 + 项目概览）
├── posts.html          # 归档页（年份分组 + 时间线 + 搜索）
├── post.html           # 文章详情页（进度条 + 灯箱 + 上下篇导航）
├── projects.html       # 作品集（分类 Tab + 精选项目 + 证书墙）
├── about.html          # 关于页（个人介绍 + 技术栈）
│
├── css/
│   ├── style.css       # 全站主样式（深色主题）
│   └── featured.css    # 精选项目页共享样式
│
├── js/
│   ├── api.js          # 数据加载（posts.json / projects.json）
│   └── main.js         # 导航交互 + 返回顶部按钮
│
├── data/
│   ├── posts.json      # 博客文章数据（由 GitHub Issues 自动生成）
│   └── projects.json   # GitHub 项目数据（由 API 自动生成）
│
├── featured/           # 精选项目详情页（截图 + 介绍 + 总结）
├── img/                # 头像、文章配图、favicon
│
├── .github/workflows/
│   └── update-data.yml # 每周自动同步数据的 Actions 工作流
│
└── server.js           # 本地预览服务器（node server.js）
```

---

## 📝 如何发布博客

博客文章就是本仓库的 **GitHub Issue**，发布流程：

1. 在本仓库新建一个 **Issue**
2. 标题即文章标题，正文用 Markdown 书写
3. 给 Issue 打上 **`blog`** 标签
4. 等待 GitHub Actions 自动同步（每周日），或手动触发工作流立即更新

文章中的图片放在 `img/posts/` 目录，正文中以 `/404BlogFound/img/posts/x.png` 引用。

> 💬 如果想留言提问，直接开 Issue 即可，打 `question` 标签，我会在评论区回复。

---

## 🔄 数据同步原理

```
GitHub Issues (blog 标签)
        │
        ▼  GitHub Actions 每周日自动拉取（也可手动触发）
        │
data/posts.json ──────────► 博客文章数据
data/projects.json ───────► GitHub 项目数据
        │
        ▼  提交并推送
GitHub Pages 自动部署 ────► 网站更新
```

前端通过 `js/api.js` 读取 `data/` 下的 JSON 文件渲染页面，文章详情页加载失败时会回退到 GitHub API 实时拉取。

---

## 🛠 本地预览

```bash
node server.js
```

然后访问 http://localhost:8080

---

## 🧰 技术栈

- **前端：** 原生 HTML / CSS / JavaScript（零框架、零构建）
- **Markdown 渲染：** [marked.js](https://marked.js.org/)
- **代码高亮：** [highlight.js](https://highlightjs.org/)
- **数据管理：** GitHub Issues + GitHub REST API
- **自动化：** GitHub Actions
- **部署：** GitHub Pages

---

## 📮 联系我

- **GitHub：** [@TsangHaotian](https://github.com/TsangHaotian)
- **Email：** TsangHaotian@hotmail.com

如果我的其他项目有任何问题，也欢迎来本仓库开 Issue 留言讨论！
