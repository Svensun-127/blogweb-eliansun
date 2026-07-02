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
    },
    '3': {
      title: '《这世界即残酷又温柔》读书笔记',
      poem: '1. 这让我回想起自己上初中的时候，老师经常讲当今世界出现了能源危机，要节约能源，维持地球的可持续发展。但是长大后了解的事实却是，全世界能源根本用不完，新能源一天比一天多，能源价格一天比一天低。美国的页岩气、新能源、电池技术突飞猛进地发展，石油价格也是屡创新低。\n\n2. 对于投资来说，投资就是投人，企业和创始人的格局有非常大的关系。选择做什么领域，在哪个赛道飞奔，拥有的格局和基因是怎样的，决定了日后最终会成为什么。苍蝇和人的基因染色体很像，可基因就是从第一天起决定你将成为人还是苍蝇的灵魂。\n\n3. 我认为真正的成年人只有一个标准，就是他能否自由地做出选择，是否明白自由选择的代价，并为这个自由的选择愿意承担责任。这是判断一个人、一个群体甚至一个国家成年与否的唯一标准，也是我们判断某个人是否真正具有理性的重要标准。\n\n4. 这群人在我很年轻的时候，就告诉了我"稳定"的定义。"稳定"就是对工作面如死灰，端水泡茶看报，燃烧的热血已成灰烬，干好干坏无所谓，任何心动都像一场尴尬的玩笑。"稳定"就是较真努力的人显得像傻×，而得过且过敷衍了事的人仿佛提前洞悉真理的先知。"稳定"就是这个世界不再需要你，任何一个人都能替代你，你没有任何价值，却能够好吃懒做地逃脱惩罚。\n\n5. 为什么我要去美国？因为这个国家有不一样的气质。我一到美国，整个人的心态就不一样了，我仿佛变成了一个世界公民，意味着全世界的事情都变成了自己的事。当时在北大，也有不少同学毕业选择去荷兰、意大利、德国、法国等欧洲国家，而这些国家的气质，我认为可以用"小国寡民"四个字来形容，整个国家充斥着"人类和我没关系，我自己开心就够了"的感觉。当然，这里不是想说这种气质是不对的，只是这种气质与我不相符。去什么样的国家，就要想清楚自己是什么样的人，虽然我的家境非常一般，父母勒紧裤腰带让我去美国念书，我还没办法去改变什么，但至少从思想和气质上，我关心更宏大的事情，拥有更宏大的愿景，这是在美国的世界公民才能够接受和享受的。\n\n6. 我的公司在面试员工的时候，最关心的是你喜欢什么前进方式？你对未来怎么看？你未来5年到10年的规划是什么？我也遇到过不少背景很出色的人，名校毕业、有曾在大公司工作的光环，但是这些人连自己哪怕是1到3年的规划也没想过。这就是境界和格局的差别。对我们来说，这样的应聘者就是完全不合格的，不会录用。据我所知，很多互联网公司招聘人才时都关注这一点，因此，有增量思维的人更容易在互联网企业中获得提升。\n\n7. 培养格局的最佳方式，就是去看看世界，打开视野。如果你立志从商，就一定要去一次峰会，看一次真人马云，因为看到最优秀的人就不会再度回到平庸；如果你是个企业家，就应该来听纳斯达克上市公司的董事长的讲座，此时你的潜意识里，自己创业的天然对标就是他们；如果你是研究科学的，就应该听听诺奖得主的课，当你看到他们，就不会甘于回去抄论文，过各种潜规则苟且的生活。当你看到最优秀的人的境界，就不会允许自己这样。\n\n8. 留在北上广，失败也能从头再来；回到小城市，一切永远就此终结。在别人的宫殿中锦衣玉食，也索然无味，因为自己的命运由他人掌控，即便拥有一切也可能一朝化为灰烬。而在自己的城市里，苦难只是一时，快乐将会永存。',
      signature: '------《这世界即残酷又温柔》'
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
