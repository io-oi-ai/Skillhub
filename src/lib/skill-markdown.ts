/**
 * Shared utility for generating Claude Code-compatible skill markdown.
 * Used by both DownloadButton (browser) and CLI install command.
 */

export interface SkillMarkdownInput {
  id: string;
  name: string;
  description: string;
  author: string;
  roles: string[];
  scenes: string[];
  version: string;
  tags: string[];
  source?: string | null;
  content: string;
}

export function toKebabCase(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function buildSkillMarkdown(skill: SkillMarkdownInput): string {
  const slug = toKebabCase(skill.name);

  // Claude Code compatible frontmatter (only name + description)
  const frontmatter = [
    "---",
    `name: ${slug}`,
    `description: ${skill.description}`,
    "---",
  ].join("\n");

  // Platform metadata preserved as HTML comment
  const metadata = [
    "<!-- SkillHub metadata",
    `author: ${skill.author}`,
    `roles: ${skill.roles.join(", ")}`,
    `scenes: ${skill.scenes.join(", ")}`,
    `version: ${skill.version}`,
    `tags: ${skill.tags.join(", ")}`,
    skill.source ? `source: ${skill.source}` : null,
    `url: https://skillhub.dev/skill/${skill.id}`,
    "-->",
  ]
    .filter(Boolean)
    .join("\n");

  const body = skill.content || `# ${skill.name}\n\n${skill.description}`;

  return `${frontmatter}\n\n${metadata}\n\n${body}\n`;
}
