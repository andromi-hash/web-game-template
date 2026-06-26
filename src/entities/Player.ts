import Phaser from "phaser";
import { GAME_CONFIG } from "@/config/game";
import type { Theme } from "@/config/themes";

export class Player {
  public sprite: Phaser.GameObjects.Graphics;
  private scene: Phaser.Scene;
  private velocityY: number = 0;
  private isGrounded: boolean = true;
  private theme: Theme;

  constructor(scene: Phaser.Scene, theme: Theme) {
    this.scene = scene;
    this.theme = theme;

    this.sprite = scene.add.graphics();
    this.drawPlayer();
    this.sprite.x = GAME_CONFIG.playerX;
    this.sprite.y = GAME_CONFIG.groundY - GAME_CONFIG.playerHeight;
  }

  private drawPlayer(): void {
    this.sprite.clear();
    const s = GAME_CONFIG.playerWidth;
    this.sprite.fillStyle(this.theme.colors.player, 1);

    switch (this.theme.playerShape) {
      case "circle":
        this.sprite.fillCircle(s / 2, s / 2, s / 2);
        break;
      case "triangle":
        this.sprite.fillTriangle(s / 2, 0, 0, s, s, s);
        break;
      default:
        this.sprite.fillRect(0, 0, s, s);
    }

    this.sprite.lineStyle(2, 0xffffff, 0.3);
    this.sprite.strokeRect(0, 0, s, s);
  }

  getBounds(): Phaser.Geom.Rectangle {
    return new Phaser.Geom.Rectangle(
      this.sprite.x,
      this.sprite.y,
      GAME_CONFIG.playerWidth,
      GAME_CONFIG.playerHeight
    );
  }

  jump(): void {
    if (!this.isGrounded) return;
    this.velocityY = GAME_CONFIG.jumpVelocity;
    this.isGrounded = false;
    this.sprite.setAlpha(0.8);
  }

  update(delta: number): void {
    const dt = delta / 1000;
    this.velocityY += GAME_CONFIG.gravity * dt;
    this.sprite.y += this.velocityY * dt;

    const floorY = GAME_CONFIG.groundY - GAME_CONFIG.playerHeight;
    if (this.sprite.y >= floorY) {
      this.sprite.y = floorY;
      this.velocityY = 0;
      this.isGrounded = true;
      this.sprite.setAlpha(1);
    }

    this.sprite.setPosition(this.sprite.x, this.sprite.y);
  }

  reset(): void {
    this.sprite.y = GAME_CONFIG.groundY - GAME_CONFIG.playerHeight;
    this.sprite.x = GAME_CONFIG.playerX;
    this.velocityY = 0;
    this.isGrounded = true;
    this.sprite.setAlpha(1);
  }

  destroy(): void {
    this.sprite.destroy();
  }
}
