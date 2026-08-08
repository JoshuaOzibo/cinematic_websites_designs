# Kings Lounge Digital

Design and build a premium, single-page marketing + digital menu website for "KINGS LOUNGE," an upscale bar, kitchen, shisha lounge, and photo-shoot venue located in Asaba, Delta State, Nigeria. This is a nightlife and social destination for an affluent, style-conscious clientele — think regal, moody, editorial nightlife, not a casual sports bar. Prices are in Nigerian Naira (₦) and range from ₦500 takeout items to ₦600,000 rare spirits (Don Julio 1942, Hennessy XO, Glenfiddich 21yr), so the design must feel genuinely high-end and trustworthy at every price point.

=== 1. OVERALL DESIGN DIRECTION ===

Premium nightlife editorial meets modern minimalism. Think: a five-star hotel lounge website crossed with a boutique cocktail bar's digital presence. Generous negative space, restrained ornamentation (thin gold linework, not gaudy gold-on-everything), confident large-scale typography, and moody, atmospheric photography-led sections rather than clipart or stock-icon-heavy layouts. Every section should feel intentional and hand-composed — asymmetric grids where appropriate, deliberate alignment, no default "AI landing page" symmetry-for-symmetry's-sake.

=== 2. BRAND PERSONALITY ===

Regal, confident, intimate, a little mysterious. "Kings Lounge" should evoke: crown/royalty motifs used subtly (a thin crown glyph as a favicon/logo mark, never cartoonish), late-night warmth, craftsmanship in cocktails, exclusivity without being cold or unwelcoming. Tone of voice in any copy: assured, warm, minimal — short confident lines, not corporate marketing-speak.

=== 3. COLOR SYSTEM ===

- Primary background: near-black charcoal #0E0D0C to #14110F (not pure black — keep slight warmth)

- Secondary surface: deep espresso brown #211B17 for card backgrounds and alternating sections

- Accent (primary): antique/muted gold #C9A24B — used sparingly for dividers, icon strokes, key CTAs, price highlights, active nav states

- Accent (secondary, optional depth): deep burgundy #5A1F24 for occasional section backgrounds (Champagne & Wine, Kitchen) to create rhythm between sections

- Text on dark: warm off-white #F4EDE4 for headings, muted warm grey #B9AFA2 for body/secondary text

- Light section (optional, for the About/story section only): warm cream #F4EDE4 background with charcoal text, to create one visual "breath" break in an otherwise dark-dominant page

Never use pure white (#FFFFFF) or pure black (#000000) anywhere — always the warm-tinted variants above. Gold should read as brushed metal, not neon/yellow — desaturate it if it starts looking cheap.

=== 4. TYPOGRAPHY ===

- Display/headings: an elegant high-contrast serif (Playfair Display, Cormorant Garamond, or similar) — used for the logotype, hero headline, section titles, and menu category names. Use generous letter-spacing on all-caps labels (e.g., "THE BAR," "THE KITCHEN").

- Body/UI: a clean modern grotesk sans-serif (Inter, Manrope, or similar) for body copy, nav links, prices, buttons, form fields.

- Hierarchy: hero headline 56–72px desktop / 32–40px mobile in the serif; section titles 36–44px serif; item names 16–18px sans, semibold, uppercase with slight tracking; prices in sans, gold accent color, tabular numerals so they align in lists.

- Avoid more than 2 font families total.

=== 5. HEADER / NAVIGATION ===

What the user sees: A slim, fixed/sticky header (72–80px tall) that starts fully transparent over the hero image and transitions to a solid charcoal background with a subtle bottom border/shadow once the user scrolls past the hero (smooth 200ms crossfade, not an abrupt cut).

Why: Keeps navigation always accessible for a long single-page menu without competing with the hero photography.

Layout: Logo/crown wordmark left ("KINGS LOUNGE" in serif, small crown glyph above or beside it), horizontal category nav center-right (BAR, KITCHEN, WINE & CHAMPAGNE, SHISHA, COCKTAILS, PHOTO SHOOT), a gold-outlined "Reserve a Table" or "View Full Menu" button on the far right. On scroll, the active nav item corresponding to the visible section gets a thin gold underline that animates in (not just a hard color swap).

Mobile: Logo left, single hamburger icon right. Tapping opens a full-screen dark overlay menu with large serif category links stacked vertically, staggered fade-up entrance (60ms delay per item), and the CTA button pinned at the bottom of the overlay.

=== 6. HERO SECTION ===

What the user sees: A full-viewport-height hero with a high-quality moody photograph or looping muted video (dim lounge lighting, cocktail being poured, shisha smoke, gold rim lighting) as the background, with a dark gradient overlay (transparent top fading to ~70% charcoal at bottom) to guarantee text legibility. Centered or left-aligned content: a small gold kicker line ("ASABA, DELTA STATE"), the large serif headline ("Where the Night Feels Like Royalty" — or similar regal-but-not-cheesy line derived from the brand), a one-sentence supporting line about the bar/kitchen/shisha experience, and two CTAs side by side: a solid gold-filled primary button ("Reserve a Table") and a ghost/outline secondary button ("View the Menu") that smooth-scrolls to the menu section.

Why: Establishes premium tone in the first 3 seconds and gives immediate paths to the two things users want — booking and browsing.

Layout: Content vertically centered, max-width constrained (not full-bleed text), with a subtle scroll-indicator (thin animated line or chevron) at the bottom center.

Animation: Headline and subtext fade-up with 80–120ms stagger on load; background has a very slow (30–60s loop) Ken Burns-style slow zoom if using a static image, to avoid a static/flat feel.

Mobile: Full-height hero retained but text left-aligned, headline scales down, buttons stack full-width, background image swapped for a portrait-cropped or center-focused version so faces/key subjects aren't cropped out.

=== 7. HERO IMAGERY ===

Use warm, low-key lighting photography: gold and amber tones, shallow depth of field, genuine lounge/bar atmosphere (bartender crafting a cocktail, glassware catching light, shisha coals glowing, a well-dressed group laughing in soft light). Avoid bright, flat, overlit stock photography — everything should look shot at night with intentional lighting design. If using illustration/graphic elements at all, keep them to a single thin gold line-art crown or laurel motif, never full icon sets.

=== 8. CTA DESIGN ===

Primary CTA: solid gold fill (#C9A24B), charcoal text, subtle uppercase tracking, small serif or semibold sans label, rounded corners kept minimal (4–6px, not pill-shaped — pill shapes read as generic SaaS, sharper corners read as premium hospitality). On hover: fill darkens slightly and a subtle upward lift (2–4px translateY) with soft shadow.

Secondary CTA: transparent background, 1px gold border, gold text; on hover, background fills to a low-opacity gold tint.

All CTAs use smooth 150–200ms ease transitions, never abrupt color snaps. WhatsApp/phone "Order" CTAs (if included per item or in a floating action button) use a subtle pulsing gold ring only on first page load to draw attention once, not a continuous distracting animation.

=== 9. EVERY SECTION IN ORDER ===

A) Header/Nav (sticky) — described above.

B) Hero — described above.

C) Brand Story / About strip

What: A shorter breathing-room section, cream/light background (the one light section on the page) with charcoal text — 2–3 sentences about Kings Lounge's identity (bar, kitchen, shisha, photo experiences, Asaba's premier lounge), paired with a single elegant photo (interior shot or signature cocktail) in an asymmetric split layout (60/40, text on one side, image bleeding to the edge on the other).

Why: Builds trust and context before diving into the transactional menu; the light background creates visual rhythm/relief.

Layout: Two-column on desktop, stacked (image first, text second) on mobile.

Animation: Image has a subtle scale-in on scroll-into-view (from 1.05 to 1.0 scale); text fades up.

D) Menu Navigation / Category Selector

What: A horizontal, pill-style or underline-style sticky sub-nav directly below the main header once the user scrolls into the menu area, showing all categories (Bar, Beers Ciders & Bitters, Champagne & Wine, Cocktails Mocktails & Smoothies, Kitchen, Photo Shoot, Shisha, Shots, Soft Drinks & Juice, Spirit Tequila & Liquor) as tappable filters/anchors.

Why: With 130+ items, users need fast navigation and filtering rather than endless scrolling — this is the single biggest functional upgrade over the current site.

Layout: Horizontally scrollable chip row on all breakpoints (no wraparound clutter), active category highlighted with a gold underline or filled chip.

Mobile: Same horizontal scroll pattern, chips slightly smaller, with a soft edge-fade gradient hinting more content is scrollable.

E) Menu Sections (one per category, in this order: Bar, Cocktails Mocktails & Smoothies, Champagne & Wine, Beers Ciders & Bitters, Spirit Tequila & Liquor, Shots, Kitchen, Shisha, Shisha & Other Service, Photo Shoot, Soft Drinks & Juice)

What: Each category is its own full-width section with a large serif category title, a thin gold divider rule, and a responsive grid of item cards (3 columns desktop, 2 tablet, 1–2 mobile). Each card: image (real photography where available, otherwise an elegant abstract gold-on-charcoal placeholder pattern — never a generic broken-image icon), item name in uppercase tracked sans, price in gold tabular numerals aligned right or below the name.

Why: This is the functional core of the site (the actual menu) — it must feel curated like a boutique catalogue, not a spreadsheet dump.

Layout: Card image has a fixed aspect ratio (4:5 portrait, cocktail-shot style) with rounded corners (6–8px) and a very subtle 1px warm-toned border. Card background matches the espresso-brown surface tone, slightly lighter than the page background so cards visually lift off the page.

Animation: Cards fade-up with a slight stagger (40–60ms per card) as each grid scrolls into view; on hover (desktop), image scales to 1.05 within its frame (overflow hidden) and a thin gold border appears around the card, transition 250ms ease.

Mobile: Grid collapses to 1 column for high-price/premium categories (Spirit/Tequila/Liquor, Champagne & Wine) so each item gets full attention, and 2-column for lower-ticket categories (Soft Drinks, Beers) to keep scrolling efficient.

F) Signature Experiences strip (Shisha / Photo Shoot spotlight)

What: A visually distinct, full-bleed section (could use the burgundy accent background) highlighting the Shisha lounge and Photo Shoot service as experiences, not just menu line items — larger photography, a short evocative description, and a "Book This Experience" CTA.

Why: These are differentiators beyond a standard bar menu and deserve to be sold as experiences, which also justifies their price points.

Layout: Two side-by-side feature cards (Shisha / Photo Shoot), each with a background image, gradient overlay, and centered text.

Mobile: Stacked vertically, full-width each.

G) Location, Hours & Reservation

What: A two-column section — left: address (Asaba, Delta, Nigeria), embedded map (styled with a dark map theme to match the palette), opening hours; right: a minimal reservation/contact form (Name, Phone, Date, Party Size, Notes) with the primary gold CTA button.

Why: Converts browsing into an actual booking — currently entirely absent from the site.

Animation: Form fields have a subtle gold focus-ring (2px, low opacity) on focus instead of a harsh browser-default blue outline.

Mobile: Stacked, map above form, both full-width.

H) Footer

What: Charcoal-black background, four-column layout on desktop (Brand/crown mark + short tagline; Quick Links to each menu category; Contact info — address, phone, email, social icons in thin gold line-art style; Hours). A hairline gold-toned divider above a bottom bar with copyright and a small "Menu prices subject to change" note.

Why: Reinforces brand consistency at the close of the page and provides a final utility layer.

Layout: 4 columns desktop, 2x2 grid tablet, single stacked column mobile with an accordion-style collapse for link groups to save space.

Animation: None beyond standard hover underline on links — footer should feel calm/settled, not attention-grabbing.

=== 10. SECTION SPACING ===

Generous vertical rhythm: 96–120px top/bottom padding between major sections on desktop, 56–72px on mobile. Within menu category sections, 48px between the category title and the item grid, 24–32px gutter between cards. Never let sections feel cramped — premium hospitality brands rely on whitespace as a luxury signal.

=== 11. CARDS / COMPONENTS ===

Consistent card system across menu items, feature/experience cards, and any info cards: rounded corners 6–8px, 1px hairline border in a warm low-opacity tone, subtle inner shadow or gradient at the image-to-content seam, consistent internal padding (16–20px). All cards share the same shadow depth on hover for consistency.

=== 12. BACKGROUND TREATMENTS ===

Primarily flat warm-charcoal backgrounds; introduce subtle texture only via a very faint noise/grain overlay (2–4% opacity) across dark sections to avoid a flat, digital, "default AI gradient" look. Avoid bright gradients, glassmorphism, or neon glows — this brand should feel physical and tactile, not tech-startup.

=== 13. IMAGE TREATMENT ===

All photography slightly warmed in color grade (amber/gold cast), consistent moderate contrast, subtle vignette on hero/feature images. Menu item photography cropped consistently to the same aspect ratio per category for visual order. Where real photos are unavailable, use an elegant generated placeholder: a deep gradient with a thin gold crown or glass-outline motif centered, rather than a broken-image icon or generic gray box.

=== 14. ANIMATIONS ===

Keep all motion subtle and slow (200–400ms for UI transitions, 600–900ms for scroll-reveals) — nothing bouncy or playful; this is a premium brand, so easing should be smooth (ease-out for entrances, ease-in-out for hovers). Use fade-up + slight scale for scroll-triggered reveals throughout.

=== 15. SCROLL INTERACTIONS ===

Smooth-scroll behavior when clicking any nav/category link (matching the original site's anchor-jump pattern, but animated rather than instant). Header background transitions from transparent to solid on scroll past hero. Menu sub-nav becomes sticky once it reaches the top of the viewport, with the active category auto-highlighting based on scroll position (scrollspy behavior).

=== 16. SECTION-TO-SECTION TRANSITIONS ===

Alternate background tones deliberately (charcoal → cream story section → charcoal menu → burgundy experience strip → charcoal footer) so the page has visual rhythm rather than one flat monotone scroll. Use thin gold hairline rules or generous padding as the separator — avoid heavy hard-edged dividers or drop shadows between sections.

=== 17. RESPONSIVE / MOBILE BEHAVIOR ===

Mobile-first considerations: sticky header collapses to logo + hamburger; category sub-nav becomes horizontally scrollable chips; menu grids reduce to 1–2 columns depending on category price tier; hero text left-aligns and buttons stack full-width; forms and footer stack to single column with generous tap targets (min 44px height). Touch interactions replace hover states with tap-triggered subtle scale feedback.

=== 18. HOVER STATES ===

Nav links: gold underline animates in from center or left. Buttons: as described in CTA section. Menu cards: image scale + border glow. Footer links: underline fade-in. All hover states must have a visible (non-hover) mobile equivalent via tap/active states.

=== 19. MICRO-INTERACTIONS ===

Category chip selection has a smooth sliding gold background indicator (like a tab underline that slides between positions, not an instant jump). Reservation form submit button shows a brief loading state (subtle spinner or pulsing dot) before a success confirmation message replaces the form. Floating "Reserve/Order" button (optional, bottom-right on mobile) with a single gentle pulse on first load only.

=== 20. FOOTER ===

(Detailed above in section G) — charcoal background, gold hairline accents, four-column desktop / stacked mobile, crown wordmark repeated small at the very bottom center as a closing brand moment.

=== 21. ACCESSIBILITY CONSIDERATIONS ===

Maintain WCAG AA contrast minimums even within the dark, moody palette (verify gold-on-charcoal and cream-text-on-charcoal combinations meet 4.5:1 for body text, 3:1 for large text). All interactive elements need visible focus states (gold focus ring, not removed). All images require descriptive alt text (e.g., "Margarita cocktail with lime garnish, Kings Lounge Asaba"). Ensure tap targets are at least 44x44px on mobile. Category navigation must be operable via keyboard (tab order, enter to activate, visible focus indicator matching the gold underline treatment).

=== 22. OVERALL VISUAL HIERARCHY ===

Priority order top to bottom: 1) Brand + emotional hook (hero), 2) Trust/context (story strip), 3) Core transactional content (menu, well-organized and filterable), 4) Differentiation (shisha/photo shoot experiences), 5) Conversion (reservation/location), 6) Utility/reinforcement (footer). Typography scale, color accent usage, and animation intensity should all step down slightly as the page progresses from hero to footer — the loudest, most premium visual moment is the hero, and everything after supports rather than competes with it.

Build this as a fully responsive single-page site (with anchor-based section navigation) using the exact category and item/price data structure from the source content (Kings Lounge, Asaba, Delta, Nigeria — categories: Bar, Beers Ciders & Bitters, Champagne & Wine, Cocktails Mocktails & Smoothies, Kitchen, Photo Shoot, Shisha, Shisha & Other Service, Shots, Soft Drinks & Juice, Spirit Tequila & Liquor, each with their respective items and Naira pricing), styled entirely according to the design system above.
## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
