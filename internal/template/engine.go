package template

import (
	"html/template"
	"io"
	"os"
	"path/filepath"

	"404BlogFound/internal/model"
)

// Engine 模板渲染引擎
type Engine struct {
	templates map[string]*template.Template
	funcMap   template.FuncMap
}

// NewEngine 创建模板引擎，加载所有模板文件
func NewEngine(templateDir string) (*Engine, error) {
	funcMap := template.FuncMap{
		"add": func(a, b int) int { return a + b },
	}

	// 先加载 base 模板
	basePath := filepath.Join(templateDir, "base.html")
	baseContent, err := os.ReadFile(basePath)
	if err != nil {
		return nil, err
	}

	// 每个页面模板都基于 base 构建
	pageFiles := []string{"index", "post", "list", "projects", "about"}
	templates := make(map[string]*template.Template)

	for _, name := range pageFiles {
		pagePath := filepath.Join(templateDir, name+".html")
		pageContent, err := os.ReadFile(pagePath)
		if err != nil {
			continue // 跳过不存在的页面模板
		}

		// 先解析 base，再附加页面内容
		// 必须先用 New 创建，然后两次 Parse
		tmpl := template.New("").Funcs(funcMap)
		tmpl, err = tmpl.Parse(string(baseContent))
		if err != nil {
			return nil, err
		}
		tmpl, err = tmpl.Parse(string(pageContent))
		if err != nil {
			return nil, err
		}
		templates[name+".html"] = tmpl
	}

	return &Engine{
		templates: templates,
		funcMap:   funcMap,
	}, nil
}

// Render 渲染指定名称的模板
func (e *Engine) Render(w io.Writer, name string, data *model.SiteData) error {
	tmpl, ok := e.templates[name]
	if !ok {
		return nil
	}
	// 用 "base" 模板名执行（所有模板的根是 base 模板）
	return tmpl.ExecuteTemplate(w, "base", data)
}
