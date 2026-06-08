// 移动端菜单切换
document.addEventListener('DOMContentLoaded', function () {
  const toggleBtn = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  var overlay = null;

  if (toggleBtn && nav) {
    function toggleNav(show) {
      nav.classList.toggle('active', show);
      if (show) {
        // 创建遮罩
        if (!overlay) {
          overlay = document.createElement('div');
          overlay.className = 'nav-overlay';
          document.body.appendChild(overlay);
          // 遮罩点击关闭
          overlay.addEventListener('click', function () {
            toggleNav(false);
          });
        }
        // 先显示再渐入
        overlay.style.display = 'block';
        overlay.style.opacity = '0';
        requestAnimationFrame(function () {
          overlay.style.opacity = '1';
        });
        document.body.style.overflow = 'hidden';
      } else {
        if (overlay) {
          overlay.style.opacity = '0';
          setTimeout(function () {
            overlay.style.display = 'none';
          }, 350);
        }
        document.body.style.overflow = '';
      }
    }

    toggleBtn.addEventListener('click', function () {
      toggleNav(!nav.classList.contains('active'));
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        toggleNav(false);
      });
    });

    // 点击遮罩关闭菜单（兼容旧的body点击逻辑）
    document.body.addEventListener('click', function (e) {
      if (document.body.classList.contains('nav-open') && !nav.contains(e.target) && !toggleBtn.contains(e.target)) {
        toggleNav(false);
      }
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
});
