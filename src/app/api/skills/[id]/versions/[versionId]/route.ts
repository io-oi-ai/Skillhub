import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; versionId: string }> }
) {
  const { id, versionId } = await params;

  const { data: version, error } = await supabase
    .from("skill_versions")
    .select(
      `
      id,
      skill_id,
      version,
      name,
      description,
      content,
      roles,
      scenes,
      tags,
      user_id,
      message,
      created_at,
      profiles:user_id (
        username,
        display_name,
        avatar_url
      )
    `
    )
    .eq("id", versionId)
    .eq("skill_id", id)
    .single();

  if (error || !version) {
    return NextResponse.json(
      { error: "Version not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(version);
}
