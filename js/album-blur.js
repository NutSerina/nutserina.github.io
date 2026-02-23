(function () {
  function initAlbumBlur() {
    var imgs = document.querySelectorAll('.album-grid .album-item img');
    if (!imgs.length) return;

    imgs.forEach(function (img) {
      // 已经缓存加载完的
      if (img.complete && img.naturalWidth > 0) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', function () {
          this.classList.add('loaded');
        });
        // 加载失败也去掉模糊
        img.addEventListener('error', function () {
          this.classList.add('loaded');
        });
      }
    });
  }

  // DOM ready 后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAlbumBlur);
  } else {
    initAlbumBlur();
  }

  // Vue/SPA 切换页面后可能需要重新执行
  // MutationObserver 监听内容变化
  var observer = new MutationObserver(function (mutations) {
    var hasNewImg = mutations.some(function (m) {
      return m.addedNodes.length > 0;
    });
    if (hasNewImg) initAlbumBlur();
  });

  var target = document.getElementById('app') || document.body;
  observer.observe(target, { childList: true, subtree: true });
})();