---
name: "Better Icons"
description: "MCP server + skill for searching and retrieving 200,000+ icons from 150+ collections. Auto-learns preferred icon libraries, syncs icons directly to project files, supports React/Vue/Svelte/Solid/SVG."
author: "better-auth"
roles: ["developer", "designer"]
scenes: ["workflow", "coding"]
version: "1.0.0"
updatedAt: "2026-03-18"
tags: ["Icons", "MCP", "SVG", "React", "Vue", "Svelte", "Lucide", "Heroicons", "Material Design", "collection:developer-tools"]
featured: true
source: "github"
---

An MCP server and CLI tool for searching and retrieving 200,000+ icons from 150+ icon collections. Solves the problem of AI models not knowing which icons are available.

> **Source:** [better-auth/better-icons](https://github.com/better-auth/better-icons) — install with `npx better-icons setup`

## Key Features

- **200,000+ icons** across **150+ collections** (Lucide, Heroicons, Material Design, Tabler, Phosphor, Font Awesome, Simple Icons, Remix Icons, etc.)
- **Auto-learning**: Prioritizes icon collections you use most
- **Direct project sync**: Writes icons into `.tsx`, `.ts`, `.js` files in your project
- **Batch retrieval**: Up to 20 icons at a time
- **Cross-collection discovery**: Find similar icons across different sets
- **Recent usage history** tracking
- **Multi-framework**: React, Vue, Svelte, Solid, raw SVG

## MCP Tools

| Tool | Description |
|------|-------------|
| `search_icons` | Search across all collections |
| `get_icon` | Retrieve a specific icon |
| `get_icons` | Batch retrieve multiple icons |
| `list_collections` | Browse available icon sets |
| `recommend_icons` | Get icon suggestions |
| `find_similar_icons` | Discover variations across collections |
| `sync_icon` | Write icon directly to project file |
| `scan_project_icons` | Audit icons used in your project |

## Installation

### Quick Setup (Interactive)

```bash
npx better-icons setup
```

### As Claude Code Skill

```bash
npx add-skill better-auth/better-icons
```

### As MCP Server

Add to your MCP config (e.g., `~/.claude/settings.json`):

```json
{
  "mcpServers": {
    "better-icons": {
      "command": "npx",
      "args": ["-y", "better-icons"]
    }
  }
}
```

### CLI Usage

```bash
npx better-icons search arrow
npx better-icons get lucide:home > icon.svg
npx better-icons search settings --json | jq '.icons[:5]'
```

# 中文版

# Better Icons 图标搜索与管理

## 技能概览

MCP 服务器 + CLI 工具，可搜索和获取 150+ 图标集中的 20 万+ 图标。AI 编码助手不再需要猜测图标名称。

## 核心能力

- 搜索 20 万+ 图标，覆盖 Lucide、Heroicons、Material Design 等 150+ 图标集
- 自动学习常用图标库，优先推荐你偏好的风格
- 直接同步到项目文件，支持 React/Vue/Svelte/Solid/SVG
- 批量获取、跨集合查找相似图标

## 使用建议

推荐作为 MCP 服务器接入 Claude Code 或 Cursor，让 AI 在编码时自动搜索和插入正确的图标，告别手动查找。
