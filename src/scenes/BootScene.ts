import Phaser from "phaser";
import { GAME_CONFIG, COLORS } from "@/config/game";

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  preload(): void {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    const bar = this.add.graphics();
    this.load.on("progress", (value: number) => {
      bar.clear();
      bar.fillStyle(0x333333, 1);
      bar.fillRect(w / 4, h / 2 - 15, w / 2, 30);
      bar.fillStyle(COLORS.accent, 1);
      bar.fillRect(w / 4 + 4, h / 2 - 11, (w / 2 - 8) * value, 22);
    });

    this.load.on("complete", () => bar.destroy());

    this.load.image("particle", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAFklEQVQIW2NkYPj/n4EBCxghYQoBAQD//wP8DPzTAAAAAElFTkSuQmCC");
  }

  create(): void {
    this.scene.start("MenuScene");
  }
}
