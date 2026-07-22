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
    /* 切换到其他页面时，关闭文章/播客详情 */
    if (name !== 'thoughts') {
      closeThoughtDetail();
    }
    if (name !== 'podcast' && window.closePodcastDetail) {
      window.closePodcastDetail();
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
  var thoughtList = thoughtPage ? thoughtPage.querySelector('.thoughts-list') : null;
  var listView = thoughtPage ? thoughtPage.querySelector('.thoughts-list-view') : null;
  var detailView = document.getElementById('thought-detail-view');
  var backBtn = document.getElementById('thought-back-btn');
  var detailTitle = detailView ? detailView.querySelector('.thought-title') : null;
  var detailPoem = detailView ? detailView.querySelector('.thought-poem') : null;
  var detailSignature = detailView ? detailView.querySelector('.thought-signature') : null;
  var currentThoughtId = null;

  /* 获取当前语言 */
  function getLang() {
    return localStorage.getItem('elian-lang') || 'en';
  }

  /* 文章数据：data-thought-id → { date, zh: {...}, en: {...} } */
  var thoughtData = {
    '1': {
      date: '2025-06-10',
      zh: {
        title: '《庆丰十二年六月十日作》',
        poem: '山高自有客行路，\n水深亦遇渡船人。\n浮萍一叶归沧海，\n何处人生不逢春？',
        signature: '------2025.6.10高考完记'
      },
      en: {
        title: 'Composed on the Tenth Day of the Sixth Month',
        poem: 'Though mountains tower, the traveler finds a way,\nWhere waters deepen, a ferryman appears.\nA single duckweed leaf drifts toward the vast sea —\nWhere in this life does spring not find you?',
        signature: '------Written after the Gaokao, June 10, 2025'
      }
    },
    '2': {
      date: '2026-04-24',
      zh: {
        title: '《自由》',
        poem: '自由是一顿饭吃一个小时\n自由是随时停下歇歇，听歌，吹风\n自由是不看表上的数字\n自由也是远离，是逃避\n你苦苦追寻的，可能正在你身边',
        signature: '------2026.4.24宁波'
      },
      en: {
        title: 'Freedom',
        poem: 'Freedom is a meal that takes an hour to finish\nFreedom is stopping anytime — to rest, to hear a song, to feel the wind\nFreedom is never looking at the numbers on the clock\nFreedom is also distance, is escape\nWhat you search for so desperately may already be right beside you',
        signature: '------Ningbo, April 24, 2026'
      }
    },
    '3': {
      date: '2026-07-02',
      zh: {
        title: '《这世界即残酷又温柔》读书笔记',
        poem: '1. 这让我回想起自己上初中的时候，老师经常讲当今世界出现了能源危机，要节约能源，维持地球的可持续发展。但是长大后了解的事实却是，全世界能源根本用不完，新能源一天比一天多，能源价格一天比一天低。美国的页岩气、新能源、电池技术突飞猛进地发展，石油价格也是屡创新低。\n\n2. 对于投资来说，投资就是投人，企业和创始人的格局有非常大的关系。选择做什么领域，在哪个赛道飞奔，拥有的格局和基因是怎样的，决定了日后最终会成为什么。苍蝇和人的基因染色体很像，可基因就是从第一天起决定你将成为人还是苍蝇的灵魂。\n\n3. 我认为真正的成年人只有一个标准，就是他能否自由地做出选择，是否明白自由选择的代价，并为这个自由的选择愿意承担责任。这是判断一个人、一个群体甚至一个国家成年与否的唯一标准，也是我们判断某个人是否真正具有理性的重要标准。\n\n4. 这群人在我很年轻的时候，就告诉了我"稳定"的定义。"稳定"就是对工作面如死灰，端水泡茶看报，燃烧的热血已成灰烬，干好干坏无所谓，任何心动都像一场尴尬的玩笑。"稳定"就是较真努力的人显得像傻×，而得过且过敷衍了事的人仿佛提前洞悉真理的先知。"稳定"就是这个世界不再需要你，任何一个人都能替代你，你没有任何价值，却能够好吃懒做地逃脱惩罚。\n\n5. 为什么我要去美国？因为这个国家有不一样的气质。我一到美国，整个人的心态就不一样了，我仿佛变成了一个世界公民，意味着全世界的事情都变成了自己的事。当时在北大，也有不少同学毕业选择去荷兰、意大利、德国、法国等欧洲国家，而这些国家的气质，我认为可以用"小国寡民"四个字来形容，整个国家充斥着"人类和我没关系，我自己开心就够了"的感觉。当然，这里不是想说这种气质是不对的，只是这种气质与我不相符。去什么样的国家，就要想清楚自己是什么样的人，虽然我的家境非常一般，父母勒紧裤腰带让我去美国念书，我还没办法去改变什么，但至少从思想和气质上，我关心更宏大的事情，拥有更宏大的愿景，这是在美国的世界公民才能够接受和享受的。\n\n6. 我的公司在面试员工的时候，最关心的是你喜欢什么前进方式？你对未来怎么看？你未来5年到10年的规划是什么？我也遇到过不少背景很出色的人，名校毕业、有曾在大公司工作的光环，但是这些人连自己哪怕是1到3年的规划也没想过。这就是境界和格局的差别。对我们来说，这样的应聘者就是完全不合格的，不会录用。据我所知，很多互联网公司招聘人才时都关注这一点，因此，有增量思维的人更容易在互联网企业中获得提升。\n\n7. 培养格局的最佳方式，就是去看看世界，打开视野。如果你立志从商，就一定要去一次峰会，看一次真人马云，因为看到最优秀的人就不会再度回到平庸；如果你是个企业家，就应该来听纳斯达克上市公司的董事长的讲座，此时你的潜意识里，自己创业的天然对标就是他们；如果你是研究科学的，就应该听听诺奖得主的课，当你看到他们，就不会甘于回去抄论文，过各种潜规则苟且的生活。当你看到最优秀的人的境界，就不会允许自己这样。\n\n8. 留在北上广，失败也能从头再来；回到小城市，一切永远就此终结。在别人的宫殿中锦衣玉食，也索然无味，因为自己的命运由他人掌控，即便拥有一切也可能一朝化为灰烬。而在自己的城市里，苦难只是一时，快乐将会永存。',
        signature: '------《这世界即残酷又温柔》'
      },
      en: {
        title: 'Reading Notes on The World Is Both Cruel and Tender',
        poem: '1. This takes me back to my middle school days, when teachers often spoke of an unfolding energy crisis and urged us to conserve resources for the planet\'s sustainable future. But what I came to understand as I grew older was the opposite: the world\'s energy is far from depleted. New energy sources multiply by the day, and energy prices keep falling. With breakthroughs in American shale gas, renewables, and battery technology, oil prices have repeatedly hit new lows.\n\n2. When it comes to investing, you\'re ultimately investing in people. A company\'s destiny is deeply tied to its founder\'s vision. The field you choose, the track you race on, the mindset and character you carry — these determine what you will ultimately become. A fly and a human share remarkably similar genes, yet from the very first day, those genes decide whether you\'ll grow into the soul of a person or the soul of a fly.\n\n3. I believe there is only one measure of being a true adult: whether you can make a choice freely, whether you understand the price of that choice, and whether you are willing to bear the responsibility for it. This is the sole standard for judging whether a person, a community, or even a nation has come of age — and the key measure of whether someone is truly rational.\n\n4. When I was very young, a group of people taught me the definition of "stability." Stability is wearing a dead expression at work, pouring tea, reading the newspaper, the fire of passion long extinguished — where it doesn\'t matter if you try or not, and any flicker of genuine excitement feels like an embarrassing joke. Stability is where the earnest and hardworking seem like fools, while those who coast by and do the bare minimum appear as prophets who have grasped the truth ahead of everyone else. Stability is a world that no longer needs you, where anyone can replace you, where you have no value at all — yet you can still escape punishment through laziness and sloth.\n\n5. Why did I want to go to America? Because this country has a different spirit. The moment I arrived, my entire mindset shifted — I felt like a citizen of the world, as if everything happening anywhere had become my concern. Back at Peking University, plenty of classmates chose to go to the Netherlands, Italy, Germany, France, and other European countries after graduation. The spirit of those countries, I think, can be captured in four words: "small country, small people." The whole nation radiates a feeling of "the rest of humanity has nothing to do with me — I\'m happy as long as I\'m content." I\'m not saying this spirit is wrong — it just doesn\'t match who I am. When choosing which country to go to, you must be clear about what kind of person you are. My family was very ordinary — my parents tightened their belts to send me to study in America. I wasn\'t yet in a position to change anything, but in thought and spirit, at least, I cared about grander things, carried a larger vision. That\'s something only a world citizen in America could embrace and enjoy.\n\n6. When my company interviews candidates, what we care about most is: What kind of progress do you love? How do you see the future? What are your plans for the next 5 to 10 years? I\'ve met many people with impressive backgrounds — elite university degrees, experience at big-name companies — but they had never even thought about a plan for the next 1 to 3 years. That\'s the difference between vision and small-mindedness. For us, such candidates are simply unqualified and won\'t be hired. To my knowledge, many internet companies look for this same quality when hiring, and so people with an incremental-growth mindset tend to advance more easily in internet companies.\n\n7. The best way to cultivate vision is to go see the world and broaden your horizons. If you aspire to business, you must attend at least one summit and see Jack Ma in person — because once you\'ve seen the very best, you can never settle back into mediocrity. If you\'re an entrepreneur, you should attend lectures by chairmen of NASDAQ-listed companies — at that point, your subconscious natural benchmark for starting a business becomes them. If you\'re in scientific research, you should take a class from a Nobel laureate — when you see them, you can\'t bear to go back to plagiarizing papers and scraping by under the table. Once you\'ve witnessed the realm of the finest minds, you simply won\'t allow yourself to stay where you are.\n\n8. Stay in Beijing, Shanghai, or Guangzhou, and even if you fail, you can start over from scratch. Go back to a small city, and everything ends forever. To live in finery within another\'s palace is tasteless — your fate is in someone else\'s hands, and even if you possess everything, it can all burn to ashes overnight. But in your own city, hardship is only temporary, and happiness will last forever.',
    },
    '4': {
      date: '2026-07-20',
      zh: {
        title: '投资笔记001',
        poem: '前两天芯片存储股回调，买了$BE，因为市价单滑点大和错误择时，把5、6月份的涨幅全吞没了。

最新操作：只保留TSLA、VOO、VGSH

经验：买自己熟悉的标的，不追热点。

$SPCX 目标买入价：97$，>10股',
        signature: ''
      },
      en: {
        title: 'Investment Notes 001',
        poem: 'A couple of days ago, chip storage stocks pulled back. I bought $BE, but heavy market-order slippage and poor timing wiped out all the gains from May and June.

Latest moves: holding only TSLA, VOO, VGSH.

Lesson: buy what you know. Don\'t chase the heat.

$SPCX target entry: $97, >10 shares',
        signature: ''
      }
    }
  };

  /* 从正文第一行生成摘要 */
  function getExcerpt(text) {
    var firstLine = text.split('\n')[0];
    firstLine = firstLine.replace(/^\d+\.\s*/, '');
    if (firstLine.length > 30) {
      return firstLine.substring(0, 30) + '...';
    }
    return firstLine + '...';
  }

  /* 动态渲染文章列表 */
  function renderThoughtList(lang) {
    if (!thoughtList) return;
    var ids = ['4', '3', '2', '1']; // 最新在前
    var html = '';
    ids.forEach(function (id) {
      var d = thoughtData[id];
      var content = d[lang];
      if (!content) return;
      var excerpt = getExcerpt(content.poem);
      html += '<article class="thought-entry" data-thought-id="' + id + '">' +
        '<h3 class="thought-title">' + escapeHTML(content.title) + '</h3>' +
        '<p class="thought-excerpt">' + escapeHTML(excerpt) + '</p>' +
        '<time class="thought-date" datetime="' + d.date + '">' + d.date + '</time>' +
        '</article>';
    });
    thoughtList.innerHTML = html;

    /* 语言切换时，如果详情页正打开，同步刷新详情内容 */
    if (currentThoughtId && detailView && detailView.style.display === 'flex') {
      var d2 = thoughtData[currentThoughtId];
      var c2 = d2 && d2[lang];
      if (c2) {
        if (detailTitle) detailTitle.textContent = c2.title;
        if (detailPoem) detailPoem.textContent = c2.poem;
        if (detailSignature) detailSignature.textContent = c2.signature || '';
      }
    }
  }

  function escapeHTML(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function openThoughtDetail(id) {
    currentThoughtId = id;
    if (!listView || !detailView || !thoughtData[id]) return;
    var lang = getLang();
    var d = thoughtData[id][lang];
    if (!d) return;
    if (detailTitle) detailTitle.textContent = d.title;
    if (detailPoem) detailPoem.textContent = d.poem;
    if (detailSignature) detailSignature.textContent = d.signature || '';
    listView.style.display = 'none';
    detailView.style.display = 'flex';
  }

  function closeThoughtDetail() {
    currentThoughtId = null;
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

  /* 初始渲染 */
  renderThoughtList(getLang());

  /* 暴露给 i18n.js 在语言切换时调用 */
  window.renderThoughtList = renderThoughtList;
})();
