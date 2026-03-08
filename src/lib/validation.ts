/**
 * Input validation utilities for API routes.
 */

// UUID v4 format
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Relaxed ID format: lowercase alphanumeric, hyphens, Chinese chars
const SKILL_ID_RE = /^[a-z0-9\u4e00-\u9fff][-a-z0-9\u4e00-\u9fff]{0,128}$/;

/**
 * Strip potentially dangerous HTML/script content from user text.
 * Does NOT fully sanitize Markdown (that should happen at render time),
 * but catches obvious XSS vectors in text fields like name, description, tags.
 */
export function sanitizeText(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim();
}

export function isValidUUID(value: string): boolean {
  return UUID_RE.test(value);
}

export function isValidSkillId(value: string): boolean {
  return SKILL_ID_RE.test(value);
}

export function isValidVisitorId(value: string): boolean {
  // visitor_id can be a UUID or a Supabase user ID
  return UUID_RE.test(value) || (value.length > 0 && value.length <= 128);
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

/**
 * Validate and sanitize skill creation/update input.
 */
export function validateSkillInput(body: Record<string, unknown>): {
  valid: boolean;
  error?: string;
  sanitized?: {
    name: string;
    description: string;
    roles: string[];
    scenes: string[];
    tags: string[];
    content: string;
    author?: string;
  };
} {
  const { name, description, roles, scenes, tags, content, author } = body;

  if (!isNonEmptyString(name) || name.length > 200) {
    return { valid: false, error: "Name is required and must be <= 200 chars" };
  }
  if (!isNonEmptyString(description) || description.length > 1000) {
    return { valid: false, error: "Description is required and must be <= 1000 chars" };
  }
  if (!isStringArray(roles) || roles.length === 0) {
    return { valid: false, error: "At least one role is required" };
  }
  if (!isStringArray(scenes) || scenes.length === 0) {
    return { valid: false, error: "At least one scene is required" };
  }

  return {
    valid: true,
    sanitized: {
      name: sanitizeText(name),
      description: sanitizeText(description as string),
      roles: roles as string[],
      scenes: scenes as string[],
      tags: isStringArray(tags) ? (tags as string[]).map(sanitizeText) : [],
      content: typeof content === "string" ? content : "",
      author: typeof author === "string" ? sanitizeText(author) : undefined,
    },
  };
}
