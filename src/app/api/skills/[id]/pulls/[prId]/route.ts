import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; prId: string }> }
) {
  const { id, prId } = await params;

  const { data: pr, error } = await supabase
    .from("skill_pull_requests")
    .select(
      `
      id,
      skill_id,
      author_id,
      status,
      title,
      message,
      name,
      description,
      content,
      roles,
      scenes,
      tags,
      reviewed_by,
      reviewed_at,
      review_comment,
      created_at,
      updated_at,
      profiles:author_id (
        username,
        display_name,
        avatar_url
      )
    `
    )
    .eq("id", prId)
    .eq("skill_id", id)
    .single();

  if (error || !pr) {
    return NextResponse.json(
      { error: "Pull request not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(pr);
}
