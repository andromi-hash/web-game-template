export interface Theme {
  id: string;
  name: string;
  colors: {
    background: number;
    ground: number;
    player: number;
    obstacle: number;
    text: number;
    accent: number;
    particle: number;
  };
  playerShape: "square" | "circle" | "triangle";
  obstacleShape: "rectangle" | "spike" | "circle";
  parallaxLayers: number;
}

const defaultTheme: Theme = {
  id: "default",
  name: "Neon Runner",
  colors: {
    background: 0x1a1a2e,
    ground: 0x16213e,
    player: 0x00ff88,
    obstacle: 0xff4444,
    text: 0xffffff,
    accent: 0x00ff88,
    particle: 0x00ff88,
  },
  playerShape: "square",
  obstacleShape: "rectangle",
  parallaxLayers: 2,
};

const cyberpunkTheme: Theme = {
  id: "cyberpunk",
  name: "Cyberpunk",
  colors: {
    background: 0x0d0221,
    ground: 0x150534,
    player: 0xff00ff,
    obstacle: 0xff6600,
    text: 0xffffff,
    accent: 0xff00ff,
    particle: 0xff00ff,
  },
  playerShape: "triangle",
  obstacleShape: "spike",
  parallaxLayers: 3,
};

const oceanTheme: Theme = {
  id: "ocean",
  name: "Ocean Deep",
  colors: {
    background: 0x001a33,
    ground: 0x002244,
    player: 0x00ffff,
    obstacle: 0xff3366,
    text: 0xffffff,
    accent: 0x00ffff,
    particle: 0x00ffff,
  },
  playerShape: "circle",
  obstacleShape: "circle",
  parallaxLayers: 2,
};

export const themes: Record<string, Theme> = {
  default: defaultTheme,
  cyberpunk: cyberpunkTheme,
  ocean: oceanTheme,
};

export function getTheme(id: string): Theme {
  return themes[id] || defaultTheme;
}
