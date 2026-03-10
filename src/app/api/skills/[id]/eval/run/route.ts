import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createSupabaseServer } from "@/lib/supabase-server";
import { requireAuth } from "@/lib/auth";
import { evaluateOutput, type EvalRules } from "@/lib/eval";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user, error: authError } = await requireAuth();
    if (authError) return authError;

    const body = await request.json().catch(() => ({}));
    const dryRun = Boolean(body?.dryRun);

    const { data: cases, error: casesError } = await supabase
      .from("skill_eval_cases")
      .select("*")
      .eq("skill_id", id)
      .order("created_at", { ascending: false });

    if (casesError) {
      console.error("Failed to fetch eval cases:", casesError);
      return NextResponse.json(
        { error: "Failed to fetch eval cases" },
        { status: 500 }
      );
    }

    const evalCases = cases ?? [];
    if (evalCases.length === 0) {
      return NextResponse.json({ total: 0, passed: 0, failed: 0, unknown: 0 });
    }

    const results = evalCases.map((c: any) => {
      const rules = (c.rules ?? {}) as EvalRules;
      const result = evaluateOutput(null, rules);
      return {
        case_id: c.id,
        status: result.status,
        reason: result.reason ?? null,
        output: null,
      };
    });

    const totals = results.reduce(
      (acc, r) => {
        acc.total += 1;
        if (r.status === "pass") acc.passed += 1;
        if (r.status === "fail") acc.failed += 1;
        if (r.status === "unknown") acc.unknown += 1;
        return acc;
      },
      { total: 0, passed: 0, failed: 0, unknown: 0 }
    );

    if (dryRun) {
      return NextResponse.json({ ...totals, results });
    }

    const authSupabase = await createSupabaseServer();

    const inserts = results.map((r) => ({
      skill_id: id,
      case_id: r.case_id,
      status: r.status,
      reason: r.reason,
      output: r.output,
      created_by: user!.id,
    }));

    const { error: insertError } = await authSupabase
      .from("skill_eval_runs")
      .insert(inserts);

    if (insertError) {
      console.error("Failed to insert eval runs:", insertError);
      return NextResponse.json(
        { error: "Failed to insert eval runs" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ...totals, results });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
