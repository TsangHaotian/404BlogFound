---
title = "Hello World"
date = "2025-05-23"
tags = ["Go", "Web"]
description = "第一篇博客，记录这个博客网站的诞生"
---

## 欢迎来到 404 Blog Not Found

这是我的个人技术博客。整个网站是用 Go 语言从零构建的。

### 技术栈

- **后端**：Go（标准库 `net/http` + `html/template`）
- **Markdown 渲染**：goldmark
- **数据源**：GitHub API
- **样式**：纯 CSS（简洁现代风）
- **部署**：GitHub Pages

### 为什么用 Go 写博客？

因为想试试用 Go 能不能做出一个完整的网站。答案是：**完全可以**。

Go 标准库自带了 HTTP 服务器和模板引擎，搭配 goldmark 做 Markdown 渲染，一个 `.md` 文件到网页的流程非常顺畅。

### 功能特性

- 博客文章管理（Markdown + Front Matter）
- GitHub 作品集自动展示
- Giscus 评论系统
- 响应式设计
- 静态构建（GitHub Pages 部署）

### 代码示例

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, Blog!")
}
```
