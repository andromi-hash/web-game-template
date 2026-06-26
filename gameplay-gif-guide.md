# Gameplay GIF Recording Guide

## Option 1: OBS Studio (recommended)

1. Install OBS Studio (free, obshstudio.com)
2. Run `npm run dev` and open http://localhost:3000
3. In OBS: Add a "Window Capture" source, select your browser
4. Crop to just the game canvas (480x800)
5. Settings → Output → Recording → Select "MP4" (best for later conversion)
6. Record 10-15 seconds of gameplay (jump a few obstacles, show speed increase)
7. Stop recording

## Option 2: Built-in tools

**macOS:** `Cmd+Shift+5` → select the game area → record 10-15s → save as .mov
**Windows:** `Win+G` → Game Bar → record
**Linux:** Use `kazam` or `peek`

## Converting to GIF

Using FFmpeg (fastest):

```bash
# Convert to optimized GIF (target ~2MB)
ffmpeg -i gameplay.mp4 -vf "fps=15,scale=320:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 output.gif

# Or use https://ezgif.com/video-to-gif (drag & drop, no install)
```

## Tips

- Record at 320px wide (scales better in tweets/Gumroad)
- Keep it under 5MB for Twitter
- Show: jump over 2-3 obstacles, then let the speed increase show
- End on the game over screen briefly (shows the full loop)
- For the listing: show each theme for 3-4 seconds in one GIF
