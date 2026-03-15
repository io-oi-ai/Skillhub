# GEO 审计报告 — SkillHubs (skillhubs.cc)

> 审计日期：2026-03-15
> 业务类型：SaaS/Platform（AI 技能市场）
> 页面数量：48 页（含 sitemap）
> 技术栈：Next.js App Router / Vercel / Supabase
> 语言：English + 简体中文 (zh-CN)

---

## 综合 GEO 评分：32/100 ⚠️ 差

| 类别 | 评分 | 权重 | 加权得分 | 状态 |
|------|------|------|----------|------|
| AI 可引用性与可见性 | 46/100 | 25% | 11.5 | 一般 |
| 品牌权威信号 | 3/100 | 20% | 0.6 | 严重缺失 |
| 内容质量与 E-E-A-T | 38/100 | 20% | 7.6 | 差 |
| 技术基础 | 62/100 | 15% | 9.3 | 一般 |
| 结构化数据 | 5/100 | 10% | 0.5 | 严重缺失 |
| 平台优化 | 34/100 | 10% | 3.4 | 差 |
| **综合得分** | | | **32.9 → 33** | **差** |

### 评分解读

- **0-20**：严重 — 对 AI 搜索引擎几乎不可见
- **21-40**：差 — 有最基本的存在感但存在重大缺陷 ← **当前位置**
- **41-60**：一般 — 有一定 AI 可见性但仍有明显差距
- **61-80**：良好 — AI 可见性较强，仍有优化空间
- **81-100**：优秀 — 强大的 AI 搜索可见性

---

## 关键发现

### 🔴 严重问题 (Critical)

#### 1. RSC 流式渲染导致 AI 爬虫无法读取页面内容
**技术评分影响：-25 分**

所有页面的 `<body>` 只包含 `<div id="__next">`，实际内容全部以 React Server Component 序列化数据嵌入 `<script>self.__next_f.push()</script>` 标签中。这意味着：
- **GPTBot、ClaudeBot、PerplexityBot 等 AI 爬虫看到的是空白页面**
- 仅 `<head>` 中的 meta 标签被正确服务端渲染
- 首页有 94 个 RSC streaming chunks，377KB HTML，但零可读内容

这是本次审计中最严重的发现。AI 爬虫无法执行 JavaScript，因此**完全无法索引网站的实际内容**。

#### 2. 结构化数据完全缺失
**Schema 评分：5/100**

整个网站没有任何 JSON-LD、Microdata 或 RDFa 结构化数据：
- 无 Organization schema（AI 模型无法建立实体图谱）
- 无 SoftwareApplication schema（技能页面无法被理解为软件产品）
- 无 Person schema（作者无法被验证专业性）
- 无 WebSite + SearchAction schema
- 无 BreadcrumbList schema
- 无 sameAs 链接到任何外部平台

#### 3. 品牌在 AI 引用平台上几乎不存在
**品牌提及评分：3/100**

| 平台 | 状态 |
|------|------|
| Wikipedia | 不存在 |
| Reddit | 无任何提及 |
| YouTube | 无频道、无视频 |
| LinkedIn | 页面存在但信息稀少 |
| GitHub | 无公开搜索结果 |
| Product Hunt | 未上线 |
| G2/Capterra | 未收录 |
| 通用网页搜索 | 第一页搜索结果中不出现 |

#### 4. 缺少隐私政策和服务条款
网站收集用户数据（登录、提交技能、积分系统），但没有：
- 隐私政策页面
- 服务条款页面
- 联系信息
- Cookie 同意机制

这既是法律风险（GDPR/CCPA），也是严重的信任信号缺失。

### 🟠 高优先级问题 (High)

#### 5. 无 llms.txt 文件
作为 AI 技能平台，没有 `/llms.txt` 是一个显著遗漏。AI 爬虫无法通过这个新兴标准了解网站结构。

#### 6. /guide 页面 canonical 标签错误
Guide 页面的 canonical URL 指向首页 (`https://skillhubs.cc`) 而非自身 (`https://skillhubs.cc/guide`)，导致搜索引擎认为 guide 内容属于首页。

#### 7. /guide 页面 title 标签重复
当前标题："Getting Started with SkillHubs | SkillHubs | SkillHubs" — 品牌名重复三次。

#### 8. /guide 页面未包含在 sitemap 中
48 个 URL 的 sitemap 中遗漏了 `/guide` 页面。

#### 9. 无关于页面、无团队信息
没有任何创始人、团队或公司背景信息。E-E-A-T 的专业性和权威性维度严重受损。

#### 10. "+16.2pp (SkillsBench)" 数据声明无法验证
首页最突出的数据声明没有链接到方法论、数据集或完整结果。

### 🟡 中等优先级问题 (Medium)

- Guide 页面内容较薄（~650 词，建议扩展至 1,500-2,000 词）
- 技能页面之间无交叉链接（"相关技能"）
- 动态页面（首页、技能页）使用 `no-cache, no-store`，每次请求都命中源服务器
- 缺少 Permissions-Policy 安全头
- OG 标签未按页面差异化（技能页缺少 og:image）
- 关键词 meta 标签所有页面相同，未差异化
- 无资源预加载提示（字体、Supabase 连接）

---

## 各模块详细评分

### 1. AI 可引用性与可见性 — 46/100

| 组件 | 评分 | 权重 | 加权 |
|------|------|------|------|
| 可引用性 | 57/100 | 35% | 19.95 |
| 品牌提及 | 3/100 | 30% | 0.90 |
| 爬虫访问 | 100/100 | 25% | 25.00 |
| llms.txt | 0/100 | 10% | 0.00 |
| **总计** | | | **46** |

**最强引用候选内容：**
1. Guide 页面积分表 — 61/100（结构化表格+具体数据）
2. 首页 "+16.2pp" 统计数据 — 58/100（具体可引用数据，但来源不明）
3. "What is a Skill?" 定义段落 — 58/100（自包含定义，AI 可直接引用）

**爬虫访问：完全开放** — 所有 AI 爬虫（GPTBot、ClaudeBot、PerplexityBot 等）均被允许访问。robots.txt 极度宽松。但由于 RSC 渲染问题，爬虫实际上看不到任何内容。

### 2. 品牌权威信号 — 3/100

几乎为零。唯一的微弱信号是 LinkedIn 上存在一个稀疏的公司页面。需要在 Reddit、YouTube、Product Hunt、GitHub 等平台建立存在感。

### 3. 内容质量与 E-E-A-T — 38/100

| 维度 | 评分 | 关键证据 |
|------|------|----------|
| Experience（经验）| 10/25 | 有原创产品和 CLI 工具；SkillsBench 声明缺少方法论；无用户案例研究 |
| Expertise（专业性）| 9/25 | 技能页面有技术深度；无团队/创始人简介；无专业资质展示 |
| Authoritativeness（权威性）| 6/25 | 无关于页面；无媒体报道；单用户排行榜显示社区极早期 |
| Trustworthiness（可信度）| 11/25 | HTTPS 正常；无隐私政策；无服务条款；无联系方式 |

### 4. 技术基础 — 62/100

| 类别 | 评分 | 状态 |
|------|------|------|
| 服务端渲染 | 35/100 | 🔴 严重 — RSC 流式渲染，非真实 HTML |
| Meta 标签 | 78/100 | 一般 — head 标签正确但有几处错误 |
| 可爬取性 | 80/100 | 良好 — robots.txt 开放，sitemap 完整 |
| 安全头 | 90/100 | 良好 — 仅缺 Permissions-Policy |
| Core Web Vitals | 55/100 | 中等风险 — 无预加载，大 HTML 负载 |
| 移动优化 | 75/100 | 一般 — Tailwind 响应式但无法验证图片 |
| URL 结构 | 90/100 | 良好 — 干净、可读、层级合理 |
| 响应状态 | 85/100 | 良好 — 正确的 308/404/200 |

### 5. 结构化数据 — 5/100

完全缺失。仅因"无废弃 schema"而得 5 分。需要添加：Organization、WebSite、SoftwareApplication、Person、BreadcrumbList、ItemList。

### 6. 平台优化 — 34/100

| 平台 | 评分 | 状态 |
|------|------|------|
| Google AI Overviews | 38/100 | 差 |
| ChatGPT Web Search | 28/100 | 严重 |
| Perplexity AI | 30/100 | 严重 |
| Google Gemini | 32/100 | 差 |
| Bing Copilot | 29/100 | 严重 |

**最强平台：** Google AI Overviews — guide 页面有问答式标题和步骤列表。
**最弱平台：** ChatGPT Web Search — 无 Wikipedia、无 Wikidata、无 JSON-LD、无作者资质。

---

## 优先行动计划

### 🔴 Quick Wins（低工作量，高影响 — 1-3 天内完成）

| # | 行动 | 影响评分 | 工作量 |
|---|------|----------|--------|
| 1 | **创建并部署 `/llms.txt`** | +7-10 分 | 30 分钟 |
| 2 | **修复 /guide canonical 标签**（指向自身而非首页）| +3 分 | 10 分钟 |
| 3 | **修复 /guide title 标签**（移除重复品牌名）| +1 分 | 5 分钟 |
| 4 | **将 /guide 加入 sitemap** | +2 分 | 10 分钟 |
| 5 | **在 robots.txt 中添加 AI 爬虫显式规则** | +2 分 | 15 分钟 |
| 6 | **在技能页面显示 `<time datetime>` 更新日期** | +3 分 | 30 分钟 |

### 🟠 Medium-Term（中等工作量 — 1-2 周内完成）

| # | 行动 | 影响评分 | 工作量 |
|---|------|----------|--------|
| 7 | **修复 RSC 渲染，确保 HTML 内容可被爬虫读取** | +15-20 分 | 高（架构级） |
| 8 | **添加 JSON-LD 结构化数据**（Organization、WebSite、SoftwareApplication、Person、BreadcrumbList）| +8-12 分 | 中 |
| 9 | **创建隐私政策和服务条款页面** | +5 分 | 中 |
| 10 | **创建关于页面**（团队/创始人信息）| +5 分 | 中 |
| 11 | **实现 IndexNow 协议**（Bing 即时索引）| +3 分 | 低 |
| 12 | **添加技能页面间 "相关技能" 交叉链接** | +3 分 | 中 |

### 🟡 Strategic（长期战略 — 1-3 个月）

| # | 行动 | 影响评分 | 工作量 |
|---|------|----------|--------|
| 13 | **在 Reddit 社区发布**（r/ChatGPT, r/ClaudeAI, r/artificial）| +8-15 分 | 持续 |
| 14 | **Product Hunt 上线** | +5-8 分 | 中 |
| 15 | **创建 YouTube 频道并上传教程视频** | +4-5 分 | 中 |
| 16 | **发布 SkillsBench 方法论文档** | +5 分 | 中 |
| 17 | **启动博客/内容策略**（AI 技能设计最佳实践等）| +8-10 分 | 持续 |
| 18 | **完善 LinkedIn 公司页面** | +2-3 分 | 低 |
| 19 | **创建 Wikipedia/Wikidata 条目**（需满足关注度要求）| +10-15 分 | 长期 |
| 20 | **创建对比页面**（SkillHubs vs 竞品）| +5 分 | 中 |

---

## 推荐的 JSON-LD 模板

### Organization（添加到 layout.tsx，全站生效）

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "SkillHubs",
  "url": "https://skillhubs.cc",
  "logo": "https://skillhubs.cc/og-image.png",
  "description": "A curated marketplace of AI agent skills and workflows for every industry and role.",
  "foundingDate": "2025",
  "sameAs": [
    "https://github.com/io-oi-ai/Skillhub",
    "https://linkedin.com/company/helloskillhubs"
  ]
}
```

### SoftwareApplication（技能详情页动态生成）

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Impeccable Frontend Design",
  "description": "Create distinctive, production-grade frontend interfaces...",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Cross-platform",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "author": { "@type": "Person", "name": "Paul Bakaus" },
  "isAccessibleForFree": true,
  "speakable": { "@type": "SpeakableSpecification", "cssSelector": ["h1", ".description"] }
}
```

### WebSite + SearchAction（首页）

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "SkillHubs",
  "url": "https://skillhubs.cc",
  "inLanguage": ["en", "zh-CN"],
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://skillhubs.cc/?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

---

## 推荐的 llms.txt 模板

```markdown
# SkillHubs

> A curated collection of AI Skills (structured Markdown files) that teach AI agents how to complete specific tasks. Browse, search, and share high-quality AI workflows for every industry and role.

## Main Pages
- [Homepage](https://skillhubs.cc): Browse all AI Skills by role, scene, or collection
- [Getting Started Guide](https://skillhubs.cc/guide): Learn how to download, use, and create Skills
- [Submit a Skill](https://skillhubs.cc/submit): Contribute your own AI Skill to the platform
- [Leaderboard](https://skillhubs.cc/leaderboard): Top skill contributors

## Popular Skills
- [Impeccable Frontend Design](https://skillhubs.cc/skill/pbakaus-impeccable): 17 commands for production-grade frontend interfaces
- [PRD Writing](https://skillhubs.cc/skill/general-prd-writing): Product requirements document generation
- [Data Analyst](https://skillhubs.cc/skill/openclaw-data-analyst): AI-powered data analysis workflows
- [Memory System](https://skillhubs.cc/skill/openclaw-memory-system): Persistent context storage for AI agents

## CLI Tool
- Install: npm install -g skillhubs
- Commands: search, download, list

## Optional
- [Sitemap](https://skillhubs.cc/sitemap.xml): All indexed pages
- [GitHub](https://github.com/io-oi-ai/Skillhub): Source code (MIT License)
```

---

## 竞争对手名称混淆风险

搜索 "SkillHubs AI skills marketplace" 时，以下竞争域名出现在第一页：
- skillhub.club
- skills-hub.cc
- skillsmp.com
- skillsllm.com
- skillmarketplace.ai

需要通过独特术语（如 "SkillsBench"、"AI Slop Test"）和跨平台一致品牌信号来差异化。

---

## 总结

SkillHubs 作为一个 AI 技能市场平台，具有独特的产品定位和丰富的技能内容库。然而，网站在 AI 搜索可见性方面存在严重的结构性缺陷：

1. **最紧迫**：RSC 流式渲染使 AI 爬虫无法读取任何页面内容 — 这比所有其他问题加在一起都重要
2. **最缺失**：结构化数据完全为零 — 作为技术平台这是不可接受的
3. **最薄弱**：品牌在 AI 引用平台上几乎不存在 — 需要系统性地建立外部存在感

如果能在 1-2 周内完成 Quick Wins 和修复 RSC 渲染问题，预计 GEO 评分可从 **33 分提升至 55-60 分**。

---

*报告由 GEO 审计工具生成 — 2026-03-15*
*方法论基于 GEO-first, SEO-supported 原则*
