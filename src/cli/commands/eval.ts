import type { Command } from "commander";
import { createSupabaseClient } from "../lib/supabase";
import { printJson, printTable } from "../lib/output";
import { evaluateOutput, type EvalRules } from "../../lib/eval";

interface EvalCaseRow {
  id: number;
  skill_id: string;
  title: string;
  input: string;
  expected: string;
  rules: EvalRules;
  created_at?: string;
}

interface EvalRunRow {
  id: number;
  skill_id: string;
  case_id: number;
  status: string;
  reason: string | null;
  output: string | null;
  created_by: string | null;
  created_at: string;
}

export function registerEvalCommands(program: Command) {
  const evalCmd = program.command("eval").description("Skill eval system");

  const cases = evalCmd.command("cases").description("Manage eval cases");

  cases
    .command("list")
    .description("List eval cases")
    .argument("<skillId>", "Skill id")
    .option("--json", "Output JSON")
    .action(async (skillId: string, options: Record<string, boolean>) => {
      const { client } = await createSupabaseClient(false);
      const { data, error } = await client
        .from("skill_eval_cases")
        .select("*")
        .eq("skill_id", skillId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch eval cases:", error.message);
        process.exit(1);
      }

      const rows = (data ?? []) as EvalCaseRow[];
      if (options.json) {
        printJson({ cases: rows });
        return;
      }

      if (rows.length === 0) {
        console.log("No eval cases found.");
        return;
      }

      printTable(
        ["id", "title", "input", "expected", "created_at"],
        rows.map((c) => [
          c.id,
          c.title,
          c.input.slice(0, 60),
          c.expected.slice(0, 60),
          c.created_at ?? "",
        ])
      );
    });

  cases
    .command("add")
    .description("Add an eval case")
    .argument("<skillId>", "Skill id")
    .requiredOption("--title <title>", "Case title")
    .requiredOption("--input <input>", "Input text")
    .requiredOption("--expected <expected>", "Expected output")
    .option("--rules-json <json>", "Rules JSON")
    .option("--json", "Output JSON")
    .action(async (skillId: string, options: Record<string, string | boolean>) => {
      const { client } = await createSupabaseClient(true);
      const rules = options["rulesJson"]
        ? (JSON.parse(String(options["rulesJson"])) as EvalRules)
        : {};

      const { data, error } = await client
        .from("skill_eval_cases")
        .insert({
          skill_id: skillId,
          title: String(options.title),
          input: String(options.input),
          expected: String(options.expected),
          rules,
        })
        .select()
        .single();

      if (error || !data) {
        console.error("Failed to create eval case:", error?.message ?? "");
        process.exit(1);
      }

      if (options.json) {
        printJson(data);
        return;
      }
      console.log(`Created eval case #${data.id}`);
    });

  evalCmd
    .command("run")
    .description("Run eval cases for a skill")
    .argument("<skillId>", "Skill id")
    .option("--dry-run", "Do not write results")
    .option("--json", "Output JSON")
    .action(async (skillId: string, options: Record<string, boolean>) => {
      const { client } = await createSupabaseClient(true);

      const { data: cases, error: casesError } = await client
        .from("skill_eval_cases")
        .select("*")
        .eq("skill_id", skillId)
        .order("created_at", { ascending: false });

      if (casesError) {
        console.error("Failed to fetch eval cases:", casesError.message);
        process.exit(1);
      }

      const evalCases = (cases ?? []) as EvalCaseRow[];
      if (evalCases.length === 0) {
        console.log("No eval cases found.");
        return;
      }

      const results = evalCases.map((c) => {
        const result = evaluateOutput(null, c.rules ?? {});
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

      if (!options["dryRun"]) {
        const { data: userData, error: userError } = await client.auth.getUser();
        if (userError || !userData.user) {
          console.error("Not logged in.");
          process.exit(1);
        }

        const inserts = results.map((r) => ({
          skill_id: skillId,
          case_id: r.case_id,
          status: r.status,
          reason: r.reason,
          output: r.output,
          created_by: userData.user.id,
        }));

        const { error: insertError } = await client
          .from("skill_eval_runs")
          .insert(inserts);

        if (insertError) {
          console.error("Failed to insert eval runs:", insertError.message);
          process.exit(1);
        }
      }

      if (options.json) {
        printJson({ ...totals, results });
        return;
      }
      console.log(
        `Total: ${totals.total}  Passed: ${totals.passed}  Failed: ${totals.failed}  Unknown: ${totals.unknown}`
      );
    });

  evalCmd
    .command("runs")
    .description("List eval runs for a skill")
    .argument("<skillId>", "Skill id")
    .option("--limit <n>", "Limit results", "50")
    .option("--json", "Output JSON")
    .action(async (skillId: string, options: Record<string, string | boolean>) => {
      const limit = Number(options.limit ?? 50);
      const { client } = await createSupabaseClient(false);
      const { data, error } = await client
        .from("skill_eval_runs")
        .select("*")
        .eq("skill_id", skillId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Failed to fetch eval runs:", error.message);
        process.exit(1);
      }

      const rows = (data ?? []) as EvalRunRow[];
      if (options.json) {
        printJson({ runs: rows });
        return;
      }

      if (rows.length === 0) {
        console.log("No eval runs found.");
        return;
      }

      printTable(
        ["id", "case_id", "status", "reason", "created_at"],
        rows.map((r) => [
          r.id,
          r.case_id,
          r.status,
          r.reason ?? "",
          r.created_at,
        ])
      );
    });
}
