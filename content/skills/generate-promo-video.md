---
name: "Generate Promo Video Generator"
description: "Automatically generate promotional GIF/MP4 videos from changelog using Remotion, supporting multiple video styles and animation effects"
author: "web-md"
roles: ["marketer", "developer", "designer"]
scenes: ["creative-design", "workflow"]
version: "1.0.0"
updatedAt: "2025-02-28"
tags: ["Video Generation", "Remotion", "Promotional Materials", "GIF", "Release", "Animation", "collection:indie-hacker"]
featured: true
source: "skillhub"
---

When the user asks you to generate a promotional video, create a release video, or make a changelog video, follow this workflow to produce Remotion-based GIF/MP4 output.

## Step 0: Discover Project Structure

Before writing any code, locate and read the Remotion project:

1. Search for `remotion.config.ts` or directories containing Remotion compositions
2. Read `Root.tsx` to understand the composition registration pattern
3. Read `package.json` to find existing render scripts and naming conventions
4. Read 1-2 existing compositions to learn the project's style patterns (colors, fonts, animations)
5. Find shared constants — look for where COLORS, FONTS, DIMENSIONS are defined

**Do NOT assume directory layouts.** Adapt to whatever structure you discover.

## Step 1: Gather Content

Ask the user what the video should showcase. Look for content in these sources:

| Source | How to Find |
|--------|-------------|
| Changelog | Search for `CHANGELOG.md` |
| Release Notes | Check git tags, GitHub releases |
| User Description | Ask the user directly |
| PR/Commit History | Run `git log --oneline` |

Extract: **product name**, **version**, **features/changes to showcase**, and whether related videos already exist.

## Step 2: Choose Video Style

Select the style based on content type:

| Content Type | Style | Duration |
|--------------|-------|----------|
| 1 Major Feature | Workflow Demo — 6-8 scenes showing usage steps | 20-40s |
| 2-4 Features | Feature Showcase — each feature 2-4 seconds | 15-30s |
| Before/After | Split-Screen Comparison — old vs new side-by-side | 10-20s |
| Bug Fixes/Minor | Quick Highlights — fast text card transitions | 8-15s |
| Product Intro | Complete Demo — Problem → Solution → Features → CTA | 30-60s |

Present the recommended style to the user and confirm before proceeding.

## Step 3: Generate Remotion Code

Create a new directory under the video source folder with two files:

1. **`styles.ts`** — Colors, fonts, timeline config, subtitle labels. Reuse the project's existing design tokens.
2. **`Composition.tsx`** — Scene components, animation logic, and closing screen.

Animation techniques to use:
- `interpolate()` for fade in/out and slide transitions
- `spring()` for bounce effects
- Delayed spring for staggered animations
- Sine-based breathing glow for emphasis

## Step 4: Register and Configure

1. Add the new composition to `Root.tsx` following existing patterns
2. Add render scripts to `package.json`:
   - GIF: `800×450`, `30fps`
   - MP4: `1280×720`, `30fps`

## Step 5: Preview and Render

1. Run `pnpm preview` and confirm the output looks correct
2. Render to the target format (GIF or MP4)
3. Copy output to the public directory and update any references (changelog, README, etc.)

## Constraints

- **Never hardcode pixel offsets** — always use `interpolate()` and `spring()`
- **Match existing visual style** — reuse COLORS/FONTS from the project's shared modules
- **GIF compositions must not import Audio** — GIF format does not support audio
- **Every video must end with a closing screen** — product branding + CTA
- **Frame math must be exact** — `totalFrames = fps × duration_seconds`
- **Do not modify existing compositions** — only create new ones

