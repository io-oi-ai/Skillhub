"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPointsCommands = registerPointsCommands;
const supabase_1 = require("../lib/supabase");
const output_1 = require("../lib/output");
const points_1 = require("../../lib/points");
function registerPointsCommands(program) {
    const points = program.command("points").description("Points system");
    points
        .command("me")
        .description("Show my points and level")
        .option("--json", "Output JSON")
        .action(async (options) => {
        const { client } = await (0, supabase_1.createSupabaseClient)(true);
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
        const profile = data;
        const level = (0, points_1.getLevel)(profile.points);
        const nextLevel = (0, points_1.getNextLevel)(profile.points);
        if (options.json) {
            (0, output_1.printJson)({
                id: profile.id,
                username: profile.username,
                display_name: profile.display_name,
                points: profile.points,
                level,
                next_level: nextLevel,
            });
            return;
        }
        console.log(`${profile.display_name || profile.username || profile.id} · ${profile.points} pts`);
        console.log(`Level: ${level.name.zh} (${level.name.en})`);
        if (nextLevel) {
            console.log(`Next: ${nextLevel.name.zh} (${nextLevel.name.en}) at ${nextLevel.minPoints} pts`);
        }
    });
    points
        .command("history")
        .description("Show my point transactions")
        .option("--limit <n>", "Limit results", "20")
        .option("--json", "Output JSON")
        .action(async (options) => {
        var _a;
        const limit = Number((_a = options.limit) !== null && _a !== void 0 ? _a : 20);
        const { client } = await (0, supabase_1.createSupabaseClient)(true);
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
        const rows = (data !== null && data !== void 0 ? data : []);
        if (options.json) {
            (0, output_1.printJson)(rows);
            return;
        }
        if (rows.length === 0) {
            console.log("No point transactions found.");
            return;
        }
        (0, output_1.printTable)(["id", "action", "points", "ref_id", "ref_type", "created_at"], rows.map((r) => {
            var _a, _b;
            return [
                r.id,
                r.action,
                r.points,
                (_a = r.ref_id) !== null && _a !== void 0 ? _a : "",
                (_b = r.ref_type) !== null && _b !== void 0 ? _b : "",
                r.created_at,
            ];
        }));
    });
}
