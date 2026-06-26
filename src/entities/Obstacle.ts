import Phaser from "phaser";
import { GAME_CONFIG } from "@/config/game";
import type { Theme } from "@/config/themes";

export class Obstacle {
  public sprite: Phaser.GameObjects.Graphics;
  private scene: Phaser.Scene;
  public active: boolean = true;
  private speed: number;
  private theme: Theme;
  private height: number;

  constructor(scene: Phaser.Scene, speed: number, theme: Theme) {
    this.scene = scene;
    this.speed = speed;
    this.theme = theme;

    this.height = Phaser.Math.Between(
      GAME_CONFIG.obstacleMinHeight,
      GAME_CONFIG.obstacleMaxHeight
    );

    this.sprite = scene.add.graphics();
    this.drawObstacle();
    this.sprite.x = GAME_CONFIG.width + 50;
    this.sprite.y = GAME_CONFIG.groundY - this.height;
  }

  private drawObstacle(): void {
    this.sprite.clear();
    const w = GAME_CONFIG.obstacleWidth;

    switch (this.theme.obstacleShape) {
      case "spike": {
        this.sprite.fillStyle(this.theme.colors.obstacle, 1);
        this.sprite.fillTriangle(w / 2, 0, 0, this.height, w, this.height);
        break;
      }
      case "circle": {
        this.sprite.fillStyle(this.theme.colors.obstacle, 1);
        this.sprite.fillCircle(w / 2, this.height / 2, w / 2);
        break;
      }
      default: {
        this.sprite.fillStyle(this.theme.colors.obstacle, 1);
        this.sprite.fillRect(0, 0, w, this.height);
        this.sprite.lineStyle(2, 0xffffff, 0.2);
        this.sprite.strokeRect(0, 0, w, this.height);
      }
    }
  }

  getBounds(): Phaser.Geom.Rectangle {
    return new Phaser.Geom.Rectangle(
      this.sprite.x,
      this.sprite.y,
      GAME_CONFIG.obstacleWidth,
      this.height
    );
  }

  update(delta: number): void {
    if (!this.active) return;
    this.sprite.x -= this.speed * (delta / 1000);
  }

  isOffScreen(): boolean {
    return this.sprite.x < -100;
  }

  destroy(): void {
    this.sprite.destroy();
  }
}
