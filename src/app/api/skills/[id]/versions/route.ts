import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: versions, error } = await supabase
    .from("skill_versions")
    .select(
      `
      id,
      skill_id,
      version,
      name,
      description,
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
    .eq("skill_id", id)
    .order("created_at", { ascending: false });

  if (error) {
    // Gracefully handle missing table (schema not yet applied)
    if (error.code === "PGRST204" || error.message?.includes("not find")) {
      return NextResponse.json({ versions: [] });
    }
    console.error("Failed to fetch versions:", error);
    return NextResponse.json(
      { error: "Failed to fetch versions" },
      { status: 500 }
    );
  }

  return NextResponse.json({ versions: versions || [] });
}
