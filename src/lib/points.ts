import type { SupabaseClient } from "@supabase/supabase-js";

// --- Point action types ---

export type PointAction =
  | "skill_create"
  | "skill_create_first"
  | "skill_update"
  | "pr_submit"
  | "pr_merged_author"
  | "pr_merged_reviewer"
  | "skill_liked"
  | "skill_unliked";

// --- Points config ---

const POINTS_CONFIG: Record<
  PointAction,
  { points: number; dailyLimit?: number; limitKey?: "global" | "ref" }
> = {
  skill_create: { points: 20, dailyLimit: 5, limitKey: "global" },
  skill_create_first: { points: 10 },
  skill_update: { points: 5, dailyLimit: 2, limitKey: "ref" },
  pr_submit: { points: 3, dailyLimit: 10, limitKey: "global" },
  pr_merged_author: { points: 15 },
  pr_merged_reviewer: { points: 3 },
  skill_liked: { points: 2 },
  skill_unliked: { points: -2 },
};

// --- Daily limit check ---

async function checkDailyLimit(
  supabase: SupabaseClient,
  userId: string,
  action: PointAction,
  refId?: string
): Promise<boolean> {
  const config = POINTS_CONFIG[action];
  if (!config.dailyLimit) return true;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  let query = supabase
    .from("point_transactions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("action", action)
    .gte("created_at", todayStart.toISOString());

  // "ref" limit: per-ref per day (e.g., 2 updates per skill per day)
  if (config.limitKey === "ref" && refId) {
    query = query.eq("ref_id", refId);
  }

  const { count } = await query;
  return (count ?? 0) < config.dailyLimit;
}

// --- Main award function ---

export async function awardPoints(
  supabase: SupabaseClient,
  userId: string,
  action: PointAction,
  refId?: string,
  refType?: string
): Promise<number> {
  const config = POINTS_CONFIG[action];
  if (!config) return 0;

  // Check daily limit
  const withinLimit = await checkDailyLimit(supabase, userId, action, refId);
  if (!withinLimit) return 0;

  // Call the RPC function
  const { error } = await supabase.rpc("award_points_to_user", {
    target_user_id: userId,
    p_action: action,
    p_points: config.points,
    p_ref_id: refId ?? null,
    p_ref_type: refType ?? null,
  });

  if (error) {
    console.error(`Failed to award points [${action}]:`, error);
    return 0;
  }

  return config.points;
}

// --- Level system ---

export interface Level {
  level: number;
  name: { en: string; zh: string };
  minPoints: number;
}

const LEVELS: Level[] = [
  { level: 1, name: { en: "Newcomer", zh: "新手" }, minPoints: 0 },
  { level: 2, name: { en: "Contributor", zh: "贡献者" }, minPoints: 50 },
  { level: 3, name: { en: "Builder", zh: "建设者" }, minPoints: 200 },
  { level: 4, name: { en: "Expert", zh: "专家" }, minPoints: 500 },
  { level: 5, name: { en: "Master", zh: "大师" }, minPoints: 1000 },
];

export function getLevel(points: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i].minPoints) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getNextLevel(points: number): Level | null {
  const current = getLevel(points);
  const next = LEVELS.find((l) => l.level === current.level + 1);
  return next ?? null;
}
