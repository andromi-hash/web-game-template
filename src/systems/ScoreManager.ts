import { GAME_CONFIG } from "@/config/game";

export class ScoreManager {
  private score: number = 0;
  private highScore: number = 0;
  private elapsed: number = 0;

  constructor() {
    this.highScore = parseInt(localStorage.getItem("highScore") || "0", 10);
  }

  update(delta: number): void {
    this.elapsed += delta;
    this.score = Math.floor(this.elapsed / 1000) * GAME_CONFIG.scorePerSecond;
  }

  getScore(): number {
    return this.score;
  }

  getHighScore(): number {
    return this.highScore;
  }

  reset(): void {
    this.score = 0;
    this.elapsed = 0;
  }

  saveHighScore(): boolean {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem("highScore", this.highScore.toString());
      return true;
    }
    return false;
  }
}
