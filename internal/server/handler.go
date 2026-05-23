package server

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"404BlogFound/internal/github"
	"404BlogFound/internal/markdown"
	"404BlogFound/internal/model"
	tmpl "404BlogFound/internal/template"
	"github.com/BurntSushi/toml"
)

// Server HTTP 服务器
type Server struct {
	config  *model.Config
	engine  *tmpl.Engine
	ghFetch *github.Fetcher
	posts   []model.Post
	postsMap map[string]*model.Post // slug -> Post，快速查找
}

// NewServer 创建新服务器
func NewServer(configPath, templateDir, contentDir string) (*Server, error) {
	// 读取配置
	config, err := loadConfig(configPath)
	if err != nil {
		return nil, fmt.Errorf("加载配置失败: %w", err)
	}

	// 初始化模板引擎
	engine, err := tmpl.NewEngine(templateDir)
	if err != nil {
		return nil, fmt.Errorf("加载模板失败: %w", err)
	}

	// 初始化 GitHub Fetcher
	ghFetcher := github.NewFetcher(config.GitHubUser)

	// 加载文章
	postDir := filepath.Join(contentDir, "post")
	posts, err := markdown.LoadAllPosts(postDir)
	if err != nil {
		log.Printf("警告: 加载文章失败: %v", err)
		posts = []model.Post{}
	}

	// 构建文章映射
	postsMap := make(map[string]*model.Post)
	for i := range posts {
		postsMap[posts[i].Slug] = &posts[i]
	}

	return &Server{
		config:   config,
		engine:   engine,
		ghFetch:  ghFetcher,
		posts:    posts,
		postsMap: postsMap,
	}, nil
}

func loadConfig(path string) (*model.Config, error) {
	var config model.Config
	if _, err := toml.DecodeFile(path, &config); err != nil {
		return nil, err
	}
	// 设置默认值
	if config.Title == "" {
		config.Title = "404 Blog Not Found"
	}
	if config.Params.Author == "" {
		config.Params.Author = config.Author
	}
	if config.Params.Author == "" {
		config.Params.Author = "TsangHaotian"
	}
	// 去掉 BaseURL 末尾的 /
	config.BaseURL = strings.TrimRight(config.BaseURL, "/")
	return &config, nil
}

// buildSiteData 构建模板数据
func (s *Server) buildSiteData() *model.SiteData {
	return &model.SiteData{
		Title:       s.config.Title,
		Subtitle:    s.config.Params.Subtitle,
		Description: s.config.Params.Description,
		Author:      s.config.Params.Author,
		BaseURL:     s.config.BaseURL,
		Posts:       s.posts,
	}
}

// RegisterRoutes 注册所有 HTTP 路由
func (s *Server) RegisterRoutes(mux *http.ServeMux) {
	// 静态文件服务
	staticDir := filepath.Join(".", "static")
	fs := http.FileServer(http.Dir(staticDir))
	mux.Handle("/static/", http.StripPrefix("/static/", fs))

	// 页面路由
	// 注意："/" 必须最后注册，避免它吞掉其他路由
	mux.HandleFunc("/posts", s.handleList)
	mux.HandleFunc("/post/", s.handlePost)
	mux.HandleFunc("/projects", s.handleProjects)
	mux.HandleFunc("/about", s.handleAbout)
	mux.HandleFunc("/", s.handleIndex)
}

func (s *Server) handleIndex(w http.ResponseWriter, r *http.Request) {
	log.Printf("DEBUG handleIndex path=%s", r.URL.Path)
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}

	// 获取 GitHub 项目（首页只显示前 3 个）
	projects, err := s.ghFetch.FetchRepos()
	if err != nil {
		log.Printf("获取 GitHub 项目失败: %v", err)
		projects = []model.Project{}
	}
	if len(projects) > 3 {
		projects = projects[:3]
	}

	data := s.buildSiteData()
	data.Projects = projects

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	if err := s.engine.Render(w, "index.html", data); err != nil {
		log.Printf("渲染模板失败: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}

func (s *Server) handleList(w http.ResponseWriter, r *http.Request) {
	data := s.buildSiteData()
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	if err := s.engine.Render(w, "list.html", data); err != nil {
		log.Printf("渲染模板失败: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}

func (s *Server) handlePost(w http.ResponseWriter, r *http.Request) {
	slug := strings.TrimPrefix(r.URL.Path, "/post/")
	slug = strings.TrimSuffix(slug, "/")

	if slug == "" {
		http.Redirect(w, r, "/posts", http.StatusSeeOther)
		return
	}

	post, ok := s.postsMap[slug]
	if !ok {
		http.NotFound(w, r)
		return
	}

	data := s.buildSiteData()
	data.Post = *post

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	if err := s.engine.Render(w, "post.html", data); err != nil {
		log.Printf("渲染模板失败: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}

func (s *Server) handleProjects(w http.ResponseWriter, r *http.Request) {
	projects, err := s.ghFetch.FetchRepos()
	if err != nil {
		log.Printf("获取 GitHub 项目失败: %v", err)
		projects = []model.Project{}
	}

	data := s.buildSiteData()
	data.Projects = projects

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	if err := s.engine.Render(w, "projects.html", data); err != nil {
		log.Printf("渲染模板失败: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}

func (s *Server) handleAbout(w http.ResponseWriter, r *http.Request) {
	data := s.buildSiteData()

	// 尝试加载 content/about.md
	aboutPath := filepath.Join("content", "about.md")
	if _, err := os.Stat(aboutPath); err == nil {
		post, err := markdown.ParseFile(aboutPath)
		if err == nil {
			data.Post = *post
		}
	}

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	if err := s.engine.Render(w, "about.html", data); err != nil {
		log.Printf("渲染模板失败: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}

// BuildStatic 生成静态 HTML 文件到 docs/ 目录
func (s *Server) BuildStatic(outputDir string) error {
	// 确保输出目录存在
	dirs := []string{
		outputDir,
		filepath.Join(outputDir, "post"),
		filepath.Join(outputDir, "static", "css"),
		filepath.Join(outputDir, "static", "js"),
	}
	for _, d := range dirs {
		if err := os.MkdirAll(d, 0755); err != nil {
			return fmt.Errorf("创建目录失败 %s: %w", d, err)
		}
	}

	// 复制静态文件
	if err := copyDir("static/css", filepath.Join(outputDir, "static", "css")); err != nil {
		log.Printf("复制 CSS 文件警告: %v", err)
	}
	if err := copyDir("static/js", filepath.Join(outputDir, "static", "js")); err != nil {
		log.Printf("复制 JS 文件警告: %v", err)
	}

	// 生成页面
	routes := []struct {
		path   string
		tmpl   string
		setup  func(*model.SiteData)
	}{
		{"index.html", "index.html", func(d *model.SiteData) {
			projects, err := s.ghFetch.FetchRepos()
			if err != nil {
				projects = []model.Project{}
			}
			if len(projects) > 3 {
				projects = projects[:3]
			}
			d.Projects = projects
		}},
		{"posts/index.html", "list.html", nil},
		{"projects/index.html", "projects.html", func(d *model.SiteData) {
			projects, err := s.ghFetch.FetchRepos()
			if err != nil {
				projects = []model.Project{}
			}
			d.Projects = projects
		}},
		{"about/index.html", "about.html", func(d *model.SiteData) {
			aboutPath := filepath.Join("content", "about.md")
			if post, err := markdown.ParseFile(aboutPath); err == nil {
				d.Post = *post
			}
		}},
	}

	// 生成普通页面
	for _, route := range routes {
		data := s.buildSiteData()
		if route.setup != nil {
			route.setup(data)
		}

		outputPath := filepath.Join(outputDir, route.path)
		// 确保父目录存在
		if err := os.MkdirAll(filepath.Dir(outputPath), 0755); err != nil {
			return fmt.Errorf("创建目录失败 %s: %w", filepath.Dir(outputPath), err)
		}
		f, err := os.Create(outputPath)
		if err != nil {
			return fmt.Errorf("创建文件失败 %s: %w", outputPath, err)
		}

		if err := s.engine.Render(f, route.tmpl, data); err != nil {
			f.Close()
			return fmt.Errorf("渲染模板失败 %s: %w", route.tmpl, err)
		}
		f.Close()
		log.Printf("生成: %s", outputPath)
	}

	// 生成文章页面
	data := s.buildSiteData()
	for _, post := range s.posts {
		data.Post = post
		slugPath := filepath.Join(outputDir, "post", post.Slug)
		if err := os.MkdirAll(slugPath, 0755); err != nil {
			return fmt.Errorf("创建文章目录失败: %w", err)
		}
		outputPath := filepath.Join(slugPath, "index.html")
		f, err := os.Create(outputPath)
		if err != nil {
			return fmt.Errorf("创建文章文件失败: %w", err)
		}
		if err := s.engine.Render(f, "post.html", data); err != nil {
			f.Close()
			return fmt.Errorf("渲染文章模板失败: %w", err)
		}
		f.Close()
		log.Printf("生成: %s", outputPath)
	}

	return nil
}

// copyDir 递归复制目录（简单实现，只复制文件不复制子目录）
func copyDir(src, dst string) error {
	entries, err := os.ReadDir(src)
	if err != nil {
		return err
	}
	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}
		srcPath := filepath.Join(src, entry.Name())
		dstPath := filepath.Join(dst, entry.Name())
		data, err := os.ReadFile(srcPath)
		if err != nil {
			return err
		}
		if err := os.WriteFile(dstPath, data, 0644); err != nil {
			return err
		}
	}
	return nil
}

