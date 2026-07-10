(function () {
  var html = document.documentElement;
  var toggle = document.getElementById('lang-toggle');

  /* Translations */
  var dict = {
    en: {
      intro: "Hi! I'm Elian",
      "hero-text": "One Step Out",
      "hero-subtitle": "",
      "nav-about": "About Me",
      "nav-thoughts": "Thoughts",
      "nav-podcast": "Podcast",
      "thoughts-placeholder": "Thoughts coming soon",
      "podcast-coming": "Coming Soon",
      "podcast-teaser": "The mic is warming up. Stories, ideas, and conversations are on their way.",
      "podcast-loading": "Loading episodes…",
      "podcast-error": "Failed to load episodes. Please try again later.",
      "podcast-listen-xiaoyuzhou": "Listen on 小宇宙",
      "podcast-listen-apple": "Listen on Apple Podcasts",
      "podcast-duration-min": "min",
      "podcast-duration-hr": "hr",
      "podcast-back": "← Back to list",
      "about-whoami": "Who am I?",
      "about-born": "Born in 2006",
      "about-native": "Native of Jinan, Shandong province",
      "about-mbti": "MBTI: INTJ",
      "about-traits": "Core traits",
      "about-self-learner": "Self-learner",
      "about-kind": "Kind-hearted",
      "about-effective": "Effective",
      "about-independent": "Think independently",
      "about-interests": "Interests",
      "tag-speakout": "Host of Speak Out Show🎙️",
      "tag-stock": "US Stock📈",
      "tag-sneakers": "Sneakers👟",
      "tag-spurs": "Spurs Fan🏀👽",
      "tag-dogs": "Dogs🐾",
      "tag-buddhism": "Buddhism🪷",
      "podcast-transcript-view": "View Transcript",
      "podcast-transcript-hide": "Hide Transcript",
      "podcast-transcript-download": "Download Transcript",
      "podcast-transcript-loading": "Loading transcript...",
      "podcast-transcript-none": "No transcript available",
      "search-thoughts": "Search articles...",
      "search-podcast": "Search episodes...",
      "search-no-results": "No results found"
    },
    zh: {
      intro: "你好，我是Elian",
      "hero-text": "一步向外",
      "hero-subtitle": "一步向外",
      "nav-about": "关于我",
      "nav-thoughts": "想法",
      "nav-podcast": "播客",
      "thoughts-placeholder": "想法即将上线",
      "podcast-coming": "即将上线",
      "podcast-teaser": "故事、思考与对话正在路上。",
      "podcast-loading": "加载中…",
      "podcast-error": "加载失败，请稍后重试。",
      "podcast-listen-xiaoyuzhou": "在小宇宙收听",
      "podcast-listen-apple": "在 Apple Podcasts 收听",
      "podcast-duration-min": "分钟",
      "podcast-duration-hr": "小时",
      "podcast-back": "← 返回列表",
      "about-whoami": "我是谁？",
      "about-born": "2006年出生",
      "about-native": "山东济南人",
      "about-mbti": "MBTI：INTJ",
      "about-traits": "核心特质",
      "about-self-learner": "自学能力强",
      "about-kind": "心地善良",
      "about-effective": "高效执行",
      "about-independent": "独立思考",
      "about-interests": "兴趣爱好",
      "tag-speakout": "Speak Out Show 主持人🎙️",
      "tag-stock": "美股投资📈",
      "tag-sneakers": "球鞋👟",
      "tag-spurs": "马刺球迷🏀👽",
      "tag-dogs": "狗狗🐾",
      "tag-buddhism": "佛学🪷",
      "podcast-transcript-view": "查看字幕",
      "podcast-transcript-hide": "隐藏字幕",
      "podcast-transcript-download": "下载字幕",
      "podcast-transcript-loading": "加载字幕中…",
      "podcast-transcript-none": "暂无字幕",
      "search-thoughts": "搜索文章...",
      "search-podcast": "搜索播客...",
      "search-no-results": "无匹配结果"
    }
  };

  if (!toggle) return;

  var currentLang = localStorage.getItem('elian-lang') || 'en';
  applyLang(currentLang);

  toggle.addEventListener('click', function () {
    var next = currentLang === 'zh' ? 'en' : 'zh';
    applyLang(next);
    currentLang = next;
    localStorage.setItem('elian-lang', next);
  });

  function applyLang(lang) {
    html.lang = lang === 'zh' ? 'zh-CN' : 'en';
    toggle.textContent = lang === 'zh' ? 'E' : '中';

    /* Re-trigger hero animation on language switch */
    if (window.revealHero) {
      setTimeout(window.revealHero, 50);
    }

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.dataset.i18n;
      if (dict[lang] && dict[lang][key]) {
        el.textContent = dict[lang][key];
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.dataset.i18nPlaceholder;
      if (dict[lang] && dict[lang][key]) {
        el.setAttribute('placeholder', dict[lang][key]);
      }
    });

    /* 通知 podcast.js 重渲染字幕（语言切换联动） */
    if (window.updateTranscriptLang) {
      window.updateTranscriptLang();
    }
  }
})();
