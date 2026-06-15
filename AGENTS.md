## 项目概览

- **项目名称:** Elian 个人博客 + 播客网站
- **设计方向:** 极简主义 / 编辑美学（editorial-minimalist）
- **用户画像:** 设计敏感型访客、播客听众、潜在合作者

## 技术栈

| 类别 | 选型 |
|------|------|
| 框架 | 纯 HTML/CSS/JS（静态站点，无需 React/Next.js） |
| 样式 | 原生 CSS（CSS 变量管理主题色） |
| 动画 | 原生 CSS + 少量 JS（GSAP 按需引入） |
| 图标 | 手动绘制 SVG（极简线性描边风格，符合设计一致性） |
| 字体 | Cambria Math（标题） + SimSun/宋体（中文） + Cambria Math（正文） |
| 播客 | RSS 2.0 XML 静态托管 + 客户端解析显示 |
| 部署 | Render 静态站点（后续 PLAN.md 步骤） |

## 设计规范 (Design Tokens)

### 颜色
| Token | 值 | 用途 |
|-------|-----|------|
| `--color-text` | `#111657` | 正文文字 |
| `--color-bg` | `#F7F5E3` | 页面背景 |
| `--color-accent` | `#1a237e` | 强调/悬停态 |
| `--color-muted` | `#6b7280` | 辅助文字 |
| `--color-border` | `#e5e0cc` | 分割线 |
| Dark 模式 | 反转：深蓝底 + 米白字 | |

### 字体
| Token | 值 | 用途 |
|-------|-----|------|
| `--font-display` | 'Cambria Math', 'SimSun', '宋体', serif | 大标题、标语 |
| `--font-body` | 'Cambria Math', serif | 正文 |
| `--font-cjk` | 'SimSun', '宋体', serif | 中文内容 |

### 字号体系 (Modular Scale 1.25)
| 层级 | 大小 | 用途 |
|------|------|------|
| Hero | `clamp(3rem, 8vw, 6rem)` | "One Step Out" |
| H1 | `2.5rem` | 页面标题 |
| H2 | `1.75rem` | 区块标题 |
| Body | `1rem` | 正文 |
| Caption | `0.875rem` | 辅助信息 |

## 设计风格值 (Taste Dials)

- `DESIGN_VARIANCE: 6` — 适度不对称，左侧栏+右侧主视觉
- `MOTION_INTENSITY: 5` — 平滑滚动 + 悬停效果 + 手写动画
- `VISUAL_DENSITY: 3` — 大量留白，空气感

## 文件结构

```
个人网站/
├── index.html          # 主入口（单页应用结构）
├── css/
│   ├── base.css        # CSS 变量、重置样式、字体
│   ├── layout.css      # 左侧栏+右侧主视觉网格
│   ├── cursor.css      # 自定义鼠标指针样式
│   ├── navigation.css  # 导航栏样式
│   ├── about.css       # About Me 页面
│   ├── podcast.css     # Podcast 页面
│   ├── thoughts.css    # Thoughts 页面
│   └── responsive.css  # 响应式断点
├── js/
│   ├── cursor.js       # 自定义鼠标指针逻辑
│   ├── navigation.js   # 页面切换 + 平滑滚动
│   ├── theme.js        # Dark/Light 模式切换
│   ├── i18n.js         # 中英文切换
│   ├── podcast.js      # RSS 解析 + 播放器
│   └── animations.js   # 手写特效 + 入场动画
├── assets/
│   ├── images/         # 人像、背景图等
│   ├── icons/          # SVG 图标（日历、信封、Octocat）
│   └── fonts/          # 自托管字体文件
├── rss/
│   └── podcast.xml     # 播客 RSS feed
├── AGENTS.md           # 本文件
└── PLAN.md             # 实施计划
```

## 代码规范

- HTML: 语义化标签，无障碍属性 (aria-*)
- CSS: BEM 命名法，CSS 变量集中管理
- JS: ES6+ 模块化，事件委托优先，避免全局变量污染
- 注释: 关键逻辑加中文注释，CSS 文件头注明用途
- 提交: `type(scope): description` 格式

## 约束

- 纯静态站点，不引入构建工具链（Webpack/Vite 不必要）
- 字体自托管，不请求 Google Fonts CDN
- 图片压缩后内联或本地托管
- 首屏加载 < 2s（目标）

## Thoughts 更新规则

### 双视图架构

Thoughts 页面分两层：**列表视图**（默认展示，仅标题+首句+省略号+日期）和**详情视图**（点击条目后展开完整文章，替代右半区）。详情内容由 JS 动态填充。

### 列表视图（`.thoughts-list-view`）

HTML 结构：
```html
<article class="thought-entry" data-thought-id="N">
  <h3 class="thought-title">文章标题</h3>
  <p class="thought-excerpt">正文首句...</p>
  <time class="thought-date" datetime="YYYY-MM-DD">YYYY-MM-DD</time>
</article>
```

- `.thought-title`：加粗，深蓝（`--color-text`），`font-size: 1.3rem`，`text-align: center` 居中
- `.thought-excerpt`：深灰（`#555`），单行截断 `text-overflow: ellipsis`，末尾显示 `...`
- `.thought-date`：`YYYY-MM-DD` 格式，浅灰（`--color-muted`）
- 条目 hover：底色变为 `--color-border`
- 条目底部：`border-bottom: 1px solid var(--color-border)` 分隔
- 条目按发布时间先后排列，旧在上，新在下

### 详情视图（`#thought-detail-view`）

HTML 为模板，`<h3>`、`<pre>` 初始为空，JS 根据 `data-thought-id` 动态填充。

```html
<div id="thought-detail-view" style="display:none">
  <button id="thought-back-btn" class="thought-back-btn">← 返回列表</button>
  <article class="thought-detail-article">
    <h3 class="thought-title"></h3>
    <div class="thought-body">
      <pre class="thought-poem"></pre>
      <p class="thought-signature"></p>
    </div>
  </article>
  <p class="thought-end-mark">— END —</p>
</div>
```

- 详情视图中**不显示日期**
- `.thought-detail-article .thought-title`：`text-align: center` 居中
- `#thought-detail-view` 默认 `display:none`，打开时 `display:flex`
- `.thought-back-btn`：「← 返回列表」按钮，点击回到列表视图
- `.thought-poem`：`pre-wrap` 保留原始换行，每句左对齐，`line-height: 2`，`color: #555`
- `.thought-signature`：`text-align: right` 落款右对齐，`line-height: 2`，`color: #555`
- `.thought-end-mark`：顶部细线分割 + 居中 `— END —`

### JS 数据与交互

文章内容存储在 `nav.js` 的 `thoughtData` 对象中，以 `data-thought-id` 为 key：

```js
var thoughtData = {
  '1': { title: '...', poem: '...', signature: '...' },
  '2': { title: '...', poem: '...', signature: '...' }
};
```

- 点击 `.thought-entry` → 读取 `data-thought-id` → `openThoughtDetail(id)` 将对应 `title`/`poem`/`signature` 填入详情模板 → 列表隐藏，详情展开
- 点击「← 返回列表」→ `closeThoughtDetail()` 回到列表
- 切换到其他页面（About/Podcast）→ 自动关闭详情回到列表

### 新增文章步骤

1. 在 `.thoughts-list` **末尾**追加新的 `<article class="thought-entry">`，`data-thought-id` 取当前最大值 +1
2. 列表条目仅放标题 + 正文首句 + `...` + 日期；完整内容存入 `nav.js` 的 `thoughtData`
3. 不改动布局配色，仅改 HTML 文字和 JS 数据

## Podcast 更新规则

### 更新规范

1. 新增单集条目格式：左侧方形封面图，右侧分两行文字；首行加粗展示集数+标题，次行浅灰色（`--color-muted`）小字为内容简介
2. 时间标注要求：每条播客简介末尾统一补充完整发布年月日，格式 `YYYY-MM-DD`
3. 排版约束：条目上下预留统一间距，选中条目底色浅灰区分，整体左对齐布局，图片固定统一尺寸，不拉伸变形
4. 更新逻辑：新发布单集置顶列表最上方，旧条目依次后移，保留全部历史条目不删除

## 参考

- [taste-skill](C:\Users\keles\.codex\skills\taste-skill\SKILL.md) — 设计方向指导
- [frontend-design skill](C:\Users\keles\.codex\skills\frontend-design\SKILL.md) — 前端实现规范
