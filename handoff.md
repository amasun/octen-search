# 🔄 Octen Search Subpage 项目交接文档 (Handoff Context)

> 本文档用于跨账号会话切换与上下文恢复。新会话启动后，请优先读取本文档了解当前架构与进度。

---

## 📌 1. 项目基础信息 (Project Overview)
- **项目路径**：`x:\XCoding\Octen\08-search subpage`
- **主要页面**：[`index.html`](file:///x:/XCoding/Octen/08-search%20subpage/index.html)
- **技术栈**：原生 HTML5 + Vanilla CSS + 原生 JavaScript（无需额外编译打包）
- **开发规范约束**：
  - **包管理器**：严格使用 `pnpm`（硬链接仓库 `X:\.pnpm-store`）
  - **字体大小规范**：所有 `font-size` **必须为偶数整数**（10px, 12px, 14px, 16px, 18px, 20px, 24px, 28px, 32px 等）
  - **浏览器交互**：免弹窗策略，禁止非用户显式要求主动调用 `browser_subagent`

---

## 📐 2. 页面区域顺序 (Section Hierarchy)
当前主页面顺序已严格调整为：
1. **Header / Navbar** (`.header-nav-exact`)
2. **Hero 区域** (`#hero`)
3. **Four APIs 滚动叙事区域** (`#endpoints`) —— *已移至 Performance 上方*
4. **Performance & Metrics 性能与数据综合大区** (`#performance` 内嵌 `#metrics`，无割裂分割线)
5. **Pricing 价格卡片** (`#pricing`)
6. **FAQ 常见问题** (`#faq`)
7. **CTA Banner** (`#cta-banner`)
8. **Footer 页脚** (`#footer`)

---

## 🚀 3. 最近完成的核心改动与决策 (Recent Completed Changes)

### ① Hero 标题断行与字号规范及副标题容器宽度
- 标题内容分为两行：
  - 第一行：`Real-time search`
  - 第二行：`API for AI agents`
- 实现：`.hero-title { font-size: clamp(36px, 5vw, 64px); white-space: normal; line-height: 1.16; }`，桌面端主字号调整为 **64px**（符合偶数字号规范），中间通过 `<br class="hero-br">` 控制断行。
- **副标题容器宽度**：`.hero-subtitle`（`One key for text, images, and video. Fresh, ranked, model-ready results from the live web.`）容器宽度统一收束为 `max-width: 440px;` 并水平居中，两行文字排版更加紧凑雅致。
- **主按钮背景磨砂玻璃模糊**：`.btn-hero-primary`（`Get your API key`）配置了 `backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);` 与 `background: rgba(10, 15, 12, 0.55);`，当 3D 球体或光晕滑过按钮背面时产生高级的磨砂透光散景效果。

### ② Metrics 数据指标卡片调整
- **单位颜色**：`ms`、`%` 不再固定绿色，跟随数字主色。
- **字距**：`letter-spacing: 0`。
- **卡片数量**：已去除 `Minutes` 指标，保留 4 个卡片（桌面端 `repeat(4, 1fr)`）。
- **QPS 文案**：语义调整为 `Scales up to 1M+ with flexible tiers`。
- **标题字号**：`.metric-bento-label` 统一调整为 `18px`（高度与行高 `26px`）。

### ③ Benchmark 面板圆角
- `.benchmark-panel` 圆角统一调整为 `border-radius: 16px;`。

### ④ Four APIs 区域重构为 Sticky Scrollytelling（参考 x.ai/grok）
- **左侧滚动内容**：
  - 4 个 API 块（Web Search、Broad Search、Image Search、Video Search），每个块设置舒适的滚动高度（`min-height: 58vh`，末尾项 `min-height: 72vh; padding-bottom: 280px;`）。
  - 激活项透明度 `opacity: 1`，未激活项淡化为 `opacity: 0.28`。
  - 支持滚轮自然滚动激活与左侧卡片点击平滑定位。
- **右侧矩形框固定与尺寸恒定 (Sticky Frame)**：
  - 固定定位：`position: sticky; top: max(80px, calc(50vh - 240px)); height: 480px;`。
  - 滚动过程中，右侧矩形框在视口中**位置与尺寸恒定不变**。
  - 精致卡片样式：`border-radius: 16px; border: 1px solid var(--border-light); background: #FFFFFF; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);`。
- **内部图形随滚动同步切换 (Dynamic Slots)**：
  - 内置 4 个插槽（`[data-slot-index="0..3"]`），通过 `opacity` + `transform` + `visibility` 实现平滑交叉淡入淡出，无重影无闪烁。
- **右侧区域当前状态**：
  - 遵循用户指令：**“右侧区域暂时为空，后续我会给出替换内容是什么”**。
  - 目前每个槽位内部保留轻量的极简画布插槽容器（`.slot-empty-canvas`），完全解耦，随时可放入用户提供的图表/动画/交互组件。

### ⑤ Performance 与 Metrics 合并为统一连续大区
- **结构合并**：将原 Section 4 (`#performance`) 与 Section 5 (`#metrics`) 合并为同一个大 section，内聚在同一个 `<div class="container">` 中。
- **无感过渡**：去除了原两个区域之间的水平分割线与背景色差，大区背景统一调整为纯白色 `#FFFFFF`。
- **视觉流**：自上而下呈现 `Section Head ➔ 16px 圆角 Benchmark Panel ➔ 56px 自然留白 ➔ 4列关键指标流 ➔ 下方 Section Border`，整体成为一个统一的纯白性能看板，不再割裂。

### ⑥ Ecosystem 区域重命名为语义化 `#retrieval-layer`
- **语义重构**：该区域展示的是 Octen 检索层套件（Extract、Embeddings、Model Gateway、Deep Research），原名称 `ecosystem` 存在歧义。
- **代码重构**：
  - HTML ID 从 `id="ecosystem"` 彻底变更为 `id="retrieval-layer"`。
  - 组件类名升级为 `.retrieval-grid`、`.retrieval-card`、`.retrieval-icon`、`.retrieval-title` 等语义类名（CSS 仍保留兼容别名）。
  - Footer 底栏全部对应锚点链接（`Extract`, `Embedding`, `VL Embedding`, `Deep Research`）同步变更为 `href="#retrieval-layer"`。

### ⑦ 卡片全面去除投影，对齐 shadcn ui 克制质感
- **阴影去除**：`.benchmark-panel`、`.sticky-frame-box`、`.pricing-bento-card`、`.retrieval-card` 等全部卡片元素统一设置为 `box-shadow: none;`。
- **去除浮动弹性**：去除 hover 时的 `transform: translateY(-2px);` 弹跳，严格保持平面结构稳定。
- **克制交互**：仅保留精致平滑的 `border-color` 细微过渡（1px 描边），使全站呈现极具专业度、克制沉稳的 shadcn ui / 极简工匠风格。

### ⑧ 定价卡片全面依据官方文档校准 (docs.octen.ai/overview/pricing.md)
- **剔除自行推导项**：移除了原卡片中推导的冗余非官方特性（如 `Design HTML Snippet`、`Dimensions & Thumbs`、`Grouped Results` 等）。
- **精准对齐官方计费规则**：
  - **Web Search**：标配 `80% Off` 徽章，价格 `$1`（划线原价 `$5`），规则行严格对齐为：`Search API Call: 1 call / request`、`Included Content: 10 free / call`、`Extra Full Content: $0.50 / 1k results`。
  - **Broad Search**：标配 `80% Off` 徽章，价格 `$1`（划线原价 `$5`），规则行标注 `1 call / sub-query` 与 `10 free / call`。
  - **Image & Video Search**：标配 `Early Access` 徽章，标准单价 `$5 / 1k calls`，输入/输出模态规格完全据实标注。
  - **底栏规则条**：原汁原味援引官方文档描述：前 10 条全量内容免费、超量按 `$0.50 / 1k` 计费、新注册账户赠送 `$5` 免费余额。

### ⑨ 参考 05-pricing QPS Plan 统一规范卡片按钮样式
- **移除内联样式**：彻底移除了 `style="width:100%;height:42px;border-radius:8px;font-size:14px;"` 等硬编码样式。
- **100% 复刻 QPS Plan 胶囊按钮标准**：
  - 高度 `40px`，内边距 `0 17px`，圆角 `border-radius: 9999px`（全圆角胶囊 Pill 形状）。
  - **自服务付费卡片（Web / Broad Search）**：采用 `.pricing-card-btn-primary`（底色 `#100F09`、文字纯白、搭配 `.btn-dark-hover` 微光泽渐变扫光效果），按钮文案统一为 **`Get started`**。
  - **受限/内测卡片（Image / Video Search）**：采用 `.pricing-card-btn-secondary`（微底色 `rgba(0,0,0,0.05)`、描边 `1px solid rgba(26,26,25,0.12)`、搭配 `.btn-light-hover` 柔光效果），按钮文案统一为 **`Request Access`**。
  - **点击微动效**：配置 `:active { transform: scale(0.97); }` 触控物理回弹反馈。

### ⑩ 定价卡片移除右上角 Hover 箭头并将 Early Access 标签锁定标题右侧单行
- **右上角箭头彻底清理**：删除了全部 4 张定价卡片右上角的 `.hover-arrow-disk` 浮动圆形箭头按钮，彻底消除卡片视觉干扰，契合 shadcn ui 的克制平面美学。
- **Early Access 标签对齐与防折行**：
  - 将 `Image Search` 与 `Video Search` 的标题结构标准化，将 `.badge-ea`（`Early Access`）直接内联置于 API 名称右侧。
  - 在 `.pricing-api-name` 中设置 `flex-wrap: nowrap; white-space: nowrap;`，并在各徽章（`.badge-ea` / `.badge-discount`）上配置 `white-space: nowrap; flex-shrink: 0;`。
  - 字号采用 `clamp(17px, 1.35vw, 20px)` 动态响应，确保在任何屏幕宽度下标题与徽章均并排于同一行，绝对不发生换行。

### ⑪ 定价区域标题简化为 Pricing，子项目明细全量移除整合至政策条
- **标题精炼**：将区域标题从 `Full content included` 修改为简洁直接的 `Pricing`，副眉标设为 `Pay As You Go`。
- **卡片子项目全面移除**：彻底移除了 4 张卡片中的 `.pricing-features-breakdown` 列表，卡片只保留核心结构（API 标题/徽章 + 简短说明 + 核心单价 + 胶囊操作按钮），极大提升卡片的干净度与视觉对齐感。
- **计费规则统一整合表达**：关于全量内容赠送（10 free / call）以及超量费用（$0.50 / 1k），统一收口并整合至卡片下方的官方政策条（`The full content of the first 10 results per search is free; additional results are $0.50 / 1k. All new accounts receive $5 in free balance upon registration.`），免除了卡片内部的重复冗余信息。
- **文档外链精准锚定**：政策条右侧的 `Full pricing docs →` 链接精准直达官方文档的具体计费锚点：`https://docs.octen.ai/overview/pricing#broad-search-and-web-search`。
- **垂直留白节奏优化**：优化了 `.pricing-bento-card` 的内边距（`padding: 28px 24px 24px; min-height: 240px;`）与价格间距（`margin: 18px 0 28px;`），使 4 张卡片更加舒展齐整。

### ⑬ 定价 4 卡片 + 1 横条全面复刻 05-pricing Plan B 双层卡片样式
- **双层嵌套结构 (Nested Outer Shell)**：
  - **外层大壳 (`.pricing-outer-shell`)**：采用极简纯粹的浅灰底色 `#F4F4F4`、**完全无外描边 (`border: none;`)**、圆角 `16px`。等距 `10px` 内边距包裹内层 4 张卡片与底部横条。
  - **移除彩色效果 (`.shell-hover-glow`)**：按用户最新要求已**彻底移除外层卡片的 Emerald ➔ Teal 彩色流光渐变背景与光晕效果**（HTML 节点移除，CSS 强制禁用），呈现极致纯净、克制的冷灰底座质感。
  - **移除顶部分类栏**：外壳上部的 `Search APIs` 标题栏及辅助描述文字已彻底移除，直接聚焦核心卡片内容。
  - **内层 4 张卡片结构优化 (`.pricing-bento-card`)**：
    - **产品图标区 (`.pricing-card-icon-wrap`)**：从导航栏（Navbar）精确提取了 4 个产品（Web Search、Broad Search、Image Search、Video Search）的专属产品 SVG 图标，置于各卡片标题（`.pricing-api-name`）正上方。配备 `40x40px` 浅灰圆角底座（`border-radius: 10px; background: #F4F4F4; color: #039855;`），并在卡片 hover 时带有微光浅绿过渡反响，大幅提升视觉识别度与卡片层次感。
    - **按钮提取至 Section 标题下方**：彻底将 `Get started` 与 `Request Access` 按钮从各个卡片中提取出来，作为统一的 CTA 按钮组并排居中放置在 Section 顶部副标题（`Transparent, usage-based pricing with no upfront commitment.`）的正下方。其中 `Get started` 为经典黑底胶囊，`Request Access` 已根据要求**重构为纯白底精美胶囊按钮**（`background: #FFFFFF; border: 1px solid rgba(26,26,25,0.16); box-shadow: 0 1px 2px rgba(16,24,40,0.05);`），黑白双主副按钮相得益彰。
    - **卡片纯粹聚焦与辅助文字精简**：按用户最新要求已**彻底移除卡片中每个产品的辅助文字介绍（`.pricing-api-desc`）**，卡片聚焦核心呈现“专属产品图标 + API 标题/徽章 + 置底价格”，内边距微调为 `padding: 22px 20px;`、高度紧凑收束至 `min-height: 160px;`，视觉极其干净清爽、横向 4 卡片高度丝毫不差。
  - **内层 1 条横条 (`.shell-policy-banner`)**：作为全宽条嵌入在外壳底部，采用**完全无边框 (`border: none;`) 与彻底透明背景 (`background: transparent; backdrop-filter: none;`)**，左侧纯净展示官方全量内容赠送与赠金规则，右侧保留精准直达的文档锚点外链，自然融入灰底底座。

### ⑭ 引入基于 Converge.AI 的 3D 球形环绕 Canvas 2D 动效至 Hero 背景
- **技术选型与架构**：
  - 彻底逆向并对齐 Converge.AI 的 `OrbitDots` 软 3D 透视投影架构，完全零外部 3D 库依赖（纯原生 Canvas 2D `getContext('2d')`），运行在 60FPS 满帧且打包极度轻量。
  - **彻底移除轨迹/路径线**：移除了原有的轨道细线描边，仅保留空中自然悬浮运动的纯色圆点粒子，纯粹空灵。
  - **当前定稿参数 (User Solidified Config - v2)**：
    - `count: 11`（粒子数量增至 11 个，分布更饱满）
    - `baseRadiusX: 435`（横向半轴收紧）
    - `baseRadiusY: 225`（纵向半轴缩至 225，落差更加紧凑舒缓）
    - `tiltX: 44°`（俯仰角 Pitch，消除过度下沉）
    - `tiltY: -17°`（偏航角 Yaw，带有更优美的向左自然偏角）
    - `tiltZ: -6°`（翻滚角 Roll，保持微妙舒适的平面侧倾）
    - `curvature: 0.58`（空间马鞍曲率 Curvature，纵深弧线更立体生动）
    - `centerYRatio: 0.39`（垂直基准线上提至 39%，与 Hero 视觉重心完美契合）
    - `perspective: 2000`（大视距长焦透视，变形更缓和高级）
    - `dotSize: 34px`（粒子体量优化为 34px，更加细腻克制）
    - `dotColor: '#409148'`（球体色彩：沉稳雅致的森林翠绿）
    - `dofStrength: 14.5px`（增强背景失焦大光圈散景）
  - **实时参数微调滑杆控制面板 (Live Sliders Control Panel)**：
    - **默认隐藏 / 双击唤出 (Default Hidden & Double-click Toggle)**：
      - 页面载入时面板默认彻底隐藏，页面保持纯粹干爽；
      - **在页面任意空白处双击（Double Click）** 即可平滑呼出/隐藏面板；
      - 面板右上角配有 `−`（折叠）和 `✕`（隐藏）按钮，并支持 `Escape` 快捷键一键关闭。
    - 页面悬浮面板（`#hero-orbit-panel`）提供 3 大分组 12 项完整滑杆：
      1. **3D 旋转姿态**：Pitch 俯仰角 (-90°~90°)、Yaw 偏航角 (-90°~90°)、Roll 翻滚角 (-90°~90°)、Curvature 鞍形曲率 (0~1.0)
      2. **空间与相机**：Radius X、Radius Y、Center Y、Perspective 焦距
      3. **粒子与视觉**：Dot Size、Count 数量、Speed 速度、DoF Blur 散景
    - 支持实时 60FPS 渲染联动，提供 **“📋 复制当前参数”** 与 **“↺ 重置默认”**。
  - **真实光学景深虚化 (Depth-of-Field Blur)**：运用原生 `ctx.filter = blur(...)`，后景球体产生大光圈失焦散景，前景球体锐利清晰，近大远小极富立体层次感。
  - **平缓宁静的慢速公转**：公转速度设定为 `speed: 0.00011`，呈现极其深邃从容的漂移节奏。
  - **性能与交互优化**：
    - **彻底去除鼠标视差效果**：已彻底移除鼠标移动触发的角度摆动与 `mousemove` 事件监听，球体保持恒定纯粹的平稳三维环绕，杜绝晃动干扰与不必要的鼠标跟踪开销。
    - 具备 `IntersectionObserver` 离开视口自动挂起 `cancelAnimationFrame`，闲置时零 CPU / GPU 损耗。
    - **彻底去除横向光栅条纹与背景网格 (Grid & Scanlines Removed)**：已彻底移除原覆盖在背景上的微细网格层（`.hero-grid-overlay`）与横向微条纹层（`.hero-orbit-scanline`），保持纯净黑底、柔和绿晕与球体的纯粹悬浮质感。

### ⑫ Products 下拉菜单重构为两栏结构（左侧菜单 + 右侧预览占位）
- **需求与结构契合**：依据用户提供的参考图，将原三列式下拉菜单重构为现代两栏式结构：
  - **左侧菜单列表 (`.nav-dropdown-menu-list`)**：
    - 垂直堆叠 5 个核心产品（`Search`、`Deep Research`、`Extract`、`Answer`、`Embeddings & Gateway`）。
    - 结构严格遵循 **主标题（16px 加粗）+ 辅助说明（12px 浅灰）**，提供充足的垂直呼吸感。
    - 悬浮/激活态采用极浅灰底（`#F4F5F6`）与平滑圆角（`10px`），保持克制精致。
  - **右侧预览展示区 (`.nav-dropdown-preview-card`)**：
    - 采用中性浅灰底座（`#EFEFEF`），圆角 `12px`。
    - 内部精准还原参考图的气泡对话占位结构（用户药丸气泡 `20px` 圆角，系统回答卡片 `16px` 圆角）。
    - 默认呈现 Web Search 综合检索占位，且当鼠标在左侧不同产品项之间 hover/focus 时，右侧卡片丝滑交叉淡入对应产品的专属占位演示（Deep Research 检索脉络、Extract 结构化 Markdown 表格、Answer 置信度生成、Embeddings 高维向量输出）。
  - **字号与规范**：所有新增文本字号严格使用偶数（12px, 14px, 16px），严禁奇数字号；媒体查询在 1024px 与 768px 提供响应式回落。

### ⑬ Hero 区域背景纯白化 (#FFFFFF) 与全要素反色
- **纯白背景定义**：`#hero` 背景彻底调整为纯白色：`background-color: #FFFFFF; background-image: none; background: #FFFFFF;`。
- **环境光晕隐藏**：保持 `.hero-glow-container` 为 `display: none;`，呈现纯净无杂质的高级白底底座。
- **全要素反色系统 (Light Theme Inversion)**：
  - **Hero 主标题 (`.hero-title`)**：反色为高品质深黑 `#101828`。
  - **Hero 副标题 (`.hero-subtitle`)**：反色为清晰次级灰 `#475467`，高亮词汇采用品牌翡翠绿 `#039855`。
  - **赠金说明 (`.hero-credit-note`)**：反色为中性浅灰 `#717680`，hover 激活时点亮为 `#039855`。
  - **主 CTA 按钮 (`.btn-hero-primary`)**：反色为经典黑底白字高级胶囊按钮（`background: #100F09; color: #FFFFFF;`，悬浮微阴影与上移）。
  - **次 CTA 按钮 (`.btn-hero-ghost`)**：反色为浅底幽灵按钮（`background: #FFFFFF; color: #1F242F; border: 1px solid #D0D5DD;`）。
  - **顶部导航栏 (`.header-nav-exact`)**：
    - 未滚动状态浮于白色 Hero 上方：Logo 自动启用深色墨黑版（`.nav-logo-light`），文字链接反色为 `#181D27`，下拉箭头反色为深灰，右侧平台按钮启用高对比度深色胶囊钮。
  - **3D 环绕球体**：沉稳的 `#409148` 翠绿球体在纯白背景与长焦景深虚化下，呈现极其通透轻盈的现代空间感。

### ⑭ "Search is where you start" 区域改为白底与全套反色 (#retrieval-layer)
- **纯白背景定义**：`#retrieval-layer` 背景由深色背景 `var(--dark-bg-alt)` 调整为纯白 `#FFFFFF`，并配置了顶底 1px 细分割线（`border-top: 1px solid var(--border-light);`）。
- **标题与说明反色**：
  - 移除了 HTML 中硬编码的 `style="color:#FFFFFF;"` 与暗色变量。
  - 主标题反色为深黑 `#0F172A`，描述说明反色为次级灰 `#475467`。
- **4 张检索产品卡片反色 (`.retrieval-card`)**：
  - 背景由暗透黑改为纯白 `#FFFFFF`，边框采用浅灰 `1px solid var(--border-light, #E2E5E0)`，圆角 `16px`。
  - Hover 态：浅灰底 `#FAFAFA`、微深边框 `#B5B5B0`。
  - 产品专属图标与跳转箭头：由荧光绿反色升级为品牌经典翡翠绿 `#039855`。
  - 标题文字反色为 `#0F172A`，描述文字反色为 `#475467`。

### ⑮ Pricing 部分卡片去掉外层灰色外壳 (#pricing)
- **外壳剥除**：彻底移除了 `.pricing-outer-shell` 的 `#F4F4F4` 灰色底色与内衬内边距（`background: transparent; padding: 0;`）。
- **独立 Bento 网格平铺**：
  - 4 张产品卡片（`.pricing-bento-card`）直接独立排布于纯白页面上，卡片圆角升级为 `16px`，间距调优为 `16px`，边框采用细腻克制的 `1px solid var(--border-light, #E2E5E0)`。
  - Hover 态仅做微细边框加深（`#B5B5B0`），无位移无冗余投影，符合现代极简工匠美学。
- **字号全偶数合规**：修复了折扣徽章与 EA 徽章字号为严格偶数 `12px`，标题 `18px`，价格 `34px`。

### ⑯ 白色区域间分割线由全屏通栏调整为内容版心区分割 (Section Dividers to Content Container)
- **背景与痛点**：此前在白色大区块（`#hero`、`#endpoints`、`#performance`、`#pricing`、`#retrieval-layer`）之间，分割线是直接施加在外层 `<section>` 标签上的 `border-top` / `border-bottom`（100vw），导致在大屏显示器上有一根横跨整个屏幕物理边缘的通栏灰线，打断了纯白画布的连续感。
- **重构策略**：
  - **移除全屏通栏边框**：彻底移除了 `#endpoints`、`#performance`、`#pricing`、`#retrieval-layer` 外层标签上的全屏 `border-top` 与 `border-bottom`。
  - **挂载至内容版心容器**：将分割线精准挂载在各区块的内容版心容器（`#endpoints > .container-wide`、`#performance > .container`、`#pricing > .container`、`#retrieval-layer > .container`）的 `border-top` 上（宽度对齐 `1312px` 版心）。
  - **上下留白对称平衡**：将原外层 section 的 `padding-top` 转移到内容容器的 `padding-top`，确保分割线严格处于上下两个模块有效内容的垂直几何中心（80px ~ 96px 平衡节奏），使大屏左右两侧的大画布自然连成一体，浑然天成。
### ⑰ 偏蓝文字颜色统一调整为纯中性灰 (Color Tone Neutralization)
- **需求**：将偏蓝调的文字色值 `rgb(100, 116, 139)`（十六进制 `#64748B`）调整为纯粹中性灰 `rgb(118, 118, 118)`（十六进制 `#767676`）。
- **落实范围**：
  - **全局变量**：[`css/variables.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/variables.css) 中将 `--text-muted` 与 `--dark-text-dim` 从 `#64748B` 调整为 `rgb(118, 118, 118)`。
  - **样式表**：[`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中竞品图例 `.legend-competitor` 及 `.faq-subtext` 回落值同步调整为 `rgb(118, 118, 118)`。
  - **SVG 矢量图表**：[`index.html`](file:///x:/XCoding/Octen/08-search%20subpage/index.html) 中性能横向坐标标签、横轴说明文本、各竞品延迟与准确率数值的 `fill` 属性全量统一为 `rgb(118, 118, 118)`。
### ⑱ Endpoints 滚动插槽区背景底色设定为暖米白 (#f9f8f6)
- **需求**：将 Four APIs 区域右侧随滚动切换的 `.sticky-graphic-slot.active` 内容区底色调整为 `#f9f8f6`。
- **落实范围**：
  - **外框与插槽**：[`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中将 `.sticky-frame-box`、`.sticky-graphic-slot` 及激活态 `.sticky-graphic-slot.active` 的背景统一设为 `#f9f8f6`。
  - **占位内衬**：将 `.slot-empty-canvas` 内部背景设为 `transparent`，使米白质感透底呈现，配合浅灰虚线框与 Emerald 徽章，形成温暖典雅的高级工匠卡片质感。

### ⑲ 冷调文字 rgb(71, 84, 103) 全量统一为纯中性灰 rgb(118, 118, 118)
- **需求**：将偏冷蓝的文字颜色 `rgb(71, 84, 103)`（十六进制 `#475467`）全量替换为纯中性灰 `rgb(118, 118, 118)`。
- **落实范围**：
  - **Hero 副标题**：[`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中 `.hero-subtitle` 文字颜色由 `#475467` 调整为 `rgb(118, 118, 118)`。
  - **API 步骤说明与特性列表**：`.api-step-desc`、`.feature-content`、`.feature-desc` 统一调整为 `rgb(118, 118, 118)`。
  - **Retrieval 产品卡片描述**：`.retrieval-desc` 与 `.ecosystem-desc` 统一调整为 `rgb(118, 118, 118)`。
  - **效果提升**：消除了次级文本中的蓝色相偏移，全页所有辅助与描述文案统一呈现极简自然的中性暖灰质感。

### ⑳ Endpoints 滚动插槽区仅保留大标题并移除虚线子框 (Minimal Title Canvas)
- **需求**：右侧随滚动切换的 `.sticky-graphic-slot.active` 内容区去掉虚线子框，只保留标题。
- **落实范围**：
  - **HTML 结构精简**：[`index.html`](file:///x:/XCoding/Octen/08-search%20subpage/index.html) 中彻底移除了各插槽的 `.slot-empty-canvas` 虚线框、`.slot-placeholder-badge` 接口徽章以及 `.slot-placeholder-hint` 提示文案，每个插槽内部仅保留纯粹的核心标题（`Web Search`、`Broad Search`、`Image Search`、`Video Search`）。
  - **视觉美化**：[`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中标题采用 Fraunces 衬线字体、`clamp(22px, 2.2vw, 28px)` 适中字号与墨黑 `#0F172A`，居中静止呈现于 `#f9f8f6` 米白大卡片中央，视觉通透从容，毫无冗余元素干扰。

### ㉑ 模块标签 "Four APIs" 升级为 "Search APIs" (Eyebrow Label Update)
- **需求**：将 `#endpoints` 区域的顶部胶囊标签从 `Four APIs` 调整为 `Search APIs`。
- **落实**：[`index.html`](file:///x:/XCoding/Octen/08-search%20subpage/index.html) 中将 `<span class="section-eyebrow">Four APIs</span>` 更新为 `<span class="section-eyebrow">Search APIs</span>`，产品语义更加聚焦清晰。

### ㉒ 模块主副标题全套升级 (Section Head Modernization)
- **需求**：将原列举式的 `Search text, images, and video` 升级为更具全模态 AI 基座格局的主标题，并将辅助文案更新为更具数据画面感的表达（选项 B1）。
- **落实**：[`index.html`](file:///x:/XCoding/Octen/08-search%20subpage/index.html) 中：
  - **主标题**：`<h2 class="section-title serif">One search engine for every modality</h2>`
  - **辅助描述**：`<p class="section-desc">Ranked passages, visual assets, and video timestamps on a single key.</p>`
### ㉓ 全局移除各部分上方的胶囊标签 (Eyebrow Capsule Removal)
- **需求**：去掉各区块标题上方的胶囊药丸标签，使版面更为纯粹洗练。
- **落实**：[`index.html`](file:///x:/XCoding/Octen/08-search%20subpage/index.html) 中全量移除了 4 个主要模块的 `.section-eyebrow` 元素：
  - 移除 `#endpoints` 上的 `<span class="section-eyebrow">Search APIs</span>`
  - 移除 `#performance` 上的 `<span class="section-eyebrow">Performance</span>`
  - 移除 `#pricing` 上的 `<span class="section-eyebrow">Pay As You Go</span>`
  - 移除 `#retrieval-layer` 上的 `<span class="section-eyebrow">Part of the retrieval layer</span>`
- **效果提升**：消除了多余的标签层级堆叠，主标题直接占据视觉重心，留白更为通透从容，契合现代大厂极致极简风格。

### ㉔ 价格模块标题由 "Pricing" 更新为 "Pay-as-you-go" (Pricing Title Update)
- **需求**：将 `#pricing` 模块的主标题由单一词汇 `Pricing` 调整为 `Pay-as-you-go`。
- **落实**：[`index.html`](file:///x:/XCoding/Octen/08-search%20subpage/index.html) 中将 `<h2 class="section-title serif">Pricing</h2>` 更新为 `<h2 class="section-title serif">Pay-as-you-go</h2>`，直观突出按量计费、灵活无门槛的产品商业模式。

### ㉕ 性能模块标题与副文本升级 (Performance Head Restructuring)
- **需求**：性能模块标题改为 `Production-grade performance`（推荐 3），原标题 `Highest accuracy at the lowest latency` 降级为副文本。
- **落实**：[`index.html`](file:///x:/XCoding/Octen/08-search%20subpage/index.html) 中：
  - **主标题**：`<h2 class="section-title serif">Production-grade performance</h2>`
  - **副文本**：`<p class="section-desc">Highest accuracy at the lowest latency.</p>`
### ㉖ Pricing 图标剥除并前置至 Four APIs 步骤标题 (Icon Relocation to API Steps)
- **需求**：Pricing 卡片中去掉标题上面的图标，将图标放到 Four APIs 区域的步骤标题前面。
- **落实**：
  - **Pricing 卡片精简化**：
    - [`index.html`](file:///x:/XCoding/Octen/08-search%20subpage/index.html) 中从 4 张 `.pricing-bento-card` 中彻底移除了 `.pricing-card-icon-wrap`，卡片内仅保留顶部的 API 标题/徽章与底部的计费价格，卡片结构高度凝练。
    - [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 将 `.pricing-bento-card` 最小高度调优为 `136px`（偶数规范），排版舒展紧凑，呼吸感更加高级。
  - **Four APIs 步骤标题图标前置**：
    - [`index.html`](file:///x:/XCoding/Octen/08-search%20subpage/index.html) 在 `#endpoints` 区域的 4 个步骤大标题（`Web Search`、`Broad Search`、`Image Search`、`Video Search`）前分别注入专属的 SVG 图标微容器 `<span class="api-step-title-icon" aria-hidden="true">`。
### ㉗ 移除 Four APIs 标题上方 POST 标签 (Method Badge Removal)
- **需求**：将 `POST /search` 这类标签去掉。
- **落实**：
  - [`index.html`](file:///x:/XCoding/Octen/08-search%20subpage/index.html) 中彻底移除了 4 个步骤上方的 `POST /search`、`POST /broad-search`、`POST /image-search`、`POST /video-search` 标签容器（`.api-step-badge-row`）。
  - 对含有 `Early Access` 状态的 Image Search 与 Video Search，将 `<span class="badge-ea">Early Access</span>` 移入 `<h3>` 标题内部并紧跟在文本后方，与标题处于同一水平线（垂直居中对齐），既保持了状态识别，又消除了大标题上方的零碎堆叠感。
  - [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中清理了废弃的 `.api-step-badge-row` 和 `.api-endpoint-badge` 规则。
### ㉘ FAQ 标题字号调整为 42px 并改为顶对齐 (FAQ Top Alignment & Font Size)
- **需求**：`Common questions` 改为 42px，上下对齐方式改为顶对齐。
- **落实**：
  - [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中：
    - 将 `.faq-split-layout` 的垂直对齐由原先的 `align-items: center` 调整为 `align-items: start`。
    - 将 `.faq-split-left` 由 `justify-content: center; align-self: center` 调整为 `justify-content: flex-start; align-self: start`。
### ㉙ FAQ 标题单行展示调优 (FAQ Headline Single Line)
- **需求**：`Common questions` 改为一行显示。
- **落实**：
  - [`index.html`](file:///x:/XCoding/Octen/08-search%20subpage/index.html) 中将 `<h2 class="faq-headline serif">Common<br>questions</h2>` 移除 `<br>` 标签，改为 `<h2 class="faq-headline serif">Common questions</h2>`。
  - [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中：
    - 为 `.faq-headline` 添加 `white-space: nowrap;`，避免大屏下被容器挤压换行。
    - 将左侧列宽容器 `.faq-split-left` 宽度提升至 `440px`，并将网格第一列设置为 `minmax(360px, 440px)`，为 42px 标题单行呈现提供充足平展空间。
### ㉚ 检索矩阵模块标题升级为方案 1 (Retrieval Stack Title Modernization)
- **需求**：检索模块标题由原口语化、步骤感的 `Search is where you start` 升级为更具基础设施格局的方案 1。
- **落实**：
  - [`index.html`](file:///x:/XCoding/Octen/08-search%20subpage/index.html) 中将 `<h2 class="section-title serif">Search is where you start</h2>` 更新为：
    `<h2 class="section-title serif">Beyond search: the full retrieval stack</h2>`。
  - **副文本保持严密对应**：`The same key extracts pages, embeds them, and reasons over them.`，精准对应下方 4 张产品卡片（Extract、Embeddings、Model Gateway、Deep Research）。
  - **业务价值提升**：确立了 Octen 作为“AI Agent 全栈检索层（Retrieval Stack）”的企业级基座定位，消除了原先“把矩阵误当成操作步骤”的认知偏差。

### ㉛ 检索层 4 张卡片图标提取自官方导航规范 (Retrieval Icons Sync with Official Nav)
- **需求**：检索层 4 个产品（`Extract`、`Embeddings`、`Model Gateway`、`Deep Research`）使用官方现成图标，从系统导航中提取替换。
- **落实**：
  - **源文件溯源提取**：
    - **`Extract`**：从控制台导航 `03-console/octen-console/js/core/sidebar.js` Line 83 提取官方专属提取矩阵网格图标（20×20 矩阵点阵连接网格）。
    - **`Embeddings`**：从官方定价中台 `05-pricing/src/components/ApiExplorer.tsx` Line 36（Figma Node 13418:141867）提取官方多维 6 节点星座星系拓扑图标。
    - **`Model Gateway`**：从控制台导航 `sidebar.js` Line 88 提取官方多模型立方透视网关与路由徽标。
    - **`Deep Research`**：从控制台导航 `sidebar.js` Line 112 提取官方深度科研微观探针与多步推理工作台专属图标。
  - **样式与尺寸统一规范**：
    - 4 个图标全量置入 `.retrieval-icon` 容器中，设定标准尺寸 `width="22" height="22"`。
    - `fill` 与 `stroke` 统一绑定 `currentColor`，完美继承 Octen 经典翡翠绿 `#039855`。
    - 与此前注入 Four APIs 的 4 个官方图标（Web/Broad/Image/Video）达成全站 100% 视觉符号体系闭环统一。

### ㉜ 核心指标卡片文案优化 (Performance Metric Descriptions Update)
- **需求**：更新性能概览（`#metrics`）前两张核心指标卡片的副文本描述。
- **落实**：
  - [`index.html`](file:///x:/XCoding/Octen/08-search%20subpage/index.html)：
    - **卡片 1 (P50 latency)**：由 `Global edge cluster retrieval` 调整为 `The fastest web search API in the world`。
    - **卡片 2 (SimpleQA accuracy)**：由 `Strict factuality on public benchmark` 调整为 `Top results on public benchmark`。
  - **表达效果**：直击全球顶尖速度与权威跑分领先事实，强化了针对 Agent 开发者最具说服力的第一心智标语。

### ㉝ 彻底移除检索层生态卡片模块 (Removal of #retrieval-layer)
- **需求**：删除原 4 张生态产品卡片模块（`#retrieval-layer`）。
- **决策与落实**：
  - **模块完全移除**：在 [`index.html`](file:///x:/XCoding/Octen/08-search%20subpage/index.html) 中彻底删除了 `<section id="retrieval-layer">` 及其内嵌的 4 张卡片（Extract、Embeddings、Model Gateway、Deep Research）。
  - **样式清理**：在 [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中彻底移除了 `#retrieval-layer`、`#ecosystem`、`.retrieval-grid`、`.retrieval-card`、`.retrieval-icon` 等对应死代码，保持代码库极致精简。
  - **页脚外链对齐**：更新底栏中 Extract、Embedding、VL Embedding、Deep Research 的锚点为官方各独立平台外部链接（`https://octen.ai/...`），避免无效的本地 hash 锚点跳转。
  - **转化动线闭环**：页面链路直接从 **Pricing (价格与注册)** 顺滑过渡到 **FAQ (解答顾虑)** ➔ **CTA (注册转化)**，彻底消除了流程感与注意力分散，Search 专项爆品转化心智达到最高纯度。

### ㉞ Pricing 卡片升级为“顶部图标 + 下方标题”纵向布局 (Pricing Cards Icon-Top Layout)
- **需求**：将此前模块卡片的布局方式（顶部独立图标 + 下方标题与徽章）应用到 `#pricing` 卡片中。
- **落实**：
  - **HTML 结构重构**：
    - 在 [`index.html`](file:///x:/XCoding/Octen/08-search%20subpage/index.html) 的 4 张 `.pricing-bento-card` 内增加 `.pricing-card-top` 容器。
    - 卡片顶部独立注入官方标准 22×22px SVG 图标：
      - **Web Search**：全球检索罗盘网格图标 (`stroke="currentColor"`)
      - **Broad Search**：空间发散与多重子查询拓扑图标 (`stroke="currentColor"`)
      - **Image Search**：相机视觉与透镜矢量图标 (`fill="currentColor"`)
      - **Video Search**：胶片播放与微观关键帧矢量图标 (`fill="currentColor"`)
    - 标题与折扣/EA徽章（`.pricing-card-header`）紧跟在图标正下方，底部保留 `.pricing-price-wrap` 沉底计费金额。
  - **样式与呼吸感调优**：
    - 在 [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中，`.pricing-bento-card` 采用 `display: flex; flex-direction: column; justify-content: space-between;`，内边距规范为 `24px`，最小高度调优为 `172px`（严格偶数规范）。
    - 增加 `.pricing-card-icon` 容器：统一色彩为 Octen 经典翡翠绿 `#039855`，下外边距设定为 `16px`，图标尺寸锁定为 `22×22px`。
  - **视觉提升**：形成“上方专属图标识别 ➔ 中部产品名称与优惠 ➔ 底部纯净计费数字”的层次清晰的上下两段式锚定，质感与专业度大幅跃升。

### ㉟ 性能基准图表标题更新为 "Latency & Accuracy" (Benchmark Chart Title Update)
- **需求**：将性能对比图表面板的主标题由 `Retrieval Latency vs. Factual Accuracy` 调整为 `Latency & Accuracy`。
- **落实**：[`index.html`](file:///x:/XCoding/Octen/08-search%20subpage/index.html) 中将 `<span class="benchmark-chart-title">Retrieval Latency vs. Factual Accuracy</span>` 更新为 `<span class="benchmark-chart-title">Latency &amp; Accuracy</span>`。
- **视觉提升**：与紧凑洗练的极简设计风格更加契合，表意更为直接明了。

### ㊱ 移除性能基准面板顶部的图例 (Benchmark Legend Removal)
- **需求**：去掉性能对比图表面板顶部的图例（Octen (Leader) / Competitors）。
- **落实**：
  - 在 [`index.html`](file:///x:/XCoding/Octen/08-search%20subpage/index.html) 中彻底移除 `.benchmark-legend` 节点。
  - 在 [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中清理相关废弃样式。
- **视觉提升**：头部仅保留主副标题，消除了与下方 SVG 图表内部标签重叠的冗余图例，版面更加纯净干练。

### ㊲ 性能基准图表面板锁定 1:1 原生像素渲染 (Benchmark Chart 1:1 Pixel Scale)
- **需求**：保持 1:1 真实字号渲染，消除宽屏下拉伸导致的文本偏大现象。
- **落实**：
  - 在 [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中：
    - `.benchmark-panel` 增加 `max-width: 884px; margin: 0 auto; box-sizing: border-box;`。
    - 扣除两端 `32px` 内边距后，内部内容区精准锁定为基准宽 `820px`（与 SVG `viewBox="0 0 820 336"` 形成 1.000 绝对 1:1 映射）。
    - `.benchmark-svg-wrap` 限制 `max-width: 820px; margin: 0 auto;`。
- **视觉提升**：图表内 `LATENCY · BAR RUNS P50 → P90` 与各刻度数字严格呈现为设计的真实 12px / 10px 物理大小，居中呈现，紧凑工整，移动端自适应平滑降级。

### ㊳ 性能基准图表面板重构为 DOM + SVG 混合架构 (DOM + SVG Hybrid Architecture)
- **需求**：使用 DOM + SVG 混合架构重构性能对比图表；卡片占满容器宽度；内部文字以 14px 为基准。
- **落实**：
  - **全宽卡片容器**：移除了 `.benchmark-panel` 的 `max-width: 884px` 限制，恢复为 `width: 100%; max-width: 100%;`，平铺撑满版心，与下方 `#metrics` 的 4 张指标卡片达成网格对齐。
  - **SVG 矢量几何底层**：
    - 使用 `<svg class="benchmark-svg-layer" viewBox="0 0 1000 320" preserveAspectRatio="none">` 仅负责坐标网格虚线与 P50→P90 误差横线。
    - 全量应用 `vector-effect="non-scaling-stroke"`，无论图表宽度如何自适应拉伸，网格线与误差线永远保持 1px / 2px 极细发丝级矢量品质。
  - **DOM 绝对锚定文本与交互层**：
    - Y 轴刻度（94%、86%、78%、70%）与 X 轴刻度（0、100ms...500ms）全部剥离为独立 DOM `<span>` 元素，通过百分比与 SVG 坐标体系保持数学绝对对齐。
    - 4 个数据节点（Octen、Tavily、Parallel、Exa）采用百分比坐标绝对定位（`left: %; top: %; transform: translate(-50%, -50%)`），数据点为真实物理正圆（避免拉伸变形），Octen 配备专属脉冲呼吸光环与高对比翡翠绿标题，竞品数据标签上下错落排布杜绝重叠。
  - **14px 基础字号规范**：
    - 副标题、轴标题（`SIMPLEQA ACCURACY` / `LATENCY · BAR RUNS P50 → P90`）、坐标刻度（`14px JetBrains Mono`）、竞品名称与指标统一以 14px 为设计基准，享受浏览器原生 subpixel 级高品质抗锯齿渲染。
  - **响应式支持**：
    - 移动端（`max-width: 768px`）适配内边距、高度与字号自适应缩放。

### ㊹ Exa Instant 标签标题与数值调整为左对齐 (Exa Instant Tag Left Alignment)
- **需求**：Exa Instant 节点上方标签（`Exa Instant` 与 `372–507ms · 89.2%`）标题和数字改为左对齐。
- **落实**：[`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中对 `.node-competitor.node-exa .node-content-tag.tag-above` 配置 `align-items: flex-start; text-align: left;`，使标题与下方的数值指标首字严格纵向左对齐。

### ㊵ 图表文字规范全面统一：左对齐且自数据点起点开始 (Unified Left-Aligned Tag Standards from Origin)
- **需求**：文字统一标准，对齐方式统一为从起点开始。
- **落实**：
  - 在 [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中对全部竞品标签（`.node-competitor .node-content-tag`）建立统一的排版规则：
    - **字号全量统一**：标题 `.node-title` 与指标 `.node-metric` 统一为 `14px` 规范（`line-height: 1.3`），消除了此前 13px / 14px 的细微差异。
    - **文字统一左对齐**：全量启用 `align-items: flex-start; text-align: left;`，标题与数值首字严格纵向对齐。
    - **位置从起点对齐**：`.tag-above` 与 `.tag-below` 统一配置 `left: -6px; transform: none;`，使标签文本严格对齐数据节点（P50 起点）的左侧物理切线，并随误差线（P50 → P90）从起点向右自然延伸，全图 4 个节点排版节奏完全统一。

### ㊶ Octen 节点文字规范与竞品完全对齐并保留品牌绿 (Octen Node Typography Parity)
- **需求**：Octen 的文字规范和其他节点保持一致，颜色保持绿色。
- **落实**：
  - **HTML 结构精简**：[`index.html`](file:///x:/XCoding/Octen/08-search%20subpage/index.html) 中移除 `<span class="node-title serif">Octen</span>` 的 `serif` 样式类，改用全站统一的 Sans 字体。
  - **CSS 规范对齐**：[`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中：
    - 标题 `.node-octen .node-title`：统一为 `font-family: var(--font-sans); font-size: 14px; font-weight: 600; line-height: 1.3;`，字号从 22px 衬线调整为标准的 14px 无衬线。
    - 指标 `.node-octen .node-metric`：统一为 `14px` 等宽规范与 `line-height: 1.3`。
    - 色彩保持：文字与数据严格保持 Octen 专属品牌翠绿 `var(--primary-green, #039855)`。
    - 移动端响应式：在 `@media (max-width: 768px)` 下与竞品统一自适应缩放至 12px。
  - **视觉提升**：4 个节点的字体、字号、行高与排版结构完全一致，Octen 通过专属绿色高亮与点阵脉冲光环自然凸显，整体画面浑然一体。

### ㊷ 纵轴百分比优化为整十整数刻度 60% – 100% (Y-Axis Clean 10% Integer Scale)
- **需求**：纵轴百分比以整数为单位，并选取合适的数值范围。
- **落实**：
  - **刻度整数规范化**：告别此前生硬的 `+8%`（`70%、78%、86%、94%`）非标准刻度，优化为数据可视化工业标准的 **`60% ~ 100%`（以整 10% 为步长递进）**。
  - **刻度标签更新**：Y 轴刻度设为 `100%、90%、80%、70%、60%`，100% 作为准确率自然上限，60% 作为坚实基准线。
  - **坐标与数据点重算**：
    - SVG 网格线与基线严格对应 60%、70%、80%、90%、100%。
    - Tavily（69.9%）精准锚定于 70% 虚线上方，不再压到底部实线轴；
    - Parallel Turbo（88.6%）与 Exa Instant（89.2%）自然分布于 90% 刻度下方；
    - Octen（95.2%）居于 90%~100% 黄金展示区间，数据密度和空间节奏更舒适。

### ㊸ 横坐标增加刻度线并使 ms 刻度文字紧贴坐标轴 (X-Axis Ticks Added & Tight Baseline Spacing)
- **需求**：为横坐标增加刻度线，ms 文字贴近坐标轴。
- **落实**：
  - **增加下向刻度标尺**：在底部基准实线（`y = 280`）处为 6 个刻度位置（0、100ms、200ms、300ms、400ms、500ms）增加了 6px 长度的物理刻度线段（`y1="280" y2="286"`，线宽 1.5px，`vector-effect="non-scaling-stroke"`）。
  - **消除冗余空隙**：将画布主容器 `.benchmark-chart-main` 高度从 320px 精确收拢至 `288px`（刚好包裹住刻度线底端），彻底消除了原底部的 40px 空白；并将 `.benchmark-x-axis` 的 `margin-top` 收紧至 `6px`。
  - **ms 文字紧密依附**：0、100ms...500ms 等文字严密居中依附于各刻度线下方（间隙仅 6px），视觉连贯紧凑。
  - **坐标百分比同步校准**：同步重新对齐了 288px 坐标空间下各 Y 刻度（100%、90%、80%、70%、60%）与散点位置的百分比，保持数学与视觉精度。

### ㊹ 纵坐标轴上限严格锁定在 100% (Y-Axis Strict 100% Ceiling)
- **需求**：纵坐标 100% 是最大值，纵轴不应该超过 100% 高度。
- **落实**：
  - **纵轴线段精准闭合**：移除此前在 100% 虚线上方向上突出的 20px 延伸线段，纵轴竖线（`<line>`）的 `y1` 直接与 100% 刻度水平虚线完全重合于 `y1 = 2`，向下连接至 60% 基线 `y2 = 242`。100% 成为纵轴的绝对几何顶点，纵轴绝不超出 100% 刻度。
  - **画布高度精简至 250px**：将 SVG 视口更新为 `viewBox="0 0 1000 250"`，主容器 `.benchmark-chart-main` 高度调整为 `250px`（移动端为 `230px`），整体比例更加舒展。
  - **刻度与数据点精密重映射**：
    - Y 轴刻度百分比：`100%` (0.8%)、`90%` (24.8%)、`80%` (48.8%)、`70%` (72.8%)、`60%` (96.8%)。
    - 各品牌数据节点与误差线（Octen 95.2%、Exa 89.2%、Parallel 88.6%、Tavily 69.9%）重新经过精确线性映射，保证坐标视觉与实际指标完全一致。

### ㊺ 图表横纵坐标文本 DOM 纯粹化与可选中性确认 (Axis Text Full DOM Confirmation & Selectability)
- **需求**：横纵坐标的文字在 SVG 中？挪到 DOM 中实现。
- **排查与落实**：
  - **全量文本结构确认**：整个基准图表内的**所有文字均已 100% 在 DOM 中实现**，SVG 图层内为纯矢量线条（`<line>`），不存在任何 `<text>` 标签：
    - 纵坐标标题：`<div class="benchmark-axis-title y-title">SIMPLEQA ACCURACY</div>`（原生 DOM 元素）
    - 纵坐标刻度：`<div class="benchmark-y-axis"><span class="y-tick">100%</span>...</div>`（原生 DOM 元素）
    - 横坐标刻度：`<div class="benchmark-x-axis"><span class="x-tick">0</span><span class="x-tick">100ms</span>...</div>`（原生 DOM 元素）
    - 横坐标标题：`<div class="benchmark-axis-title x-title">LATENCY · BAR RUNS P50 → P90</div>`（原生 DOM 元素）
  - **消除“像在 SVG 中”的视觉错觉**：
    - 此前样式对坐标标题及刻度设置了 `user-select: none;`，导致鼠标无法划选复制，给用户带来“这是否是一整张 SVG/图片”的误解。
    - 已在 [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中全面移除 `user-select: none;`，现在文本支持标准鼠标划词、高亮与复制。
    - 在 [`index.html`](file:///x:/XCoding/Octen/08-search%20subpage/index.html) 中移除了 `aria-hidden="true"` 属性，使坐标结构完全符合语义化无障碍标准。

### ㊻ Octen 节点尺寸与竞品统一（12px）并移除涟漪动画 (Octen Node Unified 12px Size & Ripple Removed)
- **需求**：octen 的点和其他产品一样大，去掉涟漪。
- **落实**：
  - **点尺寸与层级规范统一**：将 `.node-octen .node-dot-octen` 的尺寸从 16px 精确调整为与所有竞品一致的 **`12px × 12px`**，并同步将光晕投影收敛为 `0 0 0 2px #FFFFFF, 0 1px 4px rgba(3, 152, 85, 0.3)`，保持统一的精致工业质感。
  - **彻底移除涟漪动效**：在 [`index.html`](file:///x:/XCoding/Octen/08-search%20subpage/index.html) 中移除了 `<div class="node-halo-pulse">` 元素，并在 [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中清理了相关脉冲扩散关键帧 `@keyframes octenPulse`，画面恢复专业、沉稳的基准图表呈现。

### ㊼ 横坐标轴标题取消加粗并指定标准色值 (Axis Title Regular Weight & Explicit RGB Color)
- **需求**：LATENCY · BAR RUNS P50 → P90 不加粗，rgb(118, 118, 118)。
- **落实**：
  - 在 [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中将 `.benchmark-axis-title` 及 `.benchmark-axis-title.x-title` 的字重从 `600` 改为标准常规体 **`400`**（不加粗）。
  - 颜色显式指定为 **`rgb(118, 118, 118)`**，视觉轻盈、专业沉稳，不再产生厚重感。

### ㊽ 横坐标轴标题居中对齐 (X-Axis Title Center Aligned)
- **需求**：LATENCY · BAR RUNS P50 → P90 放到中间。
- **落实**：
  - 在 [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中将 `.benchmark-axis-title.x-title` 的文本对齐方式从 `text-align: left;` 调整为 **`text-align: center;`**。
  - 由于 `.benchmark-x-axis-wrap` 已精确匹配图表画布物理宽度，标题文字自然水平居中坐落在横坐标刻度与整张图表下方中央。

### ㊾ 纵坐标轴线取消加粗统一为 1px (Y-Axis Line Stroke-Width 1px Regular)
- **需求**：纵轴线不加粗。
- **落实**：
  - 在 [`index.html`](file:///x:/XCoding/Octen/08-search%20subpage/index.html) 中将左侧纵轴线（`<line>`）的线宽由 `stroke-width="1.5"` 调整为标准 **`stroke-width="1"`**。
  - 纵轴竖线与底部水平基准线（60% 基线）以及各刻度线粗细完全一致（均为 1px），视觉平衡匀称，不再突兀加粗。

### ㊿ 图表整体高度从 358px 调整至 500px (Chart Overall Height Adjusted to 500px)
- **需求**：charts整体高度从 358px 调整到 500px。
- **落实**：
  - 在 [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中对图表整体舞台容器 `.benchmark-hybrid-stage` 设置 **`height: 500px; display: flex; flex-direction: column;`**，确保整体几何高度精确锁定为 500px。
  - 将核心画布区 `.benchmark-chart-main` 配置为 **`flex: 1; min-height: 0;`**，高度自适应扩展至约 398px，图表内 4 个散点与误差线获得更充裕的纵向呼吸感与数据区分度。
  - 纵轴刻度与所有 DOM 散点、误差棒均为高精度百分比映射，随着画布纵向扩展，所有线条与数据标签保持 100% 严密对齐。
  - 移动端响应式同步适配为 `height: 380px;`。

### (51) 误差棒竖短线缩短 50% 与横纵坐标轴颜色全量统一 (Error Bar End Caps Shortened & Axes Color Unified)
- **需求**：BAR 的竖短线缩短。横纵轴的颜色保持一致。
- **落实**：
  - **误差棒（Error Bar）竖短线缩短 50%**：
    - 此前各厂商 P90 误差棒端部的竖短线（Cap）高度为 12 坐标单位，随画布高度扩展后视觉略显偏长。
    - 在 [`index.html`](file:///x:/XCoding/Octen/08-search%20subpage/index.html) 中将 4 个节点（Octen、Tavily、Parallel、Exa）的竖短线高度精确缩短 50% 至 **6 坐标单位（±3px）**，视觉精致克制，符合专业数据可视化规范。
  - **横纵坐标轴颜色与粗细完全一致**：
    - 此前底部水平基准线（60% 线）跟随网格虚线组继承了浅灰 `#E7E7E3`，而左侧纵轴竖线及 X 刻度标尺为 `#BCBCBC`，存在色差。
    - 将底部实线横轴显式统一配置为 **`stroke="#BCBCBC" stroke-width="1"`**，与左侧纵轴竖线（`#BCBCBC` 1px）及下向刻度标尺（`#BCBCBC` 1px）形成无缝连接的统一 L 型坐标轴体系，背景网格线维持 `#E7E7E3` 浅灰虚线，主次分明。

### (52) 图表副标题右浮动对齐 (Chart Subtitle Right-Aligned to Header)
- **需求**：Fast-tier Search APIs · Lower latency and higher accuracy is better 挪到右侧。
- **落实**：
  - **结构扁平化**：在 [`index.html`](file:///x:/XCoding/Octen/08-search%20subpage/index.html) 中解开此前包裹主副标题的 `.benchmark-title-group`，使 `.benchmark-chart-title`（Latency & Accuracy）与 `.benchmark-chart-subtitle` 直接作为顶栏 `.benchmark-panel-header` 的直接子级。
  - **两端对齐与基线对齐**：在 [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中对顶栏配置 `display: flex; justify-content: space-between; align-items: baseline;`，标题自然置于左侧，副说明文字（`Fast-tier Search APIs · Lower latency and higher accuracy is better`）整齐对齐到卡片右侧边缘（`text-align: right;`）。
  - **移动端自适应**：在 `@media (max-width: 768px)` 下自动转为纵向堆叠并左对齐，防止小屏空间受限产生挤压换行。

### (53) Octen 标签移至 Bar 下方并为全部厂商节点接入官方矢量 Logo (Octen Tag Repositioned Below Bar & Vector Logos Added)
- **需求**：
  1. 将 Octen 数据标签（`Octen` / `62–68ms · 95.2%`）挪动到 bar（误差棒）下方。
  2. 为基准图表中的 4 个产品分别增加品牌 Logo（提供 Exa 矢量 SVG 与 Parallel、Tavily 的 Figma 节点链接）。
- **落实**：
  - **4 大厂商官方矢量 Logo 全量集成**：
    - **Octen**：提取本站原生晶圆拓扑芯片 Mark 矢量 SVG（品牌 Emerald 翠绿 `#039855`）。
    - **Tavily Ultra-Fast**：通过 `Figma Dev Mode MCP`（节点 `4700:166992`）精准抓取 Tavily 官方圆角方块多向箭头徽标 SVG（`#3C3A39`）。
    - **Parallel Turbo**：通过 `Figma Dev Mode MCP`（节点 `4701:168740`）抓取 Parallel 官方切片球形矢量 SVG（`#1D1C1A`）。
    - **Exa Instant**：采用用户提供的官方几何交叉折纸 "X" 纯矢量 SVG（品牌皇室蓝 `#1F40ED`）。
  - **样式与排版规范**：
    - 在 [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中定义 `.node-title-row { display: inline-flex; align-items: center; gap: 6px; }` 与 `.node-logo { width: 16px; height: 16px; flex-shrink: 0; }`，与产品标题像素级垂直居中对齐，响应式下自适应缩小至 14px。
  - **Octen 标签下移至 Bar 正下方**：
    - 在 [`index.html`](file:///x:/XCoding/Octen/08-search%20subpage/index.html) 中将 Octen 节点的标签类由原本的靠右改为 `.tag-below`。
    - 针对 `.node-content-tag.tag-below` 配置 `top: calc(100% + 8px); left: -6px; transform: none;`，使 Octen 标签稳妥居于 62–68ms 误差线（Bar）正下方，完美释放顶部与右侧空间，与其他节点视觉层次清晰错落。

### (54) 布局调整：数值统计在上，Charts 图表在下 (Layout Adjusted: Numerical Metrics Above Charts)
- **需求**：改为：数值统计在上，Charts 图表在下。
- **落实**：
  - **DOM 结构重排**：在 [`index.html`](file:///x:/XCoding/Octen/08-search%20subpage/index.html) 中将 4 栏数值统计概览容器 `#metrics.metrics-overview-unified` 移至 `.benchmark-panel` 图表卡片正上方。
  - **垂直节奏与间距优化**：在 [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中将 `.metrics-overview-unified` 的 `margin-top: 56px` 调整为 `margin-top: 0; margin-bottom: 56px;`。
  - **视觉层次流畅自然**：用户从大区标题（Production-grade performance）视线自上而下顺畅先扫过 Octen 核心 4 大指标数据（P50 62ms、95.2% 准确率、99.9% SLA、1M+ QPS），随后在下方整幅图表卡片中深入查看与其他竞品的基准对照，形成由浅入深、极富说服力的排版流。

### (55) 图表卡片背景色调整为 #F9F9F9 (Chart Panel Background Updated to #F9F9F9)
- **需求**：charts 背景 #f9f9f9。
- **落实**：
  - **卡片底色**：在 [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中将 `.benchmark-panel` 的背景色由 `#FFFFFF` 调整为 **`#F9F9F9`**。
  - **数据散点裁切环对齐**：同步将 `.node-dot-octen` 与 `.node-dot-competitor` 的外圈遮罩裁切光晕（`box-shadow: 0 0 0 2px ...`）更新为 `#F9F9F9`，杜绝散点与背景之间的生硬白边，与误差棒及网格参考线完美融合。
  - **视觉层次增强**：图表卡片在纯白（#FFFFFF）大背景与纯白数值统计卡片下方形成柔和的微灰凹凸层次与包裹感，更具现代高端仪表盘质感。

### (56) 取消滚动数字选中文字时的上下渐隐遮罩效果 (Removed Gradient Fade Mask on NumberFlow Selection)
- **需求**：使用了滚动效果的数字，选择文字时候的sections区域上下有渐隐效果，是否能取消。
- **落实**：
  - **原因定位**：`NumberFlow` 组件在 Shadow DOM 的 `.number` 容器上默认挂载了 `-webkit-mask-image` 渐变遮罩（上下分别有 `0.25em` 的 linear-gradient 透明羽化过渡）。当鼠标拖拽选中数字文字时，浏览器的选中高亮块（Selection Highlight）穿透遮罩层渲染，导致选区顶部与底部产生明显的半透明渐隐与边缘断层。
  - **样式层解绑**：
    - 在 [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中对 `number-flow` 配置 `--number-flow-mask-height: 0px; --number-flow-mask-width: 0px;`。
    - 针对组件 Shadow Part 声明 `number-flow::part(number) { -webkit-mask: none !important; -webkit-mask-image: none !important; mask: none !important; mask-image: none !important; overflow: hidden; }`，彻底注销遮罩层，保留硬裁切边界。
  - **引擎底层重构**：
    - 在 [`js/number-flow.min.js`](file:///x:/XCoding/Octen/08-search%20subpage/js/number-flow.min.js) 中将默认遮罩尺寸基准修改为 `0px`，并将容器层 `-webkit-mask-image` 系列声明替换为标准的 `overflow: hidden`。
  - **效果达成**：
    - 数字在滚动进入时依然保持利落的上下进出裁切，无多余溢出。
    - 鼠标划选复制数值时，选区高亮色块呈平整均匀的矩形，彻底消除了原先在数字与单位（如 `62` 与 `ms`、`95.2` 与 `%`）之间断裂的上下渐隐现象。

### (57) 修复滚动数字与静态后缀文字的基线对齐错位问题 (Fixed Baseline Misalignment between NumberFlow and Suffix Units)
- **需求**：滚动文字和不滚动文字错位了。
- **问题根因**：
  - 此前为消除选区渐隐，在 `number-flow::part(number)` 和 `js/number-flow.min.js` 中加入了 `overflow: hidden;`。
  - 根据 W3C CSS 规范（CSS 2.1 §10.8.1 及 CSS Flexbox §8.5），当 `inline-block` 或 Flex 项目的 `overflow` 计算值不为 `visible` 时，其基线（baseline）会从原本内部字形的**文本基线**退化为其**外边距盒底边缘（bottom margin edge）**。
  - 导致父容器 `.metric-bento-val`（配置了 `align-items: baseline`）在对齐时，将静态单位（`ms`、`%`、`M+`）的文本基线强行对齐到了滚动数字的外盒底部，从而使所有非滚动单位文字向下严重沉底偏位，形成明显的阶梯错位。
- **落实修复**：
  - **恢复自然文本基线**：在 [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 与 [`js/number-flow.min.js`](file:///x:/XCoding/Octen/08-search%20subpage/js/number-flow.min.js) 中全面移除 `overflow: hidden`，保持容器的 `overflow: visible`。
  - **保留遮罩消除**：继续维持 `-webkit-mask: none !important; mask: none !important;` 以及高度宽度归零设置，既完全杜绝了文字拖选时的上下渐隐羽化，又完全恢复了数字容器标准的文本字形基线输出。
- **效果验证**：
  - `62` 与 `ms`、`95.2` 与 `%`、`99.9` 与 `%` 以及 `1` 与 `M+` 均在像素级（0px 偏差）水平基线上完全严密对齐。

### (58) 动静双态遮罩机制：数字入场保持渐隐动效，静止划选呈现完整矩形 (Dynamic Mask Lifecycle for NumberFlow: Gradient Fade on Entrance + Crisp Highlight on Selection)
- **需求**：数字出现时 渐隐效果丢失了。
- **目标全量融合**：
  1. **数字滚动登场时**：必须呈现原汁原味的上下羽化渐隐动效（`-webkit-mask-image`），杜绝滚动时暴露上下堆叠的数字串。
  2. **数字滚动结束后（静态浏览时）**：必须彻底注销渐变遮罩，使鼠标划选文字时高亮选区为纯正平整的矩形，绝不产生上下边缘半透明渐隐。
  3. **基线对齐**：必须保持 `overflow: visible`，保证 `62` 与 `ms`、`95.2` 与 `%`、`1` 与 `M+` 永久 100% 水平对齐，绝不错位。
- **落实方案（生命周期动态遮罩）**：
  - 在 [`js/number-flow.min.js`](file:///x:/XCoding/Octen/08-search%20subpage/js/number-flow.min.js) 中重构遮罩生命周期状态机：
    - **启动动效阶段 (`animationsstart` / `didUpdate`)**：动态激活原生 `-webkit-mask-image` 与 `mask-image`，数字翻滚入场时上下平滑透明渐隐。
    - **动效完成阶段 (`animationsfinish`)**：监听所有 Shadow DOM 内部动画 Promise 完成事件，瞬间将 `.number` 容器的遮罩设置为 `none`。
    - **初始静态展示阶段**：未触发滚动进入前保持无遮罩状态。
- **效果达成**：
  - 页面初次滚动至该区域：数字翻滚如丝般顺滑，上下带有自然柔和的渐隐消失感。
  - 数字停稳后：由于遮罩已自动卸载，拖拽鼠标选中数字时，高亮选区干净利落，无上下渐隐与断层。
  - 滚动数字与静态后缀文字的基线水平高度完全吻合（0px 偏差）。

### (59) Pay-as-you-go 卡片徽章右上角定位与图标中性灰配色调整 (Pay-as-you-go Top-Right Badges & Neutral Gray Icons)
- **需求**：Pay-as-you-go卡片中的标签放到卡片右上角， icons图表改为中性灰色。
- **落实**：
  - **标签右上角绝对定位**：
    - 在 [`index.html`](file:///x:/XCoding/Octen/08-search%20subpage/index.html) 中，4 张 `.pricing-bento-card` 内的优惠与公测状态徽章（`<span class="badge-discount">80% Off</span>`、`<span class="badge-ea">Early Access</span>`）提升为卡片根容器直接子元素。
    - 在 [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中对 `.pricing-bento-card .badge-discount` 与 `.pricing-bento-card .badge-ea` 配置 `position: absolute; top: 24px; right: 24px; z-index: 2;`（小屏媒体查询下自适应为 `top: 20px; right: 20px;`）。
    - 标签脱离普通文档流后，卡片内部流仅保留顶部的图标/标题与底部的价格，右上角标签与左上角图标在 `top: 24px` 的水平线上形成完美的对齐张力。
  - **图标色彩升级为中性灰色 (Neutral Gray)**：
    - 在 [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中将 `.pricing-card-icon` 颜色从原先的翠绿色 `var(--primary-green, #039855)` 调整为克制稳健的中性灰 **`#717680`**。
    - 增加平滑色彩过渡 `transition: color 0.2s cubic-bezier(0.16, 1, 0.3, 1);`，并在卡片悬停时（`.pricing-bento-card:hover .pricing-card-icon`）优雅加深至正文主色 `var(--text-main, #0F172A)`。
    - 所有 Web Search、Broad Search、Image Search、Video Search 的 SVG 图标均继承 `currentColor`，呈现出干净、沉稳、专业的现代 SaaS 设计品质。

### (60) Pay-as-you-go 规则横幅文字颜色调整 (Pricing Policy Banner Text Color Update)
- **需求**：`span.policy-text` 配置修改：`color: rgb(160, 160, 160)`。
- **落实**：在 [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中将 `.shell-policy-banner .policy-text` 的 `color` 调整为 `rgb(160, 160, 160)`（#A0A0A0），使说明文字在深浅层次上更加轻柔协调，与卡片区域整体视觉对比保持高雅平衡。

### (61) 参考 Figma 规范 (Node 13588:119047) 全面对齐 Pricing 卡片视觉规格
- **需求**：参考最新 Figma 设计稿（Node `13588:119047`）对 Pay-as-you-go 卡片进行全方位细节与层级重构。
- **落实**：
  - **容器底色与圆角对齐**：
    - `.pricing-bento-card` 背景色统一为 `#F5F5F4`，边框 `1px solid #E7E7E3`，圆角改为 `12px`，内边距规范为 `padding: 22px 20px`，最小高度 `180px`。
    - 悬停底色微调为 `#ECECE8`，边框过渡为 `#D4D4CE`，去除任何位移阴影，保持极简石材质感。
  - **网格间距调整**：
    - 将 `.shell-cards-grid` 卡片间距 `gap` 由 `16px` 精确对齐至 Figma 的 `12px`，卡片与政策横幅更紧凑沉稳。
  - **顶部图标与标题布局重构**：
    - 图标容器 `.pricing-card-icon` 纵向居顶，`padding: 8px 0`，图标色彩设定为深色 `#0F172A`。
    - 标题行 `.pricing-card-header` 采用 `display: flex; align-items: center; justify-content: space-between;`：
      - 标题 `.pricing-api-name` 字号提升至 `20px`（粗体 700，行高 `30px`，色值 `#0F172A`）。
      - 状态徽章（`.badge-discount`、`.badge-ea`）从卡片右上角绝对定位移至标题右侧同行对其，高度定为 `22px`，内边距 `3px 6px`，字号 `11px`（等宽粗体，行高 `11px`，字距 `-0.11px`），与主标题基准对齐。
  - **价格排版与划线价对齐**：
    - `.pricing-price-wrap` 设置 `padding-top: 28px`，`display: flex; align-items: baseline; gap: 6px;`。
    - 当前价 `.pricing-price-num`：`font-size: 34px; font-weight: 600; line-height: 34px; letter-spacing: -1.02px; color: #0F172A;`。
    - 原划线价 `.pricing-price-original`：`font-size: 16px; font-weight: 400; line-height: 24px; color: #9C9CA4; text-decoration: line-through;`。
    - 计量单位 `.pricing-price-unit`：`font-size: 14px; font-weight: 400; line-height: 21px; color: #767676;`。

### (62) Pricing 卡片底色调整为纯白卡片风格 (Pricing Cards Updated to Pure White)
- **需求**：改为白色卡片。
- **落实**：
  - 在 [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中将 `.pricing-bento-card` 的背景色由石材灰 `#F5F5F4` 调整为纯白 **`#FFFFFF`**。
  - 增加轻盈的基准投影 `box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);` 与精致浅灰边框 `1px solid #E7E7E3`，使纯白卡片在白底下层次清晰利落。
  - 悬停动效配置为保持纯白底色，边框过渡至 `#D4D4CE` 并升起微柔和阴影 `box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);`，呈现出克制、典雅、现代的高级感。

### (63) Pricing 卡片 Early Access 徽章调整为 Hover 悬停显现 (Early Access Badge Reveals on Hover)
- **需求**：Early Access hover再出现。
- **落实**：
  - 在 [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中对 `.pricing-bento-card .badge-ea` 设置默认状态 `opacity: 0; visibility: hidden; transform: translateY(2px); pointer-events: none;`。
  - 在卡片悬停状态 `.pricing-bento-card:hover .badge-ea` 下激活 `opacity: 1; visibility: visible; transform: translateY(0); pointer-events: auto;`，并配置贝塞尔曲线平滑过渡（`0.2s cubic-bezier(0.16, 1, 0.3, 1)`）。
  - Image Search 与 Video Search 卡片平时呈现出与正常 API 一致的清爽视觉，鼠标悬停卡片时轻盈渐显出 Early Access 绿色徽章；对无 hover 的触屏移动设备配置 `@media (hover: none)` 优雅降级保持常显。

### (64) 参考 Figma 规范 (Node 13588:119016) 重构双层卡片结构与标签位置 (Dual-Layer Card Structure & Top Tab Labels)
- **需求**：参考 `node-id=13588-119016` 结构，忽略图标和文字，只关注结构（双层卡片的颜色+标签文字位置）。
- **落实**：
  - **DOM 结构升级为双层卡片**：
    - 在 [`index.html`](file:///x:/XCoding/Octen/08-search%20subpage/index.html) 中，4 张卡片外层包裹 `.pricing-dual-card` 容器，分为顶层标签栏 `.pricing-dual-tab > .pricing-dual-tag` 与底层主卡片 `.pricing-bento-card`。
    - 移除原本 `.pricing-card-header` 内部混排的徽章元素，标题行仅保留纯净的 API 名称（`.pricing-api-name`），状态标签全面移至顶层色块中央。
  - **外层顶标色彩与版式严格对齐 Figma**：
    - **折扣卡片（Web Search / Broad Search）**：外层容器应用 `.theme-discount`（底色 **`#70FE7E`** 荧光绿），顶部标牌居中显示 `80% Off`（`color: #100F09; font-size: 11px; font-weight: 700; letter-spacing: -0.11px;` 等宽字体）。
    - **公测卡片（Image Search / Video Search）**：外层容器应用 `.theme-ea`（底色 **`#F4F4F3`** 极简石灰），顶部标牌居中显示 `Early Access`（`color: #5E5E5D; font-size: 11px; font-weight: 700; letter-spacing: -0.11px;` 等宽字体）。
  - **内层白色卡片与圆角嵌合**：
    - 内层 `.pricing-bento-card` 保持纯白底色（`#FFFFFF`）与 `1px solid #E7E7E3` 精致边框，四角均为 `12px` 圆角。
    - 使得白卡在顶部两侧自然内弯，露出上方荧光绿/灰色的胶囊顶标底色；在底部则与外盒严密对齐。
    - 悬停卡片时激活 `.pricing-dual-card:hover .pricing-bento-card`，边框过渡至 `#D4D4CE` 并升起柔和光影 `box-shadow: 0 4px 16px rgba(16, 24, 40, 0.06);`。
  - **网格间距**：`.shell-cards-grid` 的 `gap` 调整为 `16px`（大屏）/ `14px`（平板）/ `12px`（手机）。

### (65) Pricing 规则横幅外链文案调整 (Policy Banner Link Text Updated)
- **需求**：`[Full pricing docs →]` 改为 `[Full pricing ↗]`。
- **落实**：在 [`index.html`](file:///x:/XCoding/Octen/08-search%20subpage/index.html) 中将 `.shell-policy-banner` 区域的政策文档跳转链接文案更新为 **`Full pricing ↗`**，使用外链角标箭头（`↗`）更符合新标签页打开外部文档的标准视觉认知。

### (66) Navbar 下拉菜单重构为双栏 API + Application 卡片网格 (Figma Node 13589:139270)
- **需求**：navbar 下拉菜单改为 Figma 设计 `https://www.figma.com/design/jnIlRSuXffn5g2OxnsqYIE/Octen_%E6%B1%87%E6%80%BB?node-id=13589-139270&t=Z0uSptuLmVqwictA-4`，并严格修正所有 padding、gap 与几何尺寸细节。
- **落实**：
  - **Figma 规约与内边距精确校准**：
    - 外层面板：纯白底色 `#FFFFFF`、圆角 `12px`、边框 `1px solid #E9EAEB`、内边距严格为 **`padding: 20px`**、栏间距 **`gap: 20px`**、总宽 **`850px`**。
  - **左侧 API 列表 (`.nav-dropdown-section-api`)**：
    - 宽度 **`307px`**（文本区 253px + 图标 24px + 间距 10px + 左右各 10px 内边距），纵向间距 `gap: 10px`。
    - API 标头：`padding: 0 12px`、字号 `14px`、行高 `20px`、字重 600、色值 `#717680`。
    - 列表容器：`gap: 10px`。
    - 菜单项 (`.nav-product-link`)：四边内边距严格为 **`padding: 10px`**、圆角 `8px`、图标与文字间距 `gap: 10px`。
    - 图标：24×24px 原始绿色 SVG（`#039855`）。
    - 文本区：标题（16px / 24px，粗体，色值 `#181D27`）与副标题（14px / 20px，色值 `#717680`）之间间距为 **`gap: 4px`**。
    - 高度对齐：每个菜单项高度严格为 68px（10+24+4+20+10），4 项加 3 个 10px 间距，列表总高精确为 **302px**。
  - **中间分割线与右侧 Application 网格 (`.nav-dropdown-section-app`)**：
    - 中间垂直细线 `border-left: 1px solid #CACACA`，内边距严格为 **`padding-left: 28px`**，纵向间距 `gap: 10px`。
    - Application 标头：`padding: 0` 与网格齐平，字号 `14px`、行高 `20px`、字重 600、色值 `#717680`。
    - 2×2 网格：宽度 **`454px`**、高度 **`302px`**、间距 **`gap: 12px`**。
    - 4 张应用卡片：高度 **`145px`**（两行 145+12+145=302px）、圆角 `12px`、底色 `#F9F8F6`、悬停柔和色变 `#F2F0EB`。
  - **完美等高对齐**：左侧列表（302px）与右侧网格（302px）高度完全一致，两栏标头与底部卡片在同一水平基线上，视觉对称平衡。
  - **定位对齐调整 (Left-Aligned)**：将 `.nav-dropdown-menu` 从原先的居中定位（`left: 50%; transform: translateX(-50%)`）调整为与主导航菜单 Products 项左对齐（`left: 0; transform: translateY(8px) ➔ translateY(0)`），彻底消除面板向左突出的突兀感，整体自左向右自然展开。

### (67) Performance 基准图表悬停聚焦：增加其他产品透明度 (Benchmark Chart Product Hover Focus)
- **需求**：charts增加一个效果，hover到一个产品，微微增加其他产品透明度。
- **落实**：
  - **数据层打标与分组**：
    - 在 [`index.html`](file:///x:/XCoding/Octen/08-search%20subpage/index.html) 中，为 4 个产品的 DOM 散点卡片（`.benchmark-node-anchor`）及 SVG 误差范围线（`<g class="benchmark-error-bar">`）统一配置 `data-product="octen | tavily | parallel | exa"` 语义标识。
  - **交互动效逻辑**：
    - 在 [`js/main.js`](file:///x:/XCoding/Octen/08-search%20subpage/js/main.js) 中监听产品的 `mouseenter` 与 `mouseleave`，激活/移除画布的 `data-hovered-product="[product]"` 状态。
    - 在 [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中配置双向联动：
      - 当鼠标悬停任意一个产品（散点/标签/误差线）时，当前产品保持 `opacity: 1`（`z-index: 10` 顶层突出，散点微放大 `1.25x`）。
      - 其他所有产品（包括散点、标签、SVG 误差线）平滑过渡为半透明虚化态（**`opacity: 0.32`**，平滑贝塞尔曲线 `0.28s cubic-bezier(0.16, 1, 0.3, 1)`）。
      - 为标签项增加透明桥接伪元素（`::after`/`::before`），消除散点与文字标签间的移动断触闪烁。
      - 提供纯 CSS `@media (hover: hover)` 降级备用机制。

### (68) 全站页面区块上下内边距统一收敛为 100px (Unified Section Vertical Padding to 100px)
- **需求**：每个区块上下padding 100px。
- **落实**：
  - 在 [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中全面审查并统一所有主区块的垂直间距节奏（消除了原本 80px、88px、96px、200px 各不相同的离散间距）：
    1. **Hero 区块 (`#hero`)**：`padding-top: 160px`（考虑 60px 固定顶栏后，视觉可见内边距精确为 100px），`padding-bottom: 100px`。
    2. **Four APIs 滚动叙事区 (`#endpoints`)**：`#endpoints > .container` 的 `padding-top: 100px`，`#endpoints` 的 `padding-bottom: 100px`。
    3. **Performance & Benchmark 大区 (`#performance`)**：`#performance > .container` 的 `padding-top: 100px`，`#performance` 的 `padding-bottom: 100px`。
    4. **Pricing 价格卡片区 (`#pricing`)**：`#pricing > .container` 的 `padding-top: 100px`，`#pricing` 的 `padding-bottom: 100px`。
    5. **FAQ 常见问题区 (`#faq-section`)**：统一为 `padding: 100px 0;`。
    6. **CTA Banner 区 (`#cta`)**：`.cta-inner-container` 保持标准的 `padding-top: 100px; padding-bottom: 100px;`。
  - 全站 6 大核心区块自上而下形成严格一致的 100px 垂直韵律与视呼吸感。

### (69) Pay-as-you-go 定价卡片取消 Hover 悬停动效 (Pay-as-you-go Card Hover Effect Removed)
- **需求**：Pay-as-you-go 取消卡片hover效果。
- **落实**：
  - 在 [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中彻底移除了 `.pricing-dual-card:hover .pricing-bento-card`（原边框高亮变深 `#D4D4CE` 及浮动投影 `box-shadow: 0 4px 16px rgba(16, 24, 40, 0.06)`）。
  - 移除了 `.pricing-dual-card` 与 `.pricing-bento-card` 上的 `transition` 动效属性与图标 hover 触发。
  - 为卡片显式设置 `cursor: default;`，使 4 张定价卡片在鼠标悬停时完全保持静态平稳、沉着内敛的纯平面形态。

### (70) 参考 Figma 规范 (Node 13588:119119) 重构定价政策横幅样式 (Pricing Policy Banner Figma 13588:119119)
- **需求**：`https://www.figma.com/design/jnIlRSuXffn5g2OxnsqYIE/Octen_%E6%B1%87%E6%80%BB?node-id=13588-119119&t=Z0uSptuLmVqwictA-4` 按照这个修改该样式。
- **落实**：
  - **容器结构与规格全量对齐**：
    - 在 [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中更新 `.shell-policy-banner`：
      - 底色由完全透明调整为浅灰底座 **`background: #F4F4F3`**。
      - 圆角设置为 **`border-radius: 8px`**。
      - 内边距设置为严格的 **`padding: 20px 16px`**（上下 20px，左右 16px）。
      - 间距设置为 **`gap: 16px`**，上外边距调整为 **`margin-top: 16px`**。
      - 彻底移除任何边框与阴影，保持极简微光灰板质感。
  - **左侧提示信息与高亮文案**：
    - 在 [`index.html`](file:///x:/XCoding/Octen/08-search%20subpage/index.html) 中包裹 `.policy-info-wrap`（`display: flex; align-items: center; gap: 6px;`）。
    - 嵌入 16×16px 矢量信息图标（`lucide:info` SVG，色值 `#747474`）。
    - 文本使用 DM Sans 14px（行高 21px，基色 `#747474`），并按 Figma 规范精确配置重点词条高亮：
      - `The full content of the first <strong class="policy-highlight-green">10</strong> results per search is free; additional results are <strong class="policy-highlight-dark">$0.50</strong> / 1k. All new accounts receive <strong class="policy-highlight-green">$5</strong> in free balance upon registration.`
      - `.policy-highlight-green`：色值 **`#039855`**，字重 700（高亮数字 `10` 与 `$5`）。
      - `.policy-highlight-dark`：字重 700（加粗金额 `$0.50`）。
  - **右侧操作链接 (`.policy-link`)**：
    - 文案与标点对齐 Figma：**`Full pricing &rarr;`**（`Full pricing →`）。
    - 样式：`font-size: 14px; font-weight: 600; line-height: 21px; color: #039855; text-decoration: none;`。
    - 悬停高亮为下划线与加深主绿 `#027A44`。
  - **响应式优化**：
    - 增加移动端适配规则（`@media (max-width: 640px)`），在小屏下自适应为纵向排列并保持紧凑舒适的排版。

### (71) 移除 Performance 基准图表的悬停透明度虚化效果 (Chart Hover Opacity Dimming Removed)
- **需求**：去掉chart部分的hover 透明度效果。
- **落实**：
  - 在 [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中彻底移除了 `.benchmark-canvas-area[data-hovered-product]` 及 `@media (hover: hover)` 相关的透明度虚化规则（`opacity: 0.32`）。
  - 图表中 Octen、Tavily、Parallel、Exa 等全部产品标签、散点与误差线在任何时候均保持 100% 清晰显示（`opacity: 1`），不再出现半透明暗化或对比虚化。
  - 仅保留单个数据点锚点悬停时的轻微圆点放大动效（`transform: scale(1.25)`），无任何全局透明度干扰。
  - 在 [`js/main.js`](file:///x:/XCoding/Octen/08-search%20subpage/js/main.js) 中移除了对图表产品悬停切换 `data-hovered-product` 属性的事件监听器，避免冗余 DOM 属性读写，保持图表交互极简纯粹。

### (72) 定价政策横幅高度优化为 48px (Pricing Policy Banner Height to 48px)
- **需求**：`The full content of the first 10 results...` 该卡片先修改为48px高度。
- **落实**：
  - 在 [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中对 `.shell-policy-banner` 显式设置标准紧凑高度 **`height: 48px;`**。
  - 内边距由原先的纵向 20px 调整为 **`padding: 0 16px;`**，结合 `display: flex; align-items: center;` 确保左侧图标+说明文案与右侧 `Full pricing →` 外链在 48px 高度内完美居中对齐。
  - 配置 `flex-wrap: nowrap;` 保持大屏下单行横向贯通，并在 `@media (max-width: 768px)` 移动端配置 `height: auto; min-height: 48px; padding: 14px 16px;` 弹性自适应换行。

### (73) 导航下拉菜单项默认背景色修复 (Nav Dropdown Hover Effect Clarification)
- **需求**：修复nav 的下拉菜单，第一个Search色灰色底指的是hover效果，不代表常驻背景色。
- **落实**：
  - 在 [`index.html`](file:///x:/XCoding/Octen/08-search%20subpage/index.html) 中移除了第一个 API 菜单项（Search）上携带的 `.is-active` 类名及 `aria-selected="true"`，使 4 个 API 选项默认底色全部为纯净透明。
  - 在 [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中更新 `.nav-product-link` 规则，将 `#F9FAFB` 浅灰底色严格限定在 `:hover` 与 `:focus-visible` 交互伪类下触发，彻底解除常驻状态。
  - 在 [`js/main.js`](file:///x:/XCoding/Octen/08-search%20subpage/js/main.js) 中清理了旧版冗余的 `setActivePreview` 预选高亮逻辑，确保只有当鼠标真实悬停在具体选项上时才呈现灰底高亮卡片微交互。

### (74) 参考 Figma 规范 (Node 13590:139982) 修正导航下拉菜单完整结构与样式 (Nav Dropdown Menu Figma 13590:139982)
- **需求**：`https://www.figma.com/design/jnIlRSuXffn5g2OxnsqYIE/Octen_%E6%B1%87%E6%80%BB?node-id=13590-139982&t=Z0uSptuLmVqwictA-4` 修正menu样式。
- **落实**：
  - **外层容器与阴影微调**：
    - 在 [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中将 `.nav-dropdown-card.nav-dropdown-split` 宽度精确对齐为 **`841px`**。
    - 阴影严格对齐 Figma 规范：`box-shadow: 0px 12px 8px rgba(10, 13, 18, 0.08), 0px 4px 3px rgba(10, 13, 18, 0.03);`。
  - **左侧 API 列表精细化**：
    - 菜单项副标题说明文字（`.nav-product-desc`）字号调整为 **`12px`**，行高 `20px`，颜色调整为灰度 `#808080`（原为 14px / #717680），与标题形成更优雅清晰的字阶主次。
    - 悬停底色设置为微柔灰 **`#F7F7F7`**。
  - **右侧 Application 网格重构**：
    - 在 [`index.html`](file:///x:/XCoding/Octen/08-search%20subpage/index.html) 中将原占位符完整重构为 4 张结构化应用卡片（`.nav-dropdown-app-item`）：
      1. **Answer**：顶部浅灰卡片底座（`#F9F8F6`，圆角 `12px`），底部文本 `Answer`（DM Sans 16px）。
      2. **Deep Research**：顶部浅灰卡片底座，底部文本 `Deep Research`。
      3. **Multimodal Chat**：顶部浅灰卡片底座，右上角配置 **`Early Access`** 浅绿胶囊徽章（`#E3FFE2`，边框 `#6FD1A5`，文本 `#1B9C62`，11px 等宽字体），底部文本 `Multimodal Chat`。
      4. **Ground Generation**：顶部浅灰卡片底座，右上角配置 **`Early Access`** 浅绿胶囊徽章，底部文本 `Ground Generation`。
    - 中间分割线严格放置在网格左侧：`border-left: 1px solid rgba(201, 201, 201, 0.5); padding-left: 20px;`，标头同时缩进 `padding-left: 20px`，使得分割线恰好从内容区上沿贯穿至底部，与左侧列表严格平齐。
    - 卡片配置细腻悬停交互：鼠标移入时顶部缩略底座渐变至 `#F2F0EB`，标题轻微变绿高亮 `#039855`。

### (75) 全站 Web Search 图标更新为官方精确矢量规范 (Search & Web Search Icons Updated)
- **需求**：
  - 替换 nav 下拉菜单中的 Search 图标为用户提供的精确 SVG（修正识别误差）。
  - 同步修改正文中两处 Web Search 图标。
- **落实**：
  - 在 [`index.html`](file:///x:/XCoding/Octen/08-search%20subpage/index.html) 中全面完成 3 处搜索图标的矢量同步：
    1. **顶部导航下拉菜单 (`.nav-dropdown-menu .nav-product-link[data-product="web"]`)**：使用包含多重经纬弧线与右下角圆形透镜的 24×24px 官方矢量（`stroke="#039855"`，`stroke-width="1.8"`）。
    2. **正文 Four APIs 叙事区 (`#endpoints #api-step-web .api-step-title-icon`)**：同步替换为该 24×24px 官方矢量（`stroke="#039855"`，`stroke-width="1.8"`）。
    3. **正文 Pay-as-you-go 定价卡片区 (`#pricing .pricing-dual-card .pricing-card-icon`)**：同步替换为该矢量规范（22×22px，`stroke="currentColor"`，与卡片文字色 `#0F172A` 浑然一体）。
  - 彻底移除了原先简化的单圆 `tabler:world-search` 路径，保证全站所有入口与正文区块的 Search 品牌符号 100% 精确统一。

### (76) 导航下拉菜单 API 辅助文案精炼与对齐 (Nav Dropdown Supporting Copy Refined)
- **需求**：
  - 基于 `Access frontier models through one API key, with live web search built in.` 与 `Use Extract to pull clean content from URLs you already have.` 两段核心能力描述，精炼菜单副标题，并优化其他菜单项辅助文字。
- **落实**：
  - 在 [`index.html`](file:///x:/XCoding/Octen/08-search%20subpage/index.html) 中将左侧 API 栏 4 大产品项的副文本（`.nav-product-desc`）全面升级为高表现力、等长均衡的单行精炼文案：
    1. **Search**：`Search text, images, and video`（聚焦多模态即时联网检索能力，30 字符）。
    2. **Embedding**：`Top-ranked vector embeddings`（替换原重复占位文案，直观凸显 Octen 业内领先的高维向量检索基准，28 字符）。
    3. **Extract**：`Pull clean content from your URLs`（由原长句自然提炼，强调基于已有 URL 抽取干净、去除噪音的文本与结构化数据，32 字符）。
    4. **Model Gateway**：`Frontier models with live web search`（由原长句精简，突出融合了实时联网检索能力的前沿大模型统一接入，36 字符）。
  - **版式与高度平衡**：4 条文案长度严格控制在 28~36 字符之间，在 253px 文本容器内均呈现为纯净利落的单行排版，完美守住左侧 302px 与右侧 302px 应用网格的绝对等高视觉律动。

### (77) 导航下拉菜单左栏标题更新为 Capabilities (Nav Dropdown Column Title Updated to Capabilities)
- **需求**：menu 中 API 改为 Capabilities。
- **落实**：
  - 在 [`index.html`](file:///x:/XCoding/Octen/08-search%20subpage/index.html) 中将 Products 下拉菜单左侧栏标题由 `API` 更新为 **`Capabilities`**。
  - 同步将对应无障碍标注更新为 `aria-label="Capabilities Options"`。
### (78) 导航下拉菜单应用卡片 Early Access 徽章悬停显现与标题保色 (Nav App Badge Hover Reveal & Title Color Invariant)
- **需求**：menu中的early标签hover时才出现，hover时标题不变色。
- **落实**：
  - 在 [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中更新 `.nav-app-badge` 规则：
    - 默认状态设为透明隐藏：`opacity: 0; visibility: hidden; transform: translateY(2px);`。
    - 添加流畅的缓动过渡属性：`transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.2s ease;`。
    - 在应用卡片悬停状态下（`.nav-dropdown-app-item:hover .nav-app-badge`）触发平滑浮现：`opacity: 1; visibility: visible; transform: translateY(0);`。
    - 添加 `@media (hover: none)` 媒体查询，在触控移动设备上优雅降级保持常显。
### (79) Pay-as-you-go 四张卡片产品图标线宽对齐统一 (Pricing Cards Icon Stroke Width Unified)
- **需求**：检查Pay-as-you-go 四个卡片中icon线宽是否一致，修正。
- **排查分析**：
  - 4 张卡片图标均基于 22×22px 尺寸与 `viewBox="0 0 24 24"` 视口：
    1. **Web Search**（卡片 1）：原路径硬编码为 `stroke-width="1.8"`，在 22px 容器下缩放后实际线宽仅为 `1.65px`，导致视觉重量比其他卡片明显偏细。
    2. **Broad Search**（卡片 2）：SVG 设定为 `stroke-width="2.004"`（Figma 导出的 2px 浮点值），缩放后实际线宽为 `1.84px`。
    3. **Image Search**（卡片 3）：Figma 导出为轮廓闭合路径（Outline Stroke），经几何测算各边线轮廓厚度差严格为 `2.004px`，等价于标准 2px 线宽。
    4. **Video Search**（卡片 4）：同为 Outline Stroke 闭合路径，边框与播放三角形轮廓厚度差严格为 `2.004px`，等价于标准 2px 线宽。
  - **结论**：4 个卡片线宽确实存在不一致，Web Search（1.8px）比其余三张卡片（2px）偏细约 10%。
- **落实**：
  - 在 [`index.html`](file:///x:/XCoding/Octen/08-search%20subpage/index.html) 中：
    - 将 Web Search（卡片 1）的两条路径的 `stroke-width` 由 `1.8` 修正为 **`2`**。
    - 将 Broad Search（卡片 2）的 `stroke-width="2.004"` 规范规整为 **`2`**。
    - 4 张卡片图标线宽严格统一为标准的 **`2px`** 矢量粗细，视觉重量达到绝对均衡。
### (80) Production-grade Performance 数字指标从 Charts 卡片背后滚动视差升起 (Metrics Scroll-driven Parallax Reveal)
- **需求**：Production-grade performance 中的数字统计和charts能做跟随鼠标的视察滚动吗？就是数字从charts卡片背后升起。
- **落实方案**：
  - **三维层级架构 (Stacking Context)**：
    - 在 [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中，将 `#performance .section-head` 标头设为最高层 `z-index: 4`；
    - 将 `.benchmark-panel`（Charts 评测卡片）设为前景实体层 `z-index: 2`，拥有 `#F9F9F9` 不透明实底与 `box-shadow: 0 16px 40px -12px rgba(15, 23, 42, 0.06)` 高雅环境投影；
    - 将 `.metrics-overview-unified`（4 组数字统计）设为深景深层 `position: relative; z-index: 1;`，通过 CSS 变量 `--metrics-offset-y`、`--metrics-scale`、`--metrics-opacity` 实现硬件加速位移。
    - 为 4 张 `.metric-bento-card` 配置微交错参数 `--stagger-factor: 0`、`0.06`、`0.12`、`0.18`，升起时呈现出如同 Apple Keynote 般从左至右自然展开的微涟漪动效。
  - **60FPS RAF 滚动视差引擎**：
    - 在 [`js/main.js`](file:///x:/XCoding/Octen/08-search%20subpage/js/main.js) 中实现 `initPerformanceParallax()` 控制器；
    - 利用 `IntersectionObserver` 监测性能区域与视口的相交区间，仅在进入视口范围时挂载 RAF 滚动循环，离开视口后立即解绑，0 额外 CPU/GPU 负担；
### (81) Performance 滚动视差升起动效调优（提升位移幅度与触发时机校准）(Parallax Timing & Amplitude Calibration)
- **需求**：数字浮现效果不明显，触发时机太靠下。
- **问题排查**：
  1. **位移幅度不足**：原初始下移幅度（96px）小于卡片高度（约 148px）加上与图表卡片的间隔（56px），导致大号数字文本初始时仍有大部分露出在图表卡片上方，缺乏真实的“从背后钻出升起”视觉冲击。
  2. **触发时机过迟**：原触发参考系基于 `#performance` 整个大区域的顶端，由于该区域包含 100px 内边距和大标题，当计算触发时，图表卡片尚处于视口极深处，使得动画过迟展开。
- **落实方案**：
  - 在 [`js/main.js`](file:///x:/XCoding/Octen/08-search%20subpage/js/main.js) 中重构触发物理模型：
    - **参照系校准**：改为直接监听 **`.benchmark-panel`（图表卡片）自身的视口位置**。当卡片顶边刚进入屏幕下半部（`window.innerHeight * 0.94`）即刻平滑启动，在卡片位于中下部舒适浏览区（`0.44`）时恰好升起到位，正对用户视线焦点。
    - **升起幅度大幅增强**：将最大位移由 96px 大幅提升至 **`180px`**（移动端 `110px`），使整排 4 组大数字在初始状态下 **100% 完整隐匿在 `.benchmark-panel` 顶边后方**，随着滚动极为清晰鲜明地从图表顶部实体边缘逐层冒出升起。
    - **透明度策略优化**：滚动进入后立即保持清晰透明度，确保数字破格升起的过程肉眼清晰可辨，而非模糊淡入。
  - 在 [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中移除 `.metrics-overview-unified` 和 `.metric-bento-card` 上的 CSS 补间过渡延迟，实现纯粹由 RAF 逐帧紧密贴合滚轮的零延迟 60FPS 运动质感。

### (82) Performance 视差初始空白消除与图表动态展开动效 (Parallax Initial Void Elimination & Dynamic Reveal)
- **需求**：在数字区没出现时候，标题和charts之间空白太多，消除。
- **原因剖析**：
  - 此前单纯通过将数字区 `.metrics-overview-unified` 往下 translate 隐藏，但由于该元素在文档普通流中依然占据 ~168px 的物理排版高度，加之下方原本的 `margin-bottom: 56px` 与标题区的 `margin-bottom: 44px`，使得在数字未升起（或未滚动到位）时，标题与图表卡片之间存在高达 `268px` 的空旷白区。
- **落实方案**：
  - **图表卡片反向位移对开机制 (Dynamic Counter-Movement Reveal)**：
    - 在 [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中，将 `.benchmark-panel` 接入 GPU 硬件加速变量 `transform: translate3d(0, var(--chart-offset-y, 0px), 0)` 与 `will-change: transform`。
    - 将 `.metrics-overview-unified` 的 `margin-bottom` 由 `56px` 紧凑优化为 `36px`。
    - 在 `@media (prefers-reduced-motion: reduce)` 中补充 `.benchmark-panel { transform: none !important; }`，确保无障碍体验。
  - **双向联动数学模型与滚动驱动**：
    - 在 [`js/main.js`](file:///x:/XCoding/Octen/08-search%20subpage/js/main.js) 中，以 `#performance` 区域单调坐标为基准（`startY = winHeight * 0.90; endY = winHeight * 0.35`）：
      - **初始未展开阶段 (`progress = 0`)**：`.benchmark-panel` 反向向上推移 `chartOffsetY = -180px`（移动端 `-120px`），使得图表卡片顶边与大标题下边缘的真实视觉间距严丝合缝缩短至自然的 **`~68px`**，**彻底消除了 200px+ 的冗余空白空洞**！
      - **滚动展开阶段 (`0 < progress < 1`)**：图表卡片从 `-180px` 平滑向下滑动就位（`0px`），同时指标卡片从 `+50px`、`opacity: 0` 向上升起显现并放大至 `1.0`，形成极具舞台感与层次感的“卡片向下展开、指标从背后向上浮现”双向对开效果。
      - **就位与复位联动**：在 `progress >= 0.45` 适时触发数字滚轮计数；当用户向上滑出视口（`progress < 0.05`）时，数字自动复位至初始值，便于下次滑入重新享受生动动画。
      - **零重排零卡顿**：全流程基于纯 GPU Compositor 的 `transform` 与 `opacity`，无任何 DOM layout reflow，流畅度恒定 60FPS。

### (83) 视差滚动触发时机调优（锁定至标题进入窗口上半部分后触发）(Parallax Trigger Timing Recalibration)
- **需求**：视差滚动触发时间有点早，应该等 Production-grade performance 标题出现在窗口上半部分的时候再触发。
- **落实方案**：
  - 在 [`js/main.js`](file:///x:/XCoding/Octen/08-search%20subpage/js/main.js) 中：
    - **直接瞄准标题元素**：精准获取 `sectionTitle = performanceSection.querySelector(".section-title")` 的视口绝对坐标 `titleRect.top`。
    - **触发阈值精确延后至窗口上半区**：
      - **启动点**：将 `startY` 设定为 `winHeight * 0.50`（严格等大标题滚动至视口垂直中线及以上、进入窗口上半部分时才开始触发动效）。在标题处于屏幕下半部时，动效保持静止锁定，图表紧贴标题下方，无冗余空白。
      - **完成点**：将 `endY` 设定为 `winHeight * 0.16`（移动端 `0.12`），当标题舒适就位于视口顶部标头位置时，图表下移与指标升起、数字翻滚刚好全部平滑就位，动静节奏严密贴合用户的阅读视线流。

### (84) 解决动画看不到与过渡缺失：重构为状态驱动的完整 850ms 优雅入场动效 (State-based Cinematic Parallax Transition)
- **问题根因定位**：
  1. **直达锚点与刷新时动效已被消耗**：用户点击 `http://localhost:5173/#performance` 链接直接落入大区时，页面已定位在标题下方，原滚动数学模型直接判定为 `progress = 1.0`（动画已播放完毕），用户肉眼直接看到静态画面，错过了入场全过程。
  2. **离散滚轮跳帧缺失补间**：Windows 鼠标滚轮每次拨动产生 100~120px 阶梯式跳跃，此前无 CSS 补间过渡，导致在约 300px 的极短行程中仅 2 次滚轮拨动就瞬间跳变完成，无法形成肉眼连贯的“动画过渡”。
- **重构方案**：
  - **CSS 状态化与 850ms GPU 丝滑过渡**：
    - 在 [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中，`.benchmark-panel` 默认初始锁定于 `-180px`（移动端 `-120px`），紧贴标题；`.metrics-overview-unified` 初始位移 `48px`、`opacity: 0`。
    - 为图表卡片与数字指标卡片配置 `transition: transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1)`（Apple 顶级缓动曲线）。
    - 4 张 `.metric-bento-card` 配置阶梯式延迟（`0.04s`、`0.09s`、`0.14s`、`0.19s`），呈现出从左到右微波浪式的破格升起。
  - **智能状态控制器**：
    - 在 [`js/main.js`](file:///x:/XCoding/Octen/08-search%20subpage/js/main.js) 中，当用户正常滚动且标题进入视口上半部分（`titleRect.top <= winHeight * 0.52`）时，赋予 `#performance.is-revealed` 状态，触发完整 850ms 动效与数字滚轮，无论用户滚动快慢或停手，动效均能完整、从容地播放到底。
    - **锚点落位保护**：对带 `#performance` Hash 直达页面的访问，设置 260ms 微延迟后触发，保证用户视线对焦瞬间亲眼见证图表卡片下落、数字指标升起的震撼开场。
    - **双向可逆**：用户往上滑回上一区块（`titleRect.top > winHeight * 0.72`）时自动收合复位，下次滑入再次触发。

### (85) 移除 Performance Charts 基准图表卡片投影 (Benchmark Panel Shadow Removed)
- **需求**：charts卡片投影去掉。
- **落实方案**：
  - 在 [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中，将 `.benchmark-panel` 的 `box-shadow` 设置为 `none`，彻底移除了外部弥散环境投影，呈现出更加扁平、纯净、克制的极简卡片质感，与整体现代纯白极简网格风格完美融合。

### (86) 数字区域伴随从中心缩小/放大收入 Charts 背景动效 (Center Zoom-in & Zoom-out Reveal)
- **需求**：数字区域伴随从中心缩小或放大收入charts背景的效果。
- **落实方案**：
  - 在 [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中：
    - **中心锚点与大比例缩放**：为 `.metrics-overview-unified` 显式声明 `transform-origin: center center;`，初始收缩态设为 `transform: translate3d(0, 60px, 0) scale(0.80); opacity: 0;`。
    - **从中心展开 (Center Zoom-in)**：当滚入触发进入 `.is-revealed` 态时，数字网格整体从中心以 20% 的幅度优雅放大（`scale(0.80)` ➔ `scale(1.0)`），并配合 `translate3d(0, 0px, 0)` 平滑上升破格呈现。
    - **由内而外的阶梯扩散 (Center-out Stagger)**：配置中心对称波浪时延，中间两张卡片（Accuracy 与 SLA）率先在 0.03s 萌发，左右两侧外翼卡片（Latency 与 QPS）在 0.08s 紧随其后向外延展绽开。
    - **收缩吸入 (Center Zoom-out Retraction)**：当用户向上滑动离开该区域时，数字网格整体从四周向正中心聚焦收缩缩小（`scale(1.0)` ➔ `scale(0.80)`），并向后下方平滑下潜，如同被完整吸入 Charts 图表卡片背景深处一样，带来极富电影感与空间纵深感的高级交互体验。

### (87) 指标网格容器增加左内边距 (Metrics Overview Grid Left Padding)
- **需求**：metrics-overview-grid left padding 20px。
- **落实方案**：
  - 在 [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中，为 `.metrics-overview-grid` 增加 `padding-left: 20px;` 与 `box-sizing: border-box;`，使数字网格首列与版心容器及下方图表内部保持视觉内收与对齐呼吸感。

### (88) 项目代码开源与推送到 GitHub (Git Init & GitHub Remote Push)
- **需求**：上传github。
- **落实方案**：
  - 配置标准 `.gitignore` 过滤系统缓存与临时文件。
  - 初始化本地 Git 仓库，建立 `main` 主分支，完成首个全量结构化 Commit。
  - 通过 `gh repo create amasun/octen-search --public` 创建远端公共仓库并成功推送全量代码。
### (89) Navbar 菜单根据 Figma 13590:139982 规范重构 Application 视觉卡片
- **需求**：`https://www.figma.com/design/jnIlRSuXffn5g2OxnsqYIE/Octen_%E6%B1%87%E6%80%BB?node-id=13590-139982&t=Z0uSptuLmVqwictA-4 修改菜单样式`。
- **落实方案**：
  - **Figma 像素级解析**：读取 Node `13590:139982` 及各子卡片节点（`13590:161514`, `13592:161612`, `13592:161650`, `13592:161692`）。
  - **卡片式布局重构**：
    - 右侧 `Application` 栏从原“浅灰圆角方形缩略图 + 底部外挂文字”结构升级为 2x2 沉浸式暗色氛围卡片（210.67px x 145px，圆角 12px）。
    - 4 张卡片分别为：
      1. **Answer**：翡翠绿涡流宇宙背景 + 纯白高精度矢量 Crosshair/Target 图标 + 纯白单行标题。
      2. **Deep Research**：深蓝粒子数据矩阵背景 + 纯白高精度矢量 Microscope 显微镜图标 + 纯白单行标题。
      3. **Multimodal Chat**：暗绿矩阵字符流背景 + 纯白高精度矢量 Chat 气泡多模态图标 + 纯白单行标题 + 右上角悬浮 `Early Access` 毛玻璃徽章。
      4. **Grounded Generation**：深邃墨绿绽放花瓣背景 + 纯白高精度矢量 Magic Wand 魔法棒图标 + 纯白单行标题 + 右上角悬浮 `Early Access` 毛玻璃徽章。
  - **矢量图标与 Figma 原素材高清背景落地**：
    - 直接从 Figma 原型提取 4 个精准的矢量 SVG 图标嵌入卡片中。
    - 通过 Figma Dev Mode 本地服务直连下载 Figma 文件内部原始未压缩材质资产（完全保持原作者设计的原汁原味），彻底取代 AI 替代图：
      - [`images/app-answer.png`](file:///x:/XCoding/Octen/08-search%20subpage/images/app-answer.png)：原版绿色数据涡流隧道材质
      - [`images/app-deep-research.png`](file:///x:/XCoding/Octen/08-search%20subpage/images/app-deep-research.png)：原版蓝黑色代码矩阵人形流材质
      - [`images/app-multimodal-chat.png`](file:///x:/XCoding/Octen/08-search%20subpage/images/app-multimodal-chat.png)：原版暗绿终端字符流材质
      - [`images/app-grounded-generation.png`](file:///x:/XCoding/Octen/08-search%20subpage/images/app-grounded-generation.png)：原版白绿花瓣融入 ASCII 代码材质
  - **高级交互体验**：
    - 悬浮时卡片背景以柔和贝塞尔曲线微缩放（`scale(1.06)`），图标产生微妙向上浮动（`-2px`）。
    - `Early Access` 徽章默认常显（`opacity: 1, visibility: visible`，对齐 Figma 原型），在卡片 Hover 时伴随边框微提亮（`#70FE7E`）与光晕交互。

### (90) 移除 Production-grade performance 视差滚动与位移动效 (Performance Parallax Removed)
- **需求**：Production-grade performance 去掉视差效果。
- **落实方案**：
  - **CSS 静态化与纯净布局**：
    - 在 [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中，彻底移除了 `.metrics-overview-unified` 的初始 `opacity: 0`、`transform: translate3d(...) scale(0.80)` 以及全部滚动状态类 `#performance.is-revealed` 动画规则。
    - 移除了 `.metric-bento-card` 和 `.benchmark-panel` 上的 `will-change: transform;`、延迟阶梯差与滚动位移计算。
    - 数字统计卡片与基准图表卡片全面恢复自然稳重的静态流式布局，无论用户何时何速滚动，均无任何吸附收缩、破格升起或位移晃动。
  - **JS 视差监听与循环重置逻辑清理**：
    - 在 [`js/main.js`](file:///x:/XCoding/Octen/08-search%20subpage/js/main.js) 中，彻底移除了 window scroll / resize 复杂监听器与正反向 `is-revealed` / `unreveal` 状态机。
    - 保留轻量的一阶 `IntersectionObserver`，仅在区域进入视口时从容触发一次数字滚轮，平稳克制、零性能负担。

### (91) Hero 区域黑底化与全要素反色（对齐 05-pricing 配色与光晕系统）
- **需求**：将 hero 更改为黑色背景，相关元素反色，参考之前的配色（05-pricing 中的 hero 背景 `X:\XCoding\Octen\05-pricing`）。
- **落实方案**：
  - **Hero 背景与光晕系统精准对齐 05-pricing**：
    - `#hero` 背景色由纯白恢复为 Obsidian Dark 空间基底，并叠加翡翠微光垂直渐变：`background: linear-gradient(180deg, rgba(17, 70, 43, 0.6) 0%, rgba(8, 11, 18, 0) 100%), #080B12;`。
    - 重新启用 `.hero-glow-container` 氛围光晕层，精准继承 `05-pricing` 的 `HeroLightGlow` 规范（尺寸 2002px x 323px，居中 `left: calc(50% - 1001px)`，顶部 `-219.56px`，透明度 0.6）：
      - `.glow-ellipse-green`：深绿模糊大椭圆（`#2D985E`，`filter: blur(200px)`）。
      - `.glow-ellipse-accent`：亮黄核心光斑（`#F4FE38`，`filter: blur(100px)`，`left/right: 22.61%`）。
  - **全要素反色系统 (Dark Theme Inversion)**：
    - **Hero 主标题 (`.hero-title`)**：纯白 `#FFFFFF`，配合深邃微投影 `text-shadow: 0 2px 24px rgba(0, 0, 0, 0.6)`。
    - **Hero 副标题 (`.hero-subtitle`)**：清晰副文字 `#FFFFFF / rgba(255, 255, 255, 0.85)`，强调高亮词汇（`.highlight-credit`）采用品牌荧光翠绿 `#70FE7E`（粗体 700）。
    - **赠金说明 (`.hero-credit-note`)**：中性浅白透灰 `rgba(255, 255, 255, 0.65)`，主按钮 Hover 时高亮提亮为 `#70FE7E`。
    - **主 CTA 按钮 (`.btn-hero-primary` / Get your API key)**：完全复刻 `05-pricing` 的 `Start Building` 按钮规范（`border: 1px solid #60FF70; color: #60FF70; background: transparent; border-radius: 10px; font-size: 16px;`），箭头着色为 `#60FF70`；Hover 时背景纯粹呈现克制浅绿微底（`rgba(96, 255, 112, 0.10)`），彻底去除了外围弥散光晕（`box-shadow: none`），保持极致利落清爽；Active 点击产生 `scale(0.97)` 微按压动效。
    - **次 CTA 按钮 (`.btn-hero-ghost` / View Docs)**：复刻 `05-pricing` 的透明幽灵边框按钮（`background: transparent; color: #FFFFFF; border: 1px solid rgba(255, 255, 255, 0.50); border-radius: 10px; font-size: 16px; backdrop-filter: blur(8px);`），Hover 产生柔和白光半透底色（`rgba(255, 255, 255, 0.10)`）。
  - **顶部导航栏智能双主题自适应联动 (Adaptive Dual-theme Navbar)**：
    - **置顶于 Hero 黑底区**（`window.scrollY <= 20`）：
      - 自动显示浅色版 Logo（`.nav-logo-dark` 白色 Octen 字样 + 荧光绿图形），隐藏深色 Logo。
      - 导航链接文字反色为高透纯白 `rgba(255, 255, 255, 0.90)`，Hover 底色为 `rgba(255, 255, 255, 0.10)`。
      - 右侧 `API Platform` 按钮精准对齐 `05-pricing` 的暗底半透白胶囊按钮（`bg-white/10 hover:bg-white/20 border-white/50 backdrop-blur-[4px] text-white`）。
    - **在 Hero 内部轻微滑动**（`20 < window.scrollY <= heroBottom`）：
      - 启用 `.header-nav-exact.scrolled-dark`，导航栏包裹入深黑曜石微透毛玻璃胶囊（`background: rgba(8, 11, 18, 0.85); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.15)`），文字与 Logo 维持暗主题高对比度。
    - **滑出 Hero 进入下方纯白正文区**（`window.scrollY > heroBottom`）：
      - 自动平滑过渡为 `.header-nav-exact.scrolled`（纯白微透毛玻璃胶囊 `rgba(255, 255, 255, 0.95)`），Logo 自动切换为墨黑版（`.nav-logo-light`），导航文字切换为深灰 `#181D27`，按钮切换为黑底白字胶囊，保证在任何背景区域下极佳的可读性与高级感。

### (92) Pay-as-you-go 价格卡片移除双层外壳并还原为 05-pricing 标签形式（80% Off 与 Early Access）
- **需求**：Pay-as-you-go 中 80% off ，early access 两个还原为标签形式，样式参考pricing。
- **落实方案**：
  - **移除双层外壳与多余标签包裹**：
    - 在 [`index.html`](file:///x:/XCoding/Octen/08-search%20subpage/index.html) 中，彻底移除了此前包裹在卡片外部的 `.pricing-dual-card` 与 `.pricing-dual-tab`（绿色/浅灰顶部横条）；
    - 将 4 张 API 计费卡片全面还原为标准的纯净单体卡片 `.pricing-bento-card`（`border-radius: 16px; border: 1px solid #E7E7E3; background: #FFFFFF;`，悬浮时平滑呈现 `border-color: #B5B5B0; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);`）。
  - **在卡片标题行内嵌入精致徽章标签（对齐 05-pricing ApiExplorer 规范）**：
    - **Web Search** 与 **Broad Search**：在 `.pricing-card-header` 中紧随 API 名称嵌入 `<span class="badge-discount">80% Off</span>`。
      - 样式对齐 `05-pricing`：高度 `20px`，内边距 `0 6px`，`border-radius: 4px`，字体 `JetBrains Mono`（粗体 700，字号 11px，行高 1），底色 `#70FE7E`，边框 `1px solid #70FE7E`，文字颜色 `#100F09`。
    - **Image Search** 与 **Video Search**：在 `.pricing-card-header` 中嵌入 `<span class="badge-ea">Early Access</span>`。
      - 样式对齐 `05-pricing`：高度 `20px`，内边距 `0 6px`，`border-radius: 4px`，字体 `JetBrains Mono`（中等 500，字号 11px，行高 1），底色 `#E3FFE2`，边框 `1px solid #6FD1A5`，文字颜色 `#1B9C62`。
  - **CSS 样式表深度清理**：
    - 从 [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中清理了废弃的 `.pricing-dual-card`、`.pricing-dual-tab` 与 `.pricing-dual-tag` 冗余样式代码，确保样式表精简高效。

### (93) Pay-as-you-go 价格卡片移除标题上方图标（完全对齐 05-pricing 纯净无图标风格）
- **需求**：去掉 标题上的icons（确认针对 Pay-as-you-go 价格卡片）。
- **落实方案**：
  - 在 [`index.html`](file:///x:/XCoding/Octen/08-search%20subpage/index.html) 中，彻底移除了 4 张卡片（Web Search、Broad Search、Image Search、Video Search）顶部的 `.pricing-card-icon` 容器及内部 SVG 图标。
  - 在 [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css) 中：
    - 移除了冗余的 `.pricing-card-icon` 与 `.pricing-card-icon svg` 样式规则；
    - 将 `.pricing-bento-card` 最小高度从 `180px` 紧凑优化为 `140px`，卡片内仅保留顶部的「API 标题 + 徽章」与底部的「价格信息」，呼吸感适中，视觉层次更加干净利落，100% 对齐 `05-pricing` 的极简工匠品质。

---

## 📂 4. 关键文件索引 (Key Files)
- [`index.html`](file:///x:/XCoding/Octen/08-search%20subpage/index.html)：页面结构骨架（含 Navbar 下拉菜单暗色应用卡片）
- [`css/style.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/style.css)：核心样式表（含 Navbar Application 卡片、Hero Canvas、scrollytelling、响应式、Pricing 样式）
- [`css/variables.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/variables.css)：全局主题变量与容器定义
- [`css/animations.css`](file:///x:/XCoding/Octen/08-search%20subpage/css/animations.css)：动效定义
- [`js/hero-orbit.js`](file:///x:/XCoding/Octen/08-search%20subpage/js/hero-orbit.js)：Hero 3D 球形环绕 Canvas 2D 渲染引擎
- [`js/main.js`](file:///x:/XCoding/Octen/08-search%20subpage/js/main.js)：交互逻辑（Scroll-spy 监听器、FAQ 折叠等）
- [`js/snippets.js`](file:///x:/XCoding/Octen/08-search%20subpage/js/snippets.js)：各 API 请求/响应代码示例数据

---

## 🎯 5. 下一步工作计划 (Next Steps)
1. **等待用户提供右侧 4 个插槽的替换内容**：
   - 收到具体内容后，在 `index.html` 中的 `.sticky-graphic-slot[data-slot-index="0..3"]` 填入对应的真实视觉内容（例如 SVG 交互图、数据演示、代码预览等）。
2. **其他用户待提出的页面优化需求**。

