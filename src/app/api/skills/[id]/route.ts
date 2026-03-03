import { NextRequest, NextResponse } from "next/server";
import { getSkillById } from "@/lib/skills";
import { createSupabaseServer } from "@/lib/supabase-server";
import { requireAuth } from "@/lib/auth";
import { awardPoints } from "@/lib/points";

function incrementVersion(version: string): string {
  const parts = version.split(".").map(Number);
  parts[2] = (parts[2] || 0) + 1;
  return parts.join(".");
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const skill = await getSkillById(id);

  if (!skill) {
    return NextResponse.json({ error: "Skill not found" }, { status: 404 });
  }

  return NextResponse.json(skill);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { user, error: authError } = await requireAuth();
    if (authError) return authError;

    const authSupabase = await createSupabaseServer();

    // Fetch the current skill
    const { data: skill, error: fetchError } = await authSupabase
      .from("skills")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !skill) {
      return NextResponse.json(
        { error: "Skill not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (skill.user_id !== user!.id) {
      return NextResponse.json(
        { error: "Forbidden: you are not the author of this skill" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description, content, roles, scenes, tags, message } = body;

    // Snapshot current version to skill_versions
    const { error: snapshotError } = await authSupabase
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
        user_id: user!.id,
        message: message || `Updated to version ${incrementVersion(skill.version)}`,
      });

    if (snapshotError) {
      console.error("Failed to snapshot version:", snapshotError);
      return NextResponse.json(
        { error: "Failed to save version history" },
        { status: 500 }
      );
    }

    // Increment version
    const newVersion = incrementVersion(skill.version);

    // Update the skill
    const { data: updated, error: updateError } = await authSupabase
      .from("skills")
      .update({
        name: name ?? skill.name,
        description: description ?? skill.description,
        content: content ?? skill.content,
        roles: roles ?? skill.roles,
        scenes: scenes ?? skill.scenes,
        tags: tags ?? skill.tags,
        version: newVersion,
        updated_at: new Date().toISOString().split("T")[0],
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Failed to update skill:", updateError);
      return NextResponse.json(
        { error: "Failed to update skill" },
        { status: 500 }
      );
    }

    // Award points (non-blocking)
    let pointsAwarded = 0;
    try {
      pointsAwarded = await awardPoints(authSupabase, user!.id, "skill_update", id, "skill");
    } catch (e) {
      console.error("Points award error:", e);
    }

    return NextResponse.json({ ...updated, pointsAwarded });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
