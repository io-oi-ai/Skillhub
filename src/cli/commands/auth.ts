import type { Command } from "commander";
import { createSupabaseClient } from "../lib/supabase";
import { loadConfig, saveConfig } from "../lib/config";
import { startAuthCallbackServer, getCallbackUrl } from "../lib/auth-server";
import { openBrowser } from "../lib/open-browser";

const DEFAULT_REDIRECT_URL = "https://skillhub-eta.vercel.app/auth/callback";

async function saveSession(
  session: { access_token: string; refresh_token: string; expires_at?: number | null; expires_in?: number | null; token_type?: string | null; user?: unknown }
) {
  const config = await loadConfig();
  const url =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    config.supabase?.url;
  const anonKey =
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    config.supabase?.anonKey;

  await saveConfig({
    supabase: {
      url,
      anonKey,
      session: {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at ?? 0,
        expires_in: session.expires_in ?? 0,
        token_type: session.token_type ?? "bearer",
        user: session.user,
      },
    },
  });
}

export function registerAuthCommands(program: Command) {
  const auth = program.command("auth").description("Authenticate with Supabase");

  auth
    .command("login")
    .description("Login via browser OAuth (default), magic link, or OTP")
    .option("--magic <email>", "Send magic link to email")
    .option("--otp <email>", "Send one-time code to email")
    .option("--provider <name>", "OAuth provider (google, github)", "google")
    .action(async (options: Record<string, string | boolean>) => {
      const magic = options.magic ? String(options.magic) : null;
      const otp = options.otp ? String(options.otp) : null;
      const provider = options.provider ? String(options.provider) : "google";

      const { client } = await createSupabaseClient(false);

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
        const serverPromise = startAuthCallbackServer();

        // Build OAuth URL with local callback
        const { data, error } = await client.auth.signInWithOAuth({
          provider: provider as "google" | "github",
          options: {
            redirectTo: getCallbackUrl(),
            skipBrowserRedirect: true,
          },
        });

        if (error || !data.url) {
          console.error("Failed to start OAuth:", error?.message ?? "Unknown error");
          process.exit(1);
        }

        // Open browser
        try {
          await openBrowser(data.url);
          console.log("Browser opened. Complete login there...");
        } catch {
          console.log("Could not open browser automatically.");
          console.log("Open this URL manually:");
          console.log(data.url);
        }

        // Wait for callback
        const result = await serverPromise;

        let session;

        if (result.code) {
          // PKCE flow: exchange code for session
          const { data: sessionData, error: exchangeError } =
            await client.auth.exchangeCodeForSession(result.code);
          if (exchangeError || !sessionData.session) {
            console.error(
              "Failed to exchange code:",
              exchangeError?.message ?? "Unknown error"
            );
            process.exit(1);
          }
          session = sessionData.session;
        } else if (result.access_token && result.refresh_token) {
          // Implicit flow: set session directly
          const { data: sessionData, error: setError } =
            await client.auth.setSession({
              access_token: result.access_token,
              refresh_token: result.refresh_token,
            });
          if (setError || !sessionData.session) {
            console.error(
              "Failed to set session:",
              setError?.message ?? "Unknown error"
            );
            process.exit(1);
          }
          session = sessionData.session;
        } else {
          console.error("No authentication data received.");
          process.exit(1);
        }

        await saveSession(session);
        console.log(`Login successful! Welcome, ${session.user?.email ?? "user"}.`);
      } catch (err) {
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
    .action(async (options: Record<string, string | boolean>) => {
      const { client } = await createSupabaseClient(false);

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
          console.error("Failed to verify OTP:", error?.message ?? "Unknown error");
          process.exit(1);
        }
        await saveSession(data.session);
        console.log("Login confirmed.");
        return;
      }

      // URL confirmation (for magic link or manual OAuth)
      const url = String(options.url ?? "");
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
          console.error("Failed to set session:", error?.message ?? "Unknown error");
          process.exit(1);
        }
        await saveSession(data.session);
      } else if (code) {
        const { data, error } = await client.auth.exchangeCodeForSession(code);
        if (error || !data.session) {
          console.error("Failed to exchange code:", error?.message ?? "Unknown error");
          process.exit(1);
        }
        await saveSession(data.session);
      } else {
        console.error("No access_token/refresh_token or code found in URL.");
        process.exit(1);
      }

      console.log("Login confirmed.");
    });

  auth
    .command("logout")
    .description("Clear local session")
    .action(async () => {
      const config = await loadConfig();
      await saveConfig({
        supabase: {
          url: config.supabase?.url,
          anonKey: config.supabase?.anonKey,
          session: null,
        },
      });
      console.log("Logged out.");
    });

  auth
    .command("whoami")
    .description("Show current authenticated user")
    .action(async () => {
      const { client } = await createSupabaseClient(true);
      const { data, error } = await client.auth.getUser();
      if (error || !data.user) {
        console.error("Not logged in.");
        process.exit(1);
      }
      console.log(`${data.user.email ?? data.user.id}`);
    });
}
