# Visual Designer System
### Follower Growth Kit · 2D · 3D · Print · Brand Identity

A complete GitHub-hosted design system for visual designers building a social media following — with Figma-compatible tokens, live HTML templates, and a proven growth playbook.

---

## What's Inside

```
visual-designer-system/
├── tokens/
│   └── tokens.json          ← Figma design tokens (W3C format)
├── brand/
│   └── brand-kit.json       ← Brand colors, type, content strategy
├── templates/
│   ├── instagram-post.html  ← 1080×1080 — open in browser, screenshot
│   ├── youtube-banner.html  ← 2560×1440 — channel art
│   ├── story.html           ← 1080×1920 — Instagram/Facebook Story
│   └── poster.html          ← A3 print — services poster
└── docs/
    └── follower-growth-strategy.md  ← Full playbook
```

---

## Quick Start

### 1. Use the Templates
Open any `.html` file in your browser — fully rendered, no build step needed.

To export as an image:
- **Chrome/Edge**: Open DevTools → `Cmd+Shift+P` → "Capture full size screenshot"
- **Firefox**: Right-click → "Take Screenshot"

### 2. Import Tokens into Figma
1. Install [Tokens Studio for Figma](https://www.figma.com/community/plugin/843461159747178978)
2. Load `tokens/tokens.json`
3. Sync to your Figma file

### 3. Read the Strategy
See `docs/follower-growth-strategy.md` for the full content system.

---

## Brand Palette

| Token | Hex | Preview |
|-------|-----|---------|
| `color.base.black` | `#0A0A0F` | ██ Background |
| `color.base.purple` | `#7B2FFF` | ██ Primary brand |
| `color.base.cyan` | `#00F5FF` | ██ Accent / glow |
| `color.base.gold` | `#FFD700` | ██ Premium / CTA |

---

## Templates Preview

| Template | Platform | Dimensions |
|----------|----------|------------|
| `instagram-post.html` | Instagram Feed | 1080×1080px |
| `youtube-banner.html` | YouTube Channel | 2560×1440px |
| `story.html` | IG/FB Story | 1080×1920px |
| `poster.html` | Print / Digital | A3 (300dpi) |

---

## Customize

Replace these placeholders across all templates and `brand-kit.json`:

| Placeholder | Replace with |
|-------------|-------------|
| `@yourhandle` | Your social handle |
| `[YOUR NAME]` | Your name |
| `yourportfolio.com` | Your portfolio URL |
| `500+` / `8yr` | Your actual stats |

---

## Design System Stack

- **Tokens format**: W3C Design Tokens Community Group
- **Font families**: Space Grotesk, Inter, JetBrains Mono (Google Fonts)
- **Color mode**: Dark-first
- **Export targets**: Figma Variables, CSS Custom Properties, SCSS

---

Built with the [canvas-design](../canvas-design) philosophy: visual-first, craft-obsessed.
