# coffeelo

An editorial single-page site for a fictional single-origin coffee roaster, built with
React 19 + Vite + Tailwind CSS v4. Standalone project — install and run from this directory.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
npm run lint     # oxlint
```

## Notes

- **Type** — the display font is Fraunces loaded as a *variable* font and driven at
  `opsz 144 / wght 900 / SOFT 100 / WONK 1` (see `.font-display` in `src/index.css`). Those
  SOFT/WONK axes are what make the lettering rounded and bubbly; static Fraunces 900 renders
  far sharper. If headings suddenly look like an ordinary serif, the axis order in the Google
  Fonts URL in `index.html` is wrong — it must be `opsz,wght,SOFT,WONK`.
- **Hero product** — `src/components/hero/CoffeeCup.jsx` is a hand-drawn SVG stand-in for a
  photographic cutout. Drop a transparent PNG at `public/hero-cup.png` and
  `HeroProduct.jsx` swaps to it automatically; delete the file and the SVG comes back.
- **Motion** — no animation library. Scroll entrances go through the single
  `components/Reveal.jsx` IntersectionObserver wrapper; everything else is CSS `@keyframes`
  in `src/index.css`. All of it is disabled under `prefers-reduced-motion`.
- **Theme** — colors and fonts live in the `@theme` block in `src/index.css`. There is no
  `tailwind.config.js` (Tailwind v4).
