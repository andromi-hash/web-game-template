# Web Game Template — Endless Runner

**Ship a polished, mobile-friendly casual game in hours, not weeks.**

A production-ready endless runner built with TypeScript + Phaser 3. Designed for indie hackers, marketing agencies, and Telegram Mini App developers who need a deployable game FAST.

## Demo

`npm install && npm run dev` → open `http://localhost:3000`

## Features

- **Endless runner core** — polished jump mechanics, progressive difficulty, particle parallax
- **Mobile-first** — touch, click, and keyboard input out of the box
- **Leaderboard system** — local storage persistence, name entry, top 10 tracking
- **Theme system** — swap colors, shapes, and feel via JSON config (3 included themes)
- **Responsive** — Phaser Scale.FIT auto-sizes to any screen
- **Under 350KB gzipped** — loads instantly on mobile networks
- **Zero art assets** — all graphics are procedurally drawn (no licensing issues, easy to replace)

## Quick Start

```bash
npm install
npm run dev
```

## Build for Production

```bash
npm run build
```

Output in `dist/` — deploy to Vercel, Netlify, Cloudflare Pages, or Telegram Mini App host.

## Customization

Edit `src/config/themes.ts` or add JSON files in `themes/`:

```json
{
  "id": "mytheme",
  "name": "My Theme",
  "colors": {
    "background": "#1a1a2e",
    "player": "#00ff88",
    "obstacle": "#ff4444",
    "accent": "#00ff88"
  },
  "playerShape": "square",
  "obstacleShape": "rectangle"
}
```

## Project Structure

```
src/
  config/       # Game config, theme definitions
  scenes/       # Boot, Menu, Game, GameOver
  entities/     # Player, Obstacle
  systems/      # Score, Difficulty
  services/     # Leaderboard
  main.ts       # Entry point
themes/         # Theme JSON files
```

## Use Cases

- **Telegram Mini App** — deploy as a WebApp for viral Telegram games
- **Brand activation** — re-skin for a client campaign, ship in a weekend
- **MVP for a game startup** — validate your game idea before building the real thing
- **Learning resource** — clean TypeScript + Phaser 3 architecture to study

## License

MIT — use it for anything, commercial included.
