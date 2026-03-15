# GEO Audit Fixes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix all issues identified in the GEO audit to improve the composite GEO score from 33/100 to 55-60+/100.

**Architecture:** All changes are SEO/GEO infrastructure — no business logic changes. JSON-LD schema added via a reusable `JsonLd` component rendered in server components. Robots.txt and sitemap updated via Next.js MetadataRoute API. New static pages (privacy, terms) added as locale routes. llms.txt deployed as a static file.

**Tech Stack:** Next.js 16 App Router, TypeScript, React Server Components, Tailwind CSS

---

## Task Groups (Independent — Can Be Parallelized)

### Task 1: Create JsonLd Component + Organization Schema (Site-Wide)

**Files:**
- Create: `src/components/JsonLd.tsx`
- Modify: `src/app/[locale]/layout.tsx`

**Step 1:** Create `src/components/JsonLd.tsx`:

```tsx
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

**Step 2:** Add Organization schema to `src/app/[locale]/layout.tsx`:
- Import `JsonLd`
- Inside `<body>`, before `<AuthProvider>`, add:

```tsx
<JsonLd data={{
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SkillHubs",
  url: "https://skillhubs.cc",
  logo: "https://skillhubs.cc/og-image.png",
  description: "A curated marketplace of AI agent skills and workflows for every industry and role.",
  foundingDate: "2025",
  sameAs: [
    "https://github.com/io-oi-ai/Skillhub",
    "https://linkedin.com/company/helloskillhubs"
  ]
}} />
```

---

### Task 2: Homepage JSON-LD (WebSite + ItemList)

**Files:**
- Modify: `src/app/[locale]/page.tsx`

**Step 1:** Import `JsonLd` from `@/components/JsonLd`.

**Step 2:** After `authorMap` is built, generate schema data:

```tsx
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "SkillHubs",
  url: "https://skillhubs.cc",
  description: dict.metadata.home.description,
  inLanguage: ["en", "zh-CN"],
  potentialAction: {
    "@type": "SearchAction",
    target: "https://skillhubs.cc/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "AI Agent Skills",
  description: "Curated collection of AI skills for every industry and role",
  numberOfItems: skills.length,
  itemListElement: skills.slice(0, 50).map((skill, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `https://skillhubs.cc/skill/${skill.id}`,
    name: skill.name,
  })),
};
```

**Step 3:** Render both schemas inside the return, right after `<>`:

```tsx
<JsonLd data={websiteSchema} />
<JsonLd data={itemListSchema} />
```

---

### Task 3: Skill Detail Page JSON-LD (SoftwareApplication + BreadcrumbList)

**Files:**
- Modify: `src/app/[locale]/skill/[id]/page.tsx`

**Step 1:** Import `JsonLd`.

**Step 2:** After `authorLevelLabel` block, build schema:

```tsx
const baseUrl = "https://skillhubs.cc";
const skillSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: skill.name,
  description: skill.description,
  url: `${baseUrl}/skill/${skill.id}`,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Cross-platform",
  softwareVersion: skill.version,
  dateModified: skill.updatedAt,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  author: {
    "@type": "Person",
    name: skill.author,
    ...(authorUsername ? { url: `${baseUrl}/user/${authorUsername}` } : {}),
  },
  publisher: {
    "@type": "Organization",
    name: "SkillHubs",
    url: baseUrl,
  },
  keywords: [...skill.roles, ...skill.scenes, ...skill.tags.filter((t: string) => !t.startsWith("collection:"))],
  isAccessibleForFree: true,
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
    { "@type": "ListItem", position: 2, name: "Skills", item: `${baseUrl}/#skills` },
    { "@type": "ListItem", position: 3, name: skill.name, item: `${baseUrl}/skill/${skill.id}` },
  ],
};
```

**Step 3:** Add `<time>` element for updatedAt. Replace the existing updatedAt span:
```tsx
// Old:
<span>{dict.skillDetail.updatedAt} {skill.updatedAt}</span>
// New:
<time dateTime={skill.updatedAt}>{dict.skillDetail.updatedAt} {skill.updatedAt}</time>
```

**Step 4:** Render schemas after `<>`:

```tsx
<JsonLd data={skillSchema} />
<JsonLd data={breadcrumbSchema} />
```

---

### Task 4: Guide Page — Fix Metadata + Add Schema

**Files:**
- Modify: `src/app/[locale]/guide/page.tsx`

**Step 1:** Fix generateMetadata — add proper canonical, description:

```tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const baseUrl = "https://skillhubs.cc";
  return {
    title: dict.guide.title,
    description: "Learn how to discover, download, install, and create AI agent skills on SkillHubs. Step-by-step guide for getting started.",
    alternates: {
      canonical: `${baseUrl}/guide`,
      languages: {
        en: `${baseUrl}/guide`,
        "zh-CN": `${baseUrl}/zh/guide`,
      },
    },
  };
}
```

**Step 2:** Import `JsonLd`, add Article + BreadcrumbList schemas in the component:

```tsx
const baseUrl = "https://skillhubs.cc";
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: g.title,
  description: "Learn how to discover, download, install, and create AI agent skills on SkillHubs.",
  url: `${baseUrl}/guide`,
  author: { "@type": "Organization", name: "SkillHubs", url: baseUrl },
  publisher: { "@type": "Organization", name: "SkillHubs", url: baseUrl, logo: { "@type": "ImageObject", url: `${baseUrl}/og-image.png` } },
  mainEntityOfPage: `${baseUrl}/guide`,
  inLanguage: locale === "zh" ? "zh-CN" : "en",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
    { "@type": "ListItem", position: 2, name: g.title, item: `${baseUrl}/guide` },
  ],
};
```

---

### Task 5: Robots.txt — Add Explicit AI Crawler Rules

**Files:**
- Modify: `src/app/robots.ts`

Replace the single rule with an array of rules:

```tsx
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Amazonbot", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
    ],
    sitemap: "https://skillhubs.cc/sitemap.xml",
  };
}
```

---

### Task 6: Sitemap — Add Guide and Leaderboard Pages

**Files:**
- Modify: `src/app/sitemap.ts`

After the submit entry, add guide and leaderboard:

```tsx
{
  url: `${baseUrl}/guide`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.7,
  alternates: {
    languages: {
      en: `${baseUrl}/guide`,
      "zh-CN": `${baseUrl}/zh/guide`,
    },
  },
},
{
  url: `${baseUrl}/leaderboard`,
  lastModified: new Date(),
  changeFrequency: "daily",
  priority: 0.6,
  alternates: {
    languages: {
      en: `${baseUrl}/leaderboard`,
      "zh-CN": `${baseUrl}/zh/leaderboard`,
    },
  },
},
```

---

### Task 7: Create llms.txt

**Files:**
- Create: `public/llms.txt`

Static file in public directory. Content from GEO audit recommendations.

---

### Task 8: Add Permissions-Policy Security Header

**Files:**
- Modify: `src/middleware.ts`

Add to `addSecurityHeaders` function:

```tsx
response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
```

---

### Task 9: Footer — Add Privacy/Terms Links

**Files:**
- Modify: `src/components/Footer.tsx`
- Modify: `src/i18n/dictionaries/en.ts`
- Modify: `src/i18n/dictionaries/zh.ts`

Add privacy policy and terms links to the footer.

---

### Task 10: Create Privacy Policy Page

**Files:**
- Create: `src/app/[locale]/privacy/page.tsx`

Minimal privacy policy page for a free, open-source platform using Supabase auth.

---

### Task 11: Create Terms of Service Page

**Files:**
- Create: `src/app/[locale]/terms/page.tsx`

Minimal terms of service page.

---

### Task 12: Build and Verify

Run `npm run build` to ensure no TypeScript errors or build failures.

---

## Execution Order

**Parallel Group A (no dependencies):** Tasks 5, 6, 7, 8
**Parallel Group B (depends on Task 1):** Tasks 2, 3, 4
**Parallel Group C (independent):** Tasks 9, 10, 11
**Sequential:** Task 12 (after all others)
