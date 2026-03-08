---
name: "Multi-Engine Search"
description: "Aggregate search across 17+ engines with Tavily, Perplexity, and web scraping for comprehensive AI-powered research"
author: "Researcher_王十三"
roles: ["everyone", "marketer", "data-analyst"]
scenes: ["research", "data-analysis"]
version: "1.0.0"
updatedAt: "2026-03-08"
tags: ["OpenClaw", "search", "research", "Tavily", "Perplexity", "web scraping", "collection:getting-started"]
featured: false
source: "skillhub"
---

## Overview

A curated set of search and research skills for OpenClaw agents. Combines multiple search engines, AI-powered research tools, and web scraping capabilities to give your agent comprehensive internet access.

## Search Skills

### 1. Tavily Search

AI-optimized search engine designed for agents. Fast, structured results with relevance scoring.

```bash
# Install
clawhub install tavily-search

# Get API key (free tier available)
# Visit: https://app.tavily.com/home

# Configure
帮我配置 Tavily-api, api为：tvly-dev-xxx
```

### 2. Perplexity

AI-powered research engine with real-time web access. Free monthly quota (requires card on file).

```markdown
# Install
帮我安装这个skill https://clawhub.ai/zats/perplexity

# Get API key
# Visit: https://www.perplexity.ai/account/api/keys

# Configure
我的 PERPLEXITY_API_KEY 为：xxx, 请帮我配置好

# Test
使用 perplexity 搜索最新的 AI 资讯
```

### 3. Multi-Search-Engine

Aggregates results from 17 search engines simultaneously for broader coverage.

```markdown
# Install
帮我安装这个skill, 链接为:
https://clawhub.ai/gpyAngyoujun/multi-search-engine

# Test
multi-search-engine 搜索 AI agent skills 最新动态
```

### 4. Playwright Scraper

Browser-based web scraper for pages that require JavaScript rendering (social media, SPAs, etc.).

```markdown
# Install
帮我安装这个skill, 链接为:
https://clawhub.ai/peterskoett/playwright-scraper-skill

# Test
使用 playwright-scraper-skill 搜索 https://x.com/ResearchWang
```

## Quick Tip

You can also use [Jina Reader](https://r.jina.ai) to extract clean text from any URL:

```
https://r.jina.ai/<target-url>
```

## When to Use Which

| Tool | Best For | Free Tier |
|------|----------|-----------|
| Tavily | Structured agent search | Yes |
| Perplexity | Deep research with citations | Limited |
| Multi-Search | Broad coverage across engines | Yes |
| Playwright | JavaScript-heavy pages | Yes |
