/* ─── PRESETS DATA ─── */

export interface Preset {
  id: string;
  name: string;
  description: string;
  config: {
    themeId: string;
    fontId: string;
    fontSize: number;
    lineHeight: number;
    bgType: "solid" | "gradient" | "none";
    bgColor: string;
    bgGradient: string;
    windowStyle: string;
    showLineNumbers: boolean;
    padding: number;
    innerPadding: number;
    borderRadius: number;
    shadow: string;
    showWatermark: boolean;
    width: number;
  };
}

export const defaultPresets: Preset[] = [
  {
    id: "minimal-ghost",
    name: "Minimal Ghost",
    description: "Clean white, no chrome, subtle shadow",
    config: {
      themeId: "github-light",
      fontId: "source-code-pro",
      fontSize: 14,
      lineHeight: 1.6,
      bgType: "solid",
      bgColor: "#ffffff",
      bgGradient: "",
      windowStyle: "none",
      showLineNumbers: false,
      padding: 48,
      innerPadding: 24,
      borderRadius: 12,
      shadow: "0 4px 24px rgba(0,0,0,0.08)",
      showWatermark: false,
      width: 680,
    },
  },
  {
    id: "dracula-night",
    name: "Dracula Night",
    description: "Dracula theme, macOS dark, neon glow",
    config: {
      themeId: "dracula",
      fontId: "fira-code",
      fontSize: 14,
      lineHeight: 1.7,
      bgType: "gradient",
      bgColor: "#282a36",
      bgGradient:
        "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      windowStyle: "macos-dark",
      showLineNumbers: true,
      padding: 56,
      innerPadding: 20,
      borderRadius: 12,
      shadow: "0 20px 60px rgba(139,92,246,0.3)",
      showWatermark: false,
      width: 720,
    },
  },
  {
    id: "sunset-hacker",
    name: "Sunset Hacker",
    description: "Terminal chrome, amber glow",
    config: {
      themeId: "ayu-dark",
      fontId: "jetbrains-mono",
      fontSize: 14,
      lineHeight: 1.6,
      bgType: "gradient",
      bgColor: "#0a0e14",
      bgGradient:
        "linear-gradient(135deg, #f97316 0%, #ec4899 50%, #8b5cf6 100%)",
      windowStyle: "terminal",
      showLineNumbers: true,
      padding: 48,
      innerPadding: 20,
      borderRadius: 8,
      shadow: "0 16px 48px rgba(249,115,22,0.3)",
      showWatermark: false,
      width: 700,
    },
  },
  {
    id: "rose-studio",
    name: "Rosé Studio",
    description: "Rosé Pine, browser tab, soft shadow",
    config: {
      themeId: "rose-pine",
      fontId: "victor-mono",
      fontSize: 14,
      lineHeight: 1.7,
      bgType: "gradient",
      bgColor: "#191724",
      bgGradient:
        "linear-gradient(135deg, #2d1f1f 0%, #614040 30%, #b76e79 60%, #f4c2c2 100%)",
      windowStyle: "macos-dark",
      showLineNumbers: true,
      padding: 48,
      innerPadding: 20,
      borderRadius: 12,
      shadow: "0 12px 40px rgba(0,0,0,0.4)",
      showWatermark: false,
      width: 700,
    },
  },
  {
    id: "retro-terminal",
    name: "Retro Terminal",
    description: "Amber terminal, CRT vibes",
    config: {
      themeId: "amber-terminal",
      fontId: "hack",
      fontSize: 14,
      lineHeight: 1.5,
      bgType: "solid",
      bgColor: "#0a0800",
      bgGradient: "",
      windowStyle: "terminal",
      showLineNumbers: false,
      padding: 40,
      innerPadding: 20,
      borderRadius: 0,
      shadow: "0 0 40px rgba(255,176,0,0.15)",
      showWatermark: false,
      width: 680,
    },
  },
  {
    id: "tokyo-neon",
    name: "Tokyo Neon",
    description: "Tokyo Night, neon violet glow",
    config: {
      themeId: "tokyo-night",
      fontId: "fira-code",
      fontSize: 14,
      lineHeight: 1.7,
      bgType: "gradient",
      bgColor: "#1a1b26",
      bgGradient:
        "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
      windowStyle: "macos-dark",
      showLineNumbers: true,
      padding: 56,
      innerPadding: 24,
      borderRadius: 16,
      shadow: "0 20px 60px rgba(139,92,246,0.35)",
      showWatermark: false,
      width: 720,
    },
  },
  {
    id: "clean-docs",
    name: "Clean Docs",
    description: "GitHub Light, minimal frame",
    config: {
      themeId: "github-light",
      fontId: "source-code-pro",
      fontSize: 14,
      lineHeight: 1.6,
      bgType: "solid",
      bgColor: "#f0f0f0",
      bgGradient: "",
      windowStyle: "minimal",
      showLineNumbers: true,
      padding: 40,
      innerPadding: 20,
      borderRadius: 8,
      shadow: "0 2px 12px rgba(0,0,0,0.1)",
      showWatermark: false,
      width: 680,
    },
  },
  {
    id: "hacker-news",
    name: "Hacker News",
    description: "Plain, minimal, monochrome",
    config: {
      themeId: "vesper",
      fontId: "ibm-plex-mono",
      fontSize: 13,
      lineHeight: 1.5,
      bgType: "solid",
      bgColor: "#1a1a1a",
      bgGradient: "",
      windowStyle: "none",
      showLineNumbers: false,
      padding: 32,
      innerPadding: 20,
      borderRadius: 4,
      shadow: "none",
      showWatermark: false,
      width: 640,
    },
  },
];
