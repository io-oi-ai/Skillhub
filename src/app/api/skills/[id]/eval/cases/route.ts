import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createSupabaseServer } from "@/lib/supabase-server";
import { requireAuth } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data, error } = await supabase
    .from("skill_eval_cases")
    .select("*")
    .eq("skill_id", id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch eval cases:", error);
    return NextResponse.json(
      { error: "Failed to fetch eval cases" },
      { status: 500 }
    );
  }

  return NextResponse.json({ cases: data ?? [] });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { user, error: authError } = await requireAuth();
    if (authError) return authError;

    const body = await request.json();
    const { title, input, expected, rules } = body;

    if (!title || !input || !expected) {
      return NextResponse.json(
        { error: "Missing required fields: title, input, expected" },
        { status: 400 }
      );
    }

    const authSupabase = await createSupabaseServer();

    const { data, error } = await authSupabase
      .from("skill_eval_cases")
      .insert({
        skill_id: id,
        title,
        input,
        expected,
        rules: rules || {},
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create eval case:", error);
      return NextResponse.json(
        { error: "Failed to create eval case" },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
