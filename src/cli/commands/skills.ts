import type { Command } from "commander";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import matter from "gray-matter";
import { createSupabaseClient } from "../lib/supabase";
import { printJson, printKeyValue, printTable } from "../lib/output";
import { awardPoints } from "../../lib/points";
import { buildSkillMarkdown, toKebabCase } from "../../lib/skill-markdown";

interface SkillRow {
  id: string;
  name: string;
  description: string;
  author: string;
  roles: string[];
  scenes: string[];
  version: string;
  updated_at: string;
  tags: string[];
  featured: boolean;
  source: string | null;
  likes_count: number;
  content?: string;
  user_id?: string | null;
}

interface PullRequestRow {
  id: number;
  skill_id: string;
  author_id: string;
  status: string;
  title: string;
  message: string | null;
  name: string | null;
  description: string | null;
  content: string;
  roles: string[] | null;
  scenes: string[] | null;
  tags: string[] | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  review_comment?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

function normalizeStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  return [];
}

function parseList(value?: string | string[]): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function incrementVersion(version: string): string {
  const parts = version.split(".").map(Number);
  parts[2] = (parts[2] || 0) + 1;
  return parts.join(".");
}

async function loadFileContent(filePath?: string) {
  if (!filePath) return null;
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = matter(raw);
  return {
    content: parsed.content.trim(),
    data: parsed.data as Record<string, unknown>,
  };
}

function buildIdFromName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-|-$/g, "");
}

function filterByQuery(skills: SkillRow[], q: string | null) {
  if (!q) return skills;
  const query = q.toLowerCase();
  return skills.filter((s) => {
    const name = s.name?.toLowerCase() ?? "";
    const description = s.description?.toLowerCase() ?? "";
    const tags = normalizeStringArray(s.tags).map((t) => t.toLowerCase());
    return (
      name.includes(query) ||
      description.includes(query) ||
      tags.some((t) => t.includes(query))
    );
  });
}

export function registerSkillsCommands(program: Command) {
  const skills = program.command("skills").description("Manage skills");

  async function listSkills(options: Record<string, string | boolean>) {
    const limit = Number(options.limit ?? 50);
    const offset = Number(options.offset ?? 0);
    const role = options.role ? String(options.role) : null;
    const scene = options.scene ? String(options.scene) : null;
    const q = options.q ? String(options.q) : null;
    const json = Boolean(options.json);

    const { client } = await createSupabaseClient(false);

    let query = client
      .from("skills")
      .select(
        "id,name,description,author,roles,scenes,version,updated_at,tags,featured,source,likes_count"
      )
      .order("featured", { ascending: false })
      .order("updated_at", { ascending: false });

    if (role) query = query.contains("roles", [role]);
    if (scene) query = query.contains("scenes", [scene]);

    const { data, error } = await query;

    if (error) {
      console.error("Failed to fetch skills:", error.message);
      process.exit(1);
    }

    const all = filterByQuery((data ?? []) as SkillRow[], q);
    const total = all.length;
    const paged = all.slice(offset, offset + limit);

    if (json) {
      printJson({ count: total, skills: paged });
      return;
    }

    if (paged.length === 0) {
      console.log("No skills found.");
      return;
    }

    const rows = paged.map((s) => [
      s.id,
      s.name,
      s.author,
      s.version,
      s.updated_at,
      normalizeStringArray(s.roles).join(", "),
      normalizeStringArray(s.scenes).join(", "),
      normalizeStringArray(s.tags).join(", "),
    ]);

    printTable(
      ["id", "name", "author", "version", "updated_at", "roles", "scenes", "tags"],
      rows
    );
    console.log(`Total: ${total}  Showing: ${paged.length}`);
  }

  skills
    .command("list")
    .description("List skills")
    .option("--role <role>", "Filter by role")
    .option("--scene <scene>", "Filter by scene")
    .option("--q <keyword>", "Search keyword")
    .option("--limit <n>", "Limit results", "50")
    .option("--offset <n>", "Offset results", "0")
    .option("--json", "Output JSON")
    .action(listSkills);

  skills
    .command("search")
    .description("Search skills by keyword")
    .argument("<keyword>", "Keyword")
    .option("--role <role>", "Filter by role")
    .option("--scene <scene>", "Filter by scene")
    .option("--limit <n>", "Limit results", "50")
    .option("--offset <n>", "Offset results", "0")
    .option("--json", "Output JSON")
    .action(async (keyword: string, options: Record<string, string | boolean>) => {
      await listSkills({ ...options, q: keyword });
    });

  skills
    .command("show")
    .description("Show a single skill by id")
    .argument("<id>", "Skill id")
    .option("--json", "Output JSON")
    .action(async (id: string, options: Record<string, boolean>) => {
      const { client } = await createSupabaseClient(false);
      const { data, error } = await client
        .from("skills")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("Skill not found.");
        process.exit(1);
      }

      if (options.json) {
        printJson(data);
        return;
      }

      const skill = data as SkillRow;
      printKeyValue({
        id: skill.id,
        name: skill.name,
        description: skill.description,
        author: skill.author,
        roles: normalizeStringArray(skill.roles),
        scenes: normalizeStringArray(skill.scenes),
        tags: normalizeStringArray(skill.tags),
        version: skill.version,
        updated_at: skill.updated_at,
        featured: skill.featured,
        source: skill.source,
        likes_count: skill.likes_count,
      });
      console.log("");
      console.log(skill.content ?? "");
    });

  skills
    .command("create")
    .description("Create a new skill")
    .option("--name <name>", "Skill name")
    .option("--description <desc>", "Skill description")
    .option("--roles <roles>", "Comma-separated roles")
    .option("--scenes <scenes>", "Comma-separated scenes")
    .option("--tags <tags>", "Comma-separated tags")
    .option("--content <content>", "Skill markdown content")
    .option("--file <path>", "Markdown file with optional frontmatter")
    .option("--author <name>", "Author name (fallback if profile missing)")
    .option("--force", "Allow overwrite if id exists (upsert)")
    .option("--json", "Output JSON")
    .action(async (options: Record<string, string | boolean>) => {
      const { client } = await createSupabaseClient(true);
      const { data: userData, error: userError } = await client.auth.getUser();
      if (userError || !userData.user) {
        console.error("Not logged in.");
        process.exit(1);
      }

      const file = await loadFileContent(
        options.file ? String(options.file) : undefined
      );

      const name = String(options.name ?? file?.data?.name ?? "").trim();
      const description = String(
        options.description ?? file?.data?.description ?? ""
      ).trim();
      const roles = parseList(
        (options.roles as string | undefined) ??
          (file?.data?.roles as string | undefined)
      );
      const scenes = parseList(
        (options.scenes as string | undefined) ??
          (file?.data?.scenes as string | undefined)
      );
      const tags = parseList(
        (options.tags as string | undefined) ??
          (file?.data?.tags as string | undefined)
      );

      if (!name || !description || roles.length === 0 || scenes.length === 0) {
        console.error(
          "Missing required fields: name, description, roles, scenes."
        );
        process.exit(1);
      }

      const id = buildIdFromName(name);
      if (!id) {
        console.error("Could not generate a valid id from the name.");
        process.exit(1);
      }

      const content =
        (options.content ? String(options.content) : file?.content) ||
        `# ${name}\n\n${description}`;

      let author = options.author ? String(options.author) : "";
      if (!author) {
        const { data: profile } = await client
          .from("profiles")
          .select("display_name, username")
          .eq("id", userData.user.id)
          .single();
        if (profile) {
          author = profile.display_name || profile.username || author;
        }
      }

      if (!author) {
        console.error("Author name is required (set --author).");
        process.exit(1);
      }

      const row = {
        id,
        name,
        description,
        author,
        roles,
        scenes,
        version: "1.0.0",
        updated_at: new Date().toISOString().split("T")[0],
        tags,
        featured: false,
        source: null,
        content,
        likes_count: 0,
        user_id: userData.user.id,
      };

      const shouldForce = Boolean(options.force);
      const insertQuery = shouldForce
        ? client
            .from("skills")
            .upsert(row, { onConflict: "id" })
            .select("id")
            .single()
        : client.from("skills").insert(row).select("id").single();

      const { data, error } = await insertQuery;
      if (error || !data) {
        console.error("Failed to create skill:", error?.message ?? "Unknown error");
        process.exit(1);
      }

      // Award points (non-blocking)
      let pointsAwarded = 0;
      try {
        pointsAwarded += await awardPoints(
          client,
          userData.user.id,
          "skill_create",
          data.id,
          "skill"
        );

        const { count } = await client
          .from("skills")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userData.user.id);
        if (count === 1) {
          pointsAwarded += await awardPoints(
            client,
            userData.user.id,
            "skill_create_first",
            data.id,
            "skill"
          );
        }
      } catch {
        // ignore points errors
      }

      if (options.json) {
        printJson({ id: data.id, pointsAwarded });
        return;
      }
      console.log(`Created skill: ${data.id}`);
      if (pointsAwarded) console.log(`Points awarded: ${pointsAwarded}`);
    });

  skills
    .command("update")
    .description("Update an existing skill")
    .argument("<id>", "Skill id")
    .option("--name <name>", "Skill name")
    .option("--description <desc>", "Skill description")
    .option("--roles <roles>", "Comma-separated roles")
    .option("--scenes <scenes>", "Comma-separated scenes")
    .option("--tags <tags>", "Comma-separated tags")
    .option("--content <content>", "Skill markdown content")
    .option("--file <path>", "Markdown file with optional frontmatter")
    .option("--message <msg>", "Update message")
    .option("--json", "Output JSON")
    .action(async (id: string, options: Record<string, string | boolean>) => {
      const { client } = await createSupabaseClient(true);
      const { data: userData, error: userError } = await client.auth.getUser();
      if (userError || !userData.user) {
        console.error("Not logged in.");
        process.exit(1);
      }

      const { data: skill, error: fetchError } = await client
        .from("skills")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError || !skill) {
        console.error("Skill not found.");
        process.exit(1);
      }

      if (skill.user_id !== userData.user.id) {
        console.error("Forbidden: you are not the author of this skill.");
        process.exit(1);
      }

      const file = await loadFileContent(
        options.file ? String(options.file) : undefined
      );

      const name = options.name
        ? String(options.name)
        : (file?.data?.name as string | undefined);
      const description = options.description
        ? String(options.description)
        : (file?.data?.description as string | undefined);
      const roles = options.roles
        ? parseList(String(options.roles))
        : parseList(file?.data?.roles as string | undefined);
      const scenes = options.scenes
        ? parseList(String(options.scenes))
        : parseList(file?.data?.scenes as string | undefined);
      const tags = options.tags
        ? parseList(String(options.tags))
        : parseList(file?.data?.tags as string | undefined);
      const content = options.content ? String(options.content) : file?.content;
      const message = options.message ? String(options.message) : undefined;

      const { error: snapshotError } = await client
        .from("skill_versions")
        .insert({
          skill_id: id,
          version: skill.version,
          name: skill.name,
          description: skill.description,
          content: skill.content,
          roles: skill.roles,
          scenes: skill.scenes,
          tags: skill.tags,
          user_id: userData.user.id,
          message: message || `Updated to version ${incrementVersion(skill.version)}`,
        });

      if (snapshotError) {
        console.error("Failed to save version history.");
        process.exit(1);
      }

      const newVersion = incrementVersion(skill.version);
      const { data: updated, error: updateError } = await client
        .from("skills")
        .update({
          name: name ?? skill.name,
          description: description ?? skill.description,
          content: content ?? skill.content,
          roles: roles.length ? roles : skill.roles,
          scenes: scenes.length ? scenes : skill.scenes,
          tags: tags.length ? tags : skill.tags,
          version: newVersion,
          updated_at: new Date().toISOString().split("T")[0],
        })
        .eq("id", id)
        .select()
        .single();

      if (updateError || !updated) {
        console.error("Failed to update skill:", updateError?.message ?? "");
        process.exit(1);
      }

      let pointsAwarded = 0;
      try {
        pointsAwarded = await awardPoints(
          client,
          userData.user.id,
          "skill_update",
          id,
          "skill"
        );
      } catch {
        // ignore points errors
      }

      if (options.json) {
        printJson({ ...updated, pointsAwarded });
        return;
      }
      console.log(`Updated skill: ${id} -> ${newVersion}`);
      if (pointsAwarded) console.log(`Points awarded: ${pointsAwarded}`);
    });

  skills
    .command("delete")
    .description("Delete a skill")
    .argument("<id>", "Skill id")
    .option("--yes", "Confirm deletion")
    .option("--json", "Output JSON")
    .action(async (id: string, options: Record<string, boolean>) => {
      if (!options.yes) {
        console.error("Deletion requires --yes.");
        process.exit(1);
      }
      const { client } = await createSupabaseClient(true);
      const { data: userData, error: userError } = await client.auth.getUser();
      if (userError || !userData.user) {
        console.error("Not logged in.");
        process.exit(1);
      }

      const { data: skill, error: fetchError } = await client
        .from("skills")
        .select("id, user_id")
        .eq("id", id)
        .single();
      if (fetchError || !skill) {
        console.error("Skill not found.");
        process.exit(1);
      }
      if (skill.user_id !== userData.user.id) {
        console.error("Forbidden: you are not the author of this skill.");
        process.exit(1);
      }

      const { error } = await client.from("skills").delete().eq("id", id);
      if (error) {
        console.error("Failed to delete skill:", error.message);
        process.exit(1);
      }
      if (options.json) {
        printJson({ id, deleted: true });
        return;
      }
      console.log(`Deleted skill: ${id}`);
    });

  const pr = skills.command("pr").description("Skill pull requests");

  pr
    .command("list")
    .description("List pull requests for a skill")
    .argument("<skillId>", "Skill id")
    .option("--status <status>", "Filter by status")
    .option("--reviewer <userId>", "Filter by reviewer user id")
    .option("--with-comment", "Only PRs with review comments")
    .option("--limit <n>", "Limit results", "50")
    .option("--offset <n>", "Offset results", "0")
    .option("--json", "Output JSON")
    .action(async (skillId: string, options: Record<string, string | boolean>) => {
      const status = options.status ? String(options.status) : null;
      const reviewer = options.reviewer ? String(options.reviewer) : null;
      const withComment = Boolean(options["withComment"]);
      const limit = Number(options.limit ?? 50);
      const offset = Number(options.offset ?? 0);
      const { client } = await createSupabaseClient(false);

      let query = client
        .from("skill_pull_requests")
        .select(
          "id,skill_id,author_id,status,title,message,name,description,roles,scenes,tags,reviewed_by,reviewed_at,review_comment,created_at,updated_at"
        )
        .eq("skill_id", skillId)
        .order("created_at", { ascending: false });

      if (status) query = query.eq("status", status);
      if (reviewer) query = query.eq("reviewed_by", reviewer);
      if (withComment) {
        query = query.not("review_comment", "is", null).neq("review_comment", "");
      }
      query = query.range(offset, offset + limit - 1);

      const { data, error } = await query;
      if (error) {
        console.error("Failed to fetch pull requests:", error.message);
        process.exit(1);
      }

      const pulls = (data ?? []) as PullRequestRow[];
      if (options.json) {
        printJson({ pulls });
        return;
      }

      if (pulls.length === 0) {
        console.log("No pull requests found.");
        return;
      }

      printTable(
        [
          "id",
          "status",
          "title",
          "author_id",
          "reviewed_by",
          "review_comment",
          "created_at",
          "updated_at",
        ],
        pulls.map((p) => [
          p.id,
          p.status,
          p.title,
          p.author_id,
          p.reviewed_by ?? "",
          p.review_comment ?? "",
          p.created_at ?? "",
          p.updated_at ?? "",
        ])
      );
    });

  pr
    .command("show")
    .description("Show a pull request")
    .argument("<skillId>", "Skill id")
    .argument("<prId>", "Pull request id")
    .option("--json", "Output JSON")
    .action(async (skillId: string, prId: string, options: Record<string, boolean>) => {
      const { client } = await createSupabaseClient(false);
      const { data, error } = await client
        .from("skill_pull_requests")
        .select("*")
        .eq("id", Number(prId))
        .eq("skill_id", skillId)
        .single();

      if (error || !data) {
        console.error("Pull request not found.");
        process.exit(1);
      }

      if (options.json) {
        printJson(data);
        return;
      }

      const prRow = data as PullRequestRow;
      printKeyValue({
        id: prRow.id,
        skill_id: prRow.skill_id,
        status: prRow.status,
        title: prRow.title,
        message: prRow.message,
        author_id: prRow.author_id,
        reviewed_by: prRow.reviewed_by,
        reviewed_at: prRow.reviewed_at,
        review_comment: prRow.review_comment,
        created_at: prRow.created_at,
        updated_at: prRow.updated_at,
      });
      console.log("");
      console.log(prRow.content ?? "");
    });

  pr
    .command("create")
    .description("Create a pull request for a skill")
    .argument("<skillId>", "Skill id")
    .option("--title <title>", "PR title")
    .option("--message <message>", "PR message")
    .option("--name <name>", "Skill name")
    .option("--description <desc>", "Skill description")
    .option("--roles <roles>", "Comma-separated roles")
    .option("--scenes <scenes>", "Comma-separated scenes")
    .option("--tags <tags>", "Comma-separated tags")
    .option("--content <content>", "Skill markdown content")
    .option("--file <path>", "Markdown file with optional frontmatter")
    .option("--json", "Output JSON")
    .action(async (skillId: string, options: Record<string, string | boolean>) => {
      const { client } = await createSupabaseClient(true);
      const { data: userData, error: userError } = await client.auth.getUser();
      if (userError || !userData.user) {
        console.error("Not logged in.");
        process.exit(1);
      }

      const { data: skill, error: skillError } = await client
        .from("skills")
        .select("user_id")
        .eq("id", skillId)
        .single();

      if (skillError || !skill) {
        console.error("Skill not found.");
        process.exit(1);
      }

      if (skill.user_id === userData.user.id) {
        console.error("Skill creators should edit directly instead of creating pull requests.");
        process.exit(1);
      }

      const file = await loadFileContent(
        options.file ? String(options.file) : undefined
      );

      const title = String(options.title ?? file?.data?.title ?? "").trim();
      const message = options.message ? String(options.message) : null;
      const name = options.name ? String(options.name) : (file?.data?.name as string | undefined);
      const description = options.description
        ? String(options.description)
        : (file?.data?.description as string | undefined);
      const roles = parseList(
        (options.roles as string | undefined) ??
          (file?.data?.roles as string | undefined)
      );
      const scenes = parseList(
        (options.scenes as string | undefined) ??
          (file?.data?.scenes as string | undefined)
      );
      const tags = parseList(
        (options.tags as string | undefined) ??
          (file?.data?.tags as string | undefined)
      );
      const content =
        (options.content ? String(options.content) : file?.content) || "";

      if (!title || !content) {
        console.error("Missing required fields: title, content.");
        process.exit(1);
      }

      const { data, error } = await client
        .from("skill_pull_requests")
        .insert({
          skill_id: skillId,
          author_id: userData.user.id,
          status: "open",
          title,
          message,
          name: name ?? null,
          description: description ?? null,
          content,
          roles: roles.length ? roles : null,
          scenes: scenes.length ? scenes : null,
          tags: tags.length ? tags : null,
        })
        .select()
        .single();

      if (error || !data) {
        console.error("Failed to create pull request:", error?.message ?? "Unknown error");
        process.exit(1);
      }

      let pointsAwarded = 0;
      try {
        pointsAwarded = await awardPoints(
          client,
          userData.user.id,
          "pr_submit",
          String(data.id),
          "pull_request"
        );
      } catch {
        // ignore points errors
      }

      if (options.json) {
        printJson({ ...data, pointsAwarded });
        return;
      }
      console.log(`Created PR #${data.id} for skill ${skillId}`);
      console.log(`Title: ${data.title}`);
      console.log(`Status: ${data.status}`);
      if (data.message) console.log(`Message: ${data.message}`);
      console.log(`Author: ${data.author_id}`);
      console.log(`Created: ${data.created_at ?? ""}`);
      if (pointsAwarded) console.log(`Points awarded: ${pointsAwarded}`);
    });

  pr
    .command("merge")
    .description("Merge a pull request (skill owner only)")
    .argument("<skillId>", "Skill id")
    .argument("<prId>", "Pull request id")
    .option("--comment <comment>", "Review comment")
    .option("--json", "Output JSON")
    .action(async (skillId: string, prId: string, options: Record<string, string | boolean>) => {
      const { client } = await createSupabaseClient(true);
      const { data: userData, error: userError } = await client.auth.getUser();
      if (userError || !userData.user) {
        console.error("Not logged in.");
        process.exit(1);
      }

      const { data: skill, error: skillError } = await client
        .from("skills")
        .select("*")
        .eq("id", skillId)
        .single();

      if (skillError || !skill) {
        console.error("Skill not found.");
        process.exit(1);
      }

      if (skill.user_id !== userData.user.id) {
        console.error("Forbidden: only the skill creator can merge pull requests.");
        process.exit(1);
      }

      const { data: prData, error: prError } = await client
        .from("skill_pull_requests")
        .select("*")
        .eq("id", Number(prId))
        .eq("skill_id", skillId)
        .single();

      if (prError || !prData) {
        console.error("Pull request not found.");
        process.exit(1);
      }

      if (prData.status !== "open") {
        console.error(`Pull request is already ${prData.status}.`);
        process.exit(1);
      }

      const { error: snapshotError } = await client
        .from("skill_versions")
        .insert({
          skill_id: skillId,
          version: skill.version,
          name: skill.name,
          description: skill.description,
          content: skill.content,
          roles: skill.roles,
          scenes: skill.scenes,
          tags: skill.tags,
          user_id: userData.user.id,
          message: `Merged PR #${prId}`,
        });

      if (snapshotError) {
        console.error("Failed to save version history.");
        process.exit(1);
      }

      const newVersion = incrementVersion(skill.version);
      const { data: updatedSkill, error: updateError } = await client
        .from("skills")
        .update({
          name: prData.name ?? skill.name,
          description: prData.description ?? skill.description,
          content: prData.content,
          roles: prData.roles ?? skill.roles,
          scenes: prData.scenes ?? skill.scenes,
          tags: prData.tags ?? skill.tags,
          version: newVersion,
          updated_at: new Date().toISOString().split("T")[0],
        })
        .eq("id", skillId)
        .select()
        .single();

      if (updateError || !updatedSkill) {
        console.error("Failed to update skill:", updateError?.message ?? "");
        process.exit(1);
      }

      const comment = options.comment ? String(options.comment) : null;
      const { error: prUpdateError } = await client
        .from("skill_pull_requests")
        .update({
          status: "merged",
          reviewed_by: userData.user.id,
          reviewed_at: new Date().toISOString(),
          review_comment: comment,
          updated_at: new Date().toISOString(),
        })
        .eq("id", Number(prId));

      if (prUpdateError) {
        console.error("Failed to update pull request status.");
        process.exit(1);
      }

      let pointsAwarded = 0;
      try {
        pointsAwarded += await awardPoints(
          client,
          prData.author_id,
          "pr_merged_author",
          String(prId),
          "pull_request"
        );
        pointsAwarded += await awardPoints(
          client,
          userData.user.id,
          "pr_merged_reviewer",
          String(prId),
          "pull_request"
        );
      } catch {
        // ignore points errors
      }

      if (options.json) {
        printJson({
          message: `Pull request #${prId} merged successfully`,
          skill: updatedSkill,
          pointsAwarded,
        });
        return;
      }
      console.log(`Pull request #${prId} merged successfully.`);
      console.log(`Skill: ${updatedSkill.id} -> ${updatedSkill.version}`);
      console.log(`Reviewed by: ${userData.user.id}`);
      if (comment) console.log(`Review comment: ${comment}`);
      if (pointsAwarded) console.log(`Points awarded: ${pointsAwarded}`);
    });

  pr
    .command("reject")
    .description("Reject a pull request (skill owner only)")
    .argument("<skillId>", "Skill id")
    .argument("<prId>", "Pull request id")
    .option("--comment <comment>", "Review comment")
    .option("--json", "Output JSON")
    .action(async (skillId: string, prId: string, options: Record<string, string | boolean>) => {
      const { client } = await createSupabaseClient(true);
      const { data: userData, error: userError } = await client.auth.getUser();
      if (userError || !userData.user) {
        console.error("Not logged in.");
        process.exit(1);
      }

      const { data: skill, error: skillError } = await client
        .from("skills")
        .select("id, user_id")
        .eq("id", skillId)
        .single();

      if (skillError || !skill) {
        console.error("Skill not found.");
        process.exit(1);
      }

      if (skill.user_id !== userData.user.id) {
        console.error("Forbidden: only the skill creator can reject pull requests.");
        process.exit(1);
      }

      const { data: prData, error: prError } = await client
        .from("skill_pull_requests")
        .select("*")
        .eq("id", Number(prId))
        .eq("skill_id", skillId)
        .single();

      if (prError || !prData) {
        console.error("Pull request not found.");
        process.exit(1);
      }

      if (prData.status !== "open") {
        console.error(`Pull request is already ${prData.status}.`);
        process.exit(1);
      }

      const comment = options.comment ? String(options.comment) : null;
      const { error: prUpdateError } = await client
        .from("skill_pull_requests")
        .update({
          status: "rejected",
          reviewed_by: userData.user.id,
          reviewed_at: new Date().toISOString(),
          review_comment: comment,
          updated_at: new Date().toISOString(),
        })
        .eq("id", Number(prId));

      if (prUpdateError) {
        console.error("Failed to update pull request status.");
        process.exit(1);
      }

      if (options.json) {
        printJson({
          message: `Pull request #${prId} rejected`,
          reviewed_by: userData.user.id,
          review_comment: comment,
        });
        return;
      }
      console.log(`Pull request #${prId} rejected.`);
      console.log(`Reviewed by: ${userData.user.id}`);
      if (comment) console.log(`Review comment: ${comment}`);
    });

  pr
    .command("close")
    .description("Close a pull request with a comment (no status change)")
    .argument("<skillId>", "Skill id")
    .argument("<prId>", "Pull request id")
    .option("--comment <comment>", "Review comment")
    .option(
      "--comment-format <format>",
      "Comment format with {comment} {user} {time}"
    )
    .option("--comment-sep <sep>", "Separator between comments", "\n\n---\n")
    .option("--json", "Output JSON")
    .action(async (skillId: string, prId: string, options: Record<string, string | boolean>) => {
      const comment = options.comment ? String(options.comment) : null;
      if (!comment) {
        console.error("Comment is required. Use --comment <comment>.");
        process.exit(1);
      }

      const { client } = await createSupabaseClient(true);
      const { data: userData, error: userError } = await client.auth.getUser();
      if (userError || !userData.user) {
        console.error("Not logged in.");
        process.exit(1);
      }

      const { data: skill, error: skillError } = await client
        .from("skills")
        .select("id, user_id")
        .eq("id", skillId)
        .single();

      if (skillError || !skill) {
        console.error("Skill not found.");
        process.exit(1);
      }

      if (skill.user_id !== userData.user.id) {
        console.error("Forbidden: only the skill creator can close pull requests.");
        process.exit(1);
      }

      const { data: prData, error: prError } = await client
        .from("skill_pull_requests")
        .select("id, skill_id, status, review_comment")
        .eq("id", Number(prId))
        .eq("skill_id", skillId)
        .single();

      if (prError || !prData) {
        console.error("Pull request not found.");
        process.exit(1);
      }

      const existingComment = prData.review_comment;
      const now = new Date().toISOString();
      const format = options["commentFormat"]
        ? String(options["commentFormat"])
        : "{comment}";
      const sep = options["commentSep"] ? String(options["commentSep"]) : "\n\n---\n";
      const formatted = format
        .replaceAll("{comment}", comment)
        .replaceAll("{user}", userData.user.id)
        .replaceAll("{time}", now);
      const combinedComment = existingComment
        ? `${existingComment}${sep}${formatted}`
        : formatted;

      const { error: prUpdateError } = await client
        .from("skill_pull_requests")
        .update({
          reviewed_by: userData.user.id,
          reviewed_at: new Date().toISOString(),
          review_comment: combinedComment,
          updated_at: new Date().toISOString(),
        })
        .eq("id", Number(prId));

      if (prUpdateError) {
        console.error("Failed to update pull request comment.");
        process.exit(1);
      }

      if (options.json) {
        printJson({
          message: `Pull request #${prId} commented`,
          status: prData.status,
          reviewed_by: userData.user.id,
          review_comment: combinedComment,
        });
        return;
      }
      console.log(`Pull request #${prId} commented.`);
      console.log(`Status: ${prData.status}`);
      console.log(`Reviewed by: ${userData.user.id}`);
      console.log(`Review comment appended.`);
    });

  // --- Install / Uninstall / Installed ---

  const DEFAULT_COMMANDS_DIR = path.join(os.homedir(), ".claude", "commands");

  skills
    .command("install")
    .description("Install a skill as a Claude Code slash command")
    .argument("<id>", "Skill id")
    .option("--path <dir>", "Custom commands directory", DEFAULT_COMMANDS_DIR)
    .option("--json", "Output JSON")
    .action(async (id: string, options: Record<string, string | boolean>) => {
      // Validate id does not contain path separators
      if (id.includes("/") || id.includes("\\") || id.includes("..")) {
        console.error("Invalid skill id.");
        process.exit(1);
      }

      const targetDir = String(options.path || DEFAULT_COMMANDS_DIR);
      const { client } = await createSupabaseClient(false);

      const { data, error } = await client
        .from("skills")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("Skill not found.");
        process.exit(1);
      }

      const skill = data as SkillRow & { content: string };
      const md = buildSkillMarkdown({
        id: skill.id,
        name: skill.name,
        description: skill.description,
        author: skill.author,
        roles: normalizeStringArray(skill.roles),
        scenes: normalizeStringArray(skill.scenes),
        version: skill.version,
        tags: normalizeStringArray(skill.tags),
        source: skill.source,
        content: skill.content ?? "",
      });

      await fs.mkdir(targetDir, { recursive: true });
      const filePath = path.join(targetDir, `${skill.id}.md`);
      await fs.writeFile(filePath, md, "utf8");

      // Record download (fire-and-forget)
      try {
        const apiBase = process.env.NEXT_PUBLIC_SITE_URL || "https://skillhubs.cc";
        await fetch(`${apiBase}/api/skills/${id}/download`, { method: "POST" });
      } catch {
        // ignore
      }

      if (options.json) {
        printJson({ id: skill.id, installed: true, path: filePath });
        return;
      }
      console.log(`Installed: ${filePath}`);
      console.log(`Use /${skill.id} in Claude Code to invoke this skill.`);
    });

  skills
    .command("uninstall")
    .description("Remove an installed skill from Claude Code commands")
    .argument("<id>", "Skill id")
    .option("--path <dir>", "Custom commands directory", DEFAULT_COMMANDS_DIR)
    .option("--json", "Output JSON")
    .action(async (id: string, options: Record<string, string | boolean>) => {
      if (id.includes("/") || id.includes("\\") || id.includes("..")) {
        console.error("Invalid skill id.");
        process.exit(1);
      }

      const targetDir = String(options.path || DEFAULT_COMMANDS_DIR);
      const filePath = path.join(targetDir, `${id}.md`);

      try {
        await fs.access(filePath);
      } catch {
        console.error(`Skill not installed: ${id}`);
        process.exit(1);
      }

      await fs.unlink(filePath);

      if (options.json) {
        printJson({ id, uninstalled: true });
        return;
      }
      console.log(`Uninstalled: ${id}`);
    });

  skills
    .command("installed")
    .description("List installed skills in Claude Code commands directory")
    .option("--path <dir>", "Custom commands directory", DEFAULT_COMMANDS_DIR)
    .option("--json", "Output JSON")
    .action(async (options: Record<string, string | boolean>) => {
      const targetDir = String(options.path || DEFAULT_COMMANDS_DIR);

      let files: string[] = [];
      try {
        const entries = await fs.readdir(targetDir);
        files = entries.filter((f) => f.endsWith(".md"));
      } catch {
        // Directory doesn't exist
      }

      if (options.json) {
        printJson({
          count: files.length,
          skills: files.map((f) => ({
            id: f.replace(/\.md$/, ""),
            path: path.join(targetDir, f),
          })),
        });
        return;
      }

      if (files.length === 0) {
        console.log("No skills installed.");
        return;
      }

      const rows = files.map((f) => [
        f.replace(/\.md$/, ""),
        path.join(targetDir, f),
      ]);
      printTable(["id", "path"], rows);
      console.log(`Total: ${files.length}`);
    });

  skills
    .command("rollback")
    .description("Rollback a skill to a previous version (skill owner only)")
    .argument("<skillId>", "Skill id")
    .option("--version <versionId>", "Target version id")
    .option("--json", "Output JSON")
    .action(async (skillId: string, options: Record<string, string | boolean>) => {
      const versionId = options.version ? String(options.version) : "";
      if (!versionId) {
        console.error("versionId is required. Use --version <versionId>.");
        process.exit(1);
      }

      const { client } = await createSupabaseClient(true);
      const { data: userData, error: userError } = await client.auth.getUser();
      if (userError || !userData.user) {
        console.error("Not logged in.");
        process.exit(1);
      }

      const { data: skill, error: fetchError } = await client
        .from("skills")
        .select("*")
        .eq("id", skillId)
        .single();

      if (fetchError || !skill) {
        console.error("Skill not found.");
        process.exit(1);
      }

      if (skill.user_id !== userData.user.id) {
        console.error("Forbidden: you are not the author of this skill.");
        process.exit(1);
      }

      const { data: targetVersion, error: versionError } = await client
        .from("skill_versions")
        .select("*")
        .eq("id", Number(versionId))
        .eq("skill_id", skillId)
        .single();

      if (versionError || !targetVersion) {
        console.error("Target version not found.");
        process.exit(1);
      }

      const { error: snapshotError } = await client
        .from("skill_versions")
        .insert({
          skill_id: skillId,
          version: skill.version,
          name: skill.name,
          description: skill.description,
          content: skill.content,
          roles: skill.roles,
          scenes: skill.scenes,
          tags: skill.tags,
          user_id: userData.user.id,
          message: `Rolled back to version ${targetVersion.version}`,
        });

      if (snapshotError) {
        console.error("Failed to save version history.");
        process.exit(1);
      }

      const newVersion = incrementVersion(skill.version);
      const { data: updated, error: updateError } = await client
        .from("skills")
        .update({
          name: targetVersion.name,
          description: targetVersion.description,
          content: targetVersion.content,
          roles: targetVersion.roles,
          scenes: targetVersion.scenes,
          tags: targetVersion.tags,
          version: newVersion,
          updated_at: new Date().toISOString().split("T")[0],
        })
        .eq("id", skillId)
        .select()
        .single();

      if (updateError || !updated) {
        console.error("Failed to rollback skill:", updateError?.message ?? "");
        process.exit(1);
      }

      if (options.json) {
        printJson({
          message: `Rolled back to version ${targetVersion.version}`,
          skill: updated,
          target_version_id: targetVersion.id,
        });
        return;
      }
      console.log(`Rolled back to version ${targetVersion.version}`);
      console.log(`Skill: ${updated.id} -> ${updated.version}`);
      console.log(`Target version id: ${targetVersion.id}`);
    });
}
