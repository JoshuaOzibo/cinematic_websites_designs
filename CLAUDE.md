# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository structure

This is not a single app — it's a workspace of **independent** Vite + React demo sites, each its own npm project with its own `node_modules`, `package.json`, and lockfile. There is no root package.json, no workspace tool (no npm/pnpm workspaces, no Turborepo/Nx), and no shared code between sites. Always `cd` into the specific site directory before running any npm command.

- `test_website_one/` — "Revuelto" — a Lamborghini-style car configurator/showcase site.
- `test_website_two/` — "Aura Royale" — a cinematic gourmet smash-burger restaurant site.
- `images/` (repo root) — source frame-sequence JPGs; this is the origin copy of `test_website_one/public/images/` (duplicated there for Vite to serve it). Treat root `images/` as a source asset store, not something either app reads directly at runtime.
- `.agent/` — a vendored third-party agent-skill package (git-ignored, not part of either site's source).

When asked to work on "the site" without qualification, check which directory the user's files/selection point to — do not assume one project over the other.

## Commands

Run from inside the relevant site directory (`test_website_one/` or `test_website_two/`):

```bash
npm install       # install deps for that site only
npm run dev       # start Vite dev server
npm run build     # production build
npm run preview   # preview a production build
npm run lint      # oxlint
```

There is no test suite configured in either project — don't invent test commands.

## Architecture

Both sites share the same underlying pattern even though the codebases are fully separate:

- **React 19 + Vite + Tailwind CSS v4** (via `@tailwindcss/vite`, configured through `@theme` blocks in `src/index.css` rather than a `tailwind.config.js`).
- **GSAP + ScrollTrigger** drives all scroll-based motion. Every component that animates on scroll calls `gsap.registerPlugin(ScrollTrigger)` at module scope and wraps its animations in `gsap.context(() => {...}, scopeRef)` inside a `useEffect`, cleaning up with `ctx.revert()` on unmount.
- **Canvas frame-sequence hero**: both sites have a hero component (`CanvasSequence.jsx` in site one, `BurgerHeroCanvas.jsx` in site two) that preloads a numbered sequence of images from `public/` (e.g. `ezgif-frame-001.jpg`/`.png`) and scrubs through them on a `<canvas>` as the user scrolls, driven by a pinned/sticky section and a GSAP-tweened frame index. This is the most performance-sensitive part of each app — frame count, image dimensions, and preload logic are tightly coupled to the scroll math (`TOTAL_FRAMES`, `TRACK_VH`, easing helpers at the top of the file).
- In `test_website_two`, the hero canvas hands off to a static image in `BurgerFeatureSection.jsx`: the canvas reads the landing target's `getBoundingClientRect()` live every frame (via a shared DOM id, `LANDING_SLOT_ID`) and lerps the burger's box into it, then cross-fades to a static `<img>` for the final resting frame. The cross-fade is coordinated through a CSS custom property (`--burger-travel`) written by the canvas component and read by `index.css` — if you change the travel/handoff math in `BurgerHeroCanvas.jsx`, check `index.css`'s `.burger-slot-placeholder`/`.burger-slot-image` clamp ranges stay in sync. `BurgerScrollBridge.jsx` in that same directory is an alternate/unused implementation of the same handoff — it is not imported by `App.jsx`; don't assume it's live.
- Root App component (`src/App.jsx`) in each site is a flat composition of section components in scroll order — no router, no global state library. `test_website_two`'s `App.jsx` owns cart/reservation-drawer state (`useState`) and passes handlers down; there's no context or external store.
- `oxlint` (not ESLint) is the linter in both projects, configured via `.oxlintrc.json` with the `react` and `oxc` plugin sets.
