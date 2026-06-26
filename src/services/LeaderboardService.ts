import { GAME_CONFIG } from "@/config/game";

interface LeaderboardEntry {
  name: string;
  score: number;
  timestamp: number;
}

const STORAGE_KEY = "leaderboard";

export class LeaderboardService {
  private entries: LeaderboardEntry[];

  constructor() {
    this.entries = this.load();
  }

  private load(): LeaderboardEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.entries));
  }

  getEntries(): LeaderboardEntry[] {
    return [...this.entries].sort((a, b) => b.score - a.score);
  }

  addEntry(name: string, score: number): void {
    this.entries.push({ name, score, timestamp: Date.now() });
    this.entries.sort((a, b) => b.score - a.score);
    if (this.entries.length > GAME_CONFIG.leaderboardMaxEntries) {
      this.entries = this.entries.slice(0, GAME_CONFIG.leaderboardMaxEntries);
    }
    this.save();
  }

  isHighScore(score: number): boolean {
    if (this.entries.length < GAME_CONFIG.leaderboardMaxEntries) return true;
    const lowest = this.entries[this.entries.length - 1];
    return score > lowest.score;
  }

  clear(): void {
    this.entries = [];
    this.save();
  }
}
