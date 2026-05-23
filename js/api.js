/**
 * 数据获取：优先读取本地 data/ 目录下的静态 JSON 文件
 * 这些文件由 GitHub Actions 每周自动更新
 */

const GITHUB_USER = 'TsangHaotian';
const GITHUB_REPO = '404BlogFound';

// 获取项目列表（读本地 data/projects.json）
async function fetchRepos() {
  const resp = await fetch('data/projects.json');
  if (!resp.ok) throw new Error('加载项目数据失败');
  return resp.json();
}

// 获取博客文章列表（读本地 data/posts.json）
async function fetchPosts() {
  const resp = await fetch('data/posts.json');
  if (!resp.ok) return []; // 没有文章时不报错
  return resp.json();
}

// 获取单篇文章（从 posts.json 里找）
async function fetchPost(id) {
  const posts = await fetchPosts();
  return posts.find(p => p.id == id) || null;
}
