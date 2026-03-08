---
name: "Security Audit Toolkit"
description: "Essential security skills for OpenClaw agents — skill vetting, security practice guide, and automated vulnerability scanning before installing any third-party skill"
author: "Researcher_王十三"
roles: ["developer", "everyone"]
scenes: ["workflow", "coding"]
version: "1.0.0"
updatedAt: "2026-03-08"
tags: ["OpenClaw", "security", "audit", "vetting", "safety", "collection:developer-tools"]
featured: false
source: "skillhub"
---

## Overview

Before installing any third-party skill into your OpenClaw agent, you should verify it's safe. This guide covers the three essential security skills that protect your agent environment from malicious code, data leaks, and unsafe practices.

## Skills Included

### 1. Skill-Vetter

Scans any skill before installation to detect potential security risks, suspicious patterns, and unsafe code.

```bash
# Install
clawhub install skill-vetter

# Scan a skill before using it
skill-vetter <skill-name>
```

**Best Practice**: Always run `skill-vetter` on a new skill before enabling it in production.

### 2. OpenClaw Security Practice Guide

A comprehensive security checklist authored by [@evilcos](https://x.com/evilcos) covering agent permission management, API key handling, and safe interaction patterns.

```markdown
# Install
帮我安装这个skill, github链接是:
https://github.com/ArkTeam/openclaw-security-practice-guide

# Run a security check
使用 openclaw-security-practice-guide 做一次安全检查
```

### 3. ClawSec

Automated security scanning that can run before every skill installation, checking for known vulnerabilities and unsafe patterns.

```markdown
# Install
帮我安装这个skill, github链接是:
https://github.com/prompt-security/clawsec

# Enable auto-scan mode
开启自动安全模式，安装任何 skill 前都先必须运行 clawsec 检查
```

## Recommended Workflow

1. **Install all three security skills first** — before adding any other skills to your agent.
2. **Enable auto-scan** — configure ClawSec to run automatically on every new skill installation.
3. **Vet manually** — for critical skills, also run Skill-Vetter for a second opinion.
4. **Review permissions** — use the Security Practice Guide to audit what each skill can access.

## Why This Matters

Third-party skills can execute code, access files, and make network requests within your agent environment. A malicious or poorly written skill could leak API keys, modify system files, or exfiltrate sensitive data. These three tools form a defense-in-depth approach to keep your agent safe.

# 中文版

# 安全审计工具箱

## 技能概览

在安装第三方 skill 前，先做安全审计。该工具箱提供“预检 + 自动扫描 + 安全规范”三层防护，降低恶意代码和数据泄漏风险。

## 核心能力

- Skill-Vetter：安装前静态风险扫描
- OpenClaw Security Practice Guide：权限与密钥管理最佳实践
- ClawSec：自动化漏洞和风险模式检查

## 推荐流程

1. 先安装这 3 个安全技能
2. 配置 ClawSec 为安装前自动扫描
3. 关键技能再用 Skill-Vetter 二次人工复核
4. 按安全实践指南检查权限边界

## 使用建议

把“先审计后安装”固化为默认流程，避免高权限环境被供应链风险影响。
