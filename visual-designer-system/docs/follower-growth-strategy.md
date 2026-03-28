# Visual Designer Follower Growth Strategy
## 2D · 3D · Print · Brand — The Complete Playbook

---

## The Core Principle: Show the Full Stack

Most designers only show *outputs*. Top accounts show the **full stack mastery** — the ability to move fluidly between 2D, 3D, and print. This dual/triple mastery is rare and immediately sets you apart algorithmically and visually.

**What competitors do:** Post finished work.
**What this system does:** Show process + proof of mastery across every medium.

---

## Phase 1: Foundation (Days 1–30)
### Goal: Establish identity & post consistently

| Week | Focus | Output |
|------|-------|--------|
| 1 | Profile optimization + 9-grid aesthetic | 3 portfolio posts |
| 2 | First process reveal (2D workflow) | 3 posts + 1 reel |
| 3 | First 3D showcase | 3 posts + 1 reel |
| 4 | Print-ready / behind-the-scenes | 3 posts + 1 story |

**Profile must-haves:**
- Bio: `Visual Designer · 2D · 3D · Print · DM to hire`
- Link: Portfolio or Linktree
- Profile photo: Dark bg, face or logo mark, high contrast
- Highlights: Work / Process / Services / About

---

## Phase 2: Growth Engine (Days 31–90)
### Goal: Algorithmic amplification

### The 4-Pillar Content System

#### Pillar 1 — Process Reveal (3x/week)
Show what others hide. Wireframes, sketches, before/after renders.
- Hook: "Nobody shows this part. I will."
- Format: Carousel (swipe = more reach) or Reel (10–30s)
- Best performers: Sketch → 3D render transformation

#### Pillar 2 — Before/After (2x/week)
Maximum visual contrast. Client rebrand. Concept evolution.
- Hook: "I redesigned this in 2 hours. [Before / After]"
- Format: Side-by-side carousel
- Best performers: Logo rebrand, poster evolution

#### Pillar 3 — Design Tips (2x/week)
Position as expert. Short, actionable, shareable.
- Hook: "3 typography rules every designer ignores"
- Format: Text-heavy carousel or talking-head reel
- Best performers: Print tips, 3D render tips, color theory

#### Pillar 4 — Portfolio Drop (1x/week)
Let the craft speak. Clean, full-quality work.
- Hook: "Spent 40 hours on this. Worth it."
- Format: Single hero image or multi-slide carousel
- Best performers: 3D renders, full brand identity systems

---

## Platform-Specific Strategy

### Instagram
- Post 1x daily (optimal window: 8am, 12pm, or 7pm)
- Reels for discovery, carousels for saves/shares
- Stories daily: WIP, polls, Q&A to keep DRs (daily reach) high
- 20–30 hashtags: mix broad + niche (see brand-kit.json)

### TikTok
- 2x daily for rapid growth phase
- Screen recording your process = high watch time
- "Design with me" trend consistently performs
- Hook in first 2 seconds: "Watch me turn this sketch into a 3D world"

### YouTube
- 1x weekly, 8–15 min tutorials
- Title formula: `[Software] [Result] [Time]` → "Blender 3D Logo in 20 min"
- Community posts: Show WIPs, ask for feedback
- Shorts: Repurposed TikToks / Reels

### Pinterest
- 5–10 pins daily (evergreen traffic)
- Tall format (2:3 ratio): 1000×1500px
- Best: Portfolio work, mood boards, design tips graphics
- SEO-optimized titles and descriptions

---

## The Algorithm Advantage: Dual-Platform Repurposing

One piece of content → 8 touchpoints:

```
Original work (Blender / Illustrator / InDesign)
    │
    ├── TikTok: Screen recording process (raw, authentic)
    ├── Instagram Reel: Edited version with music + text overlays
    ├── Instagram Carousel: Step-by-step breakdown
    ├── Instagram Story: Poll "2D or 3D — which do you prefer?"
    ├── YouTube Short: Repurposed reel
    ├── YouTube Long: Full tutorial with commentary
    ├── Pinterest: Final work + process pin
    └── Twitter/X: 1 tip extracted as thread
```

---

## Visual Identity Rules (Never Break These)

### Color palette
| Role | Hex | Use |
|------|-----|-----|
| Background | `#0A0A0F` | All post backgrounds |
| Brand | `#7B2FFF` | Primary accent, headlines |
| Accent | `#00F5FF` | Secondary glow, highlights |
| Premium | `#FFD700` | Badges, milestones, CTAs |
| Text | `#FFFFFF` | All primary text |
| Muted | `#9A9A9A` | Captions, metadata |

### Typography
- Headlines: **Space Grotesk 800** — tight, uppercase
- Labels/Badges: **JetBrains Mono 600** — wide tracking
- Body: **Inter 400/700** — clean, readable

### Design rules
1. Dark background ALWAYS — creates instant premium feel
2. Glow effects on key elements (purple + cyan)
3. Grid overlay (subtle) — signals technical precision
4. Wireframe sphere/geometry — signals 3D expertise
5. Badge row: `2D · 3D · PRINT · BRANDING · MOTION` always visible

---

## Conversion Funnel: Follower → Client

```
Stranger sees reel/post
    │
    ▼
Follows for more content
    │
    ▼
Saves a tips post (trust building)
    │
    ▼
Watches a full process video (expertise proof)
    │
    ▼
DMsfor services or clicks link in bio
    │
    ▼
Pays client
```

**CTA rotation** (change every post):
- "Follow for daily design drops"
- "Save this for your next project"
- "DM me your project idea"
- "Link in bio to see full portfolio"
- "Share with a designer friend"

---

## Milestone Tracking

| Followers | Unlock |
|-----------|--------|
| 1K | Instagram swipe-up links available |
| 5K | Credibility for cold outreach |
| 10K | Brand partnership inquiries begin |
| 50K | Sponsored posts ($500–2K per post) |
| 100K | Course / digital product launch |

---

## Tools Recommended

| Category | Tool | Use |
|----------|------|-----|
| 2D | Adobe Illustrator / Figma | Vector, UI, illustration |
| 3D | Blender (free) / Cinema 4D | Modeling, rendering |
| Print | Adobe InDesign | Layout, CMYK prep |
| Video | Adobe Premiere / CapCut | Reels, TikToks |
| Design tokens | Figma + Style Dictionary | Export to code |
| Scheduling | Later / Buffer | Consistent posting |
| Analytics | Instagram Insights / Metricool | Track what works |

---

## Figma Token Integration

The `tokens/tokens.json` file in this repo uses the **W3C Design Tokens** community group format, compatible with:

- **Figma** → Variables (import via Tokens Studio plugin)
- **Style Dictionary** → Generate CSS variables, SCSS, JSON
- **Theo** → Multi-platform token output
- **sd-transforms** → Figma-specific transforms

### Quick Figma import
1. Install [Tokens Studio for Figma](https://www.figma.com/community/plugin/843461159747178978)
2. Open plugin → Sync → Load JSON
3. Point to `tokens/tokens.json`
4. Apply token set to your Figma file

### Quick CSS export (Style Dictionary)
```bash
npm install -g style-dictionary
style-dictionary build --config sd.config.json
```

---

*Strategy built on analysis of top design influencer accounts: Chris Do / The Futur, Flux Academy, Will Paterson, Satori Graphics, and Zimri Mayfield.*
