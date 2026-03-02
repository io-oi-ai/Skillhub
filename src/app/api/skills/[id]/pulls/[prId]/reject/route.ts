import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { requireAuth } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; prId: string }> }
) {
  try {
    const { id, prId } = await params;

    const { user, error: authError } = await requireAuth();
    if (authError) return authError;

    const authSupabase = await createSupabaseServer();

    // Fetch the skill to verify ownership
    const { data: skill, error: skillError } = await authSupabase
      .from("skills")
      .select("user_id")
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
        { error: "Forbidden: only the skill creator can reject pull requests" },
        { status: 403 }
      );
    }

    // Fetch the PR to check status
    const { data: pr, error: prError } = await authSupabase
      .from("skill_pull_requests")
      .select("status")
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

    // Update PR status to rejected
    const { data: updatedPr, error: updateError } = await authSupabase
      .from("skill_pull_requests")
      .update({
        status: "rejected",
        reviewed_by: user!.id,
        reviewed_at: new Date().toISOString(),
        review_comment: comment || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", prId)
      .select()
      .single();

    if (updateError) {
      console.error("Failed to reject pull request:", updateError);
      return NextResponse.json(
        { error: "Failed to reject pull request" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: `Pull request #${prId} rejected`,
      pull_request: updatedPr,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
