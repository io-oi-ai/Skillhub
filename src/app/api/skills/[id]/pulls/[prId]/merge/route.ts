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
  { params }: { params: Promise<{ id: string; prId: string }> }
) {
  try {
    const { id, prId } = await params;

    const { user, error: authError } = await requireAuth();
    if (authError) return authError;

    const authSupabase = await createSupabaseServer();

    // Fetch the skill
    const { data: skill, error: skillError } = await authSupabase
      .from("skills")
      .select("*")
      .eq("id", id)
      .single();

    if (skillError || !skill) {
      return NextResponse.json(
        { error: "Skill not found" },
        { status: 404 }
      );
    }

    // Verify the current user is the skill creator
    if (skill.user_id !== user!.id) {
      return NextResponse.json(
        { error: "Forbidden: only the skill creator can merge pull requests" },
        { status: 403 }
      );
    }

    // Fetch the PR
    const { data: pr, error: prError } = await authSupabase
      .from("skill_pull_requests")
      .select("*")
      .eq("id", prId)
      .eq("skill_id", id)
      .single();

    if (prError || !pr) {
      return NextResponse.json(
        { error: "Pull request not found" },
        { status: 404 }
      );
    }

    if (pr.status !== "open") {
      return NextResponse.json(
        { error: `Pull request is already ${pr.status}` },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { comment } = body;

    // Snapshot current skill to skill_versions
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
        message: `Merged PR #${prId}`,
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

    // Update skills table with PR content
    const { data: updatedSkill, error: updateError } = await authSupabase
      .from("skills")
      .update({
        name: pr.name ?? skill.name,
        description: pr.description ?? skill.description,
        content: pr.content,
        roles: pr.roles ?? skill.roles,
        scenes: pr.scenes ?? skill.scenes,
        tags: pr.tags ?? skill.tags,
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

    // Update PR status
    const { error: prUpdateError } = await authSupabase
      .from("skill_pull_requests")
      .update({
        status: "merged",
        reviewed_by: user!.id,
        reviewed_at: new Date().toISOString(),
        review_comment: comment || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", prId);

    if (prUpdateError) {
      console.error("Failed to update PR status:", prUpdateError);
      return NextResponse.json(
        { error: "Failed to update pull request status" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: `Pull request #${prId} merged successfully`,
      skill: updatedSkill,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
