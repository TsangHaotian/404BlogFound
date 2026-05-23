package cmd

import (
	"flag"
	"fmt"
	"log"
	"net/http"

	"404BlogFound/internal/server"
)

// Run 启动服务器或生成静态文件
func Run() {
	// 定义命令行参数
	buildMode := flag.Bool("build", false, "生成静态文件到 docs/ 目录")
	port := flag.Int("port", 8080, "HTTP 服务器端口")
	flag.Parse()

	// 创建 Server
	srv, err := server.NewServer("config.toml", "templates", "content")
	if err != nil {
		log.Fatalf("初始化服务器失败: %v", err)
	}

	if *buildMode {
		// 构建模式：生成静态文件到 docs/
		fmt.Println("正在生成静态文件到 docs/ 目录...")
		if err := srv.BuildStatic("docs"); err != nil {
			log.Fatalf("生成静态文件失败: %v", err)
		}
		fmt.Println("生成完成！")
		return
	}

	// 开发模式：启动 HTTP 服务器
	mux := http.NewServeMux()
	srv.RegisterRoutes(mux)

	addr := fmt.Sprintf(":%d", *port)
	log.Printf("服务器启动于 http://localhost%s", addr)
	log.Printf("按 Ctrl+C 停止服务器")
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatalf("服务器启动失败: %v", err)
	}
}
