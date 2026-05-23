/**
 * GitHub API 工具函数
 * 从 GitHub 获取仓库列表和 Issues（博客文章）
 */

const GITHUB_USER = 'TsangHaotian';
const GITHUB_REPO = '404BlogFound';

// 缓存数据到 localStorage，避免频繁请求
function getCache(key, ttl = 5 * 60 * 1000) {
  const cached = localStorage.getItem(key);
  if (!cached) return null;
  try {
    const data = JSON.parse(cached);
    if (Date.now() - data.time < ttl) return data.value;
  } catch (e) {}
  return null;
}

function setCache(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify({ time: Date.now(), value }));
  } catch (e) {}
}

// 获取 GitHub Token（从 URL 参数、localStorage 或硬编码默认值）
const DEFAULT_TOKEN = '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';
function getToken() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token') || localStorage.getItem('github_token') || DEFAULT_TOKEN;
  if (token && token !== DEFAULT_TOKEN) localStorage.setItem('github_token', token);
  return token;
}

// 通用 GitHub API 请求
async function githubFetch(url) {
  const token = getToken();
  const headers = { 'Accept': 'application/vnd.github.v3+json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const resp = await fetch(url, { headers });
  if (!resp.ok) {
    throw new Error(`GitHub API ${resp.status}: ${resp.statusText}`);
  }
  return resp.json();
}

/**
 * 获取用户的仓库列表
 * 过滤：非 fork、有描述、按 star 数排序
 */
async function fetchRepos() {
  const cacheKey = `gh_repos_${GITHUB_USER}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const repos = await githubFetch(
    `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`
  );

  // 过滤并排序
  let projects = repos
    .filter(r => !r.fork && r.description)
    .map(r => ({
      name: r.name,
      description: r.description,
      stars: r.stargazers_count,
      language: r.language,
      topics: r.topics || [],
      url: r.html_url,
      updated_at: r.updated_at
    }))
    .sort((a, b) => b.stars - a.stars);

  setCache(cacheKey, projects);
  return projects;
}

/**
 * 获取 Issues（作为博客文章）
 * 文章用 Issue 写，label 为 "blog" 的标记为博客
 */
async function fetchPosts() {
  const cacheKey = `gh_issues_${GITHUB_USER}_${GITHUB_REPO}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const issues = await githubFetch(
    `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/issues?state=open&per_page=100&labels=blog`
  );

  const posts = issues.map(issue => ({
    id: issue.number,
    title: issue.title,
    date: issue.created_at.slice(0, 10),
    tags: issue.labels.filter(l => l.name !== 'blog').map(l => l.name),
    description: issue.body ? issue.body.split('\n')[0].replace(/^#+\s*/, '').slice(0, 120) : '',
    body: issue.body || '',
    url: issue.html_url
  }));

  setCache(cacheKey, posts);
  return posts;
}

/**
 * 获取单篇文章详情
 */
async function fetchPost(id) {
  const cacheKey = `gh_issue_${GITHUB_USER}_${GITHUB_REPO}_${id}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const issue = await githubFetch(
    `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/issues/${id}`
  );

  const post = {
    id: issue.number,
    title: issue.title,
    date: issue.created_at.slice(0, 10),
    tags: issue.labels.filter(l => l.name !== 'blog').map(l => l.name),
    description: issue.body ? issue.body.split('\n')[0].replace(/^#+\s*/, '').slice(0, 120) : '',
    body: issue.body || '（文章内容为空）',
    url: issue.html_url
  };

  setCache(cacheKey, post);
  return post;
}
