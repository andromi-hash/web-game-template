import { GAME_CONFIG } from "@/config/game";
import { COLORS } from "@/config/game";

export class DifficultyManager {
  private currentSpeed: number;

  constructor() {
    this.currentSpeed = GAME_CONFIG.initialSpeed;
  }

  update(delta: number): void {
    const increment = GAME_CONFIG.speedIncrement * (delta / 1000);
    this.currentSpeed = Math.min(
      this.currentSpeed + increment,
      GAME_CONFIG.maxSpeed
    );
  }

  getSpeed(): number {
    return this.currentSpeed;
  }

  getProgress(): number {
    return (
      (this.currentSpeed - GAME_CONFIG.initialSpeed) /
      (GAME_CONFIG.maxSpeed - GAME_CONFIG.initialSpeed)
    );
  }

  getColor(): number {
    const progress = this.getProgress();
    if (progress < 0.33) return COLORS.accent;
    if (progress < 0.66) COLORS.obstacle;
    return 0xff8800;
  }

  getSpawnDelay(): number {
    const progress = this.getProgress();
    const range = GAME_CONFIG.obstacleSpawnMax - GAME_CONFIG.obstacleSpawnMin;
    return GAME_CONFIG.obstacleSpawnMax - range * progress;
  }

  reset(): void {
    this.currentSpeed = GAME_CONFIG.initialSpeed;
  }
}
