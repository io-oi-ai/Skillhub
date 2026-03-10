import http from "node:http";

const AUTH_CALLBACK_PORT = 54321;

const SUCCESS_HTML = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>SkillHubs CLI</title></head>
<body style="font-family:system-ui;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#0a0a0a;color:#fff">
<div style="text-align:center">
<h1 style="font-size:2rem">Login Successful</h1>
<p style="color:#888">You can close this window and return to the terminal.</p>
</div>
</body>
</html>`;

// When Supabase uses implicit flow, tokens arrive in the URL fragment (#access_token=...).
// The server can't read fragments, so this page extracts them via JS and re-sends as query params.
const FRAGMENT_RELAY_HTML = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>SkillHubs CLI</title></head>
<body style="font-family:system-ui;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#0a0a0a;color:#fff">
<div style="text-align:center">
<h1 style="font-size:2rem">Completing login...</h1>
<p style="color:#888">Please wait.</p>
</div>
<script>
(function() {
  var hash = window.location.hash.substring(1);
  if (hash) {
    window.location.replace(window.location.pathname + '?from_fragment=1&' + hash);
  } else {
    document.querySelector('h1').textContent = 'Login Failed';
    document.querySelector('p').textContent = 'No authentication data received. Please try again.';
  }
})();
</script>
</body>
</html>`;

export interface AuthCallbackResult {
  code?: string;
  access_token?: string;
  refresh_token?: string;
}

/**
 * Start a temporary local HTTP server to receive the OAuth callback.
 * Supports both PKCE flow (?code=) and implicit flow (#access_token= via JS relay).
 */
export function startAuthCallbackServer(): Promise<AuthCallbackResult> {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url ?? "/", `http://localhost:${AUTH_CALLBACK_PORT}`);
      const code = url.searchParams.get("code");
      const accessToken = url.searchParams.get("access_token");
      const refreshToken = url.searchParams.get("refresh_token");
      const fromFragment = url.searchParams.get("from_fragment");

      // PKCE flow: got ?code=
      if (code) {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(SUCCESS_HTML);
        server.close();
        resolve({ code });
        return;
      }

      // Implicit flow relay: got tokens from fragment via JS redirect
      if (accessToken && refreshToken) {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(SUCCESS_HTML);
        server.close();
        resolve({ access_token: accessToken, refresh_token: refreshToken });
        return;
      }

      // Check for errors
      const errorMsg = url.searchParams.get("error_description") || url.searchParams.get("error");
      if (errorMsg) {
        res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
        res.end(`<!DOCTYPE html><html><body style="font-family:system-ui;background:#0a0a0a;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0"><div style="text-align:center"><h1>Login Failed</h1><p>${errorMsg}</p></div></body></html>`);
        server.close();
        reject(new Error(errorMsg));
        return;
      }

      // No code and not a fragment relay — serve the fragment relay page
      // This handles the initial redirect where tokens are in the fragment
      if (!fromFragment) {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(FRAGMENT_RELAY_HTML);
        return;
      }

      // Fragment relay returned but with no useful data
      res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
      res.end(`<!DOCTYPE html><html><body style="font-family:system-ui;background:#0a0a0a;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0"><div style="text-align:center"><h1>Login Failed</h1><p>No authentication data received.</p></div></body></html>`);
      server.close();
      reject(new Error("No authentication data received"));
    });

    server.on("error", (err) => {
      reject(new Error(`Failed to start auth callback server: ${err.message}`));
    });

    server.listen(AUTH_CALLBACK_PORT, "127.0.0.1", () => {
      // Server is ready
    });

    // Timeout after 2 minutes
    setTimeout(() => {
      server.close();
      reject(new Error("Login timed out. Please try again."));
    }, 120_000);
  });
}

export function getCallbackUrl() {
  return `http://localhost:${AUTH_CALLBACK_PORT}`;
}
