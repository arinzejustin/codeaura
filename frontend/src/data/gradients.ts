/* ─── GRADIENT PRESETS ─── */

export interface GradientPreset {
  id: string;
  name: string;
  category:
    | "neon"
    | "nature"
    | "retro"
    | "moody"
    | "pastel"
    | "lux"
    | "dark"
    | "special";
  css: string;
}

export const gradientPresets: GradientPreset[] = [
  // NEON
  {
    id: "neon-purple",
    name: "Neon Purple",
    category: "neon",
    css: "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
  },
  {
    id: "electric-cyan",
    name: "Electric Cyan",
    category: "neon",
    css: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)",
  },
  {
    id: "laser-pink",
    name: "Laser Pink",
    category: "neon",
    css: "linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #f97316 100%)",
  },
  {
    id: "acid-green",
    name: "Acid Green",
    category: "neon",
    css: "linear-gradient(135deg, #22c55e 0%, #84cc16 50%, #eab308 100%)",
  },

  // NATURE
  {
    id: "aurora",
    name: "Aurora Borealis",
    category: "nature",
    css: "linear-gradient(135deg, #064e3b 0%, #059669 30%, #06b6d4 60%, #8b5cf6 100%)",
  },
  {
    id: "sunset-coast",
    name: "Sunset Coast",
    category: "nature",
    css: "linear-gradient(135deg, #f97316 0%, #ec4899 50%, #8b5cf6 100%)",
  },
  {
    id: "deep-ocean",
    name: "Deep Ocean",
    category: "nature",
    css: "linear-gradient(135deg, #0c1445 0%, #0e4166 50%, #1e3a5f 100%)",
  },
  {
    id: "forest-mist",
    name: "Forest Mist",
    category: "nature",
    css: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)",
  },

  // RETRO
  {
    id: "lofi-vibes",
    name: "Lo-Fi Vibes",
    category: "retro",
    css: "linear-gradient(135deg, #fbbf24 0%, #f97316 30%, #dc2626 60%, #9333ea 100%)",
  },
  {
    id: "vaporwave-grid",
    name: "Vaporwave Grid",
    category: "retro",
    css: "linear-gradient(135deg, #ff6ad5 0%, #c774e8 30%, #ad8cff 60%, #8795e8 100%)",
  },
  {
    id: "synthwave-sky",
    name: "Synthwave Sky",
    category: "retro",
    css: "linear-gradient(180deg, #1a0533 0%, #2d1b69 30%, #e91e63 70%, #ff6d00 100%)",
  },
  {
    id: "80s-chrome",
    name: "80s Chrome",
    category: "retro",
    css: "linear-gradient(135deg, #f5af19 0%, #f12711 50%, #c471ed 100%)",
  },

  // MOODY
  {
    id: "noir-smoke",
    name: "Noir Smoke",
    category: "moody",
    css: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)",
  },
  {
    id: "midnight-storm",
    name: "Midnight Storm",
    category: "moody",
    css: "linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 50%, #2a1a4e 100%)",
  },
  {
    id: "blood-moon",
    name: "Blood Moon",
    category: "moody",
    css: "linear-gradient(135deg, #1a0000 0%, #3d0000 50%, #6d0000 100%)",
  },

  // PASTEL
  {
    id: "cotton-candy",
    name: "Cotton Candy",
    category: "pastel",
    css: "linear-gradient(135deg, #fce4ec 0%, #f3e5f5 50%, #e8eaf6 100%)",
  },
  {
    id: "lavender-dream",
    name: "Lavender Dream",
    category: "pastel",
    css: "linear-gradient(135deg, #e8eaf6 0%, #ede7f6 50%, #fce4ec 100%)",
  },
  {
    id: "mint-fresh",
    name: "Mint Fresh",
    category: "pastel",
    css: "linear-gradient(135deg, #e0f2f1 0%, #e8f5e9 50%, #f1f8e9 100%)",
  },

  // LUX
  {
    id: "liquid-gold",
    name: "Liquid Gold",
    category: "lux",
    css: "linear-gradient(135deg, #1a1200 0%, #3d2e00 30%, #b8860b 60%, #ffd700 100%)",
  },
  {
    id: "rose-gold",
    name: "Rose Gold",
    category: "lux",
    css: "linear-gradient(135deg, #2d1f1f 0%, #614040 30%, #b76e79 60%, #f4c2c2 100%)",
  },
  {
    id: "champagne",
    name: "Champagne",
    category: "lux",
    css: "linear-gradient(135deg, #2d2a1f 0%, #6b5e40 30%, #c9b97f 60%, #f7e7ce 100%)",
  },

  // DARK
  {
    id: "abyss",
    name: "Abyss",
    category: "dark",
    css: "linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #141414 100%)",
  },
  {
    id: "void",
    name: "Void",
    category: "dark",
    css: "linear-gradient(135deg, #000000 0%, #050510 50%, #0d0d1a 100%)",
  },
  {
    id: "obsidian",
    name: "Obsidian",
    category: "dark",
    css: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%)",
  },
  {
    id: "carbon-black",
    name: "Carbon Black",
    category: "dark",
    css: "linear-gradient(135deg, #090909 0%, #111111 50%, #1a1a1a 100%)",
  },

  // SPECIAL
  {
    id: "rainbow",
    name: "Rainbow",
    category: "special",
    css: "linear-gradient(135deg, #ff0000, #ff7700, #ffff00, #00ff00, #0000ff, #8b00ff)",
  },
  {
    id: "holographic",
    name: "Holographic",
    category: "special",
    css: "linear-gradient(135deg, #a2d9ff 0%, #c2b0ff 20%, #ffb0d0 40%, #ffe0a0 60%, #a2ffb0 80%, #a2d9ff 100%)",
  },
  {
    id: "oil-slick",
    name: "Oil Slick",
    category: "special",
    css: "linear-gradient(135deg, #0f0c29 0%, #302b63 30%, #24243e 50%, #544a7d 70%, #7b6daa 100%)",
  },
  {
    id: "iridescent",
    name: "Iridescent",
    category: "special",
    css: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 20%, #a1c4fd 40%, #c2e9fb 60%, #d4fc79 80%, #96e6a1 100%)",
  },
];
