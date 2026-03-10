import type { Command } from "commander";
import { createSupabaseClient } from "../lib/supabase";
import { printJson, printTable } from "../lib/output";
import { getLevel, getNextLevel } from "../../lib/points";

interface ProfileRow {
  id: string;
  username: string | null;
  display_name: string | null;
  points: number;
}

interface PointTxRow {
  id: number;
  action: string;
  points: number;
  ref_id: string | null;
  ref_type: string | null;
  created_at: string;
}

export function registerPointsCommands(program: Command) {
  const points = program.command("points").description("Points system");

  points
    .command("me")
    .description("Show my points and level")
    .option("--json", "Output JSON")
    .action(async (options: Record<string, boolean>) => {
      const { client } = await createSupabaseClient(true);
      const { data: userData, error: userError } = await client.auth.getUser();
      if (userError || !userData.user) {
        console.error("Not logged in.");
        process.exit(1);
      }

      const { data, error } = await client
        .from("profiles")
        .select("id, username, display_name, points")
        .eq("id", userData.user.id)
        .single();

      if (error || !data) {
        console.error("Failed to load profile.");
        process.exit(1);
      }

      const profile = data as ProfileRow;
      const level = getLevel(profile.points);
      const nextLevel = getNextLevel(profile.points);

      if (options.json) {
        printJson({
          id: profile.id,
          username: profile.username,
          display_name: profile.display_name,
          points: profile.points,
          level,
          next_level: nextLevel,
        });
        return;
      }

      console.log(
        `${profile.display_name || profile.username || profile.id} · ${profile.points} pts`
      );
      console.log(`Level: ${level.name.zh} (${level.name.en})`);
      if (nextLevel) {
        console.log(
          `Next: ${nextLevel.name.zh} (${nextLevel.name.en}) at ${nextLevel.minPoints} pts`
        );
      }
    });

  points
    .command("history")
    .description("Show my point transactions")
    .option("--limit <n>", "Limit results", "20")
    .option("--json", "Output JSON")
    .action(async (options: Record<string, string | boolean>) => {
      const limit = Number(options.limit ?? 20);
      const { client } = await createSupabaseClient(true);
      const { data: userData, error: userError } = await client.auth.getUser();
      if (userError || !userData.user) {
        console.error("Not logged in.");
        process.exit(1);
      }

      const { data, error } = await client
        .from("point_transactions")
        .select("id, action, points, ref_id, ref_type, created_at")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Failed to fetch point history:", error.message);
        process.exit(1);
      }

      const rows = (data ?? []) as PointTxRow[];
      if (options.json) {
        printJson(rows);
        return;
      }

      if (rows.length === 0) {
        console.log("No point transactions found.");
        return;
      }

      printTable(
        ["id", "action", "points", "ref_id", "ref_type", "created_at"],
        rows.map((r) => [
          r.id,
          r.action,
          r.points,
          r.ref_id ?? "",
          r.ref_type ?? "",
          r.created_at,
        ])
      );
    });
}
