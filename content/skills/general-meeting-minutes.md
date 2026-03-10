---
name: "Meeting Minutes Organization"
description: "Organize meeting recordings or notes into structured meeting minutes, including resolutions and action items"
author: "SkillHubs"
roles: ["everyone"]
scenes: ["communication", "workflow"]
version: "1.0.0"
updatedAt: "2025-02-20"
tags: ["meeting minutes", "communication", "collaboration", "action items", "collection:getting-started"]
featured: false
source: "skillhub"
---

When the user provides meeting notes, a transcript, or a recording transcription, organize it into structured meeting minutes following this process.

## Step 1: Identify Meeting Info

Extract or ask the user for:
1. **Meeting topic**
2. **Date and time**
3. **Attendees** (and moderator if identifiable)
4. **Agenda** (if available)

If the input is a raw transcript, infer attendees from speaker labels. If key information is missing and cannot be inferred, ask the user before proceeding.

## Step 2: Process the Content

Read through the entire input and extract:
1. **Discussion topics** — group related conversation into distinct topics
2. **Key arguments** — capture different viewpoints expressed per topic
3. **Decisions made** — any consensus, approval, or resolution reached
4. **Action items** — tasks assigned to specific people with deadlines
5. **Open questions** — unresolved issues that need follow-up

## Step 3: Generate Meeting Minutes

Output the minutes in this exact format:

```markdown
# Meeting Minutes: [Topic]

**Date:** [YYYY-MM-DD]
**Time:** [HH:MM - HH:MM]
**Attendees:** [Names]
**Moderator:** [Name]

---

## Agenda

1. [Topic 1]
2. [Topic 2]
...

## Discussion Summary

### [Topic 1]
[2-3 sentence summary of discussion and key viewpoints]

### [Topic 2]
[2-3 sentence summary]

## Decisions

| # | Decision | Rationale | Decided by |
|---|----------|-----------|------------|
| 1 | ...      | ...       | ...        |

## Action Items

| # | Task | Owner | Deadline | Status |
|---|------|-------|----------|--------|
| 1 | ...  | ...   | ...      | Pending |

## Open Issues

- [ ] [Issue description] — to be discussed in [next meeting / specific date]
```

## Constraints

- Every action item MUST have three elements: **owner**, **specific task**, and **deadline**. If the deadline is unclear from the input, mark it as "TBD" and flag it.
- Distinguish facts from opinions — use "X suggested..." or "X proposed..." for opinions, not declarative statements.
- Keep each topic summary to 2-3 sentences. Link to detailed discussion only if the user requests verbose output.
- If the input is a raw transcript with filler words, clean it up but preserve the substance and attribution of statements.
- Do NOT add information that was not discussed in the meeting.

# 中文版

当用户提供会议记录、会议纪要或转写内容时，请按以下流程整理为结构化会议纪要。

## 第 1 步：识别会议基本信息

提取或向用户确认：
1. **会议主题**
2. **日期与时间**
3. **参会人**（若可识别也注明主持人）
4. **会议议程**（如有）

如果输入是原始转写内容，需从发言者标签推断参会人。若关键信息缺失且无法推断，请在继续前向用户确认。

## 第 2 步：处理内容

通读全部输入并提取：
1. **讨论议题** —— 将相关讨论归为明确主题
2. **关键观点** —— 记录每个议题中的不同观点
3. **已达成决议** —— 共识、批准或结论
4. **行动项** —— 指派给具体人员且有截止时间的任务
5. **未决问题** —— 需要后续跟进的事项

## 第 3 步：生成会议纪要

请严格按以下格式输出：

```markdown
# 会议纪要：[主题]

**日期：** [YYYY-MM-DD]
**时间：** [HH:MM - HH:MM]
**参会人：** [姓名]
**主持人：** [姓名]

---

## 议程

1. [议题 1]
2. [议题 2]
...

## 讨论摘要

### [议题 1]
[2-3 句总结讨论与关键观点]

### [议题 2]
[2-3 句总结]

## 决议

| # | 决议 | 理由 | 决策人 |
|---|------|------|--------|
| 1 | ...  | ...  | ...    |

## 行动项

| # | 任务 | 负责人 | 截止日期 | 状态 |
|---|------|--------|----------|------|
| 1 | ...  | ...    | ...      | Pending |

## 未决问题

- [ ] [问题描述] —— 将在[下次会议/指定日期]讨论
```

## 约束

- 每个行动项必须包含：**负责人**、**具体任务**、**截止日期**。如截止日期不明确，标记为“待定（TBD）”并提示。
- 区分事实与观点，观点用“某人提出/建议”表述，避免主观陈述。
- 每个议题摘要保持 2-3 句。
- 若输入为原始转写且包含口头语，需要清洗但保留事实与归属。
- 不要添加会议中未讨论的信息。
