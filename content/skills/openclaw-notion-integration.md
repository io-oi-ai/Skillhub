---
name: "Notion Integration"
description: "Complete CRUD operations for Notion pages and databases with AI-driven knowledge management"
author: "OpenClaw Community"
roles: ["everyone", "product-manager"]
scenes: ["workflow", "project-management"]
version: "1.0.0"
updatedAt: "2025-02-15"
tags: ["OpenClaw", "Notion", "knowledge management", "project management", "collection:developer-tools"]
featured: false
source: "clawhub.ai"
---

# Notion Integration

## Overview

Notion Integration skill enables complete operational capabilities on your Notion workspace through the Notion API, allowing you to create pages, manage databases, and organize knowledge bases using natural language. After understanding your intent, AI directly manipulates Notion, saving time spent clicking through the interface. It's especially suitable for scenarios requiring bulk operations or regular content updates.

## Core Features

### Page Management
- Create richly formatted Notion pages through conversation, supporting block types like headings, lists, code blocks, and quotes
- Search and locate existing pages to quickly find needed information
- Bulk update page content, such as unified format changes or tag additions
- Create child pages under specified pages to maintain clear hierarchical structures

### Database Operations
- Create databases and define property fields (text, number, date, single select, multi-select, relations, etc.)
- Add entries to databases in bulk, eliminating tedious manual entry
- Query and filter database content by conditions to quickly retrieve needed information
- Update properties of existing entries, supporting bulk modifications

### Knowledge Management
- Automatically archive meeting notes, document summaries, and other content to corresponding Notion pages
- Automatically create to-do items from chat content and add them to task databases
- Reorganize and restructure existing knowledge base structures to improve information retrieval efficiency
- Extract information from external content (web pages, documents) and write to Notion

### Project Management Support
- Create and update task cards in project dashboards
- Bulk adjust task properties like status, assignees, and due dates
- Generate project progress summaries, automatically counting tasks in different statuses
- Quickly create complete page structures for new projects using templates

## Typical Use Cases

1. **Team Knowledge Base Maintenance**: Consolidate scattered documents throughout your workspace into a unified Notion knowledge base
2. **Meeting Management**: Automatically write meeting notes to Notion and create corresponding action items
3. **Product Requirements Management**: Bulk upload requirements to databases and track priority and status
4. **Personal Note Organization**: Categorize and archive learning notes and reading excerpts to Notion

## Usage Examples

- "Add 5 new requirements to the product requirements database, all with P1 priority"
- "Search for all pages in the knowledge base about user research and prepare a summary"
- "Create a new project dashboard with To-Do, In Progress, and Completed statuses"
- "Write these meeting notes to Notion under the team space's meeting records"

## Important Notes

- Before using, you need to create a Notion Integration and configure the API Token
- You must add the Integration to the target page or database connections to gain access
- Notion API has rate limits; bulk operations automatically throttle request speed
- It's recommended to verify operations on test pages first to avoid accidental changes to production content

# 中文版

# Notion 集成

## 技能概览

Notion Integration 支持 Notion 页面与数据库的增删改查，帮助你自动化知识管理、任务管理和项目协作流程。

## 核心能力

- 页面与数据库的创建、查询、更新
- 支持多字段类型（文本、日期、选择、多选、关联等）
- 批量写入和批量更新数据库记录
- 将会议纪要、任务、摘要自动入库

## 典型场景

- 团队知识库维护
- 会议纪要自动归档并生成待办
- 产品需求数据库管理
- 个人笔记系统化整理

## 使用建议

先配置 Integration 权限与测试库，再在生产空间执行批量操作。
