import Phaser from "phaser";
import { GAME_CONFIG, COLORS, getTheme, type Theme } from "@/config";
import { Player } from "@/entities/Player";
import { Obstacle } from "@/entities/Obstacle";
import { ScoreManager } from "@/systems/ScoreManager";
import { DifficultyManager } from "@/systems/DifficultyManager";

export class GameScene extends Phaser.Scene {
  private theme!: Theme;
  private bg!: Phaser.GameObjects.Graphics;
  private groundLine!: Phaser.GameObjects.Graphics;
  private scoreText!: Phaser.GameObjects.Text;
  private speedText!: Phaser.GameObjects.Text;
  private player!: Player;
  private obstacles: Obstacle[] = [];
  private scoreManager!: ScoreManager;
  private difficultyManager!: DifficultyManager;
  private spawnTimer: number = 0;
  private isGameOver: boolean = false;
  private particles: Phaser.GameObjects.Graphics[] = [];

  constructor() {
    super({ key: "GameScene" });
  }

  init(data: { themeId?: string }): void {
    this.theme = getTheme(data.themeId || "default");
    this.obstacles = [];
    this.particles = [];
    this.spawnTimer = 0;
    this.isGameOver = false;
  }

  create(): void {
    const w = GAME_CONFIG.width;
    const h = GAME_CONFIG.height;

    this.bg = this.add.graphics();
    this.bg.fillStyle(this.theme.colors.background, 1);
    this.bg.fillRect(0, 0, w, h);

    this.groundLine = this.add.graphics();
    this.groundLine.fillStyle(this.theme.colors.ground, 1);
    this.groundLine.fillRect(0, GAME_CONFIG.groundY, w, 6);

    this.scoreManager = new ScoreManager();
    this.difficultyManager = new DifficultyManager();

    this.scoreText = this.add
      .text(20, 20, "SCORE: 0", {
        fontFamily: "monospace",
        fontSize: "22px",
        color: "#ffffff",
      })
      .setDepth(10);

    this.speedText = this.add
      .text(20, 48, "SPD: 1.0x", {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#888888",
      })
      .setDepth(10);

    this.player = new Player(this, this.theme);

    this.input.on("pointerdown", () => this.handleJump());
    this.input.keyboard?.on("keydown-SPACE", () => this.handleJump());

    this.createParallax();
  }

  private createParallax(): void {
    for (let i = 0; i < 3; i++) {
      const g = this.add.graphics();
      const alpha = 0.05 + i * 0.03;
      g.fillStyle(this.theme.colors.accent, alpha);
      for (let j = 0; j < 5; j++) {
        const rx = Phaser.Math.Between(50, GAME_CONFIG.width - 50);
        const ry = Phaser.Math.Between(50, GAME_CONFIG.groundY - 50);
        const rs = Phaser.Math.Between(2, 6);
        g.fillRect(rx, ry, rs, rs);
      }
      this.particles.push(g);
    }
  }

  private handleJump(): void {
    if (this.isGameOver) return;
    this.player.jump();
  }

  update(_time: number, delta: number): void {
    if (this.isGameOver) return;

    this.scoreManager.update(delta);
    this.difficultyManager.update(delta);
    this.player.update(delta);

    this.scoreText.setText(`SCORE: ${this.scoreManager.getScore()}`);
    const speedRatio = (
      this.difficultyManager.getSpeed() / GAME_CONFIG.initialSpeed
    ).toFixed(1);
    this.speedText.setText(`SPD: ${speedRatio}x`);

    this.spawnTimer += delta;
    if (this.spawnTimer >= this.difficultyManager.getSpawnDelay()) {
      this.spawnTimer = 0;
      this.spawnObstacle();
    }

    this.updateObstacles(delta);
    this.checkCollisions();
    this.updateParallax(delta);
  }

  private spawnObstacle(): void {
    const obstacle = new Obstacle(this, this.difficultyManager.getSpeed(), this.theme);
    this.obstacles.push(obstacle);
  }

  private updateObstacles(delta: number): void {
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.update(delta);
      if (obs.isOffScreen()) {
        obs.destroy();
        this.obstacles.splice(i, 1);
      }
    }
  }

  private checkCollisions(): void {
    const playerBounds = this.player.getBounds();
    for (const obs of this.obstacles) {
      if (!obs.active) continue;
      const obsBounds = obs.getBounds();
      if (Phaser.Geom.Rectangle.Overlaps(playerBounds, obsBounds)) {
        this.gameOver();
        return;
      }
    }
  }

  private updateParallax(delta: number): void {
    const speed = this.difficultyManager.getSpeed();
    this.particles.forEach((g, i) => {
      g.x -= speed * (delta / 1000) * (0.1 + i * 0.1);
      if (g.x < -200) g.x = GAME_CONFIG.width + 50;
    });
  }

  private gameOver(): void {
    this.isGameOver = true;
    const isNewBest = this.scoreManager.saveHighScore();
    const finalScore = this.scoreManager.getScore();

    this.flashScreen();

    this.time.delayedCall(600, () => {
      this.scene.start("GameOverScene", {
        score: finalScore,
        isNewBest,
        themeId: Object.entries(this.theme).length > 0 ? this.theme.id : "default",
      });
    });
  }

  private flashScreen(): void {
    const flash = this.add.graphics();
    flash.fillStyle(0xffffff, 0.3);
    flash.fillRect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height);
    flash.setDepth(100);

    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 500,
      onComplete: () => flash.destroy(),
    });
  }
}
