"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openBrowser = openBrowser;
const node_child_process_1 = require("node:child_process");
/**
 * Open a URL in the user's default browser (cross-platform).
 */
function openBrowser(url) {
    return new Promise((resolve, reject) => {
        let command;
        switch (process.platform) {
            case "darwin":
                command = `open "${url}"`;
                break;
            case "win32":
                command = `start "" "${url}"`;
                break;
            default:
                command = `xdg-open "${url}"`;
                break;
        }
        (0, node_child_process_1.exec)(command, (err) => {
            if (err) {
                reject(new Error(`Failed to open browser: ${err.message}`));
            }
            else {
                resolve();
            }
        });
    });
}
