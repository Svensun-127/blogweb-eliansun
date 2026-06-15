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
| 字体 | Playfair Display（标题衬线体） + 华文中宋（中文） + Inter（正文无衬线体） |
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
| `--font-display` | 'Playfair Display', serif | 大标题、标语 |
| `--font-body` | 'Inter', sans-serif | 正文 |
| `--font-cjk` | 'STZhongsong', '华文中宋', serif | 中文内容 |

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

## 参考

- [taste-skill](C:\Users\keles\.codex\skills\taste-skill\SKILL.md) — 设计方向指导
- [frontend-design skill](C:\Users\keles\.codex\skills\frontend-design\SKILL.md) — 前端实现规范
