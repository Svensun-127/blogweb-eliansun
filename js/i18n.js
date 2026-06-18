(function () {
  var html = document.documentElement;
  var toggle = document.getElementById('lang-toggle');

  /* Translations */
  var dict = {
    en: {
      intro: "Hi! I'm Elian",
      "hero-text": "One Step Out",
      "nav-about": "About Me",
      "nav-thoughts": "Thoughts",
      "nav-podcast": "Podcast",
      "thoughts-placeholder": "Thoughts coming soon",
      "podcast-coming": "Coming Soon",
      "podcast-teaser": "The mic is warming up. Stories, ideas, and conversations are on their way.",
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
      "tag-buddhism": "Buddhism🪷"
    },
    zh: {
      intro: "你好，我是Elian",
      "hero-text": "一步向外",
      "nav-about": "关于我",
      "nav-thoughts": "想法",
      "nav-podcast": "播客",
      "thoughts-placeholder": "想法即将上线",
      "podcast-coming": "即将上线",
      "podcast-teaser": "故事、思考与对话正在路上。",
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
      "tag-buddhism": "佛学🪷"
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

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.dataset.i18n;
      if (dict[lang] && dict[lang][key]) {
        el.textContent = dict[lang][key];
      }
    });
  }
})();
