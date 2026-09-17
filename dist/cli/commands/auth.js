"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAuthCommands = registerAuthCommands;
const supabase_1 = require("../lib/supabase");
const config_1 = require("../lib/config");
const auth_server_1 = require("../lib/auth-server");
const open_browser_1 = require("../lib/open-browser");
const DEFAULT_REDIRECT_URL = "https://skillhub-eta.vercel.app/auth/callback";
async function saveSession(session) {
    var _a, _b, _c, _d, _e;
    const config = await (0, config_1.loadConfig)();
    const url = process.env.SUPABASE_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_URL ||
        ((_a = config.supabase) === null || _a === void 0 ? void 0 : _a.url);
    const anonKey = process.env.SUPABASE_ANON_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        ((_b = config.supabase) === null || _b === void 0 ? void 0 : _b.anonKey);
    await (0, config_1.saveConfig)({
        supabase: {
            url,
            anonKey,
            session: {
                access_token: session.access_token,
                refresh_token: session.refresh_token,
                expires_at: (_c = session.expires_at) !== null && _c !== void 0 ? _c : 0,
                expires_in: (_d = session.expires_in) !== null && _d !== void 0 ? _d : 0,
                token_type: (_e = session.token_type) !== null && _e !== void 0 ? _e : "bearer",
                user: session.user,
            },
        },
    });
}
function registerAuthCommands(program) {
    const auth = program.command("auth").description("Authenticate with Supabase");
    auth
        .command("login")
        .description("Login via browser OAuth (default), magic link, or OTP")
        .option("--magic <email>", "Send magic link to email")
        .option("--otp <email>", "Send one-time code to email")
        .option("--provider <name>", "OAuth provider (google, github)", "google")
        .action(async (options) => {
        var _a, _b, _c, _d;
        const magic = options.magic ? String(options.magic) : null;
        const otp = options.otp ? String(options.otp) : null;
        const provider = options.provider ? String(options.provider) : "google";
        const { client } = await (0, supabase_1.createSupabaseClient)(false);
        // OTP flow
        if (otp) {
            const { error } = await client.auth.signInWithOtp({
                email: otp,
                options: { emailRedirectTo: DEFAULT_REDIRECT_URL },
            });
            if (error) {
                console.error("Failed to send OTP:", error.message);
                process.exit(1);
            }
            console.log("OTP sent to email. Then run:");
            console.log("  skillhub auth confirm --otp <email> --code <6-digit-code>");
            return;
        }
        // Magic link flow
        if (magic) {
            const { error } = await client.auth.signInWithOtp({
                email: magic,
                options: { emailRedirectTo: DEFAULT_REDIRECT_URL },
            });
            if (error) {
                console.error("Failed to send magic link:", error.message);
                process.exit(1);
            }
            console.log("Magic link sent. Open it and copy the final redirect URL.");
            console.log("Then run: skillhub auth confirm --url <redirect_url>");
            return;
        }
        // Default: Browser OAuth flow with local callback server
        console.log("Starting browser login...");
        try {
            // Start local callback server first
            const serverPromise = (0, auth_server_1.startAuthCallbackServer)();
            // Build OAuth URL with local callback
            const { data, error } = await client.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: (0, auth_server_1.getCallbackUrl)(),
                    skipBrowserRedirect: true,
                },
            });
            if (error || !data.url) {
                console.error("Failed to start OAuth:", (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "Unknown error");
                process.exit(1);
            }
            // Open browser
            try {
                await (0, open_browser_1.openBrowser)(data.url);
                console.log("Browser opened. Complete login there...");
            }
            catch {
                console.log("Could not open browser automatically.");
                console.log("Open this URL manually:");
                console.log(data.url);
            }
            // Wait for callback
            const result = await serverPromise;
            // Exchange code for session
            const { data: sessionData, error: exchangeError } = await client.auth.exchangeCodeForSession(result.code);
            if (exchangeError || !sessionData.session) {
                console.error("Failed to exchange code:", (_b = exchangeError === null || exchangeError === void 0 ? void 0 : exchangeError.message) !== null && _b !== void 0 ? _b : "Unknown error");
                process.exit(1);
            }
            await saveSession(sessionData.session);
            console.log(`Login successful! Welcome, ${(_d = (_c = sessionData.session.user) === null || _c === void 0 ? void 0 : _c.email) !== null && _d !== void 0 ? _d : "user"}.`);
        }
        catch (err) {
            console.error("Login failed:", err instanceof Error ? err.message : err);
            process.exit(1);
        }
    });
    auth
        .command("confirm")
        .description("Confirm login by pasting redirect URL or OTP code")
        .option("--url <url>", "Redirect URL after login")
        .option("--otp <email>", "Email for OTP confirmation")
        .option("--code <code>", "OTP code")
        .action(async (options) => {
        var _a, _b, _c, _d;
        const { client } = await (0, supabase_1.createSupabaseClient)(false);
        // OTP confirmation
        const otpEmail = options.otp ? String(options.otp) : "";
        const otpCode = options.code ? String(options.code) : "";
        if (otpEmail || otpCode) {
            if (!otpEmail || !otpCode) {
                console.error("Both --otp and --code are required for OTP confirmation.");
                process.exit(1);
            }
            const { data, error } = await client.auth.verifyOtp({
                email: otpEmail,
                token: otpCode,
                type: "email",
            });
            if (error || !data.session) {
                console.error("Failed to verify OTP:", (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "Unknown error");
                process.exit(1);
            }
            await saveSession(data.session);
            console.log("Login confirmed.");
            return;
        }
        // URL confirmation (for magic link or manual OAuth)
        const url = String((_b = options.url) !== null && _b !== void 0 ? _b : "");
        if (!url) {
            console.error("Missing --url");
            process.exit(1);
        }
        const parsed = new URL(url);
        const hashParams = new URLSearchParams(parsed.hash.replace(/^#/, ""));
        const searchParams = parsed.searchParams;
        const accessToken = hashParams.get("access_token") || searchParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token") || searchParams.get("refresh_token");
        const code = searchParams.get("code");
        if (accessToken && refreshToken) {
            const { data, error } = await client.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
            });
            if (error || !data.session) {
                console.error("Failed to set session:", (_c = error === null || error === void 0 ? void 0 : error.message) !== null && _c !== void 0 ? _c : "Unknown error");
                process.exit(1);
            }
            await saveSession(data.session);
        }
        else if (code) {
            const { data, error } = await client.auth.exchangeCodeForSession(code);
            if (error || !data.session) {
                console.error("Failed to exchange code:", (_d = error === null || error === void 0 ? void 0 : error.message) !== null && _d !== void 0 ? _d : "Unknown error");
                process.exit(1);
            }
            await saveSession(data.session);
        }
        else {
            console.error("No access_token/refresh_token or code found in URL.");
            process.exit(1);
        }
        console.log("Login confirmed.");
    });
    auth
        .command("logout")
        .description("Clear local session")
        .action(async () => {
        var _a, _b;
        const config = await (0, config_1.loadConfig)();
        await (0, config_1.saveConfig)({
            supabase: {
                url: (_a = config.supabase) === null || _a === void 0 ? void 0 : _a.url,
                anonKey: (_b = config.supabase) === null || _b === void 0 ? void 0 : _b.anonKey,
                session: null,
            },
        });
        console.log("Logged out.");
    });
    auth
        .command("whoami")
        .description("Show current authenticated user")
        .action(async () => {
        var _a;
        const { client } = await (0, supabase_1.createSupabaseClient)(true);
        const { data, error } = await client.auth.getUser();
        if (error || !data.user) {
            console.error("Not logged in.");
            process.exit(1);
        }
        console.log(`${(_a = data.user.email) !== null && _a !== void 0 ? _a : data.user.id}`);
    });
}
