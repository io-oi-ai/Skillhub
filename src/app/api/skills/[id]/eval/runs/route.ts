import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = request.nextUrl;
  const limit = Number(searchParams.get("limit") ?? "50");

  const { data, error } = await supabase
    .from("skill_eval_runs")
    .select("*")
    .eq("skill_id", id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to fetch eval runs:", error);
    return NextResponse.json(
      { error: "Failed to fetch eval runs" },
      { status: 500 }
    );
  }

  return NextResponse.json({ runs: data ?? [] });
}
