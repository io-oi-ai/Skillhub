---
name: "Generate Promo 宣传视频生成"
description: "使用 Remotion 从更新日志自动生成宣传 GIF/MP4 视频，支持多种视频风格和动画效果"
author: "web-md"
roles: ["marketer", "developer", "designer"]
scenes: ["creative-design", "workflow"]
version: "1.0.0"
updatedAt: "2025-02-28"
tags: ["视频生成", "Remotion", "宣传素材", "GIF", "发布", "动画"]
featured: true
source: "skillhub"
---

# Generate Promo — Remotion 宣传视频生成器

一个项目通用的 Skill，用于使用 Remotion 生成宣传 GIF/MP4 视频。适用于任何拥有 Remotion 视频项目的产品。

## 触发方式

当用户说以下类似内容时触发：
- "generate promo"、"create release video"、"make changelog video"
- "生成宣传素材"、"做一个新版本的视频"、"发布视频"
- `/generate-promo`

## 工作流程

### 第 0 步：发现项目结构

在开始之前，自动定位 Remotion 项目：
1. **查找视频目录** — 搜索 `remotion.config.ts` 或包含 Remotion composition 的目录
2. **阅读 `Root.tsx`** — 了解现有的 composition 注册模式
3. **阅读 `package.json`** — 查找现有的渲染脚本和命名约定
4. **阅读 1-2 个现有 composition** — 学习项目的特定风格模式（颜色、字体、动画约定）
5. **识别共享常量** — 查找 COLORS、FONTS、DIMENSIONS 的定义位置

> **重要：** 每个项目都不同，不要假设特定的目录布局，要适应你发现的内容。

### 第 1 步：收集内容

询问用户视频应该展示什么。常见来源：

| 来源 | 如何查找 |
|------|---------|
| Changelog 文件 | 搜索 `changelog`、`CHANGELOG.md` |
| Release Notes | 检查 git tags、GitHub releases |
| 用户描述 | 用户直接告知要突出的功能 |
| PR/commit 历史 | `git log --oneline` 查看最近变更 |

提取：产品名称和版本、要展示的功能/变更、是否已有相关视频。

### 第 2 步：选择视频风格

根据内容选择合适的风格：

| 内容类型 | 风格 | 时长 |
|---------|------|------|
| 1 个重大新功能 | **工作流演示** — 6-8 个场景展示使用步骤 | 20-40 秒 |
| 2-4 个功能 | **功能展示** — 每个功能 2-4 秒 | 15-30 秒 |
| 前后对比改进 | **分屏对比** — 并排展示新旧版本 | 10-20 秒 |
| Bug 修复/小改动 | **快速集锦** — 快速文字卡切换 | 8-15 秒 |
| 产品介绍 | **完整演示** — 问题→方案→功能→CTA | 30-60 秒 |

### 第 3 步：生成 Remotion 代码

在视频源文件夹下创建新目录，生成两个文件：

- **`styles.ts`** — 颜色、字体、时间轴配置和字幕标签
- **`Composition.tsx`** — 场景组件、动画逻辑和结束画面

### 第 4 步：注册 Composition

更新 `Root.tsx` 和 `package.json`：
- GIF：`800×450`，`30fps`
- MP4：`1280×720`，`30fps`

### 第 5 步：预览与渲染

1. 先预览：`pnpm preview`
2. 渲染 GIF 或 MP4
3. 后置任务：复制到 public 目录、更新 changelog 等

## 动画参考

支持的动画效果包括：
- **淡入淡出** — `interpolate()` 控制透明度
- **弹性动画** — `spring()` 实现弹跳效果
- **延迟弹性** — 延迟启动的 spring 动画
- **呼吸发光** — 正弦函数控制发光强度
- **滑入** — 从侧边滑入的动画

## 核心规则

- 永远不要硬编码像素偏移 — 使用 `interpolate()` 和 `spring()`
- 匹配项目现有视觉风格 — 复用共享模块中的 COLORS/FONTS
- GIF 不支持音频 — 不要在 GIF composition 中导入 Audio
- 结束画面是必须的 — 每个视频必须以产品品牌 + CTA 结尾
- 帧计算必须正确 — `totalFrames = fps × duration_seconds`
