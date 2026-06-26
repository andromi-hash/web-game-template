import Phaser from "phaser";
import { GAME_CONFIG, COLORS, getTheme } from "@/config";
import { LeaderboardService } from "@/services/LeaderboardService";
import { themes } from "@/config/themes";

export class GameOverScene extends Phaser.Scene {
  private score: number = 0;
  private isNewBest: boolean = false;
  private themeId: string = "default";
  private leaderboardService!: LeaderboardService;

  constructor() {
    super({ key: "GameOverScene" });
  }

  init(data: { score: number; isNewBest: boolean; themeId: string }): void {
    this.score = data.score || 0;
    this.isNewBest = data.isNewBest || false;
    this.themeId = data.themeId || "default";
    this.leaderboardService = new LeaderboardService();
  }

  create(): void {
    const w = GAME_CONFIG.width;
    const h = GAME_CONFIG.height;
    const theme = getTheme(this.themeId);

    const bg = this.add.graphics();
    bg.fillStyle(theme.colors.background, 0.95);
    bg.fillRect(0, 0, w, h);

    const accentColor = "#" + theme.colors.accent.toString(16).padStart(6, "0");

    this.add
      .text(w / 2, h * 0.12, "GAME OVER", {
        fontFamily: "monospace",
        fontSize: "36px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    if (this.isNewBest) {
      this.add
        .text(w / 2, h * 0.2, "NEW HIGH SCORE!", {
          fontFamily: "monospace",
          fontSize: "16px",
          color: accentColor,
        })
        .setOrigin(0.5);
    }

    this.add
      .text(w / 2, h * 0.28, `Score: ${this.score}`, {
        fontFamily: "monospace",
        fontSize: "28px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    const playAgain = this.add
      .text(w / 2, h * 0.4, "[ PLAY AGAIN ]", {
        fontFamily: "monospace",
        fontSize: "22px",
        color: accentColor,
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    const menu = this.add
      .text(w / 2, h * 0.48, "[ MENU ]", {
        fontFamily: "monospace",
        fontSize: "18px",
        color: "#aaaaaa",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    playAgain.on("pointerdown", () => {
      this.scene.start("GameScene", { themeId: this.themeId });
    });
    playAgain.on("pointerover", () => playAgain.setAlpha(0.7));
    playAgain.on("pointerout", () => playAgain.setAlpha(1));

    menu.on("pointerdown", () => {
      this.scene.start("MenuScene");
    });
    menu.on("pointerover", () => menu.setAlpha(0.7));
    menu.on("pointerout", () => menu.setAlpha(1));

    this.input.keyboard?.on("keydown-SPACE", () => {
      this.scene.start("GameScene", { themeId: this.themeId });
    });

    this.drawLeaderboard(w, h, theme);

    this.drawNameEntry(w, h, accentColor);
  }

  private drawLeaderboard(w: number, h: number, theme: any): void {
    this.add
      .text(w / 2, h * 0.58, "LEADERBOARD", {
        fontFamily: "monospace",
        fontSize: "16px",
        color: "#888888",
      })
      .setOrigin(0.5);

    const entries = this.leaderboardService.getEntries().slice(0, 5);

    if (entries.length === 0) {
      this.add
        .text(w / 2, h * 0.65, "No scores yet. Be the first!", {
          fontFamily: "monospace",
          fontSize: "12px",
          color: "#666666",
        })
        .setOrigin(0.5);
      return;
    }

    entries.forEach((entry, i) => {
      const isCurrent =
        entry.score === this.score &&
        this.leaderboardService.getEntries().indexOf(entry) < 5;

      const color = isCurrent ? "#" + theme.colors.accent.toString(16).padStart(6, "0") : "#cccccc";
      const prefix = i + 1 <= 3 ? ["1st", "2nd", "3rd"][i] : `${i + 1}th`;

      this.add
        .text(w / 2 - 80, h * 0.62 + i * 24, `${prefix}`, {
          fontFamily: "monospace",
          fontSize: "14px",
          color: "#666666",
        })
        .setOrigin(0, 0.5);

      this.add
        .text(w / 2 - 40, h * 0.62 + i * 24, entry.name, {
          fontFamily: "monospace",
          fontSize: "14px",
          color,
        })
        .setOrigin(0, 0.5);

      this.add
        .text(w / 2 + 100, h * 0.62 + i * 24, `${entry.score}`, {
          fontFamily: "monospace",
          fontSize: "14px",
          color,
        })
        .setOrigin(1, 0.5);
    });
  }

  private drawNameEntry(w: number, h: number, accentColor: string): void {
    const currentHigh = parseInt(localStorage.getItem("highScore") || "0", 10);
    if (this.score < currentHigh && this.score === 0 && !this.isNewBest) return;

    this.add
      .text(w / 2, h * 0.86, "Enter your name for the leaderboard", {
        fontFamily: "monospace",
        fontSize: "11px",
        color: "#666666",
      })
      .setOrigin(0.5);

    let nameInput = "Player";
    const nameText = this.add
      .text(w / 2, h * 0.91, `[ ${nameInput} ]`, {
        fontFamily: "monospace",
        fontSize: "18px",
        color: accentColor,
      })
      .setOrigin(0.5);

    nameText.setInteractive({ useHandCursor: true });

    nameText.on("pointerdown", () => {
      const newName = prompt("Enter your name (max 12 chars):", nameInput);
      if (newName && newName.trim().length > 0) {
        nameInput = newName.trim().slice(0, 12);
        nameText.setText(`[ ${nameInput} ]`);
      }
    });

    const saveBtn = this.add
      .text(w / 2, h * 0.96, "SAVE", {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#ffffff",
        backgroundColor: "#333333",
        padding: { x: 16, y: 6 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    saveBtn.on("pointerdown", () => {
      if (this.score > 0) {
        this.leaderboardService.addEntry(nameInput, this.score);
      }
      saveBtn.setText("SAVED!");
      saveBtn.removeInteractive();
    });

    this.input.keyboard?.on("keydown-ENTER", () => {
      if (this.score > 0) {
        this.leaderboardService.addEntry(nameInput, this.score);
      }
      this.scene.start("GameScene", { themeId: this.themeId });
    });
  }
}
