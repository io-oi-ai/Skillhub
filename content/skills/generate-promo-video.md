---
name: "Generate Promo Video Generator"
description: "Automatically generate promotional GIF/MP4 videos from changelog using Remotion, supporting multiple video styles and animation effects"
author: "web-md"
roles: ["marketer", "developer", "designer"]
scenes: ["creative-design", "workflow"]
version: "1.0.0"
updatedAt: "2025-02-28"
tags: ["Video Generation", "Remotion", "Promotional Materials", "GIF", "Release", "Animation", "collection:indie-hacker"]
featured: true
source: "skillhub"
---

When the user asks you to generate a promotional video, create a release video, or make a changelog video, follow this workflow to produce Remotion-based GIF/MP4 output.

## Step 0: Discover Project Structure

Before writing any code, locate and read the Remotion project:

1. Search for `remotion.config.ts` or directories containing Remotion compositions
2. Read `Root.tsx` to understand the composition registration pattern
3. Read `package.json` to find existing render scripts and naming conventions
4. Read 1-2 existing compositions to learn the project's style patterns (colors, fonts, animations)
5. Find shared constants — look for where COLORS, FONTS, DIMENSIONS are defined

**Do NOT assume directory layouts.** Adapt to whatever structure you discover.

## Step 1: Gather Content

Ask the user what the video should showcase. Look for content in these sources:

| Source | How to Find |
|--------|-------------|
| Changelog | Search for `CHANGELOG.md` |
| Release Notes | Check git tags, GitHub releases |
| User Description | Ask the user directly |
| PR/Commit History | Run `git log --oneline` |

Extract: **product name**, **version**, **features/changes to showcase**, and whether related videos already exist.

## Step 2: Choose Video Style

Select the style based on content type:

| Content Type | Style | Duration |
|--------------|-------|----------|
| 1 Major Feature | Workflow Demo — 6-8 scenes showing usage steps | 20-40s |
| 2-4 Features | Feature Showcase — each feature 2-4 seconds | 15-30s |
| Before/After | Split-Screen Comparison — old vs new side-by-side | 10-20s |
| Bug Fixes/Minor | Quick Highlights — fast text card transitions | 8-15s |
| Product Intro | Complete Demo — Problem → Solution → Features → CTA | 30-60s |

Present the recommended style to the user and confirm before proceeding.

## Step 3: Generate Remotion Code

Create a new directory under the video source folder with two files:

1. **`styles.ts`** — Colors, fonts, timeline config, subtitle labels. Reuse the project's existing design tokens.
2. **`Composition.tsx`** — Scene components, animation logic, and closing screen.

Animation techniques to use:
- `interpolate()` for fade in/out and slide transitions
- `spring()` for bounce effects
- Delayed spring for staggered animations
- Sine-based breathing glow for emphasis

## Step 4: Register and Configure

1. Add the new composition to `Root.tsx` following existing patterns
2. Add render scripts to `package.json`:
   - GIF: `800×450`, `30fps`
   - MP4: `1280×720`, `30fps`

## Step 5: Preview and Render

1. Run `pnpm preview` and confirm the output looks correct
2. Render to the target format (GIF or MP4)
3. Copy output to the public directory and update any references (changelog, README, etc.)

## Constraints

- **Never hardcode pixel offsets** — always use `interpolate()` and `spring()`
- **Match existing visual style** — reuse COLORS/FONTS from the project's shared modules
- **GIF compositions must not import Audio** — GIF format does not support audio
- **Every video must end with a closing screen** — product branding + CTA
- **Frame math must be exact** — `totalFrames = fps × duration_seconds`
- **Do not modify existing compositions** — only create new ones

# 中文版

当用户要求生成宣传视频、发布视频或更新日志视频时，请按以下流程生成基于 Remotion 的 GIF/MP4。

## 第 0 步：了解项目结构

在写代码前，先定位并阅读 Remotion 项目：

1. 查找 `remotion.config.ts` 或包含 Remotion compositions 的目录
2. 阅读 `Root.tsx`，了解 Composition 的注册方式
3. 阅读 `package.json`，找到现有 render 脚本与命名规范
4. 阅读 1-2 个已有 composition，学习样式（颜色、字体、动画）
5. 找到共享常量 —— 确定 COLORS / FONTS / DIMENSIONS 的定义位置

**不要假设目录结构**，必须以实际结构为准。

## 第 1 步：收集内容

询问用户视频展示内容，并从以下来源提取：

| 来源 | 查找方式 |
|------|----------|
| Changelog | 搜索 `CHANGELOG.md` |
| Release Notes | 检查 git tags / GitHub releases |
| 用户描述 | 直接询问 |
| PR/Commit 历史 | 运行 `git log --oneline` |

提取：**产品名**、**版本号**、**要展示的功能/变化**、以及是否已有相关视频。

## 第 2 步：选择视频风格

根据内容类型选择风格：

| 内容类型 | 风格 | 时长 |
|----------|------|------|
| 1 个主要功能 | 工作流演示（6-8 场景） | 20-40s |
| 2-4 个功能 | 功能展示（每个 2-4s） | 15-30s |
| 前后对比 | 分屏对比（旧 vs 新） | 10-20s |
| Bug 修复/小更新 | 快速高亮（文字卡片切换） | 8-15s |
| 产品介绍 | 完整演示（问题→解决→功能→CTA） | 30-60s |

向用户推荐风格并确认后继续。

## 第 3 步：生成 Remotion 代码

在视频源目录新建一个目录，包含两个文件：

1. **`styles.ts`** —— 颜色、字体、时间轴配置、字幕标签。复用项目已有 token。
2. **`Composition.tsx`** —— 场景组件、动画逻辑、结尾画面。

可用动画技巧：
- `interpolate()` 实现淡入淡出与滑动
- `spring()` 实现弹性效果
- 延迟 spring 实现错峰动画
- 正弦呼吸光效用于强调

## 第 4 步：注册与配置

1. 按项目现有模式将新 composition 注册到 `Root.tsx`
2. 在 `package.json` 添加渲染脚本：
   - GIF：`800×450`, `30fps`
   - MP4：`1280×720`, `30fps`

## 第 5 步：预览与渲染

1. 运行 `pnpm preview`，确认预览正确
2. 渲染为目标格式（GIF 或 MP4）
3. 将输出复制到 public 目录，并更新引用（changelog/README 等）

## 约束

- **禁止硬编码像素偏移** —— 必须用 `interpolate()` / `spring()`
- **保持视觉风格一致** —— 复用项目已有 COLORS/FONTS
- **GIF 不能引入音频** —— GIF 不支持音轨
- **必须有结尾画面** —— 产品品牌 + CTA
- **帧数计算必须准确** —— `totalFrames = fps × duration_seconds`
- **不要修改已有 composition** —— 只新增
