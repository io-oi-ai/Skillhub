---
name: "Meeting Minutes Organization"
description: "Organize meeting recordings or notes into structured meeting minutes, including resolutions and action items"
author: "SkillHub"
roles: ["everyone"]
scenes: ["communication", "workflow"]
version: "1.0.0"
updatedAt: "2025-02-20"
tags: ["meeting minutes", "communication", "collaboration", "action items"]
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
