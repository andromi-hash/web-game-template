import Phaser from "phaser";
import { GAME_CONFIG, COLORS, getTheme, themes } from "@/config";
import type { Theme } from "@/config";

export class MenuScene extends Phaser.Scene {
  private currentThemeId: string = "default";
  private playText!: Phaser.GameObjects.Text;
  private themeText!: Phaser.GameObjects.Text;
  private highScoreText!: Phaser.GameObjects.Text;
  private bg!: Phaser.GameObjects.Graphics;
  private groundLine!: Phaser.GameObjects.Graphics;
  private demoObstacles: Phaser.GameObjects.Graphics[] = [];

  constructor() {
    super({ key: "MenuScene" });
  }

  create(): void {
    const w = GAME_CONFIG.width;
    const h = GAME_CONFIG.height;
    const theme = getTheme(this.currentThemeId);

    this.bg = this.add.graphics();
    this.groundLine = this.add.graphics();
    this.demoObstacles.forEach((o) => o.destroy());
    this.demoObstacles = [];

    this.bg.fillStyle(theme.colors.background, 1);
    this.bg.fillRect(0, 0, w, h);

    this.groundLine.fillStyle(theme.colors.ground, 1);
    this.groundLine.fillRect(0, GAME_CONFIG.groundY, w, 4);

    const title = this.add
      .text(w / 2, h * 0.2, "GAME\nTEMPLATE", {
        fontFamily: "monospace",
        fontSize: "48px",
        color: "#" + theme.colors.accent.toString(16).padStart(6, "0"),
        align: "center",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    const subtitle = this.add
      .text(w / 2, h * 0.38, "Endless Runner", {
        fontFamily: "monospace",
        fontSize: "18px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    this.playText = this.add
      .text(w / 2, h * 0.52, "[ PLAY ]", {
        fontFamily: "monospace",
        fontSize: "28px",
        color: "#" + theme.colors.accent.toString(16).padStart(6, "0"),
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.highScoreText = this.add
      .text(w / 2, h * 0.6, `BEST: ${this.getHighScore()}`, {
        fontFamily: "monospace",
        fontSize: "16px",
        color: "#888888",
      })
      .setOrigin(0.5);

    const themeKeys = Object.keys(themes);
    this.themeText = this.add
      .text(w / 2, h * 0.7, `Theme: ${theme.name}  [< >]`, {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#aaaaaa",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    const controls = this.add
      .text(w / 2, h * 0.82, "SPACE / TAP / CLICK to Jump", {
        fontFamily: "monospace",
        fontSize: "13px",
        color: "#666666",
      })
      .setOrigin(0.5);

    const footer = this.add
      .text(w / 2, h * 0.92, "Web Game Template v1.0", {
        fontFamily: "monospace",
        fontSize: "11px",
        color: "#444444",
      })
      .setOrigin(0.5);

    this.playText.on("pointerdown", () => this.startGame());
    this.playText.on("pointerover", () => this.playText.setAlpha(0.7));
    this.playText.on("pointerout", () => this.playText.setAlpha(1));

    this.themeText.on("pointerdown", () => this.cycleTheme());
    this.themeText.on("pointerover", () => this.themeText.setAlpha(0.7));
    this.themeText.on("pointerout", () => this.themeText.setAlpha(1));

    this.input.keyboard?.on("keydown-SPACE", () => this.startGame());
    this.input.keyboard?.on("keydown-ENTER", () => this.startGame());

    this.drawDemoObstacles(theme);
    this.tweens.add({
      targets: title,
      y: title.y - 5,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  private getHighScore(): number {
    return parseInt(localStorage.getItem("highScore") || "0", 10);
  }

  private startGame(): void {
    this.scene.start("GameScene", { themeId: this.currentThemeId });
  }

  private cycleTheme(): void {
    const keys = Object.keys(themes);
    const idx = keys.indexOf(this.currentThemeId);
    this.currentThemeId = keys[(idx + 1) % keys.length];
    this.scene.restart({ themeId: this.currentThemeId });
  }

  private drawDemoObstacles(theme: Theme): void {
    for (let i = 0; i < 3; i++) {
      const g = this.add.graphics();
      g.fillStyle(theme.colors.obstacle, 0.3);
      const x = 200 + i * 100;
      g.fillRect(x, GAME_CONFIG.groundY - 40 - i * 10, 20, 40 + i * 10);
      this.demoObstacles.push(g);
    }
  }
}
