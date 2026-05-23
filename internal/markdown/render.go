package markdown

import (
	"bytes"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"html/template"

	"404BlogFound/internal/model"
	"github.com/BurntSushi/toml"
	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/extension"
	"github.com/yuin/goldmark/parser"
	"github.com/yuin/goldmark/renderer/html"
)

// frontMatter 用于解析 Markdown 文件头的 TOML 元数据
type frontMatter struct {
	Title       string   `toml:"title"`
	Date        string   `toml:"date"`
	Tags        []string `toml:"tags"`
	Description string   `toml:"description"`
}

// Render 将 Markdown 正文渲染为 HTML
func Render(content string) (string, error) {
	md := goldmark.New(
		goldmark.WithExtensions(extension.GFM),
		goldmark.WithParserOptions(
			parser.WithAutoHeadingID(),
		),
		goldmark.WithRendererOptions(
			html.WithHardWraps(),
		),
	)

	var buf bytes.Buffer
	if err := md.Convert([]byte(content), &buf); err != nil {
		return "", fmt.Errorf("markdown 渲染失败: %w", err)
	}

	return buf.String(), nil
}

// ParseFile 解析一个 Markdown 文件，返回 Post
// 文件格式：
//   ---
//   title = "..."
//   date = "..."
//   ---
//   正文内容...
func ParseFile(filePath string) (*model.Post, error) {
	data, err := os.ReadFile(filePath)
	if err != nil {
		return nil, fmt.Errorf("读取文件失败 %s: %w", filePath, err)
	}

	content := string(data)

	// 提取 front matter（--- 包裹的部分）
	var fm frontMatter
	var body string

	if strings.HasPrefix(content, "---") {
		parts := strings.SplitN(content[3:], "---", 2)
		if len(parts) == 2 {
			if err := toml.Unmarshal([]byte(parts[0]), &fm); err != nil {
				return nil, fmt.Errorf("解析 front matter 失败: %w", err)
			}
			body = strings.TrimSpace(parts[1])
		}
	} else {
		body = content
	}

	// 渲染正文
	htmlContent, err := Render(body)
	if err != nil {
		return nil, err
	}

	// 从文件名生成 Slug（去掉日期前缀和 .md）
	filename := filepath.Base(filePath)
	slug := strings.TrimSuffix(filename, ".md")
	// 去掉 "2025-05-23-" 这样的日期前缀
	if len(slug) > 11 && slug[4] == '-' && slug[7] == '-' {
		slug = slug[11:]
	}

	return &model.Post{
		Title:       fm.Title,
		Date:        fm.Date,
		Tags:        fm.Tags,
		Description: fm.Description,
		Slug:        slug,
		Content:     template.HTML(htmlContent),
	}, nil
}

// LoadAllPosts 扫描 content/post/ 目录下的所有 .md 文件并解析
func LoadAllPosts(postDir string) ([]model.Post, error) {
	entries, err := os.ReadDir(postDir)
	if err != nil {
		return nil, fmt.Errorf("读取文章目录失败: %w", err)
	}

	var posts []model.Post
	for _, entry := range entries {
		if entry.IsDir() || !strings.HasSuffix(entry.Name(), ".md") {
			continue
		}

		filePath := filepath.Join(postDir, entry.Name())
		post, err := ParseFile(filePath)
		if err != nil {
			// 出错时跳过单个文件，不中断整体加载
			fmt.Fprintf(os.Stderr, "警告: 解析 %s 失败: %v\n", filePath, err)
			continue
		}
		posts = append(posts, *post)
	}

	return posts, nil
}
