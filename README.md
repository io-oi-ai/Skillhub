# SkillHub

Open-source platform for discovering, sharing, and managing AI Agent Skills — structured Markdown workflows that teach AI agents (Claude, ChatGPT, Cursor, etc.) how to perform specific tasks.

Think of it as **npm for AI workflows**: a curated registry of reusable, versioned, community-driven skill documents.

**Live:** [skillhubs.cc](https://skillhubs.cc)

## Features

- **Skills Registry** — Browse, search, and filter 37+ AI skills by role and scene
- **Git-like Collaboration** — Version history, pull requests, merge/reject, rollback
- **CLI Tool** — Full-featured command-line interface for agents and power users
- **Points & Levels** — Gamification system rewarding creation, collaboration, and downloads
- **Research-Backed** — Curated skills improve task completion by +16.2pp (SkillsBench)
- **Bilingual** — Full English / Chinese (i18n) support
- **OAuth & Magic Link** — Supabase Auth with Google, GitHub, email login
- **Pro Billing** — Waffo Pancake subscriptions and per-download checkout

## Writing Guide

SkillHub includes a research-backed [Writing Guide](https://skillhubs.cc/guide) based on the SkillsBench study (arXiv:2602.12670). Key findings:

- **2–3 modules** is the sweet spot (+18.6pp); 4+ modules see diminishing returns
- **Detailed & compact** style works best (+18.8pp); verbose docs hurt (-2.9pp)
- **Human curation** beats AI self-generation (+16.2pp vs -1.3pp)
- **Domain-specific** skills outperform general-purpose ones

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, React 19) |
| Database & Auth | Supabase (PostgreSQL + RLS) |
| Styling | Tailwind CSS v4 |
| CLI | Commander.js |
| Language | TypeScript |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### Setup

```bash
# Install dependencies
npm install

# Configure environment
# Create .env.local and fill in:
#   NEXT_PUBLIC_SUPABASE_URL=
#   NEXT_PUBLIC_SUPABASE_ANON_KEY=
#   SUPABASE_SERVICE_ROLE_KEY=
#   WAFFO_MERCHANT_ID=
#   WAFFO_PRIVATE_KEY=
#   WAFFO_STORE_ID=
#   WAFFO_DOWNLOAD_PRODUCT_ID=
#   WAFFO_PRO_MONTHLY_PRODUCT_ID=
#   WAFFO_PRO_YEARLY_PRODUCT_ID=

# Run database migrations
# Execute scripts/setup-auth-schema.sql, scripts/setup-points-schema.sql,
# and scripts/setup-billing-schema.sql
# in your Supabase SQL editor

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Seed Data

```bash
# Import skill markdown files into Supabase
npx tsx scripts/migrate-to-supabase.ts
```

## CLI

SkillHub includes a standalone CLI for managing skills from the terminal.

```bash
# Build the CLI
npm run build:cli

# Or run directly with tsx
npx tsx src/cli/index.ts
```

### Auth

```bash
skillhub auth login                   # Browser OAuth (opens browser automatically)
skillhub auth login --magic <email>   # Magic link
skillhub auth login --otp <email>     # Email OTP
skillhub auth whoami
skillhub auth logout
```

### Skills

```bash
skillhub skills list [--role developer] [--scene coding] [--q keyword]
skillhub skills search <keyword>
skillhub skills show <id>
skillhub skills create --name "My Skill" --description "..." --roles developer --scenes coding --file skill.md
skillhub skills update <id> --file skill.md --message "what changed"
skillhub skills delete <id> --yes
skillhub skills rollback <id> --version <versionId>
```

### Pull Requests

```bash
skillhub skills pr list <skillId>
skillhub skills pr create <skillId> --title "Fix typo" --file updated.md
skillhub skills pr merge <skillId> <prId>
skillhub skills pr reject <skillId> <prId> --comment "reason"
```

### Points

```bash
skillhub points me        # Current points and level
skillhub points history   # Transaction log
```

All commands support `--json` for machine-readable output.

## Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── [locale]/         # Locale-scoped pages (en/zh)
│   │   ├── page.tsx      # Homepage
│   │   ├── login/        # Auth page
│   │   ├── submit/       # Skill submission
│   │   ├── leaderboard/  # Points leaderboard
│   │   └── skill/[id]/   # Skill detail, edit, versions, PRs
│   └── api/              # REST API routes
├── cli/                  # CLI tool (compiled separately)
│   ├── commands/         # auth, skills, points
│   └── lib/              # Supabase client, config, output
├── components/           # React components
├── i18n/                 # Dictionaries (en, zh)
├── lib/                  # Shared logic (types, auth, points, Supabase clients)
└── middleware.ts         # i18n routing + session refresh
```

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/skills` | List skills (`?role`, `?scene`, `?q`) |
| POST | `/api/skills` | Create skill |
| GET | `/api/skills/[id]` | Get skill |
| PUT | `/api/skills/[id]` | Update skill |
| DELETE | `/api/skills/[id]` | Delete skill |
| POST | `/api/skills/[id]/download` | Record download |
| GET | `/api/skills/[id]/versions` | Version history |
| POST | `/api/skills/[id]/rollback` | Rollback to version |
| GET/POST | `/api/skills/[id]/pulls` | List/create PRs |
| POST | `/api/skills/[id]/pulls/[prId]/merge` | Merge PR |
| POST | `/api/skills/[id]/pulls/[prId]/reject` | Reject PR |
| POST | `/api/likes/[skillId]` | Toggle like |

## Points System

| Action | Points |
|--------|--------|
| Sign up | +10 |
| Create skill | +10 |
| First skill bonus | +20 |
| Update skill | +5 |
| Skill downloaded | +5 + likes |
| Submit PR | +3 |
| PR merged | +3 |
| Skill liked | +2 |

Levels: Newcomer (0) → Contributor (50) → Builder (200) → Expert (500) → Master (1000+)

## License

MIT
