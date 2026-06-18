/**
 * podcast.js — 播客列表渲染 + 列表↔详情导航 + 自定义音频播放器
 * 从 assets/data/podcast.json 加载数据，动态渲染节目列表
 */
(function () {
  var podcastPage = document.getElementById('page-podcast');
  if (!podcastPage) return;

  /* DOM 引用 */
  var listView      = podcastPage.querySelector('.podcast-list-view');
  var listContainer = podcastPage.querySelector('.podcast-list');
  var detailView    = podcastPage.querySelector('.podcast-detail-view');
  var loadingEl     = podcastPage.querySelector('.podcast-loading');
  var errorEl       = podcastPage.querySelector('.podcast-error');
  var audioEl       = podcastPage.querySelector('.podcast-audio');

  /* 详情视图 DOM */
  var backBtn        = podcastPage.querySelector('.podcast-back-btn');
  var detailCover    = podcastPage.querySelector('.podcast-detail-cover');
  var coverPH        = podcastPage.querySelector('.podcast-detail-cover-placeholder');
  var detailTitle    = podcastPage.querySelector('.podcast-detail-title');
  var detailDate     = podcastPage.querySelector('.podcast-detail-date');
  var detailDuration = podcastPage.querySelector('.podcast-detail-duration');
  var detailDesc     = podcastPage.querySelector('.podcast-detail-desc');
  var detailLink     = podcastPage.querySelector('.podcast-detail-link');

  /* 自定义播放器 DOM */
  var playBtn       = podcastPage.querySelector('.podcast-play-btn');
  var iconPlay      = podcastPage.querySelector('.podcast-icon-play');
  var iconPause     = podcastPage.querySelector('.podcast-icon-pause');
  var progressBar   = podcastPage.querySelector('.podcast-progress-bar');
  var progressFill  = podcastPage.querySelector('.podcast-progress-fill');
  var timeDisplay   = podcastPage.querySelector('.podcast-time-display');

  var episodes = [];
  var currentGuid = null;
  var loaded = false;
  var playerReady = false;

  /**
   * 首次切换到 Podcast tab 时触发加载
   * 由 nav.js 的 showPage() 调用
   */
  function init() {
    if (loaded) return;
    loaded = true;
    fetchEpisodes();
  }

  function fetchEpisodes() {
    if (!loadingEl) return;
    loadingEl.style.display = 'flex';

    fetch('assets/data/podcast.json')
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        episodes = data.episodes || [];
        loadingEl.style.display = 'none';
        if (episodes.length === 0) {
          showError();
        } else {
          renderList();
        }
      })
      .catch(function () {
        loadingEl.style.display = 'none';
        showError();
      });
  }

  function showError() {
    if (errorEl) errorEl.style.display = 'flex';
    if (listContainer) listContainer.innerHTML = '';
  }

  /* ========== 列表渲染 ========== */

  function renderList() {
    if (!listContainer) return;
    listContainer.innerHTML = '';

    episodes.forEach(function (ep) {
      var entry = document.createElement('article');
      entry.className = 'podcast-entry';
      entry.setAttribute('data-guid', ep.guid);

      var coverHtml = ep.image
        ? '<img class="podcast-cover" src="' + escapeAttr(ep.image) + '" alt="' + escapeAttr(ep.title) + '" loading="lazy">'
        : '<div class="podcast-cover podcast-cover-placeholder"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><polygon points="5 3 19 12 5 21 5 3"/></svg></div>';

      var durationText = formatDuration(ep.duration);

      entry.innerHTML =
        coverHtml +
        '<div class="podcast-info">' +
          '<h3 class="podcast-title">' + escapeHtml(ep.title) + '</h3>' +
          '<p class="podcast-desc">' + escapeHtml(ep.description) + '</p>' +
          '<div class="podcast-meta">' +
            (durationText ? '<span class="podcast-duration">' + escapeHtml(durationText) + '</span>' : '') +
            '<span class="podcast-date">' + escapeHtml(ep.pubDate) + '</span>' +
          '</div>' +
        '</div>';

      listContainer.appendChild(entry);
    });

    listContainer.addEventListener('click', handleEntryClick);
  }

  /* ========== 列表 → 详情 ========== */

  function handleEntryClick(e) {
    var entry = e.target.closest('.podcast-entry');
    if (!entry) return;

    var guid = entry.getAttribute('data-guid');
    var ep = findEpisode(guid);
    if (!ep) return;

    openDetail(guid, ep);
  }

  function openDetail(guid, ep) {
    /* 填充内容 */
    if (ep.image) {
      detailCover.src = ep.image;
      detailCover.alt = ep.title;
      detailCover.style.display = '';
      if (coverPH) coverPH.style.display = 'none';
    } else {
      detailCover.style.display = 'none';
      if (coverPH) coverPH.style.display = 'flex';
    }

    if (detailTitle) detailTitle.textContent = ep.title;
    if (detailDate) detailDate.textContent = ep.pubDate;
    if (detailDuration) detailDuration.textContent = formatDuration(ep.duration);
    if (detailDesc) detailDesc.textContent = ep.description;
    if (detailLink) {
      detailLink.href = ep.link || '#';
      detailLink.style.display = ep.link ? '' : 'none';
    }

    /* 切换视图 */
    if (listView) listView.style.display = 'none';
    if (detailView) detailView.style.display = 'flex';

    /* 设置音频源 */
    if (audioEl && ep.audioUrl) {
      audioEl.src = ep.audioUrl;
      audioEl.load();
    }

    /* 初始化自定义播放器事件（仅一次） */
    if (!playerReady) {
      initCustomPlayer();
      playerReady = true;
    }

    currentGuid = guid;
  }

  function closeDetail() {
    if (listView) listView.style.display = '';
    if (detailView) detailView.style.display = 'none';
    if (audioEl) {
      audioEl.pause();
    }
    updatePlayIcon(false);
    currentGuid = null;
  }

  /* ========== 自定义音频播放器 ========== */

  function initCustomPlayer() {
    if (!audioEl || !playBtn || !progressBar || !timeDisplay) return;

    /* 播放/暂停 */
    playBtn.addEventListener('click', function () {
      if (!audioEl.src) return;
      if (audioEl.paused) {
        audioEl.play().catch(function () {});
      } else {
        audioEl.pause();
      }
    });

    /* 时间更新 → 进度条 + 时间显示 */
    audioEl.addEventListener('timeupdate', function () {
      var pct = audioEl.duration ? (audioEl.currentTime / audioEl.duration) * 100 : 0;
      if (progressFill) progressFill.style.width = pct + '%';
      if (timeDisplay) timeDisplay.textContent = fmtTime(audioEl.currentTime) + ' / ' + fmtTime(audioEl.duration || 0);
    });

    /* 元数据加载 → 更新时间显示 */
    audioEl.addEventListener('loadedmetadata', function () {
      if (timeDisplay) timeDisplay.textContent = '00:00 / ' + fmtTime(audioEl.duration || 0);
    });

    /* 播放/暂停状态同步图标 */
    audioEl.addEventListener('play', function () { updatePlayIcon(true); });
    audioEl.addEventListener('pause', function () { updatePlayIcon(false); });
    audioEl.addEventListener('ended', function () { updatePlayIcon(false); });

    /* 进度条点击跳转 */
    progressBar.addEventListener('click', function (e) {
      if (!audioEl.duration) return;
      var rect = progressBar.getBoundingClientRect();
      var pct = (e.clientX - rect.left) / rect.width;
      pct = Math.max(0, Math.min(1, pct));
      audioEl.currentTime = pct * audioEl.duration;
    });

    /* 进度条拖拽 */
    var dragging = false;

    progressBar.addEventListener('mousedown', function (e) {
      if (!audioEl.duration) return;
      dragging = true;
      var rect = progressBar.getBoundingClientRect();
      var pct = (e.clientX - rect.left) / rect.width;
      pct = Math.max(0, Math.min(1, pct));
      audioEl.currentTime = pct * audioEl.duration;
      e.preventDefault();
    });

    document.addEventListener('mousemove', function (e) {
      if (!dragging || !audioEl.duration) return;
      var rect = progressBar.getBoundingClientRect();
      var pct = (e.clientX - rect.left) / rect.width;
      pct = Math.max(0, Math.min(1, pct));
      audioEl.currentTime = pct * audioEl.duration;
    });

    document.addEventListener('mouseup', function () {
      dragging = false;
    });

    /* 键盘支持 */
    progressBar.addEventListener('keydown', function (e) {
      if (!audioEl.duration) return;
      if (e.key === 'ArrowLeft') {
        audioEl.currentTime = Math.max(0, audioEl.currentTime - 5);
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        audioEl.currentTime = Math.min(audioEl.duration, audioEl.currentTime + 5);
        e.preventDefault();
      }
    });
  }

  function updatePlayIcon(playing) {
    if (iconPlay) iconPlay.style.display = playing ? 'none' : '';
    if (iconPause) iconPause.style.display = playing ? '' : 'none';
  }

  function fmtTime(sec) {
    if (!sec || isNaN(sec)) return '00:00';
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }

  /* ========== 工具函数 ========== */

  function findEpisode(guid) {
    for (var i = 0; i < episodes.length; i++) {
      if (episodes[i].guid === guid) return episodes[i];
    }
    return null;
  }

  function formatDuration(dur) {
    if (!dur) return '';
    var parts = dur.split(':');
    var h = parseInt(parts[0], 10);
    var m = parseInt(parts[1], 10);
    var lang = (localStorage.getItem('elian-lang') || 'en') === 'zh' ? 'zh' : 'en';
    var hrText = lang === 'zh' ? '小时' : 'hr';
    var minText = lang === 'zh' ? '分钟' : 'min';
    if (h > 0) {
      return h + ' ' + hrText + ' ' + m + ' ' + minText;
    }
    return m + ' ' + minText;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeAttr(str) {
    return String(str).replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* 列表视图内点击返回按钮 → 关闭详情 */
  if (backBtn) {
    backBtn.addEventListener('click', function () {
      closeDetail();
    });
  }

  /* 暴露给外部 */
  window.initPodcast = init;
  window.closePodcastDetail = closeDetail;
})();