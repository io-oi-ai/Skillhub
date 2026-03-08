---
name: "AgenticMail Email Management"
description: "Comprehensive email, SMS, and multi-Agent coordination system with 63 tools"
author: "OpenClaw Community"
roles: ["everyone", "operations"]
scenes: ["communication", "workflow"]
version: "1.0.0"
updatedAt: "2025-02-20"
tags: ["OpenClaw", "Email", "SMS", "Automation", "Multi-Agent"]
featured: false
source: "clawhub.ai"
---

## Overview

AgenticMail is a comprehensive communication management skill for AI Agents, integrating email sending/receiving, SMS processing, and multi-Agent coordination capabilities. It provides over 63 specialized tools, covering everything from simple email sending to complex multi-channel communication orchestration.

## Core Features

### Complete Email Lifecycle Management

AgenticMail supports the complete email workflow: receiving new emails, parsing content and attachments, intelligent classification and archiving, drafting replies, batch sending, and tracking delivery status. Agents can operate like experienced administrative assistants, autonomously handling large volumes of routine email tasks.

### SMS Integration

Beyond email, the system integrates SMS sending capabilities, suitable for scenarios requiring immediate notifications such as meeting reminders, urgent notifications, or verification code delivery. Email and SMS can be coordinated within the same workflow.

### Multi-Agent Coordination

A key highlight of AgenticMail is multi-Agent coordination. When a communication task involves multiple steps, different Agents can take responsibility: one Agent handles email classification, another drafts replies, and a third reviews content. These Agents collaborate efficiently through AgenticMail's coordination mechanism.

### Intelligent Email Processing Rules

You can define email processing rules in natural language, such as "immediately forward customer complaint emails to the customer service manager and mark as high priority" or "summarize all unanswered emails each Friday afternoon". The system will transform these rules into automated workflows.

## Typical Use Cases

- **Enterprise Email Automation**: Automatically handle large volumes of repetitive emails such as order confirmations, shipping notifications, and customer inquiry responses, freeing up team time and energy.
- **Customer Communication Management**: Track customer email response status and automatically send reminders if responses exceed the set timeframe, ensuring no important communications are missed.
- **Cross-department Coordination**: When receiving emails requiring multi-department collaboration, automatically distribute tasks to relevant department Agents and consolidate feedback for unified responses.
- **Meeting Management**: Automatically send meeting invitations, collect attendance confirmations, distribute pre-meeting materials, and send post-meeting summaries to create a complete meeting communication loop.
- **Periodic Report Distribution**: Generate and automatically send weekly reports, monthly reports, and other periodic reports to specified recipient lists according to schedule.

## Usage Instructions

1. Integrate the AgenticMail skill into your Agent project.
2. Configure email account connection information (supports IMAP/SMTP and mainstream email service APIs).
3. Define email processing rules and workflows.
4. Start the Agent, which will automatically monitor and process communication tasks according to configuration.

## Security Notes

AgenticMail supports OAuth 2.0 authentication with encryption protection for email content during transmission and storage. You can fine-grained control Agent email operation permissions, such as allowing only reading while prohibiting sending, ensuring automated operations operate within security boundaries.

# 中文版

# AgenticMail 邮件管理

## 技能概览

AgenticMail 提供 AI 驱动的邮件处理与协作能力，帮助你完成邮件分类、草拟回复、任务提取与跟进管理。

## 核心能力

- 自动识别邮件意图与优先级
- 根据语境生成回复草稿
- 从邮件中提取待办与截止时间
- 支持跨渠道协同（邮件/短信/Agent 分工）

## 典型场景

- 高负荷收件箱管理
- 团队销售与客户沟通跟进
- 事务性邮件自动化处理

## 使用建议

将高优先级规则前置配置，并对自动草稿设置人工审核阈值。
