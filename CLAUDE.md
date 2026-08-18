# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

---

## Workspace Overview

This is a **multi-site portfolio workspace** — a collection of independent, cinematic website builds used to attract high-budget clients. Each site is a standalone Vite + React project with its own `node_modules`, `package.json`, and lockfile. There is no root package.json, no workspace tool (no npm/pnpm workspaces, no Turborepo/Nx), and no shared code between sites.

**Always `cd` into the specific site directory before running any npm command.**

---

## Sites

| Directory | Name | Concept |
|---|---|---|
| `test_website_one/` | Revuelto | Lamborghini-style car configurator / showcase |
| `test_website_two/` | Aura Royale | Cinematic gourmet smash-burger restaurant |
| `coffe_website/` | (active) | Coffee brand site — currently in dev |
| `kings_website/` | (active) | Kings-themed site — currently in dev |
| `tracking_orders_website/` | (active) | Order tracking site — currently in dev |

New sites will be added as the challenge progresses. When a new site directory appears, treat it the same as existing ones — fully independent, `cd` first.

When asked to work on "the site" without qualification, check which directory the user's files or selection point to. Do not assume one project over another.

---

## Commands

Run from inside the relevant site directory:

```bash
npm install       # install deps for that site only
npm run dev       # start Vite dev server
npm run build     # production build
npm run preview   # preview a production build
npm run lint      # oxlint
```

There is no test suite configured — do not invent test commands.

---

## Architecture

All sites share the same underlying pattern even though codebases are fully separate:

**Stack:**
- React 19 + Vite + Tailwind CSS v4 (via `@tailwindcss/vite`, configured through `@theme` blocks in `src/index.css` — no `tailwind.config.js`)
- GSAP + ScrollTrigger for all scroll-based motion
- Canvas frame-sequence heroes

**GSAP Rules (critical):**
- Every component that animates on scroll calls `gsap.registerPlugin(ScrollTrigger)` at module scope
- Wrap animations in `gsap.context(() => {...}, scopeRef)` inside `useEffect`
- Always clean up with `ctx.revert()` on unmount
- Never use `window.addEventListener('scroll', ...)` — use ScrollTrigger or IntersectionObserver only
- Animate only `transform` and `opacity` — never `top`, `left`, `width`, `height`

**Canvas Hero Pattern:**
- `CanvasSequence.jsx` (site one), `BurgerHeroCanvas.jsx` (site two)
- Preloads a numbered image sequence from `public/` and scrubs through on a `<canvas>` as the user scrolls
- Driven by a pinned/sticky section + a GSAP-tweened frame index
- `TOTAL_FRAMES`, `TRACK_VH`, and easing helpers at the top of the file are tightly coupled — treat them carefully

**Site Two Handoff (specific to `test_website_two`):**
- Canvas hero hands off to a static image in `BurgerFeatureSection.jsx`
- Canvas reads `LANDING_SLOT_ID` via `getBoundingClientRect()` live every frame and lerps the burger's box into it
- Cross-fade coordinated through CSS custom property `--burger-travel` (written by canvas, read by `index.css`)
- If you change travel/handoff math in `BurgerHeroCanvas.jsx`, check `index.css`'s `.burger-slot-placeholder` / `.burger-slot-image` clamp ranges stay in sync
- `BurgerScrollBridge.jsx` is an unused alternate implementation — it is NOT imported by `App.jsx`, do not assume it's live

**App Structure:**
- Root `App.jsx` in each site is a flat composition of section components in scroll order — no router, no global state library
- `test_website_two`'s `App.jsx` owns cart/reservation-drawer state (`useState`) and passes handlers down — no context or external store

**Linting:**
- `oxlint` (not ESLint) in both projects, configured via `.oxlintrc.json` with `react` and `oxc` plugin sets

---

## Design Skills

Three taste-skills are installed in `.agent/skills/`. Claude Code reads these automatically. Here is when each one applies:

### `design-taste-frontend` (taste-skill)
**Use for:** any greenfield frontend build or new section from scratch.

This skill governs all design decisions — typography, color, layout, motion, component patterns. Key rules that apply to every build in this workspace:

- Read the brief first. Declare a one-line "Design Read" before writing code.
- Set three dials: `DESIGN_VARIANCE`, `MOTION_INTENSITY`, `VISUAL_DENSITY`. These drive all layout and animation decisions.
- No Inter as default font — reach for Geist, Outfit, Cabinet Grotesk, or Satoshi first.
- No AI-purple gradients, no three-equal-feature-cards, no centered-hero-over-dark-mesh defaults.
- Em-dash (`—`) is completely banned anywhere on the page. Zero exceptions.
- Hero must fit in the initial viewport. Max 4 text elements. Headline max 2 lines.
- `min-h-[100dvh]` not `h-screen`. CSS Grid not flexbox percentage math.
- Motion must be motivated — every GSAP/ScrollTrigger use needs a one-sentence reason.
- GSAP sticky-stack: always `start: "top top"`, `pin: true`, `ctx.revert()` cleanup.
- No `useState` for continuous scroll/mouse values — use `useMotionValue` / `useTransform`.
- Run the full Pre-Flight Check (Section 14 of the skill) before declaring any task done.

### `redesign-existing-projects` (redesign-skill)
**Use for:** improving an existing site in this workspace — upgrading visual quality, fixing generic patterns, or polishing a build.

This skill audits before touching. Sequence: Scan → Diagnose → Fix. It works with the existing stack — do not migrate frameworks. Fix priority order: font swap → color cleanup → hover states → layout → components → states → typography polish.

### `imagegen-frontend-web`
**Use for:** generating section-by-section frontend design reference images before coding a new site or section.

**Hard output rule:** one separate horizontal image per section. A landing page = 6 images. A full website = 8 images. Never collapse multiple sections into one image. Announce each: "Section X of N: Hero", etc.

Preferred hero compositions (in order): centered over background image, bottom-left over image, stacked center, off-grid editorial. Left-text/right-image is allowed but is the most overused pattern — avoid it as the default.

---

## Design Standards (Workspace-Level)

These apply to every site, every build:

- **No AI tells:** no generic brand names (Acme, Nexus), no fake-round numbers (99%), no "Elevate / Seamless / Unleash" copy, no placeholder names (John Doe)
- **Real images:** gen-tool first, then `https://picsum.photos/seed/{descriptive-seed}/{w}/{h}` — never div-based fake screenshots
- **One accent color per site.** Lock it. Never swap mid-page.
- **One corner-radius scale per site.** Lock it. Never mix pill buttons with square cards.
- **One theme per page (light or dark).** Sections do not flip mid-scroll.
- **Icons:** Phosphor or HugeIcons as default — not Lucide, not hand-rolled SVG paths
- **CTAs:** label must fit on one line at desktop. One label per intent across the whole page.
- **Dark mode:** always design for both modes from the start using Tailwind `dark:` variant
- **Reduced motion:** any `MOTION_INTENSITY > 3` must respect `prefers-reduced-motion` via `useReducedMotion()`
- **Viewport stability:** `min-h-[100dvh]` always, never `h-screen`

---

## Asset Structure

```
images/              ← source frame-sequence JPGs (root copy — source of truth)
test_website_one/
  public/images/     ← duplicate of root images/ for Vite to serve
test_website_two/
  public/            ← site-specific assets
.agent/
  skills/            ← vendored taste-skill SKILL.md files (git-ignored)
```

The root `images/` directory is a source asset store — it is not read directly at runtime by either app.

---

## Inspiration & References

Design references and site inspirations will be added here as the challenge progresses. When a new reference is added, use it to inform the Design Read before building.

- delulustream.com — real-time avatar video call aesthetic (reference for future build)
- *(add new inspirations here as they come)*

---

## Working Notes

- When the user says "new site" or "new build", create a new directory at the workspace root, scaffold a Vite + React + Tailwind v4 project, and document it in the Sites table above.
- Before coding any new UI, run `imagegen-frontend-web` to generate design references if image generation is available.
- Before touching an existing site for visual improvements, run the `redesign-skill` audit sequence first.
- For all new builds, apply `design-taste-frontend` from brief to pre-flight check.