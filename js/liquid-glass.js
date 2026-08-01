// Liquid Glass - 共享 SVG 置换滤镜注入
// 结构：元素自身为容器，::before 为折射层，::after 为边缘高光层
(function () {
  'use strict';

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.setAttribute('style', 'position:absolute');
  svg.innerHTML =
    '<defs>' +
    '<filter id="liquid_glass_filter" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox" colorInterpolationFilters="sRGB">' +
    '<feDisplacementMap scale="25" xChannelSelector="R" yChannelSelector="G" />' +
    '</filter>' +
    '</defs>';

  if (document.body) {
    document.body.appendChild(svg);
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      document.body.appendChild(svg);
    });
  }
})();
