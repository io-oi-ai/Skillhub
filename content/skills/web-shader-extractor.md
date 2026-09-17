---
name: "Web Shader Extractor"
description: "AI Skill that extracts WebGL/Canvas/Shader visual effects from any webpage, de-obfuscates bundled code, and ports them into standalone runnable native JS projects. Supports Three.js, Babylon.js, PixiJS, Raw WebGL, TSL and more."
author: "lixiaolin94"
roles: ["developer", "designer"]
scenes: ["creative-design", "coding", "workflow"]
version: "1.0.0"
updatedAt: "2026-03-30"
tags: ["WebGL", "Shader", "GLSL", "Three.js", "Canvas", "Visual Effects", "Extraction", "Reverse Engineering", "Creative Coding"]
featured: true
source: "github"
---

An AI Agent Skill that extracts WebGL / Canvas / Shader visual effects from webpages, de-obfuscates bundled code, and ports them into standalone runnable native JS projects.

> **Source:** [lixiaolin94/skills](https://github.com/lixiaolin94/skills) — install with `npx skills add https://github.com/lixiaolin94/skills --skill web-shader-extractor`

## Core Capabilities

- **Auto-detect tech stack:** Three.js / Babylon.js / PixiJS / Raw WebGL / TSL etc.
- **Extract GLSL shaders** from obfuscated JS bundles along with rendering parameters
- **Decode encrypted configs:** Base64 + XOR, Nuxt payload, Next.js `__NEXT_DATA__`
- **Smart porting strategy:** Pure 2D fullscreen shaders → zero-dependency WebGL2; 3D scenes → preserve original framework
- **Zero-config startup:** Auto-generates standalone runnable projects

## Workflow (8 Phases)

| Phase | Description |
|-------|-------------|
| **Phase 0** | Tech detection — identify framework, shader type, and rendering pipeline |
| **Phase 1** | DOM extraction — Playwright headless browser or curl fallback |
| **Phase 2** | Config extraction — from public API / Nuxt payload / Next.js data / bundle defaults |
| **Phase 3** | Shader extraction — deep analysis of 1MB+ JS bundles, de-obfuscate GLSL and rendering logic |
| **Phase 4** | Porting — choose optimal strategy based on tech stack, generate standalone project |
| **Phase 5** | Simplification assessment — propose removing framework dependencies if effect is correct |
| **Phase 6** | Extraction report — optionally generate `EXTRACTION-REPORT.md` with timeline, scene structure, render pipeline |
| **Phase 7** | Final review — user confirmation and cleanup |

> Phases 0–5 execute fully autonomously. Phases 6–7 ask user before proceeding. Falls back to curl mode if Playwright is unavailable.

## Examples

### Stainless Steel — SDF Glass Refraction (shaders.com)

- **Tech stack:** Three.js r183 + TSL node shaders
- **Effects:** SDF glass refraction, chromatic aberration, 3-point lighting + 4 environment spheres, film grain
- **Porting approach:** TSL decompiled to standard GLSL, 4-pass render pipeline, Three.js loaded via CDN importmap
- **Project size:** ~1.1 MB (including SDF textures)

### Metallic Rings — Plasma + Concentric Rotation (shaders.com)

- **Tech stack:** Pure WebGL (zero dependencies)
- **Porting approach:** Native WebGL2, single fullscreen quad shader

### Framer Shaders — Turbulent Liquid Gradient

- **Tech stack:** Pure WebGL2 (zero dependencies)
- **Effects:** Turbulence noise-driven liquid gradient, particle emission/dissipation, OkLab color blending, dithering
- **Porting approach:** Native WebGL2, 3-layer shader + compositing
- **Project size:** ~36 KB

## Installation

```bash
npx skills add https://github.com/lixiaolin94/skills --skill web-shader-extractor
```

After installation, the Skill auto-links to your AI coding assistant. Supports Claude Code, Cursor, Windsurf, Codex and 44+ agents.

## Usage

No configuration needed after installation. Simply tell the AI what you want to extract:

- "Extract the background shader effect from this site: https://example.com"
- "Grab the WebGL animation from this page and make it standalone"
- "Port this Three.js shader to pure WebGL2"

## Skill Architecture

```
web-shader-extractor/
├── SKILL.md                        # Main workflow (8-phase decision tree)
├── references/
│   ├── tech-signatures.md          # Framework signature cheat sheet
│   ├── extraction-workflow.md      # Agent extraction prompts + de-obfuscation rules
│   ├── config-extraction.md        # Config parameter extraction strategies
│   ├── tsl-extraction.md           # Three.js TSL → GLSL mapping
│   ├── encoded-definitions.md      # Encoded/encrypted config decoding
│   ├── shader-injection.md         # onBeforeCompile injection pitfalls
│   ├── porting-strategy.md         # Porting framework selection + project templates
│   ├── unicorn-studio.md           # Unicorn Studio dedicated extraction flow
│   └── shaders-com.md              # shaders.com dedicated extraction flow
└── scripts/
    └── fetch-rendered-dom.mjs      # Playwright DOM capture script
```

## Reference Documents

The Skill includes 9 on-demand reference documents covering:

- **Framework signatures** — detection rules for Three.js, Babylon.js, PixiJS, WebGL, TSL
- **De-obfuscation rules** — class name and variable name mapping
- **Edge cases** — TSL node shader reconstruction, onBeforeCompile injection traps, encoded config decoding
- **Porting strategies** — framework selection and project structure templates

## Disclaimer

This tool is for learning and research purposes only. Extracted code may be protected by the original website's copyright and licenses. Users are responsible for confirming legal usage. Please check the target website's terms of use and respect the original author's work.
