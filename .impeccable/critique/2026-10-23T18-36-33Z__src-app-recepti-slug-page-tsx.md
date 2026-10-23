---
target: "public blog: professional look and best practices"
total_score: 25
max_score: 36
na_heuristics: 10
p0_count: 0
p1_count: 3
target_identity: "file:C:\\Users\\ipene\\Desktop\\Cooking-Blog-New-\\src\\app\\recepti\\[slug]\\page.tsx"
target_fingerprint: "sha256:d7e7f3092cb0b8f51a44da65a445ae4326ae4b20e2c9f4e1bf8498f51b948a4b"
target_path: "C:\\Users\\ipene\\Desktop\\Cooking-Blog-New-\\src\\app\\recepti\\[slug]\\page.tsx"
timestamp: 2026-10-23T18-36-33Z
slug: src-app-recepti-slug-page-tsx
---
Method: dual-agent (A: design review + best-practice research · B: detector + browser evidence)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Mobile Съставки/Приготвяне bar scrolls away, so "where am I" is lost mid-recipe |
| 2 | Match System / Real World | 3 | Natural Bulgarian and cookable units; printout has no dish name |
| 3 | User Control and Freedom | 3 | Good exits; getting back to ingredients on a phone is a long scroll |
| 4 | Consistency and Standards | 2 | About page breaks the system (uppercase eyebrow, icon-tile grid, tilted photo); 36px timer chips; DESIGN.md out of date |
| 5 | Error Prevention | 3 | Comment counter and late validation are good |
| 6 | Recognition Rather Than Recall | 2 | Desktop sticky ingredients panel clips long lists with no cue |
| 7 | Flexibility and Efficiency | 3 | "/" search, Cook Mode, scaler, timers |
| 8 | Aesthetic and Minimalist Design | 3 | Calm and photo-led; recipe tail stacks six asks; home hero half empty on desktop |
| 9 | Error Recovery | 3 | Good 404 copy; unknown recipe slugs return HTTP 200 (soft 404) |
| 10 | Help and Documentation | n/a | A recipe blog needs little help |
| **Total** | | **25/36** | **Acceptable (69%), on the edge of Good** |

## Design Specificity Verdict

Authored, not interchangeable: Иво's real photos, category food colours, the steaming-pot logo, the doodle footer, Bulgarian kitchen copy and real kitchen tooling (scaler, persistent ticks, step timers, Cook Mode). Type discipline holds: exactly four sizes ship (14/17/24/40-60px), two families (Onest body, Lora headings), dark mode is designed, CLS 0, no overflow, one h1 per page.

What reads as less professional is missing editorial basics and a few template pieces: no byline, no dates, no face on recipe pages; the About page uses a generic SaaS "icon tile + heading + blurb" grid with an uppercase eyebrow; and two functional bugs (print, sticky bar).

Deterministic scan: 3 CLI findings. 2 × design-system-font (Lora in OG images) are DESIGN.md drift, not code bugs; 1 × design-system-color (black photo scrim in OG image) is a false positive. Browser overlay: image-hover-transform ×7 on home category tiles (real; craft-floor ban), icon-tile-stack ×4 on /za-ivo (real, agrees with review), gray-on-color on butter bands (7.23:1, passes AAA; style flag only), cream-palette (warm off-white ground, intentional), text-occlusion on /recepti (false positive: chip inside a closed details panel).

## Overall Impression

The recipe page core is genuinely kitchen-grade and the system is disciplined. What separates it from a professional food site is trust and finish: readers can't see who cooked it or when, the printout loses the title, the phone's section bar doesn't stay put, and the About page looks like a landing-page template.

## What's Working

- Kitchen-grade recipe core: quantity-first 56px rows, persistent ticks, cookable scaling, per-step timers, Cook Mode with wake lock.
- Visible authenticity: real photos everywhere, honest empty states, aggregateRating omitted until real ratings exist.
- System discipline: four type sizes, tokenised category tints, designed dark mode, complete Recipe + Breadcrumb + WebSite JSON-LD, branded OG images.

## Priority Issues

1. [P1] Printing a recipe drops its title, facts and source. `globals.css:466` hides every `header` in print, including the recipe's own header with the h1 and facts. Fix: hide only the site header/footer; add a print-only line with blog name and recipe URL.
2. [P1] The mobile Съставки | Приготвяне bar is not sticky. `recepti/[slug]/page.tsx:271` wraps the sticky nav in a div of its own height, so sticky has no room. Fix: drop the wrapper so the nav's containing block spans the recipe body.
3. [P1] No trust signals on recipe pages. No author byline, no avatar, no published/updated date; "Сготвено и снимано в моята кухня." has no owner. JSON-LD lacks dateModified. Fix: byline row (small portrait, "Иво" linked to /za-ivo, `<time>` published/updated), dateModified + author url in JSON-LD. Real data only.
4. [P2] Inconsistencies that read as template. About page: uppercase eyebrow, 4 identical icon tiles, rotated polaroid; home category tiles zoom photos on hover (`page.tsx:91`); timer chips 36px with neutral shadow. Fix: remove eyebrow, turn tiles into first-person prose beside an upright portrait, remove hover zoom, timers to 44px with shadow-card; update DESIGN.md to Lora + white cards.
5. [P2] Desktop sticky ingredients panel clips long lists (`md:max-h-[calc(100vh-7rem)] overflow-y-auto`), with no cue. Fix: only stick when it fits, or add a fade + scroll cue.
6. [P2] Home hero typesetting. One-letter prepositions dangle at line ends ("в / моята кухня"); generic subhead; mobile first viewport is all text. Fix: non-breaking space after single-letter words site-wide; one sharper line in Иво's voice.

## Persona Red Flags

- Casey (one hand, mobile): section bar disappears; timer chips 36px; print/share/like ~2200px down.
- Jordan (first visit from Google): no byline or date; printout has no title; desktop 16:5 crop turns the dish into texture.
- Sam (screen reader/keyboard): good skip link, lang, outline; /za-ivo h3 follows value h2s (mis-nesting); search h2 "Резултати" repeats h1.
- Мария (stove at night, floury hands): long scrolls back to ingredients; timers hard to hit; "Готви стъпка по стъпка" ~1500px down on mobile.

## Minor Observations

- Recipe tail asks for six things in a row (rate, like, print, share, comment, subscribe).
- Ingredient rows without a quantity leave an empty quantity column.
- Non-interactive tag pills look like buttons.
- Single search result leaves a large void; add category chips under sparse results.
- Unknown recipe slugs return 200 with noindex; a real 404 status is better.
- Canonical/JSON-LD fall back to localhost:3000 when NEXT_PUBLIC_SITE_URL is unset; confirm it is set in Vercel.
- On /recepti/musaka the LCP element is the description, not the hero photo.
- PRODUCT.md and DESIGN.md are stale (portrait exists, 27 recipes, Lora headings).

## Questions to Consider

- If the moat is "one cook, his own kitchen", why does Иво's face live only on a page most readers never open?
- Does a 27-recipe blog need every ask at the end of a recipe, or would fewer, better-placed actions read as more professional?
- What would the recipe page look like if print and share sat right under the facts, where the cook decides to make it?
