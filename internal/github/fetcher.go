package github

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"sort"
	"sync"
	"time"

	"404BlogFound/internal/model"
)

// Fetcher GitHub API 数据获取器
type Fetcher struct {
	username  string
	token     string
	client    *http.Client
	cache     []model.Project
	cacheMu   sync.RWMutex
	cachedAt  time.Time
	ttl       time.Duration
}

// NewFetcher 创建 GitHub Fetcher
// token 为 "" 时使用匿名请求（限制 60次/小时）
func NewFetcher(username, token string) *Fetcher {
	return &Fetcher{
		username: username,
		token:    token,
		client: &http.Client{
			Timeout: 10 * time.Second,
		},
		ttl: 5 * time.Minute, // 缓存 5 分钟
	}
}

// FetchRepos 获取用户的 GitHub 仓库列表
func (f *Fetcher) FetchRepos() ([]model.Project, error) {
	// 检查缓存是否有效
	f.cacheMu.RLock()
	if f.cachedAt.After(time.Now().Add(-f.ttl)) && len(f.cache) > 0 {
		defer f.cacheMu.RUnlock()
		return f.cache, nil
	}
	f.cacheMu.RUnlock()

	// 调用 GitHub API
	apiURL := fmt.Sprintf("https://api.github.com/users/%s/repos?per_page=100&sort=updated", url.PathEscape(f.username))

	req, err := http.NewRequest("GET", apiURL, nil)
	if err != nil {
		return nil, fmt.Errorf("创建请求失败: %w", err)
	}
	req.Header.Set("Accept", "application/vnd.github.v3+json")
	req.Header.Set("User-Agent", "404BlogFound")
	if f.token != "" {
		req.Header.Set("Authorization", "Bearer "+f.token)
	}

	resp, err := f.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("请求 GitHub API 失败: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("GitHub API 返回状态 %d: %s", resp.StatusCode, string(body))
	}

	var repos []struct {
		Name            string   `json:"name"`
		Description     string   `json:"description"`
		Stars           int      `json:"stargazers_count"`
		Language        string   `json:"language"`
		Topics          []string `json:"topics"`
		HTMLURL         string   `json:"html_url"`
		UpdatedAt       string   `json:"updated_at"`
		Fork            bool     `json:"fork"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&repos); err != nil {
		return nil, fmt.Errorf("解析 JSON 失败: %w", err)
	}

	// 过滤掉 fork 的仓库，并转为 Project 结构
	var projects []model.Project
	for _, r := range repos {
		if r.Fork {
			continue
		}
		if r.Description == "" {
			continue
		}
		projects = append(projects, model.Project{
			Name:        r.Name,
			Description: r.Description,
			Stars:       r.Stars,
			Language:    r.Language,
			Topics:      r.Topics,
			URL:         r.HTMLURL,
			UpdatedAt:   r.UpdatedAt,
		})
	}

	// 按 star 数排序
	sort.Slice(projects, func(i, j int) bool {
		return projects[i].Stars > projects[j].Stars
	})

	// 写入缓存
	f.cacheMu.Lock()
	f.cache = projects
	f.cachedAt = time.Now()
	f.cacheMu.Unlock()

	return projects, nil
}
