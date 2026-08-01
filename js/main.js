// 移动端菜单切换
document.addEventListener('DOMContentLoaded', function () {
  const toggleBtn = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  if (toggleBtn && nav) {
    function toggleNav(show) {
      nav.classList.toggle('active', show);
    }

    toggleBtn.addEventListener('click', function () {
      toggleNav(!nav.classList.contains('active'));
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        toggleNav(false);
      });
    });
  }

  // 当前页面导航高亮
  const current = window.location.pathname.split('/').pop() || 'index.html';
  const navEl = document.querySelector('.main-nav');
  if (navEl) {
    navEl.querySelectorAll('a').forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === current || (current === '' && href === 'index.html')) {
        link.style.color = 'var(--accent)';
      }
    });
  }

  // 返回顶部按钮
  const topBtn = document.createElement('button');
  topBtn.className = 'back-to-top';
  topBtn.setAttribute('aria-label', '返回顶部');
  topBtn.innerHTML = '&uarr;';
  document.body.appendChild(topBtn);

  topBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', function () {
    topBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
});
