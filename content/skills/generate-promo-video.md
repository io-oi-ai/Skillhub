---
name: "Generate Promo Video Generator"
description: "Automatically generate promotional GIF/MP4 videos from changelog using Remotion, supporting multiple video styles and animation effects"
author: "web-md"
roles: ["marketer", "developer", "designer"]
scenes: ["creative-design", "workflow"]
version: "1.0.0"
updatedAt: "2025-02-28"
tags: ["Video Generation", "Remotion", "Promotional Materials", "GIF", "Release", "Animation"]
featured: true
source: "skillhub"
---

# Generate Promo — Remotion Promotional Video Generator

A universal project skill for generating promotional GIF/MP4 videos using Remotion. Works with any product that has a Remotion video project.

## Trigger Conditions

Trigger when users say similar things:
- "generate promo", "create release video", "make changelog video"
- "Generate promotional materials", "Create a release video", "Make a promotional video"
- `/generate-promo`

## Workflow

### Step 0: Discover Project Structure

Before starting, automatically locate the Remotion project:
1. **Find Video Directory** — Search for `remotion.config.ts` or directories containing Remotion compositions
2. **Read `Root.tsx`** — Understand the existing composition registration pattern
3. **Read `package.json`** — Look for existing render scripts and naming conventions
4. **Read 1-2 Existing Compositions** — Learn the project's specific style patterns (colors, fonts, animation conventions)
5. **Identify Shared Constants** — Find where COLORS, FONTS, DIMENSIONS are defined

> **Important:** Each project is different; don't assume specific directory layouts; adapt to what you discover.

### Step 1: Gather Content

Ask users what the video should showcase. Common sources:

| Source | How to Find |
|--------|-------------|
| Changelog File | Search for `changelog`, `CHANGELOG.md` |
| Release Notes | Check git tags, GitHub releases |
| User Description | Users directly specify features to highlight |
| PR/Commit History | `git log --oneline` to see recent changes |

Extract: Product name and version, features/changes to showcase, whether any related videos exist.

### Step 2: Choose Video Style

Select appropriate style based on content:

| Content Type | Style | Duration |
|--------------|-------|----------|
| 1 Major New Feature | **Workflow Demo** — 6-8 scenes showing usage steps | 20-40 seconds |
| 2-4 Features | **Feature Showcase** — Each feature 2-4 seconds | 15-30 seconds |
| Before/After Improvements | **Split-Screen Comparison** — Show new vs. old version side-by-side | 10-20 seconds |
| Bug Fixes/Minor Updates | **Quick Highlights** — Fast text card transitions | 8-15 seconds |
| Product Introduction | **Complete Demo** — Problem → Solution → Features → CTA | 30-60 seconds |

### Step 3: Generate Remotion Code

Create a new directory under the video source folder and generate two files:

- **`styles.ts`** — Colors, fonts, timeline configuration, and subtitle labels
- **`Composition.tsx`** — Scene components, animation logic, and closing screen

### Step 4: Register Composition

Update `Root.tsx` and `package.json`:
- GIF: `800×450`, `30fps`
- MP4: `1280×720`, `30fps`

### Step 5: Preview and Render

1. Preview first: `pnpm preview`
2. Render GIF or MP4
3. Post-render tasks: Copy to public directory, update changelog, etc.

## Animation Reference

Supported animation effects include:
- **Fade In/Out** — Control opacity with `interpolate()`
- **Spring Animation** — Implement bounce effects with `spring()`
- **Delayed Spring** — Spring animation with delayed start
- **Breathing Glow** — Control glow intensity with sine function
- **Slide In** — Animation sliding in from the side

## Core Rules

- Never hardcode pixel offsets — Use `interpolate()` and `spring()`
- Match the project's existing visual style — Reuse COLORS/FONTS from shared modules
- GIF doesn't support audio — Don't import Audio in GIF compositions
- Closing screen is mandatory — Every video must end with product branding + CTA
- Frame calculation must be correct — `totalFrames = fps × duration_seconds`

