package model

import "html/template"

// Post 表示一篇博客文章
type Post struct {
	Title       string        `toml:"title"`
	Date        string        `toml:"date"`
	Tags        []string      `toml:"tags"`
	Description string        `toml:"description"`
	Slug        string        // URL 路径，由文件名决定
	Content     template.HTML // 渲染后的 HTML 正文
}

// Project 表示一个 GitHub 仓库（作品集展示用）
type Project struct {
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Stars       int      `json:"stargazers_count"`
	Language    string   `json:"language"`
	Topics      []string `json:"topics"`
	URL         string   `json:"html_url"`
	UpdatedAt   string   `json:"updated_at"`
}

// Config 博客配置文件结构
type Config struct {
	BaseURL      string `toml:"baseURL"`
	LanguageCode string `toml:"languageCode"`
	Title        string `toml:"title"`
	Author       string `toml:"author"`
	GitHubUser   string `toml:"githubUser"`

	Params struct {
		Subtitle    string `toml:"subtitle"`
		Description string `toml:"description"`
		Author      string `toml:"author"`
		Giscus      struct {
			Repo       string `toml:"repo"`
			RepoID     string `toml:"repoId"`
			Category   string `toml:"category"`
			CategoryID string `toml:"categoryId"`
		} `toml:"giscus"`
	} `toml:"params"`
}

// SiteData 传递给模板的全局数据
type SiteData struct {
	Title       string
	Subtitle    string
	Description string
	Author      string
	BaseURL     string
	Posts       []Post
	Projects    []Project
	Post        Post
}
