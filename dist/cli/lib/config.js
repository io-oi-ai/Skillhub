"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfigPath = getConfigPath;
exports.loadConfig = loadConfig;
exports.saveConfig = saveConfig;
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const node_os_1 = __importDefault(require("node:os"));
const CONFIG_DIR = node_path_1.default.join(node_os_1.default.homedir(), ".config", "skillhub");
const CONFIG_PATH = node_path_1.default.join(CONFIG_DIR, "config.json");
function getConfigPath() {
    return CONFIG_PATH;
}
async function loadConfig() {
    try {
        const raw = await promises_1.default.readFile(CONFIG_PATH, "utf8");
        return JSON.parse(raw);
    }
    catch {
        return {};
    }
}
async function saveConfig(config) {
    await promises_1.default.mkdir(CONFIG_DIR, { recursive: true });
    await promises_1.default.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), "utf8");
}
