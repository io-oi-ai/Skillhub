---
name: "UI Test — Agentic UI Testing"
description: "Test UI changes in a real browser. Adversarial tester that tries to break things, not confirm they work. Supports diff-driven, exploratory, and parallel workflows."
author: "Browserbase"
roles: ["developer"]
scenes: ["coding", "workflow"]
version: "1.0.0"
updatedAt: "2026-04-04"
tags: ["testing", "browser", "qa", "ui", "playwright", "browserbase", "accessibility", "collection:developer-tools"]
featured: false
source: "https://skills.sh/browserbase/skills/ui-test"
---

# UI Test — Agentic UI Testing Skill

Test UI changes in a real browser. Your job is to try to break things, not confirm they work.

Three workflows:

- **Diff-driven** — analyze a git diff, test only what changed
- **Exploratory** — navigate the app, find bugs the developer didn't think about
- **Parallel** — fan out independent test groups across multiple Browserbase browsers

## How Testing Works

The main agent coordinates — it plans test strategy, delegates to sub-agents, and merges results. Sub-agents do the actual browser testing.

### Planning: multiple angles, then execute once

You **MUST** complete all three planning rounds yourself and output them before launching any sub-agents. Planning happens in your own response — it is NOT delegated to sub-agents. Do not skip ahead to execution.

- **Round 1 — Functional**: What are the core user flows? What should work? Write out each test as: action → expected result.
- **Round 2 — Adversarial**: Re-read Round 1. What did you miss? Think about: different user types/roles, error paths, empty states, race conditions, edge inputs (empty, huge, special chars, rapid clicks).
- **Round 3 — Coverage gaps**: Re-read Rounds 1–2. What about: accessibility (axe-core, keyboard-only), mobile viewports, console errors, visual consistency with the rest of the app?
- **Deduplicate**: Merge all three rounds into one numbered list of tests. Remove overlaps. Assign each test to a group (e.g. Group A, Group B).

Then execute once — launch one sub-agent per group. Each sub-agent receives its specific list of tests to run, nothing more.

### Principles for splitting work

- Sub-agents run assigned tests, not open exploration.
- The bottleneck is the slowest agent — split work so no single agent has a disproportionate share.
- Size the effort to the change — a single component fix doesn't need many agents. A full-page redesign does.
- No early stopping on failures — find as many bugs as possible within the assigned tests.

### Giving sub-agents a step budget

The main agent MUST include an explicit browse step limit in every sub-agent prompt.

As a rough heuristic: ~25 steps for a few targeted checks, ~40 for a full page with functional + adversarial + a11y, ~75 for multiple pages or a broad category.

Every sub-agent prompt must include:

```
You have a budget of N browse steps (each `browse` command = 1 step). Count your steps as you go.
When you reach N, stop immediately and report:
- STEP_PASS/STEP_FAIL for every test you completed
- STEP_SKIP|<test-id>|budget reached for every test you didn't get to

Run only these tests: [numbered list from the merged plan]
Do not explore beyond the assigned tests.
Do NOT generate an HTML report or write any files. Return only step markers and your findings as text.
```

### Reporting

Every sub-agent reports back with:
```
Tests: 8 | Passed: 5 | Failed: 2 | Skipped: 1 | Pages visited: 2
```

The main agent merges into a final report with:
```
Tests: 20 | Passed: 14 | Failed: 4 | Skipped: 2 | Agents: 3 | Pass rate: 70%
```

## Testing Philosophy

You are an adversarial tester. Your goal is to find bugs, not prove correctness.

- Try to break every feature you test. Don't just check "does the button exist?" — click it twice rapidly, submit empty forms, paste 500 characters, press Escape mid-flow.
- Test what the developer didn't think about. Empty states, error recovery, keyboard-only navigation, mobile overflow.
- Every assertion must be evidence-based. Compare before/after snapshots. Check specific elements by ref. Never report PASS without concrete evidence.
- Report failures with enough detail to reproduce. Include the exact action, what you expected, what you got, and a suggested fix.

## Assertion Protocol

Every test step MUST produce a structured assertion. Do not write freeform "this looks good."

### Step markers

For each test step, emit exactly one marker:

```
STEP_PASS|<step-id>|<evidence>
```
or
```
STEP_FAIL|<step-id>|<expected> → <actual>|<screenshot-path>
```

### Screenshot Capture for Failures

Every `STEP_FAIL` MUST have an accompanying screenshot.

```bash
# Setup screenshot directory at start of any test run
mkdir -p .context/ui-test-screenshots

# Take screenshot immediately after observing a failure
browse screenshot --path .context/ui-test-screenshots/<step-id>.png
```

Rules:
- File name = step-id (e.g., `double-submit.png`, `axe-audit.png`)
- Store in `.context/ui-test-screenshots/`
- For parallel runs, include session name: `<session>-<step-id>.png`
- Take the screenshot at the moment of failure — capture the broken state

### How to verify (in order of rigor)

1. **Deterministic check** (strongest) — `browse eval` returns structured data (axe-core violations, title, form value, console errors)
2. **Snapshot element match** — a specific element with a specific role and text exists in the accessibility tree
3. **Before/after comparison** — snapshot before action, act, snapshot after
4. **Screenshot + visual judgment** (weakest) — only for visual-only properties the accessibility tree cannot capture

### Before/after comparison pattern

```bash
# 1. BEFORE: capture state
browse snapshot

# 2. ACT: perform the interaction
browse click @0-12

# 3. AFTER: capture new state
browse snapshot

# 4. ASSERT: emit marker based on comparison
# STEP_PASS|modal-open|dialog "Confirm" appeared at @0-20
# or
# STEP_FAIL|modal-open|expected dialog to appear → snapshot unchanged|.context/ui-test-screenshots/modal-open.png
```

## Setup

```bash
which browse || npm install -g @browserbasehq/browse-cli
```

### Avoid permission fatigue

Add both patterns to `.claude/settings.json` (project-level) or `~/.claude/settings.json` (user-level):

```json
{
  "permissions": {
    "allow": [
      "Bash(browse:*)",
      "Bash(BROWSE_SESSION=*)"
    ]
  }
}
```

## Mode Selection

| Target | Mode | Command | Auth |
|--------|------|---------|------|
| localhost / 127.0.0.1 | Local | `browse env local` | None needed |
| Deployed/staging site | Remote | `browse env remote` | cookie-sync → `--context-id` |

**Rule**: If the target URL contains `localhost` or `127.0.0.1`, always use `browse env local`.

### Local Mode (default for localhost)

```bash
browse env local
browse open http://localhost:3000
```

Use `browse env local --auto-connect` only when the test explicitly needs existing local login/cookies/state.

### Remote Mode (deployed sites via cookie-sync)

```bash
# Step 1: Sync cookies from local Chrome to Browserbase
node .claude/skills/cookie-sync/scripts/cookie-sync.mjs --domains your-app.com
# Output: Context ID: ctx_abc123

# Step 2: Switch to remote mode
browse env remote
browse open https://staging.your-app.com --context-id ctx_abc123 --persist
browse snapshot
# ... run tests ...
browse stop
```

## Workflow A: Diff-Driven Testing

### Phase 1: Analyze the diff

```bash
git diff --name-only HEAD~1
git diff HEAD~1 -- <file>
```

| File pattern | UI impact | What to test |
|---|---|---|
| `*.tsx, *.jsx, *.vue` | Component | Render, interaction, state, edge cases |
| `pages/**, app/**` | Route/page | Navigation, page load, content |
| `*.css, *.scss` | Style | Visual appearance, responsive |
| `*form*, *input*` | Form | Validation, submission, empty input, long input |
| `*modal*, *dialog*` | Interactive | Open/close, escape, focus trap |
| `*nav*, *menu*` | Navigation | Links, active states, keyboard nav |
| Non-UI files only | None | Skip — report "no UI tests needed" |

### Phase 2: Map files to URLs

```bash
cat package.json | grep -E '"(next|react|vue|nuxt|svelte|angular|vite)"'
```

| Framework | Default port | File → URL pattern |
|---|---|---|
| Next.js App Router | 3000 | `app/dashboard/page.tsx → /dashboard` |
| Next.js Pages Router | 3000 | `pages/about.tsx → /about` |
| Vite | 5173 | Check router config |
| SvelteKit | 5173 | `src/routes/+page.svelte → /` |

### Phase 3: Ensure the right code is running

```bash
git branch --show-current
# If it's not the PR branch, switch to it
git fetch origin <branch> && git checkout <branch>
yarn install  # or npm install / pnpm install

# Find running dev server
for port in 3000 3001 5173 4200 8080 8000 5000; do
  s=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$port" 2>/dev/null)
  if [ "$s" != "000" ]; then echo "Dev server on port $port (HTTP $s)"; fi
done
```

### Phase 4: Generate test plan

For each changed area, plan both happy path AND adversarial tests:

```
Test Plan (based on git diff)
=============================
Changed: src/components/SignupForm.tsx (added email validation)

1. [happy] Valid email submits successfully
   URL: http://localhost:3000/signup
   Steps: fill valid email → submit → verify success message appears

2. [adversarial] Invalid email shows error
   Steps: fill "not-an-email" → submit → verify error message appears

3. [adversarial] Empty form submission
   Steps: click submit without filling anything → verify error, no crash

4. [adversarial] XSS in email field
   Steps: fill "<script>alert(1)</script>" → submit → verify sanitized/rejected

5. [adversarial] Rapid double-submit
   Steps: click submit twice quickly → verify no duplicate submission

6. [adversarial] Keyboard-only flow
   Steps: Tab to email → type → Tab to submit → Enter → verify success
```

### Phase 5: Execute tests

```bash
browse stop 2>/dev/null
mkdir -p .context/ui-test-screenshots
browse env local

# For each test, follow the before/after pattern:
browse open http://localhost:3000/path
browse wait load
browse snapshot              # BEFORE: note elements, refs, text
browse click @0-ref          # ACT
browse snapshot              # AFTER: compare against BEFORE
# ASSERT with marker
```

### Phase 6: Report results

```markdown
## UI Test Results

### STEP_PASS|valid-email-submit|status "Thanks!" appeared at @0-42 after submit
- URL: http://localhost:3000/signup
- Before: form with email input @0-3, submit button @0-7
- Action: filled "user@test.com", clicked @0-7
- After: form replaced by status element with "Thanks! We'll be in touch."

### STEP_FAIL|double-submit|expected single submission → form submitted twice|.context/ui-test-screenshots/double-submit.png
- URL: http://localhost:3000/signup
- Action: clicked @0-7 twice rapidly
- After: two success toasts appeared, suggesting duplicate submission
- Suggestion: disable submit button after first click, or debounce the handler

---
**Summary: 4/6 passed, 2 failed**
Failed: double-submit, xss-sanitization
```

Always `browse stop` when done.

### Phase 7: Generate HTML report

After producing the text report, generate a standalone HTML report:

- Read the HTML template at `references/report-template.html`
- Replace all placeholders (`{{TITLE}}`, `{{PASS_COUNT}}`, etc.) with actual data
- Embed screenshots as base64: `base64 -i .context/ui-test-screenshots/step-id.png | tr -d '\n'`
- Write the final HTML to `.context/ui-test-report.html`
- Open: `open .context/ui-test-report.html`

Rules:
- Failures section comes before passes
- Failed cards are open by default; passed cards are collapsed
- Every `STEP_FAIL` card MUST have an embedded screenshot
- The report must work offline — no CDN links, no external assets
- Keep the HTML under 5MB

## Workflow B: Exploratory Testing

No diff, no plan — just open the app and try to break it. Use when the user says "test my app", "find bugs", or "QA this site."

**Approach:**
1. Discover the app — read `package.json` to detect the framework, then open the root URL
2. Navigate everything — click through nav links, visit every reachable page
3. Test what you find — apply adversarial patterns to forms, modals, navigation, keyboard, error states
4. Run deterministic checks — axe-core, console errors, broken images, form labels on every page
5. Report findings — use `STEP_PASS`/`STEP_FAIL` markers

**Tips:**
- Start with the homepage, then follow the navigation naturally
- Try the 404 page (`/does-not-exist`) — is it custom or default?
- Look for empty states (pages with no data)
- Test forms with garbage input before valid input
- Check mobile viewport (375px) on every page — does it overflow?
- If the app has auth, use cookie-sync first

## Workflow C: Parallel Testing

Run independent test groups concurrently using named browse sessions (`BROWSE_SESSION=<name>`). Each session gets its own browser.

Use when testing multiple pages or categories and you want faster wall clock time.

```bash
# Launch parallel sessions
BROWSE_SESSION=signup browse open http://localhost:3000/signup
BROWSE_SESSION=dashboard browse open http://localhost:3000/dashboard

# Stop all named sessions when done
BROWSE_SESSION=signup browse stop
BROWSE_SESSION=dashboard browse stop
```

## Adversarial Test Patterns

Apply these to every interactive element you test:

| Category | Tests |
|---|---|
| Forms | Empty submit, max-length overflow, special chars, XSS, rapid double-submit |
| Modals | Open/close, Escape key, focus trap, cancel vs confirm |
| Navigation | All links work, active states, keyboard nav |
| Error states | Navigate to empty/error states, recovery flows |
| Responsive | Mobile (375px) overflow, tablet (768px), desktop |

## Deterministic Checks

| Check | What it catches | Assertion |
|---|---|---|
| axe-core | WCAG violations | `violations.length === 0` |
| Console errors | Runtime exceptions, failed requests | empty error array |
| Broken images | Missing/failed image loads | no images with `naturalWidth === 0` |
| Form labels | Inputs without accessible labels | every input has `hasLabel: true` |

## Troubleshooting

| Problem | Solution |
|---|---|
| "No active page" | `browse stop`, retry. For zombies: `pkill -f "browse.*daemon"` |
| Dev server not responding | `curl http://localhost:<port>` — ask user to start it |
| `browse eval` with await fails | Use `.then()` instead — doesn't support top-level await |
| Element ref not found | `browse snapshot` again — refs change on page update |
| Blank snapshot | `browse wait load` before snapshotting |
| SPA deep links 404 | Navigate to `/` first, then click through |
| Remote auth fails | Re-run cookie-sync with `--context <id>`, try `--stealth` |
| Parallel session conflicts | Ensure every command uses `BROWSE_SESSION=<name>` |

## Best Practices

- **Be adversarial** — try to break things, don't just confirm they work
- **Every assertion needs evidence** — snapshot ref, eval result, or before/after diff
- **Before/after for every interaction** — snapshot, act, snapshot, compare
- **Screenshot every failure** — immediately on `STEP_FAIL`, save to `.context/ui-test-screenshots/<step-id>.png`
- **Deterministic checks first** — axe-core, console errors, form labels before visual judgment
- **For localhost, start with clean local mode** — use `browse env local` for reproducible runs
- **Always `browse stop` when done**
- **Report failures with reproduction steps** — action, expected, actual, screenshot path, suggestion

---

# 中文版

# UI Test — 智能 UI 自动化测试

在真实浏览器中测试 UI 变更。你的目标是**找出 Bug，而不是证明功能正常**。

三种工作流：

- **Diff 驱动** — 分析 git diff，只测试有变更的部分
- **探索式** — 浏览应用，发现开发者没想到的 Bug
- **并行** — 跨多个 Browserbase 浏览器并发测试

## 工作原理

主 Agent 负责协调：制定测试策略、分配子 Agent、汇总结果。子 Agent 执行实际浏览器测试。

### 规划：多角度分析，一次执行

在启动任何子 Agent 之前，你**必须**亲自完成三轮规划并输出结果，不可委托子 Agent 规划。

- **第一轮 — 功能性**：核心用户流程是什么？应该正常工作的是什么？写出每项测试：操作 → 预期结果。
- **第二轮 — 对抗性**：重读第一轮。遗漏了什么？考虑：不同用户角色、错误路径、空状态、竞态条件、边界输入（空、超长、特殊字符、快速点击）。
- **第三轮 — 覆盖盲区**：重读前两轮。还有什么？无障碍（axe-core、仅键盘）、移动端视口、控制台错误、视觉一致性。
- **去重合并**：合并为一个编号列表，删除重叠项，分组（如 Group A、Group B）。

然后一次性执行 — 每组启动一个子 Agent，子 Agent 只执行分配的测试列表。

### 测试哲学

你是一个对抗性测试者，目标是找出 Bug，而不是证明正确性：

- 尝试破坏每个功能：快速双击、提交空表单、粘贴 500 个字符、中途按 Escape。
- 测试开发者没有考虑到的情况：空状态、错误恢复、纯键盘导航、移动端溢出。
- 每个断言必须基于证据：前后快照对比，不能无证据报告 PASS。
- 报告失败时提供足够的复现细节：操作、预期、实际、建议修复方案。

## 断言协议

每个测试步骤必须产生一个结构化断言，禁止写模糊的"看起来没问题"。

### 步骤标记

```
STEP_PASS|<step-id>|<evidence>
STEP_FAIL|<step-id>|<expected> → <actual>|<screenshot-path>
```

每次 `STEP_FAIL` 必须附带截图：

```bash
mkdir -p .context/ui-test-screenshots
browse screenshot --path .context/ui-test-screenshots/<step-id>.png
```

### 验证强度排序（从强到弱）

1. **确定性检查**（最强）— eval 返回结构化数据（axe-core 违规数、表单值、控制台错误）
2. **快照元素匹配** — 特定角色和文本的元素存在于无障碍树中
3. **前后对比** — 快照 → 操作 → 快照，验证树的变化
4. **截图 + 视觉判断**（最弱）— 仅用于无障碍树无法捕捉的视觉属性

## 工作流 A：Diff 驱动测试

1. **分析 diff**：`git diff --name-only HEAD~1`，分类文件（组件/路由/样式/表单/弹窗/导航）
2. **映射 URL**：检测框架端口，将文件路径转换为 URL
3. **确认正确代码正在运行**：检查当前分支，必要时切换分支并重启开发服务器
4. **生成测试计划**：为每个变更区域规划正向路径和对抗性测试
5. **执行测试**：`browse env local` → 对每个测试执行前后对比模式
6. **报告结果**：使用 `STEP_PASS`/`STEP_FAIL` 标记，失败附截图
7. **生成 HTML 报告**：读取模板 → 填充数据 → 嵌入 base64 截图 → 保存到 `.context/ui-test-report.html`

## 工作流 B：探索式测试

无 diff，无计划，直接打开应用尝试破坏它：

1. 发现应用（框架检测、打开根 URL）
2. 浏览所有导航和页面
3. 对每个页面应用对抗性模式
4. 运行确定性检查（axe-core、控制台错误、broken images、表单标签）
5. 报告发现

## 工作流 C：并行测试

使用命名 browse 会话（`BROWSE_SESSION=<name>`）并发运行独立测试组：

```bash
BROWSE_SESSION=signup browse open http://localhost:3000/signup
BROWSE_SESSION=dashboard browse open http://localhost:3000/dashboard
```

测试完毕后停止所有命名会话：

```bash
BROWSE_SESSION=signup browse stop
BROWSE_SESSION=dashboard browse stop
```

## 最佳实践

- 对抗性优先：尝试破坏，而不是确认
- 每个断言都需要证据
- 每次交互都做前后对比
- 每次失败立即截图
- 确定性检查优先于视觉判断
- localhost 使用 `browse env local` 保证可重现性
- 完成后始终执行 `browse stop`
