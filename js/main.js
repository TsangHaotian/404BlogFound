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

  // 液态玻璃滑动指示器
  const navEl = document.querySelector('.main-nav');
  if (navEl) {
    const pill = document.createElement('span');
    pill.className = 'nav-pill';
    navEl.appendChild(pill);

    const links = Array.from(navEl.querySelectorAll('a'));
    const current = window.location.pathname.split('/').pop() || 'index.html';
    // 文章页归属于"归档"
    const currentFile = current === 'post.html' ? 'posts.html' : current;

    const activeLink = links.find(l => l.getAttribute('href') === currentFile)
      || links.find(l => currentFile === '' && l.getAttribute('href') === 'index.html');

    function movePill(link, animate) {
      if (!link) return;
      if (!animate) pill.style.transition = 'none';
      pill.style.left = (link.offsetLeft - 8) + 'px';
      pill.style.width = (link.offsetWidth + 16) + 'px';
      if (!animate) {
        void pill.offsetHeight;
        pill.style.transition = '';
      }
    }

    if (activeLink) {
      activeLink.classList.add('nav-active');
      requestAnimationFrame(() => movePill(activeLink, false));
      window.addEventListener('load', () => movePill(activeLink, false));
      window.addEventListener('resize', () => movePill(activeLink, false));
    }

    links.forEach(link => {
      link.addEventListener('click', function (e) {
        if (link === activeLink) return;
        e.preventDefault();
        const href = this.getAttribute('href');
        links.forEach(l => l.classList.remove('nav-active'));
        this.classList.add('nav-active');
        movePill(this, true);
        setTimeout(() => { window.location.href = href; }, 400);
      });
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
