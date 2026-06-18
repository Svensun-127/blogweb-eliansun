/**
 * podcast.js — 播客列表渲染 + HTML5 音频播放器
 * 从 assets/data/podcast.json 加载数据，动态渲染节目列表
 */
(function () {
  var podcastPage = document.getElementById('page-podcast');
  if (!podcastPage) return;

  /* DOM 引用 (HTML 中已预置) */
  var listContainer = podcastPage.querySelector('.podcast-list');
  var playerContainer = podcastPage.querySelector('.podcast-player');
  var audioEl = podcastPage.querySelector('.podcast-audio');
  var playerTitle = podcastPage.querySelector('.podcast-player-title');
  var playerLink = podcastPage.querySelector('.podcast-player-link');
  var loadingEl = podcastPage.querySelector('.podcast-loading');
  var errorEl = podcastPage.querySelector('.podcast-error');

  var episodes = [];
  var currentGuid = null;
  var loaded = false;

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

  /* ========== 渲染 ========== */

  function renderList() {
    if (!listContainer) return;
    listContainer.innerHTML = '';

    episodes.forEach(function (ep) {
      var entry = document.createElement('article');
      entry.className = 'podcast-entry';
      entry.setAttribute('data-guid', ep.guid);

      /* 封面图 — 有图片则展示，无则使用占位 SVG */
      var coverHtml = ep.image
        ? '<img class="podcast-cover" src="' + escapeAttr(ep.image) + '" alt="' + escapeAttr(ep.title) + '" loading="lazy">'
        : '<div class="podcast-cover podcast-cover-placeholder"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><polygon points="5 3 19 12 5 21 5 3"/></svg></div>';

      /* 时长格式化：HH:MM:SS → 可读文本 */
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

    /* 绑定点击 */
    listContainer.addEventListener('click', handleEntryClick);
  }

  /* ========== 播放器 ========== */

  function handleEntryClick(e) {
    var entry = e.target.closest('.podcast-entry');
    if (!entry) return;

    var guid = entry.getAttribute('data-guid');
    var ep = findEpisode(guid);
    if (!ep || !ep.audioUrl) return;

    /* 点击同一集 → 暂停/播放切换 */
    if (guid === currentGuid) {
      if (audioEl) {
        if (audioEl.paused) {
          audioEl.play().catch(function () {});
        } else {
          audioEl.pause();
        }
      }
      return;
    }

    /* 切换节目 */
    selectEpisode(guid, ep);
  }

  function selectEpisode(guid, ep) {
    /* UI 高亮 */
    var entries = listContainer.querySelectorAll('.podcast-entry');
    entries.forEach(function (el) {
      el.classList.toggle('selected', el.getAttribute('data-guid') === guid);
    });

    /* 播放器 */
    if (audioEl) {
      audioEl.src = ep.audioUrl;
      audioEl.load();
      audioEl.play().catch(function () {});
    }
    if (playerTitle) playerTitle.textContent = ep.title;
    if (playerLink) {
      playerLink.href = ep.link || '#';
      playerLink.style.display = ep.link ? '' : 'none';
    }
    if (playerContainer) playerContainer.style.display = '';

    currentGuid = guid;
  }

  function findEpisode(guid) {
    for (var i = 0; i < episodes.length; i++) {
      if (episodes[i].guid === guid) return episodes[i];
    }
    return null;
  }

  /* ========== 工具函数 ========== */

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

  /* 暴露给 nav.js 调用 */
  window.initPodcast = init;
})();