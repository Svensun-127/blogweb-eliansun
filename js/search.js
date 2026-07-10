/**
 * search.js - 搜索框功能
 * 实时过滤 Thoughts 文章和 Podcast 播客列表
 */
(function () {
  /* ========== 通用搜索逻辑 ========== */

  function initSearch(section, entrySelector, textSelectors) {
    var searchBar = section.querySelector(".search-bar");
    if (!searchBar) return;

    var input = searchBar.querySelector(".search-input");
    var clearBtn = searchBar.querySelector(".search-clear");
    var listContainer = textSelectors.listContainer
      ? section.querySelector(textSelectors.listContainer)
      : section;
    var noResults = section.querySelector(".search-no-results");

    if (!input) return;

    function filterEntries() {
      var query = input.value.trim().toLowerCase();
      var entries = listContainer
        ? listContainer.querySelectorAll(entrySelector)
        : [];
      var visibleCount = 0;

      entries.forEach(function (entry) {
        var match = query === "";
        if (!match) {
          for (var i = 0; i < textSelectors.fields.length; i++) {
            var el = entry.querySelector(textSelectors.fields[i]);
            if (el && el.textContent.toLowerCase().indexOf(query) !== -1) {
              match = true;
              break;
            }
          }
        }
        entry.style.display = match ? "" : "none";
        if (match) visibleCount++;
      });

      /* 显示/隐藏清除按钮 */
      if (input.value.trim() !== "") {
        clearBtn.style.display = "";
      } else {
        clearBtn.style.display = "none";
      }

      /* 无结果提示 */
      if (noResults) {
        noResults.style.display =
          query !== "" && visibleCount === 0 ? "block" : "none";
      }
    }

    input.addEventListener("input", filterEntries);

    clearBtn.addEventListener("click", function () {
      input.value = "";
      filterEntries();
      input.focus();
    });
  }

  /* ========== Thoughts 搜索 ========== */
  var thoughtPage = document.getElementById("page-thoughts");
  if (thoughtPage) {
    initSearch(thoughtPage, ".thought-entry", {
      listContainer: ".thoughts-list",
      fields: [".thought-title", ".thought-excerpt"],
    });
  }

  /* ========== Podcast 搜索 ========== */
  var podcastPage = document.getElementById("page-podcast");
  if (podcastPage) {
    var podcastSearchReady = false;

    function initPodcastSearch() {
      if (podcastSearchReady) return;
      var listContainer = podcastPage.querySelector(".podcast-list");
      if (!listContainer || listContainer.children.length === 0) return;
      podcastSearchReady = true;
      initSearch(podcastPage, ".podcast-entry", {
        listContainer: ".podcast-list",
        fields: [".podcast-title", ".podcast-desc"],
      });
    }

    /* 监听列表变化（Podcast 数据加载完成后渲染） */
    var observer = new MutationObserver(function () {
      initPodcastSearch();
    });
    var listEl = podcastPage.querySelector(".podcast-list");
    if (listEl) {
      observer.observe(listEl, { childList: true });
    }
  }
})();
