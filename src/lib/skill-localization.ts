import type { Skill } from "@/lib/types";

interface SkillCopy {
  name: string;
  description: string;
}

function getChineseSection(content: string): string {
  const lines = content.split("\n");
  const markerIndex = lines.findIndex((line) =>
    /^#{1,2}\s*中文版\s*$/.test(line.trim()),
  );
  if (markerIndex === -1) return "";
  return lines.slice(markerIndex + 1).join("\n").trim();
}

function getFirstMarkdownHeading(content: string): string {
  const lines = content.split("\n");
  for (const line of lines) {
    const match = line.trim().match(/^#{1,2}\s+(.+)$/);
    if (match) return match[1].trim();
  }
  return "";
}

function getFirstParagraph(content: string): string {
  const lines = content.split("\n");
  let inCodeBlock = false;
  const buffer: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    if (!line) {
      if (buffer.length > 0) break;
      continue;
    }

    if (
      line.startsWith("#") ||
      line.startsWith("- ") ||
      line.startsWith("* ") ||
      line.startsWith(">") ||
      line.startsWith("|") ||
      /^\d+\.\s/.test(line)
    ) {
      if (buffer.length > 0) break;
      continue;
    }

    buffer.push(line);
  }

  return buffer.join(" ").trim();
}

export function getLocalizedSkillCopy(skill: Skill, locale: string): SkillCopy {
  if (!locale.startsWith("zh")) {
    return { name: skill.name, description: skill.description };
  }

  const chineseSection = skill.content ? getChineseSection(skill.content) : "";
  if (!chineseSection) {
    return { name: skill.name, description: skill.description };
  }

  const chineseTitle = getFirstMarkdownHeading(chineseSection);
  const chineseDescription = getFirstParagraph(chineseSection);

  return {
    name: chineseTitle || skill.name,
    description: chineseDescription || skill.description,
  };
}
