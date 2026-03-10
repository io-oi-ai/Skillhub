import { exec } from "node:child_process";

/**
 * Open a URL in the user's default browser (cross-platform).
 */
export function openBrowser(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    let command: string;

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

    exec(command, (err) => {
      if (err) {
        reject(new Error(`Failed to open browser: ${err.message}`));
      } else {
        resolve();
      }
    });
  });
}
