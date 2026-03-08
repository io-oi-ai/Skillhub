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
