import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";

export interface StoredSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  expires_in?: number;
  token_type?: string;
  user?: unknown;
}

export interface ConfigFile {
  supabase?: {
    url?: string;
    anonKey?: string;
    session?: StoredSession | null;
  };
}

const CONFIG_DIR = path.join(os.homedir(), ".config", "skillhub");
const CONFIG_PATH = path.join(CONFIG_DIR, "config.json");

export function getConfigPath() {
  return CONFIG_PATH;
}

export async function loadConfig(): Promise<ConfigFile> {
  try {
    const raw = await fs.readFile(CONFIG_PATH, "utf8");
    return JSON.parse(raw) as ConfigFile;
  } catch {
    return {};
  }
}

export async function saveConfig(config: ConfigFile) {
  await fs.mkdir(CONFIG_DIR, { recursive: true });
  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), "utf8");
}
