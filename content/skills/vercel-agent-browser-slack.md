---
name: "Slack Browser Automation"
description: "Interact with Slack workspaces using browser automation — check unreads, navigate channels, send messages, search conversations, and extract data"
author: "Vercel Labs"
roles: ["everyone", "developer", "operations"]
scenes: ["communication", "workflow"]
version: "1.0.0"
updatedAt: "2026-03-03"
tags: ["slack", "browser automation", "messaging", "agent-browser", "workspace", "collection:developer-tools"]
featured: false
---

# Slack Automation

Interact with Slack workspaces to check messages, extract data, and automate common tasks.

## Quick Start

Connect to an existing Slack browser session or open Slack:

```bash
# Connect to existing session on port 9222 (typical for already-open Slack)
agent-browser connect 9222

# Or open Slack if not already running
agent-browser open https://app.slack.com
```

Then take a snapshot to see what's available:

```bash
agent-browser snapshot -i
```

## Core Workflow

1. **Connect/Navigate**: Open or connect to Slack
2. **Snapshot**: Get interactive elements with refs (`@e1`, `@e2`, etc.)
3. **Navigate**: Click tabs, expand sections, or navigate to specific channels
4. **Extract/Interact**: Read data or perform actions
5. **Screenshot**: Capture evidence of findings

```bash
# Example: Check unread channels
agent-browser connect 9222
agent-browser snapshot -i
# Look for "More unreads" button
agent-browser click @e21  # Ref for "More unreads" button
agent-browser screenshot slack-unreads.png
```

## Common Tasks

### Checking Unread Messages

```bash
# Connect to Slack
agent-browser connect 9222

# Take snapshot to locate unreads button
agent-browser snapshot -i

# Look for:
# - "More unreads" button (usually near top of sidebar)
# - "Unreads" toggle in Activity tab (shows unread count)
# - Channel names with badges/bold text indicating unreads

# Navigate to Activity tab to see all unreads in one view
agent-browser click @e14  # Activity tab (ref may vary)
agent-browser wait 1000
agent-browser screenshot activity-unreads.png

# Or check DMs tab
agent-browser click @e13  # DMs tab
agent-browser screenshot dms.png

# Or expand "More unreads" in sidebar
agent-browser click @e21  # More unreads button
agent-browser wait 500
agent-browser screenshot expanded-unreads.png
```

### Navigating to a Channel

```bash
# Search for channel in sidebar or by name
agent-browser snapshot -i

# Look for channel name in the list (e.g., "engineering", "product-design")
# Click on the channel treeitem ref
agent-browser click @e94  # Example: engineering channel ref
agent-browser wait --load networkidle
agent-browser screenshot channel.png
```

### Finding Messages/Threads

```bash
# Use Slack search
agent-browser snapshot -i
agent-browser click @e5  # Search button (typical ref)
agent-browser fill @e_search "keyword"
agent-browser press Enter
agent-browser wait --load networkidle
agent-browser screenshot search-results.png
```

### Extracting Channel Information

```bash
# Get list of all visible channels
agent-browser snapshot --json > slack-snapshot.json

# Parse for channel names and metadata
# Look for treeitem elements with level=2 (sub-channels under sections)
```

### Checking Channel Details

```bash
# Open a channel
agent-browser click @e_channel_ref
agent-browser wait 1000

# Get channel info (members, description, etc.)
agent-browser snapshot -i
agent-browser screenshot channel-details.png

# Scroll through messages
agent-browser scroll down 500
agent-browser screenshot channel-messages.png
```

### Taking Notes/Capturing State

When you need to document findings from Slack:

```bash
# Take annotated screenshot (shows element numbers)
agent-browser screenshot --annotate slack-state.png

# Take full-page screenshot
agent-browser screenshot --full slack-full.png

# Get current URL for reference
agent-browser get url

# Get page title
agent-browser get title
```

## Sidebar Structure

Understanding Slack's sidebar helps you navigate efficiently:

```
- Threads
- Huddles
- Drafts & sent
- Directories
- [Section Headers - External connections, Starred, Channels, etc.]
  - [Channels listed as treeitems]
- Direct Messages
  - [DMs listed]
- Apps
  - [App shortcuts]
- [More unreads] button (toggles unread channels list)
```

Key refs to look for:
- `@e12` - Home tab (usually)
- `@e13` - DMs tab
- `@e14` - Activity tab
- `@e5` - Search button
- `@e21` - More unreads button (varies by session)

## Tabs in Slack

After clicking on a channel, you'll see tabs:
- **Messages** - Channel conversation
- **Files** - Shared files
- **Pins** - Pinned messages
- **Add canvas** - Collaborative canvas
- Other tabs depending on workspace setup

Click tab refs to switch views and get different information.

## Extracting Data from Slack

### Get Text Content

```bash
# Get a message or element's text
agent-browser get text @e_message_ref
```

### Parse Accessibility Tree

```bash
# Full snapshot as JSON for programmatic parsing
agent-browser snapshot --json > output.json

# Look for:
# - Channel names (name field in treeitem)
# - Message content (in listitem/document elements)
# - User names (button elements with user info)
# - Timestamps (link elements with time info)
```

### Count Unreads

```bash
# After expanding unreads section:
agent-browser snapshot -i | grep -c "treeitem"
# Each treeitem with a channel name in the unreads section is one unread
```

## Best Practices

- **Connect to existing sessions**: Use `agent-browser connect 9222` if Slack is already open. This is faster than opening a new browser.
- **Take snapshots before clicking**: Always `snapshot -i` to identify refs before clicking buttons.
- **Re-snapshot after navigation**: After navigating to a new channel or section, take a fresh snapshot to find new refs.
- **Use JSON snapshots for parsing**: When you need to extract structured data, use `snapshot --json` for machine-readable output.
- **Pace interactions**: Add `sleep 1` between rapid interactions to let the UI update.
- **Check accessibility tree**: The accessibility tree shows what screen readers (and your automation) can see. If an element isn't in the snapshot, it may be hidden or require scrolling.
- **Scroll in sidebar**: Use `agent-browser scroll down 300 --selector ".p-sidebar"` to scroll within the Slack sidebar if channel list is long.

## Limitations

- **Cannot access Slack API**: This uses browser automation, not the Slack API. No OAuth, webhooks, or bot tokens needed.
- **Session-specific**: Screenshots and snapshots are tied to the current browser session.
- **Rate limiting**: Slack may rate-limit rapid interactions. Add delays between commands if needed.
- **Workspace-specific**: You interact with your own workspace -- no cross-workspace automation.

## Debugging

### Check console for errors

```bash
agent-browser console
agent-browser errors
```

### View raw HTML of an element

```bash
# Snapshot shows the accessibility tree. If an element isn't there,
# it may not be interactive (e.g., div instead of button)
# Use snapshot -i -C to include cursor-interactive divs
agent-browser snapshot -i -C
```

### Get current page state

```bash
agent-browser get url
agent-browser get title
agent-browser screenshot page-state.png
```

## Example: Full Unread Check

```bash
#!/bin/bash

# Connect to Slack
agent-browser connect 9222

# Take initial snapshot
echo "=== Checking Slack unreads ==="
agent-browser snapshot -i > snapshot.txt

# Check Activity tab for unreads
agent-browser click @e14  # Activity tab
agent-browser wait 1000
agent-browser screenshot activity.png
ACTIVITY_RESULT=$(agent-browser get text @e_main_area)
echo "Activity: $ACTIVITY_RESULT"

# Check DMs
agent-browser click @e13  # DMs tab
agent-browser wait 1000
agent-browser screenshot dms.png

# Check unread channels in sidebar
agent-browser click @e21  # More unreads button
agent-browser wait 500
agent-browser snapshot -i > unreads-expanded.txt
agent-browser screenshot unreads.png

# Summary
echo "=== Summary ==="
echo "See activity.png, dms.png, and unreads.png for full details"
```

## References

- **Slack docs**: https://slack.com/help
- **Web experience**: https://app.slack.com
- **Keyboard shortcuts**: Type `?` in Slack for shortcut list

# 中文版

# Slack 自动化

通过浏览器自动化与 Slack 工作区交互，用于查看未读、切换频道、发送消息、搜索对话和提取信息。

## 快速开始

连接到已有 Slack 浏览器会话，或直接打开 Slack：

```bash
# 连接到 9222 端口上的现有会话（通常用于已打开 Slack 的场景）
agent-browser connect 9222

# 若未打开 Slack，可直接访问
agent-browser open https://app.slack.com
```

然后先抓取一次快照，查看当前可交互元素：

```bash
agent-browser snapshot -i
```

## 核心流程

1. **连接/导航**：打开或连接 Slack
2. **抓快照**：获取交互元素引用（`@e1`、`@e2` 等）
3. **页面导航**：点击标签页、展开分组、进入目标频道
4. **读取/操作**：提取数据或执行操作
5. **截图留证**：保留结果证据

```bash
# 示例：检查未读频道
agent-browser connect 9222
agent-browser snapshot -i
# 查找 "More unreads" 按钮
agent-browser click @e21
agent-browser screenshot slack-unreads.png
```

## 常见任务

### 查看未读消息

```bash
agent-browser connect 9222
agent-browser snapshot -i

# 重点查找：
# - "More unreads" 按钮（通常在侧栏上方）
# - Activity 标签中的未读入口/计数
# - 带徽标或加粗的频道名称

agent-browser click @e14  # Activity（引用会变化）
agent-browser wait 1000
agent-browser screenshot activity-unreads.png
```

### 进入指定频道

```bash
agent-browser snapshot -i
agent-browser click @e94  # 示例：某频道引用
agent-browser wait --load networkidle
agent-browser screenshot channel.png
```

### 搜索消息/线程

```bash
agent-browser snapshot -i
agent-browser click @e5
agent-browser fill @e_search "keyword"
agent-browser press Enter
agent-browser wait --load networkidle
agent-browser screenshot search-results.png
```

### 提取频道信息

```bash
agent-browser snapshot --json > slack-snapshot.json
# 在 JSON 中解析频道名、层级、元数据
```

### 记录现场信息

```bash
agent-browser screenshot --annotate slack-state.png
agent-browser screenshot --full slack-full.png
agent-browser get url
agent-browser get title
```

## 侧栏结构速览

典型 Slack 侧栏包含：

- Threads
- Huddles
- Drafts & sent
- Directories
- 各类分组（Starred、Channels 等）
- Direct Messages
- Apps
- More unreads（展开未读频道）

常见引用（实际以快照为准）：

- `@e12`：Home
- `@e13`：DMs
- `@e14`：Activity
- `@e5`：Search
- `@e21`：More unreads

## 数据提取

### 获取文本

```bash
agent-browser get text @e_message_ref
```

### 解析无障碍树（推荐）

```bash
agent-browser snapshot --json > output.json
```

可从中提取：

- 频道名称（`treeitem`）
- 消息内容（`listitem` / `document`）
- 用户信息
- 时间戳

### 统计未读频道

```bash
agent-browser snapshot -i | grep -c "treeitem"
```

## 最佳实践

- 优先 `connect 9222` 复用现有会话，速度更快。
- 点击前先 `snapshot -i`，避免误点错误引用。
- 页面切换后立即重新快照，引用常会变化。
- 需要结构化抽取时使用 `snapshot --json`。
- 高频操作间加短等待（如 `sleep 1` / `wait 500`）。
- 侧栏过长时用 `scroll --selector ".p-sidebar"` 定位目标。

## 限制说明

- 本技能走浏览器自动化，不是 Slack API。
- 截图与快照仅对当前会话有效。
- 交互过快可能触发 Slack 限流。
- 仅能操作当前登录的工作区。

## 调试建议

```bash
agent-browser console
agent-browser errors
agent-browser snapshot -i -C
agent-browser get url
agent-browser get title
agent-browser screenshot page-state.png
```

## 参考

- Slack 帮助文档：https://slack.com/help
- Web 入口：https://app.slack.com
- 快捷键：在 Slack 中输入 `?`
