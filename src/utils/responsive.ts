import { GAME_CONFIG } from "@/config/game";

export interface GameDimensions {
  width: number;
  height: number;
  scale: number;
}

export function calculateDimensions(): GameDimensions {
  const maxWidth = window.innerWidth;
  const maxHeight = window.innerHeight;

  const scaleX = maxWidth / GAME_CONFIG.width;
  const scaleY = maxHeight / GAME_CONFIG.height;
  const scale = Math.min(scaleX, scaleY, 1);

  return {
    width: GAME_CONFIG.width,
    height: GAME_CONFIG.height,
    scale,
  };
}
