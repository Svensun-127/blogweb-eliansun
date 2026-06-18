(function () {
  var nav = document.getElementById('bottom-nav');
  if (!nav) return;

  var buttons = nav.querySelectorAll('button[data-page]');
  var pages = document.querySelectorAll('.page');

  /* 【路由分离】切换可见页面，隐藏其余 */
  function showPage(name) {
    pages.forEach(function (p) {
      p.classList.toggle('visible', p.dataset.page === name);
    });
    buttons.forEach(function (b) {
      b.classList.toggle('active', b.dataset.page === name);
    });
    /* 切换到其他页面时，关闭文章详情 */
    if (name !== 'thoughts') {
      closeThoughtDetail();
    }
    /* 首次切换到播客页面时触发数据加载 */
    if (name === 'podcast' && window.initPodcast) {
      window.initPodcast();
    }
  }

  /* 默认展示 About Me */
  showPage('about');

  /* 点击导航切换页面 */
  nav.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-page]');
    if (!btn) return;
    showPage(btn.dataset.page);
  });

  /* ========== Thoughts 列表 / 详情切换 ========== */
  var thoughtPage = document.getElementById('page-thoughts');
  var listView = thoughtPage ? thoughtPage.querySelector('.thoughts-list-view') : null;
  var detailView = document.getElementById('thought-detail-view');
  var backBtn = document.getElementById('thought-back-btn');
  var detailTitle = detailView ? detailView.querySelector('.thought-title') : null;
  var detailPoem = detailView ? detailView.querySelector('.thought-poem') : null;
  var detailSignature = detailView ? detailView.querySelector('.thought-signature') : null;

  /* 文章数据：data-thought-id → { title, poem, signature } */
  var thoughtData = {
    '1': {
      title: '《庆丰十二年六月十日作》',
      poem: '山高自有客行路，\n水深亦遇渡船人。\n浮萍一叶归沧海，\n何处人生不逢春？',
      signature: '------2025.6.10高考完记'
    },
    '2': {
      title: '《自由》',
      poem: '自由是一顿饭吃一个小时\n自由是随时停下歇歇，听歌，吹风\n自由是不看表上的数字\n自由也是远离，是逃避\n你苦苦追寻的，可能正在你身边',
      signature: '------2026.4.24宁波'
    }
  };

  function openThoughtDetail(id) {
    if (!listView || !detailView || !thoughtData[id]) return;
    var d = thoughtData[id];
    if (detailTitle) detailTitle.textContent = d.title;
    if (detailPoem) detailPoem.textContent = d.poem;
    if (detailSignature) detailSignature.textContent = d.signature || '';
    listView.style.display = 'none';
    detailView.style.display = 'flex';
  }

  function closeThoughtDetail() {
    if (!listView || !detailView) return;
    listView.style.display = '';
    detailView.style.display = 'none';
  }

  /* 点击文章条目 → 打开详情 */
  if (thoughtPage) {
    thoughtPage.addEventListener('click', function (e) {
      var entry = e.target.closest('.thought-entry');
      if (entry) {
        openThoughtDetail(entry.getAttribute('data-thought-id'));
      }
    });
  }

  /* 返回列表按钮 */
  if (backBtn) {
    backBtn.addEventListener('click', function () {
      closeThoughtDetail();
    });
  }
})();
