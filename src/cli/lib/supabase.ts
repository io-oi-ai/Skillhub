import { createClient } from "@supabase/supabase-js";
import { loadConfig, saveConfig, type StoredSession } from "./config";

export interface SupabaseClientResult {
  client: ReturnType<typeof createClient>;
  session: StoredSession | null;
}

function getSupabaseUrl(configUrl?: string) {
  return (
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    configUrl ||
    ""
  );
}

function getSupabaseAnonKey(configKey?: string) {
  return (
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    configKey ||
    ""
  );
}

function isTokenExpired(session: StoredSession): boolean {
  if (!session.expires_at) return false;
  // Refresh if less than 5 minutes remaining
  const bufferSeconds = 300;
  return Date.now() / 1000 >= session.expires_at - bufferSeconds;
}

export async function createSupabaseClient(
  requireAuth: boolean
): Promise<SupabaseClientResult> {
  const config = await loadConfig();
  const url = getSupabaseUrl(config.supabase?.url);
  const anonKey = getSupabaseAnonKey(config.supabase?.anonKey);

  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase configuration. Set SUPABASE_URL/SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  const client = createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      flowType: "pkce",
    },
  });

  let session = config.supabase?.session || null;
  if (session?.access_token && session?.refresh_token) {
    // If token is expired or near expiry, refresh it
    if (isTokenExpired(session)) {
      const { data, error } = await client.auth.refreshSession({
        refresh_token: session.refresh_token,
      });
      if (!error && data.session) {
        session = {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at ?? 0,
          expires_in: data.session.expires_in,
          token_type: data.session.token_type,
          user: data.session.user,
        };
        await saveConfig({
          supabase: { url, anonKey, session },
        });
      } else {
        // Refresh failed — clear session
        session = null;
        await saveConfig({
          supabase: { url, anonKey, session: null },
        });
      }
    } else {
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
            expires_at: data.session.expires_at ?? session.expires_at,
            expires_in: data.session.expires_in,
            token_type: data.session.token_type,
            user: data.session.user,
          };
          await saveConfig({
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
