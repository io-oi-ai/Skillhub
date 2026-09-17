---
name: "AI Website Cloner"
description: "One-command website cloner using AI coding agents. Extracts design tokens, assets, and component specs, then dispatches parallel builders to reconstruct any site as a clean Next.js codebase."
author: "JCodesMore"
roles: ["developer"]
scenes: ["coding", "design"]
version: "1.0.0"
updatedAt: "2026-04-04"
tags: ["clone", "reverse-engineering", "nextjs", "shadcn", "tailwind", "web-scraping", "ai-agent", "browser-automation", "collection:developer-tools"]
featured: false
source: "https://github.com/JCodesMore/ai-website-cloner-template"
---

# AI Website Cloner Template

用一条命令，将任意网站逆向重建为干净的 Next.js 代码库。

**推荐使用 Claude Code + Opus 4.6**，但也支持 Codex、Cursor、Windsurf、Gemini CLI 等主流 AI 编程 Agent。

## 快速开始

```bash
# 1. 克隆模板仓库
git clone https://github.com/JCodesMore/ai-website-cloner-template.git my-clone
cd my-clone

# 2. 安装依赖
npm install

# 3. 启动 AI Agent（推荐 Claude Code）
claude --chrome

# 4. 运行克隆技能
/clone-website <目标网址1> [<目标网址2> ...]
```

## 技术栈

- **Next.js 16** — App Router、React 19、TypeScript strict
- **shadcn/ui** — Radix 原语 + Tailwind CSS v4
- **Tailwind CSS v4** — oklch 设计 Token
- **Lucide React** — 默认图标（克隆过程中会替换为提取的 SVG）

## 支持的 AI Agent

| Agent | 状态 |
|-------|------|
| Claude Code | **推荐** — Opus 4.6 |
| Codex CLI | 支持 |
| OpenCode | 支持 |
| GitHub Copilot | 支持 |
| Cursor | 支持 |
| Windsurf | 支持 |
| Gemini CLI | 支持 |
| Cline / Roo Code | 支持 |
| Amazon Q | 支持 |
| Aider | 支持 |

## 工作原理

`/clone-website` 技能运行多阶段流水线：

### 阶段 1：侦察（Reconnaissance）

- 在桌面端（1440px）和移动端（390px）截全屏图
- 提取全局字体、颜色、favicon 和 meta
- **强制交互扫描**：
  - **滚动扫描** — 缓慢滚动页面，记录滚动驱动的动画、吸附点、header 变化触发位置
  - **点击扫描** — 点击所有按钮、标签、pill，记录每个状态的内容
  - **悬停扫描** — 记录所有 hover 状态的 CSS 变化
  - **响应式扫描** — 在 1440px / 768px / 390px 三个视口测试布局变化
- 输出 `docs/research/BEHAVIORS.md`（行为圣经）和 `docs/research/PAGE_TOPOLOGY.md`（页面拓扑）

### 阶段 2：基础构建（Foundation Build）

按顺序执行（不委托给子 Agent）：

1. 更新 `layout.tsx` 字体配置（`next/font/google` 或 `next/font/local`）
2. 更新 `globals.css`：颜色 Token、间距、关键帧动画、全局滚动行为
3. 在 `src/types/` 创建 TypeScript 接口
4. 提取所有内联 SVG，保存为命名 React 组件 `src/components/icons.tsx`
5. 运行资产下载脚本，将所有图片/视频下载到 `public/`
6. 验证：`npm run build` 通过

**资产发现脚本（通过浏览器 MCP 运行）：**

```javascript
JSON.stringify({
  images: [...document.querySelectorAll('img')].map(img => ({
    src: img.src || img.currentSrc,
    alt: img.alt,
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight,
    parentClasses: img.parentElement?.className,
    position: getComputedStyle(img).position,
    zIndex: getComputedStyle(img).zIndex
  })),
  videos: [...document.querySelectorAll('video')].map(v => ({
    src: v.src || v.querySelector('source')?.src,
    poster: v.poster, autoplay: v.autoplay
  })),
  backgroundImages: [...document.querySelectorAll('*')].filter(el => {
    const bg = getComputedStyle(el).backgroundImage;
    return bg && bg !== 'none';
  }).map(el => ({
    url: getComputedStyle(el).backgroundImage,
    element: el.tagName + '.' + el.className?.split(' ')[0]
  })),
  fonts: [...new Set([...document.querySelectorAll('*')].slice(0, 200)
    .map(el => getComputedStyle(el).fontFamily))]
});
```

### 阶段 3：组件规格 & 派发（Component Specification & Dispatch）

核心循环——对页面拓扑中的每个区域，依次执行：

**Step 1：提取 CSS（使用 getComputedStyle）**

```javascript
(function(selector) {
  const el = document.querySelector(selector);
  const props = [
    'fontSize','fontWeight','fontFamily','lineHeight','letterSpacing','color',
    'backgroundColor','padding','margin','width','height','maxWidth',
    'display','flexDirection','justifyContent','alignItems','gap',
    'gridTemplateColumns','borderRadius','border','boxShadow','overflow',
    'position','top','right','bottom','left','zIndex',
    'opacity','transform','transition','cursor','backdropFilter'
  ];
  function extractStyles(element) {
    const cs = getComputedStyle(element);
    const styles = {};
    props.forEach(p => {
      const v = cs[p];
      if (v && v !== 'none' && v !== 'normal' && v !== 'auto' && v !== '0px' && v !== 'rgba(0, 0, 0, 0)') styles[p] = v;
    });
    return styles;
  }
  function walk(element, depth) {
    if (depth > 4) return null;
    const children = [...element.children];
    return {
      tag: element.tagName.toLowerCase(),
      classes: element.className?.toString().split(' ').slice(0, 5).join(' '),
      text: element.childNodes.length === 1 && element.childNodes[0].nodeType === 3
        ? element.textContent.trim().slice(0, 200) : null,
      styles: extractStyles(element),
      childCount: children.length,
      children: children.slice(0, 20).map(c => walk(c, depth + 1)).filter(Boolean)
    };
  }
  return JSON.stringify(walk(el, 0), null, 2);
})('SELECTOR');
```

**Step 2：编写组件规格文件**（`docs/research/components/<name>.spec.md`）

```markdown
# <ComponentName> Specification

## Overview
- **Target file:** `src/components/<ComponentName>.tsx`
- **Screenshot:** `docs/design-references/<screenshot>.png`
- **Interaction model:** <static | click-driven | scroll-driven | time-driven>

## DOM Structure
<元素层级结构>

## Computed Styles (exact values from getComputedStyle)
### Container
- display: flex
- padding: 48px 24px
- maxWidth: 1200px

## States & Behaviors
### <行为名称，如 "Scroll-triggered floating mode">
- **Trigger:** 滚动超过 50px
- **State A:** maxWidth: 100vw, boxShadow: none
- **State B:** maxWidth: 1200px, boxShadow: 0 4px 20px rgba(0,0,0,0.1)
- **Transition:** all 0.3s ease

## Per-State Content (if applicable)
### State: "Featured"
- Cards: [{ title, description, image, link }, ...]

## Assets
- Background: `public/images/<file>.webp`
- Icons: <ArrowIcon>, <SearchIcon> from icons.tsx

## Text Content (verbatim)
<从真实网站复制的所有文字>

## Responsive Behavior
- **Desktop (1440px):** 3列网格
- **Tablet (768px):** 2列，间距缩小到 16px
- **Mobile (390px):** 单列，图片全宽
```

**Step 3：在 Worktree 中派发构建 Agent**

- 简单区块（1-2 个子组件）：一个 Agent 处理整个区块
- 复杂区块（3+ 个子组件）：每个子组件一个 Agent + 一个 wrapper Agent
- **不等待**——派发完一个区块的构建任务后，立即继续提取下一个区块
- 每个 Builder Agent 必须内联接收完整规格，不能让它去读文件

**构建 Agent 必须包含的指令：**
- 完整的规格文件内容（内联）
- 截图路径
- 使用哪些共享组件（icons.tsx、cn()、shadcn primitives）
- 目标文件路径
- 验证指令：`npx tsc --noEmit`

### 阶段 4：页面组装（Page Assembly）

在 `src/app/page.tsx` 中串联所有区块：
- 导入所有 section 组件
- 实现页面级布局（滚动容器、粘性定位、z-index 层）
- 实现页面级行为（Lenis 平滑滚动、scroll-driven 动画、IntersectionObserver）
- 验证：`npm run build` 通过

### 阶段 5：视觉 QA 对比

**不要在没有 QA 的情况下宣布完成：**

1. 在 1440px 和 390px 分别截图对比原站和克隆站
2. 逐区块从上到下对比
3. 测试所有交互：滚动、点击、悬停、动画
4. 验证平滑滚动手感、header 过渡、标签切换正常

## 核心原则

### 1. 完整性优先于速度

每个 Builder Agent 必须获得完美完成任务所需的**一切**：截图、精确 CSS 值、下载的资产本地路径、真实文字内容。如果 Builder 需要猜任何东西——一个颜色、一个字体大小——说明提取工作做得不够好。

### 2. 小任务，完美结果

当 Agent 接到"构建整个 features 区块"时，它会泛化细节。当它拿到一个有精确 CSS 值的单一组件时，它每次都能做到位。

**复杂度预算规则**：如果一个 Builder 的规格内容超过 ~150 行，说明任务太复杂，需要拆分。

### 3. 真实内容，真实资产

提取网站上实际的文字、图片、视频、SVG。这是克隆，不是 mockup。唯一生成内容的情况是服务器动态生成的内容。

**注意层叠资产**：一个看起来像单张图片的区块往往是多个图层——背景图、前景 UI mockup PNG、叠加图标。检查每个容器的完整 DOM 树。

### 4. 先确定交互模型

克隆中最昂贵的错误：把滚动驱动的 UI 做成了点击驱动的，或反过来。

判断方法：
1. **不要先点击**——先缓慢滚动观察内容是否自动变化
2. 如果内容随滚动变化：提取机制（IntersectionObserver、scroll-snap、position: sticky）
3. 如果滚动没有变化：再测试点击/悬停

在规格文件中明确记录：`INTERACTION MODEL: scroll-driven with IntersectionObserver`

### 5. 提取所有状态

- 标签内容：点击每个标签，提取每个状态的内容
- 滚动触发元素：在 position 0 和 100px+ 分别捕获计算样式
- Hover 状态：记录前后属性值和过渡时间

## 派发前检查清单

```
- [ ] 规格文件已写入，ALL 章节已填写
- [ ] 所有 CSS 值来自 getComputedStyle()，未估算
- [ ] 交互模型已确定（static / click / scroll / time）
- [ ] 有状态组件：所有状态的内容和样式已捕获
- [ ] 滚动驱动组件：触发阈值、前后样式、过渡已记录
- [ ] Hover 状态：前后值和过渡时序已记录
- [ ] 区块中所有图片已识别（包括叠加图层）
- [ ] 至少在桌面和移动端记录了响应式行为
- [ ] 文字内容是逐字提取的，未改写
- [ ] Builder 规格内容 < 150 行（否则需要拆分）
```

## 常见错误（避坑指南）

| 错误 | 代价 | 正确做法 |
|------|------|----------|
| 将滚动驱动 UI 做成点击驱动 | 完全重写 | 先滚动观察，再点击测试 |
| 只提取默认状态 | 所有标签内容缺失 | 点击每个标签，提取每个状态 |
| 漏掉叠加图片 | 区块显示空洞 | 检查每个容器的完整 DOM 树 |
| 把视频区块做成 HTML mockup | 完全返工 | 先检查是否为 `<video>` 或 Lottie |
| 用 Tailwind class 估算尺寸 | 精度不足 | 始终用 getComputedStyle() 提取精确值 |
| 漏掉平滑滚动库 | 手感明显不对 | 检查 `.lenis`、`.locomotive-scroll` 类 |
| 没有规格文件就派发 Builder | Builder 靠猜 | 先写规格，再派发 |

## 项目结构

```
src/
  app/              # Next.js 路由
  components/
    ui/             # shadcn/ui 原语
    icons.tsx       # 提取的 SVG 图标
  lib/utils.ts      # cn() 工具函数
  types/            # TypeScript 接口
  hooks/            # 自定义 Hooks
public/
  images/           # 下载的目标站图片
  videos/           # 下载的目标站视频
  seo/              # Favicon、OG 图
docs/
  research/         # 提取输出和组件规格
  design-references/ # 截图参考
scripts/
  download-assets.mjs  # 资产下载脚本
  sync-skills.mjs      # 同步 /clone-website 到所有平台
```

## 常用命令

```bash
npm run dev       # 启动开发服务器
npm run build     # 生产构建
npm run check     # lint + typecheck + build 全套检查

# Docker 模式
docker compose up app --build   # 生产模式
docker compose up dev --build   # 开发模式（端口 3001）
```

## 适用场景

- **平台迁移** — 将自己的 WordPress/Webflow/Squarespace 网站重建为现代 Next.js 代码
- **源码丢失恢复** — 网站还在线，但仓库没了、开发者跑了、或技术栈已过时
- **学习研究** — 拆解生产级网站如何实现特定布局、动画和响应式行为

## 不适用场景

- 钓鱼网站或冒充他人身份
- 将他人设计冒充为自己原创（Logo、品牌资产、原创文案属于原作者）
- 违反目标网站使用条款（部分网站明确禁止抓取，请事先确认）

---

# English Version

# AI Website Cloner Template

Clone any website with one command using AI coding agents.

**Recommended: Claude Code with Opus 4.6** — but works with Codex, Cursor, Windsurf, Gemini CLI, and others.

## Quick Start

```bash
git clone https://github.com/JCodesMore/ai-website-cloner-template.git my-clone
cd my-clone
npm install
claude --chrome
# then run:
/clone-website <target-url>
```

## How It Works

A 5-phase pipeline:

1. **Reconnaissance** — screenshots, design token extraction, mandatory interaction sweep (scroll, click, hover, responsive at 1440/768/390px)
2. **Foundation** — fonts, colors, globals, SVG icons, asset downloads. Sequential, done by you.
3. **Component Spec & Dispatch** — for each section: extract CSS with `getComputedStyle()`, write a spec file to `docs/research/components/`, dispatch builder agents in git worktrees
4. **Assembly** — wire all sections in `src/app/page.tsx`, implement page-level scroll behaviors
5. **Visual QA Diff** — side-by-side screenshot comparison, test all interactions

## Key Principles

- **Completeness beats speed** — builders must receive everything: exact CSS values, downloaded assets, real content, all states
- **Small tasks, perfect results** — if a builder spec exceeds ~150 lines, split it
- **Identify the interaction model first** — scroll-driven vs. click-driven is the #1 most expensive mistake
- **Extract ALL states** — click every tab, capture scroll-triggered before/after styles
- **Build must always compile** — `npx tsc --noEmit` before finishing, `npm run build` after every merge

## Tech Stack

Next.js 16 · shadcn/ui · Tailwind CSS v4 · TypeScript strict · Lucide React

## GitHub

[github.com/JCodesMore/ai-website-cloner-template](https://github.com/JCodesMore/ai-website-cloner-template) — 7400+ stars
