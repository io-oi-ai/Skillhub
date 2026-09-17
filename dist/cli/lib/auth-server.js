"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startAuthCallbackServer = startAuthCallbackServer;
exports.getCallbackUrl = getCallbackUrl;
const node_http_1 = __importDefault(require("node:http"));
const AUTH_CALLBACK_PORT = 54321;
const SUCCESS_HTML = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>SkillHub CLI</title></head>
<body style="font-family:system-ui;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#0a0a0a;color:#fff">
<div style="text-align:center">
<h1 style="font-size:2rem">Login Successful</h1>
<p style="color:#888">You can close this window and return to the terminal.</p>
</div>
</body>
</html>`;
/**
 * Start a temporary local HTTP server to receive the OAuth callback.
 * Returns a promise that resolves with the authorization code.
 */
function startAuthCallbackServer() {
    return new Promise((resolve, reject) => {
        const server = node_http_1.default.createServer((req, res) => {
            var _a;
            const url = new URL((_a = req.url) !== null && _a !== void 0 ? _a : "/", `http://localhost:${AUTH_CALLBACK_PORT}`);
            const code = url.searchParams.get("code");
            if (code) {
                res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
                res.end(SUCCESS_HTML);
                server.close();
                resolve({ code });
            }
            else {
                const error = url.searchParams.get("error_description") || url.searchParams.get("error") || "No authorization code received";
                res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
                res.end(`<!DOCTYPE html><html><body><h1>Login Failed</h1><p>${error}</p></body></html>`);
                server.close();
                reject(new Error(error));
            }
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
        }, 120000);
    });
}
function getCallbackUrl() {
    return `http://localhost:${AUTH_CALLBACK_PORT}`;
}
