---
name: "Impeccable Frontend Design"
description: "Create distinctive, production-grade frontend interfaces with high design quality. Includes 17 commands (/polish, /distill, /audit, /bolder, /quieter, etc.) and curated anti-patterns to avoid generic AI aesthetics."
author: "Paul Bakaus"
roles: ["developer", "designer"]
scenes: ["creative-design", "workflow"]
version: "1.2.0"
updatedAt: "2026-03-06"
tags: ["Frontend Design", "UI", "UX", "CSS", "Accessibility", "Design System", "Anti-Patterns", "Remotion"]
featured: true
source: "github"
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

> **Source:** [pbakaus/impeccable](https://github.com/pbakaus/impeccable) — install the full plugin with `npx skills add pbakaus/impeccable`

## Design Direction

Commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work — the key is intentionality, not intensity.

Then implement working code that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines

### Typography

Choose fonts that are beautiful, unique, and interesting. Pair a distinctive display font with a refined body font.

**DO**: Use a modular type scale with fluid sizing (clamp). Vary font weights and sizes to create clear visual hierarchy.

**DON'T**: Use overused fonts — Inter, Roboto, Arial, Open Sans, system defaults. Don't use monospace typography as lazy shorthand for "technical/developer" vibes. Don't put large icons with rounded corners above every heading.

### Color & Theme

Commit to a cohesive palette. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.

**DO**: Use modern CSS color functions (oklch, color-mix, light-dark) for perceptually uniform, maintainable palettes. Tint your neutrals toward your brand hue.

**DON'T**: Use gray text on colored backgrounds. Don't use pure black (#000) or pure white (#fff). Don't use the AI color palette: cyan-on-dark, purple-to-blue gradients, neon accents on dark backgrounds. Don't use gradient text for "impact". Don't default to dark mode with glowing accents.

### Layout & Space

Create visual rhythm through varied spacing — not the same padding everywhere. Embrace asymmetry and unexpected compositions.

**DO**: Use fluid spacing with clamp() that breathes on larger screens. Use asymmetry and break the grid intentionally for emphasis.

**DON'T**: Wrap everything in cards. Don't nest cards inside cards. Don't use identical card grids. Don't use the hero metric layout template. Don't center everything. Don't use the same spacing everywhere.

### Visual Details

**DO**: Use intentional, purposeful decorative elements that reinforce brand.

**DON'T**: Use glassmorphism everywhere. Don't use rounded elements with thick colored border on one side. Don't use sparklines as decoration. Don't use rounded rectangles with generic drop shadows. Don't use modals unless truly necessary.

### Motion

Focus on high-impact moments: one well-orchestrated page load with staggered reveals creates more delight than scattered micro-interactions.

**DO**: Use motion to convey state changes. Use exponential easing (ease-out-quart/quint/expo). For height animations, use grid-template-rows transitions.

**DON'T**: Animate layout properties (width, height, padding, margin) — use transform and opacity only. Don't use bounce or elastic easing — they feel dated and tacky.

### Interaction

Make interactions feel fast. Use optimistic UI — update immediately, sync later.

**DO**: Use progressive disclosure. Design empty states that teach the interface. Make every interactive surface feel intentional and responsive.

**DON'T**: Repeat the same information. Don't make every button primary — use ghost buttons, text links, secondary styles.

### Responsive

**DO**: Use container queries (@container) for component-level responsiveness. Adapt the interface for different contexts.

**DON'T**: Hide critical functionality on mobile — adapt, don't amputate.

### UX Writing

**DO**: Make every word earn its place.

**DON'T**: Repeat information users can already see.

## The AI Slop Test

**Critical quality check**: If you showed this interface to someone and said "AI made this," would they believe you immediately? If yes, that's the problem.

A distinctive interface should make someone ask "how was this made?" not "which AI made this?"

Review the DON'T guidelines above — they are the fingerprints of AI-generated work from 2024-2025.

## Implementation Principles

Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices across generations.

## Included Commands

The full impeccable plugin includes 17 user-invocable commands:

| Command | Description |
|---------|-------------|
| `/polish` | Final quality pass — fixes alignment, spacing, consistency details |
| `/distill` | Strip designs to their essence by removing unnecessary complexity |
| `/audit` | Comprehensive quality audit across accessibility, performance, theming |
| `/bolder` | Make designs more impactful — increase contrast, scale, visual weight |
| `/quieter` | Reduce visual noise — soften, simplify, create calm interfaces |
| `/animate` | Add purposeful motion and transitions |
| `/colorize` | Refine and improve color usage |
| `/clarify` | Improve information architecture and content clarity |
| `/critique` | Get honest design criticism with specific improvement suggestions |
| `/delight` | Add delightful micro-interactions and details |
| `/extract` | Extract reusable components and design tokens |
| `/harden` | Improve resilience — error states, edge cases, defensive design |
| `/normalize` | Align with design system standards and tokens |
| `/onboard` | Improve first-use experience and progressive disclosure |
| `/optimize` | Improve rendering performance and loading speed |
| `/adapt` | Make interfaces responsive and context-aware |
| `/teach-impeccable` | Learn the impeccable design philosophy |

Install the full plugin: `npx skills add pbakaus/impeccable`
