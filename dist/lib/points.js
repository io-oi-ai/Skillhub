"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LEVELS = void 0;
exports.awardPoints = awardPoints;
exports.getLevel = getLevel;
exports.getNextLevel = getNextLevel;
// --- Points config ---
const POINTS_CONFIG = {
    signup_bonus: { points: 10 },
    skill_create: { points: 10, dailyLimit: 5, limitKey: "global" },
    skill_create_first: { points: 20 },
    skill_update: { points: 5, dailyLimit: 2, limitKey: "ref" },
    skill_downloaded: { points: 5 }, // base points, actual = 5 + likes
    pr_submit: { points: 3, dailyLimit: 10, limitKey: "global" },
    pr_merged_author: { points: 3 },
    pr_merged_reviewer: { points: 3 },
    skill_liked: { points: 2 },
    skill_unliked: { points: -2 },
};
// --- Daily limit check ---
async function checkDailyLimit(supabase, userId, action, refId) {
    const config = POINTS_CONFIG[action];
    if (!config.dailyLimit)
        return true;
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
    return (count !== null && count !== void 0 ? count : 0) < config.dailyLimit;
}
// --- Main award function ---
async function awardPoints(supabase, userId, action, refId, refType, overridePoints) {
    const config = POINTS_CONFIG[action];
    if (!config)
        return 0;
    // Check daily limit
    const withinLimit = await checkDailyLimit(supabase, userId, action, refId);
    if (!withinLimit)
        return 0;
    const pts = overridePoints !== null && overridePoints !== void 0 ? overridePoints : config.points;
    // Call the RPC function
    const { error } = await supabase.rpc("award_points_to_user", {
        target_user_id: userId,
        p_action: action,
        p_points: pts,
        p_ref_id: refId !== null && refId !== void 0 ? refId : null,
        p_ref_type: refType !== null && refType !== void 0 ? refType : null,
    });
    if (error) {
        console.error(`Failed to award points [${action}]:`, error);
        return 0;
    }
    return pts;
}
exports.LEVELS = [
    { level: 1, name: { en: "Newcomer", zh: "新手" }, minPoints: 0 },
    { level: 2, name: { en: "Contributor", zh: "贡献者" }, minPoints: 50 },
    { level: 3, name: { en: "Builder", zh: "建设者" }, minPoints: 200 },
    { level: 4, name: { en: "Expert", zh: "专家" }, minPoints: 500 },
    { level: 5, name: { en: "Master", zh: "大师" }, minPoints: 1000 },
];
function getLevel(points) {
    for (let i = exports.LEVELS.length - 1; i >= 0; i--) {
        if (points >= exports.LEVELS[i].minPoints)
            return exports.LEVELS[i];
    }
    return exports.LEVELS[0];
}
function getNextLevel(points) {
    const current = getLevel(points);
    const next = exports.LEVELS.find((l) => l.level === current.level + 1);
    return next !== null && next !== void 0 ? next : null;
}
