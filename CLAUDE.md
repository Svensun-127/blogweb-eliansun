# Elian 个人博客 + 播客网站 - 开发规范文档
## 一、项目核心信息
### 1.1 项目定位
面向设计敏感型访客、播客听众、潜在合作者的极简主义/编辑美学风格个人站点，包含博客（Thoughts）、播客、关于我等核心模块，采用纯静态 HTML/CSS/JS 构建。

### 1.2 技术栈选型
| 类别       | 选型说明                                                                 |
|------------|--------------------------------------------------------------------------|
| 核心框架   | 纯 HTML/CSS/JS（静态站点，无 React/Next.js 等框架依赖）                  |
| 样式管理   | 原生 CSS + CSS 变量（集中管理主题色、字体、字号等设计令牌）              |
| 动效实现   | 原生 CSS 为主，少量 JS 辅助（按需引入 GSAP 增强动效）                    |
| 图标系统   | 手动绘制 SVG（极简线性描边风格，保证设计一致性）                        |
| 字体方案   | 自托管字体：Cambria Math（标题/正文） + SimSun/宋体（中文内容）          |
| 播客实现   | RSS 2.0 XML 静态托管 + 客户端 JS 解析渲染                              |
| 部署方式   | Render 静态站点（具体步骤参考 PLAN.md）                                 |

## 二、设计规范（Design Tokens）
### 2.1 颜色体系
| Token 名称       | 取值         | 应用场景               | 深色模式适配       |
|------------------|--------------|------------------------|--------------------|
| `--color-text`   | `#111657`    | 正文文字               | 米白色（#F7F5E3）  |
| `--color-bg`     | `#F7F5E3`    | 页面背景               | 深蓝色（#111657）  |
| `--color-accent` | `#1a237e`    | 强调色、交互悬停态     | 加深一级（#151c6e）|
| `--color-muted`  | `#6b7280`    | 辅助文字（日期/简介）  | 浅灰（#9499a8）    |
| `--color-border` | `#e5e0cc`    | 分割线、条目边框       | 深灰（#2a2e45）    |

### 2.2 字体体系
| Token 名称       | 取值                                      | 应用场景               |
|------------------|-------------------------------------------|------------------------|
| `--font-display` | 'Cambria Math', 'SimSun', '宋体', serif   | 大标题、标语、页面标题 |
| `--font-body`    | 'Cambria Math', serif                     | 英文正文               |
| `--font-cjk`     | 'SimSun', '宋体', serif                   | 中文内容               |

### 2.3 字号体系（Modular Scale 1.25）
| 层级   | 字号取值                | 应用场景               |
|--------|-------------------------|------------------------|
| Hero   | `clamp(3rem, 8vw, 6rem)`| 核心标语（如“One Step Out”） |
| H1     | `2.5rem`                | 页面一级标题           |
| H2     | `1.75rem`               | 区块二级标题           |
| Body   | `1rem`                  | 正文内容               |
| Caption| `0.875rem`              | 辅助信息（日期/按钮说明）|

### 2.4 设计风格参数
| 参数名              | 取值 | 说明                     |
|---------------------|------|--------------------------|
| `DESIGN_VARIANCE`   | 6    | 适度不对称布局（左侧栏+右侧主视觉） |
| `MOTION_INTENSITY`  | 5    | 平滑滚动 + 悬停效果 + 手写动画     |
| `VISUAL_DENSITY`    | 3    | 大量留白，强调“空气感”             |

## 三、文件结构规范
```
个人网站/
├── index.html          # 主入口（单页应用结构，承载所有页面切换）
├── css/
│   ├── base.css        # 全局：CSS变量、重置样式、字体引入
│   ├── layout.css      # 核心布局：左侧栏+右侧主视觉网格系统
│   ├── cursor.css      # 自定义鼠标指针样式
│   ├── navigation.css  # 导航栏样式（含交互态）
│   ├── about.css       # About Me 页面专属样式
│   ├── podcast.css     # Podcast 页面专属样式
│   ├── thoughts.css    # Thoughts 页面专属样式
│   └── responsive.css  # 响应式断点（移动端/平板适配）
├── js/
│   ├── cursor.js       # 自定义鼠标指针交互逻辑
│   ├── navigation.js   # 页面切换、平滑滚动、Thoughts 数据管理
│   ├── theme.js        # 明暗模式切换（含 localStorage 持久化）
│   ├── i18n.js         # 中英文内容切换逻辑
│   ├── podcast.js      # RSS 解析、播客播放器、列表渲染
│   └── animations.js   # 手写特效、入场动画、交互动效
├── assets/
│   ├── images/         # 人像、背景图（压缩后本地托管）
│   ├── icons/          # SVG 图标（日历、信封、Octocat 等）
│   └── fonts/          # 自托管字体文件（Cambria Math/SimSun）
├── rss/
│   └── podcast.xml     # 播客 RSS 2.0 标准 feed 文件
├── AGENTS.md           # 开发规范文档（本文档）
└── PLAN.md             # 项目实施计划
```

## 四、编码规范
### 4.1 通用约束
- 纯静态站点，不引入 Webpack/Vite 等构建工具链；
- 字体/图片均本地托管，不依赖外部 CDN（如 Google Fonts）；
- 首屏加载时间目标 < 2s，图片需压缩、非关键 JS 按需加载；
- 所有代码需兼顾无障碍性（HTML 加 aria-* 属性、语义化标签）。

### 4.2 各语言规范
| 语言 | 核心规范                                                                 |
|------|--------------------------------------------------------------------------|
| HTML | 语义化标签（header/section/article 等）；结构清晰、缩进统一   |
| CSS  | BEM 命名法（.block__element--modifier）；CSS 变量集中管理；文件头注明用途 |
| JS   | IIFE 模块化；事件委托优先；避免全局变量污染；关键逻辑加中文注释           |

### 4.3 提交规范
提交信息格式：`type(scope): description`
- type：feat（新增功能）/fix（修复问题）/style（样式调整）/docs（文档更新）/refactor（重构）
- scope：thoughts/podcast/layout 等模块名
- description：简洁描述修改内容（中文）

## 五、Thoughts 模块规范
### 5.1 双视图架构
- 列表视图：默认展示，仅显示标题+首句+省略号+日期，占据右侧主视觉区；
- 详情视图：点击条目后展开，替代列表视图，展示完整文章内容。

### 5.2 列表视图（.thoughts-list-view）
→ 参考 index.html 中 #page-thoughts 实际结构
#### 样式规则
- `.thought-title`：加粗，`--color-text`，`1.3rem`，居中对齐；
- `.thought-excerpt`：#555，单行截断（`text-overflow: ellipsis`），末尾固定显示 `...`；
- `.thought-date`：`--color-muted`，YYYY-MM-DD 格式；
- 条目 hover：背景色变为 `--color-border`；
- 条目底部：1px 实线 `--color-border` 分隔；
- 排序规则：按发布时间降序（旧条目在上，新条目在下）。

### 5.3 详情视图（#thought-detail-view）
→ 参考 index.html 中 #thought-detail-view 实际结构
#### 样式规则
- 默认隐藏（`display:none`），激活后改为 `display:flex`；
- `.thought-detail-article .thought-title`：居中对齐；
- `.thought-poem`：`white-space: pre-wrap`（保留换行），左对齐，`line-height: 2`，#555；
- `.thought-signature`：右对齐，`line-height: 2`，#555；
- `.thought-end-mark`：顶部细线分隔 + 居中显示「— END —」；
- 详情视图不展示日期信息。

### 5.4 交互逻辑（JS）
#### 数据存储
在 `navigation.js` 中维护 `thoughtData` 对象，以 `data-thought-id` 为键：
```js
const thoughtData = {
  '1': { 
    title: '文章标题', 
    poem: '完整正文内容（支持换行）', 
    signature: '落款/签名' 
  },
  // 新增文章按 ID 递增追加
};
```
#### 核心交互
1. 点击 `.thought-entry` → 读取 `data-thought-id` → 调用 `openThoughtDetail(id)` 填充模板 → 隐藏列表、显示详情；
2. 点击「← 返回列表」→ 调用 `closeThoughtDetail()` → 隐藏详情、显示列表；
3. 切换到 About/Podcast 等其他页面 → 自动执行 `closeThoughtDetail()` 回到列表。

### 5.5 新增文章步骤
1. 在 `.thoughts-list` 末尾追加 `<article class="thought-entry">`，`data-thought-id` 为当前最大值 +1；
2. 列表条目仅填写标题、正文首句+`...`、发布日期；
3. 完整内容存入 `navigation.js` 的 `thoughtData` 中；
4. 不改动布局/配色，仅更新 HTML 文字和 JS 数据。

## 六、Podcast 模块规范
### 6.1 条目格式
```html
<article class="podcast-entry">
  <img src="assets/images/podcast-cover-N.jpg" class="podcast-cover" alt="第N集封面">
  <div class="podcast-info">
    <h3 class="podcast-title">N | 播客标题</h3>
    <p class="podcast-desc">内容简介 <time class="podcast-date">YYYY-MM-DD</time></p>
  </div>
</article>
```

### 6.2 样式规则
1. 封面图：方形固定尺寸，不拉伸变形；
2. `.podcast-title`：加粗，`--color-text`，左对齐；
3. `.podcast-desc`：`--color-muted`，小字，简介末尾必须补充 `YYYY-MM-DD` 格式发布日期；
4. 条目间距：上下统一预留间距，选中条目背景色为 `--color-border`；
5. 整体布局：左对齐，封面+文字横向排列。

### 6.3 更新规则
1. 新发布单集置顶列表最上方，旧条目依次后移；
2. 保留全部历史条目，不删除；
3. RSS 文件（`rss/podcast.xml`）同步更新，符合 RSS 2.0 标准。

## 七、参考文档
- taste-skill/SKILL.md：设计方向指导
- frontend-design/SKILL.md：前端实现规范