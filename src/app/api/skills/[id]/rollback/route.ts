import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { requireAuth } from "@/lib/auth";

function incrementVersion(version: string): string {
  const parts = version.split(".").map(Number);
  parts[2] = (parts[2] || 0) + 1;
  return parts.join(".");
}

export async function POST(
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
    const { versionId } = body;

    if (!versionId) {
      return NextResponse.json(
        { error: "versionId is required" },
        { status: 400 }
      );
    }

    // Fetch the target version
    const { data: targetVersion, error: versionError } = await authSupabase
      .from("skill_versions")
      .select("*")
      .eq("id", versionId)
      .eq("skill_id", id)
      .single();

    if (versionError || !targetVersion) {
      return NextResponse.json(
        { error: "Target version not found" },
        { status: 404 }
      );
    }

    // Snapshot current state before rollback
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
        message: `Rolled back to version ${targetVersion.version}`,
      });

    if (snapshotError) {
      console.error("Failed to snapshot version:", snapshotError);
      return NextResponse.json(
        { error: "Failed to save version history" },
        { status: 500 }
      );
    }

    // Increment version number
    const newVersion = incrementVersion(skill.version);

    // Update skills table with target version's data
    const { data: updated, error: updateError } = await authSupabase
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
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Failed to rollback skill:", updateError);
      return NextResponse.json(
        { error: "Failed to rollback skill" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: `Rolled back to version ${targetVersion.version}`,
      skill: updated,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
