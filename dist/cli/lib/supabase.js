"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSupabaseClient = createSupabaseClient;
const supabase_js_1 = require("@supabase/supabase-js");
const config_1 = require("./config");
function getSupabaseUrl(configUrl) {
    return (process.env.SUPABASE_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_URL ||
        configUrl ||
        "");
}
function getSupabaseAnonKey(configKey) {
    return (process.env.SUPABASE_ANON_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        configKey ||
        "");
}
function isTokenExpired(session) {
    if (!session.expires_at)
        return false;
    // Refresh if less than 5 minutes remaining
    const bufferSeconds = 300;
    return Date.now() / 1000 >= session.expires_at - bufferSeconds;
}
async function createSupabaseClient(requireAuth) {
    var _a, _b, _c, _d, _e;
    const config = await (0, config_1.loadConfig)();
    const url = getSupabaseUrl((_a = config.supabase) === null || _a === void 0 ? void 0 : _a.url);
    const anonKey = getSupabaseAnonKey((_b = config.supabase) === null || _b === void 0 ? void 0 : _b.anonKey);
    if (!url || !anonKey) {
        throw new Error("Missing Supabase configuration. Set SUPABASE_URL/SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_ANON_KEY.");
    }
    const client = (0, supabase_js_1.createClient)(url, anonKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
        },
    });
    let session = ((_c = config.supabase) === null || _c === void 0 ? void 0 : _c.session) || null;
    if ((session === null || session === void 0 ? void 0 : session.access_token) && (session === null || session === void 0 ? void 0 : session.refresh_token)) {
        // If token is expired or near expiry, refresh it
        if (isTokenExpired(session)) {
            const { data, error } = await client.auth.refreshSession({
                refresh_token: session.refresh_token,
            });
            if (!error && data.session) {
                session = {
                    access_token: data.session.access_token,
                    refresh_token: data.session.refresh_token,
                    expires_at: (_d = data.session.expires_at) !== null && _d !== void 0 ? _d : 0,
                    expires_in: data.session.expires_in,
                    token_type: data.session.token_type,
                    user: data.session.user,
                };
                await (0, config_1.saveConfig)({
                    supabase: { url, anonKey, session },
                });
            }
            else {
                // Refresh failed — clear session
                session = null;
                await (0, config_1.saveConfig)({
                    supabase: { url, anonKey, session: null },
                });
            }
        }
        else {
            // Token still valid, just set it
            const { data, error } = await client.auth.setSession({
                access_token: session.access_token,
                refresh_token: session.refresh_token,
            });
            if (!error && data.session) {
                // Update if tokens were rotated
                if (data.session.access_token !== session.access_token) {
                    session = {
                        access_token: data.session.access_token,
                        refresh_token: data.session.refresh_token,
                        expires_at: (_e = data.session.expires_at) !== null && _e !== void 0 ? _e : session.expires_at,
                        expires_in: data.session.expires_in,
                        token_type: data.session.token_type,
                        user: data.session.user,
                    };
                    await (0, config_1.saveConfig)({
                        supabase: { url, anonKey, session },
                    });
                }
            }
        }
    }
    if (requireAuth && !session) {
        throw new Error("Not logged in. Run `skillhub auth login` first.");
    }
    return { client, session };
}
