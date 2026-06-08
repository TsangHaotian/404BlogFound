// 移动端菜单切换
document.addEventListener('DOMContentLoaded', function () {
  const toggleBtn = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  if (toggleBtn && nav) {
    function toggleNav(show) {
      nav.classList.toggle('active', show);
      document.body.classList.toggle('nav-open', show);
    }

    toggleBtn.addEventListener('click', function () {
      toggleNav(!nav.classList.contains('active'));
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        toggleNav(false);
      });
    });

    // 点击遮罩关闭菜单
    document.body.addEventListener('click', function (e) {
      if (document.body.classList.contains('nav-open') && !nav.contains(e.target) && !toggleBtn.contains(e.target)) {
        toggleNav(false);
      }
    });
  }

  // 当前页面导航高亮
  const current = window.location.pathname.split('/').pop() || 'index.html';
  nav.querySelectorAll('a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.style.color = 'var(--accent)';
    }
  });
});
