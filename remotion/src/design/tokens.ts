// Colors from globals.css
export const colors = {
  bgPrimary: "#f5f5f0",
  bgCard: "#ffffff",
  bgHover: "#f0f0eb",
  border: "#e5e5e0",
  accent: "#1a1a1a",
  accentHover: "#333333",
  textPrimary: "#1a1a1a",
  textSecondary: "#6b6b6b",
  textMuted: "#9a9a9a",
  white: "#ffffff",
  // Scene-specific
  statGreen: "#22c55e",
  statBg: "#f0fdf4",
  terminalBg: "#1e1e2e",
  terminalGreen: "#a6e3a1",
  terminalText: "#cdd6f4",
  terminalBorder: "#45475a",
};

export const fonts = {
  serif: "Noto Serif, Georgia, serif",
  serifCn: "Noto Serif SC, Noto Serif, Georgia, serif",
  mono: "JetBrains Mono, monospace",
  sans: "system-ui, -apple-system, sans-serif",
};

export const GIF_CONFIG = {
  width: 800,
  height: 450,
  fps: 15,
  durationInSeconds: 20,
  get durationInFrames() {
    return this.fps * this.durationInSeconds;
  },
  sceneDuration: 4, // seconds per scene
  get sceneFrames() {
    return this.fps * this.sceneDuration;
  },
};

export const MP4_CONFIG = {
  width: 1280,
  height: 720,
  fps: 30,
  durationInSeconds: 40,
  get durationInFrames() {
    return this.fps * this.durationInSeconds;
  },
  // 7 scenes: 5s + 6s + 5s + 6s + 5s + 7s + 6s = 40s
  sceneDurations: [5, 6, 5, 6, 5, 7, 6],
  getSceneFrames(index: number) {
    return this.fps * this.sceneDurations[index];
  },
};
