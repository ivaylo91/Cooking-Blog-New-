---
target: www.cookingblogofivo.com (public site)
total_score: 18
max_score: 40
na_heuristics: 
p0_count: 2
p1_count: 2
target_identity: "url:https://www.cookingblogofivo.com/"
timestamp: 2026-10-07T20-03-43Z
slug: www-cookingblogofivo-com
---
Method: dual-agent (A: design review · B: detector + browser evidence)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | /recepti never states its size unless filtered; "Най-високо оценени" advertised but never renders |
| 2 | Match System / Real World | 2 | Scaling 6->8 portions yields `1,33 бр лук`, `1333,33 г картофи` |
| 3 | User Control and Freedom | 2 | Cook Mode has no Escape; checked ingredients and scaled servings vanish on navigation |
| 4 | Consistency and Standards | 2 | "Всички" chip on Категория only; lucide hairlines beside FontAwesome solids in one row |
| 5 | Error Prevention | 2 | Servings stepper unbounded; one mis-tap on a 24x28 star is an irreversible write |
| 6 | Recognition Rather Than Recall | 2 | Cook Mode shows steps but no quantities, and no timers |
| 7 | Flexibility and Efficiency | 1 | No sort; no keyboard control in Cook Mode; likes are not personal bookmarks |
| 8 | Aesthetic and Minimalist Design | 1 | Decorative doodles render behind body text sitewide at 0.4 opacity |
| 9 | Error Recovery | 3 | Error boundary, 404 and newsletter states good; search empty state is one grey line |
| 10 | Help and Documentation | 1 | /za-ivo reprints the footer tagline verbatim; nothing explains Cook Mode or "трудност" |
| **Total** | | **18/40** | **Poor — major UX work needed, on mobile especially** |

## Design Specificity Verdict

A competent recipe site wearing a Bulgarian costume. Personality is applied as wallpaper, not content.

/za-ivo is the proof: on a blog named after a person, the About page reprints the footer tagline verbatim — no photo, no story, no Иво. Strip the doodle SVG, --accent and Playfair and nothing remains that is about Bulgarian home cooking specifically. Category chips sort alphabetically (a database default, not a cook's ordering). Консерви and Постни sit at the same weight as everything else.

Two authored moments prove it was possible: the 404 line "Тази страница липсва от менюто" and Cook Mode's wake lock.

Deterministic scan: source scan 0 findings, exit 0 (validated against a canary, so not a silent no-op; JSX rule coverage is narrow). Browser-rendered scan 31 desktop / 30 mobile: image-hover-transform x22 (inflated — one group-hover:scale-105 in RecipeCard counted per rendered card), overused-font x3, skipped-heading x2 (real: h1 -> h3 with no h2), layout-transition x2 (near-false-positive; width is the semantic property for a progress bar), hero-eyebrow-chip, em-dash-overuse.

Overlays: script injection verified working, but no persistent user-visible overlay was left; evidence was gathered headlessly. 33 screenshots in the scratchpad.

Correction to an earlier claim in this project: axe reported 0 violations, but it also returned a large `incomplete` set it could NOT evaluate (26 home / 38 recepti / 49 musaka nodes), every one reading "background color could not be determined because element contains an image node" — the doodle layer. Independent manual compositing found one genuine failure (a decorative "/" separator at 1.21:1). The palette work holds, but "zero violations" was less complete than implied, and the wallpaper is the reason.

## Overall Impression

Engineering judgment consistently exceeds design judgment, and the gap is the story. Cook Mode's wake lock re-acquires on visibilitychange — someone pictured a floury phone on a counter. The same recipe page renders cooking steps at 14px under a decorative citrus wheel, with 14x14 checkboxes.

Biggest opportunity: the product already knows what it should be — Cook Mode — and hides it behind a click almost nobody makes. The default recipe page should inherit Cook Mode's posture.

## What's Working

- Ingredient line typography: bold quantity / regular item / muted prep note, strike-through on check. Three information levels in one line, correctly ranked for scanning in a supermarket aisle.
- Cook Mode wake lock with a visibilitychange re-acquire (the part most implementations forget), wrapped in a silent try/catch. A product decision, not a feature.
- SubscribeForm: honeypot, sr-only label, autocomplete, a reserved min-h-5 aria-live region so the response does not shift layout, distinct copy per failure mode. The quality bar for the rest of the site.

## Priority Issues

### [P0] Decorative doodles render behind recipe body text
CookingBackground is mounted globally in layout.tsx:92 at default variant="fixed" (fixed inset-0 -z-10), doodles at opacity 0.4. Cards and the newsletter box have bg-surface and are protected; the recipe text column has no surface and is not. On mobile a leaf sits on top of "400 г кисело мляко" and a citrus wheel crosses steps 1 and 3. Fixed positioning means the pattern holds still while text scrolls over it. In dark mode the doodles gain relative contrast — worse at night, which is when people cook. Also the reason axe could not evaluate contrast on 49 nodes.

Fix: drop the global mount, keep it in the hero and footer only. Give the recipe text column the rounded-2xl border bg-surface treatment the newsletter box already uses. If it must sit behind text anywhere, opacity ~0.12 and absolute, not fixed.
Command: /impeccable quieter

### [P0] The servings scaler produces non-cookable quantities
formatAmount is Math.round(amount*100)/100 with no unit awareness (RecipeIngredients.tsx:7). Reproduced: 6->8 portions gives 1333,33 г картофи, 933,33 г кайма, 1,33 бр лук, 2,67 бр домати. The stepper has no upper bound.

Fix: unit-aware rounding. бр -> nearest 0.5, floor 1. г/мл -> nearest 5 under 100, nearest 10 under 1000, switch to кг/л at >=1000. с.л./ч.л. -> nearest 0.5 rendered as fractions. Cap the stepper at 2x base servings.
Command: /impeccable harden

### [P1] Every primary control on the mobile recipe page is under the touch minimum
Measured at 390px: rating stars 24x28 and only 2.0px apart (the densest tap cluster on the site), servings stepper 28x28, ingredient checkboxes 14x14 (the label is 342 wide but still only 20px tall), share icons 32x32, filter chips 34px, hamburger 36x36. 32 undersized targets on the recipe page alone.

Fix: pad stars to 44x44 (p-2.5 around the 16px glyph — hit area grows, visual does not), stepper h-11 w-11, make the whole ingredient row min-h-11 with a 20px custom checkbox, share icons h-11 w-11, chips 44px.
Command: /impeccable adapt

### [P1] Cook Mode is keyboard-inaccessible and amnesiac
A bare fixed div: no role="dialog", no aria-modal. Focus verifiably stays on the trigger, so Tab walks into the page behind it. Escape unbound, arrows unbound, body scroll unlocked, setIndex(0) on every open. And it shows no quantities — at "залейте с каймата отгоре" you must recall 700 г or leave and lose your place.

Fix: role="dialog" aria-modal, focus the Напред button on open and restore on close, bind Escape and arrows, lock body scroll, persist the step index, and pin a collapsible ingredient strip showing the current step's quantities.
Command: /impeccable harden

### [P2] The visual order says sharing matters more than cooking
Seven equal-weight controls (like showing 0, Разпечатай, generic share, Facebook, Viber, WhatsApp, Копирай линк) sit in one undifferentiated row above the ingredients, while "Готви стъпка по стъпка" sits ~300px lower. Five grey stars announce "Още няма оценки" directly above them. The sticky aspect-[4/5] photo occupies ~690px — half the viewport for the whole scroll — for an image already seen on the card.

Fix: promote Cook Mode to a filled primary button under the description. Collapse print and all four share targets into one Сподели menu. Either rewrite the empty rating state as an invitation or hide the stars until a recipe has one rating.
Command: /impeccable layout

## Persona Red Flags

Sam (keyboard / screen reader): Cook Mode announces nothing and cannot be escaped without a pointer. The 14 filter chips are bare anchors with span group labels — no fieldset/legend, so tab order never announces "Категория" or "Време"; aria-current="true" should be "page". h1 -> h3 on /recepti leaves no landmark for the results region. Ingredient checkboxes have an invisible focus ring in dark mode (1.07:1), caused by scoping the globals.css:92 focus-visible rule to a/button/[tabindex] when the doubled outline was removed — text inputs kept their own focus treatment, checkboxes never got a replacement. Skip link and main tabIndex={-1} are correct.

Casey (one-handed, mobile): 36% of the first /recepti screen is filter chrome; the first recipe title lands at the bottom edge of the fold. Doodles draw through "Салати", "Супи" and "Трудно". On the homepage "Всички рецепти ->" abuts its heading with a measured 0px gutter, reading as its third line. Checked ingredients live in React state only — one app switch and the mise-en-place is gone, with no warning it was never saved.

Riley (stress tester): two taps on + gives 1,33 бр лук. Cook Mode at step 4, closed to check a quantity, reopens at step 1 every time. /tarsene with no query renders a heading and an empty grid with no search box on the page. /tarsene?q=супа is one card in ~88% wallpaper with no count or refine field. The homepage "Най-високо оценени" section silently does not exist — rating_count is 0 for all 24 recipes.

## Minor Observations

- Two icon families in one 20px row (lucide hairlines beside FontAwesome solids); the FontAwesome React runtime for two glyphs is heavy for a blog.
- Card descriptions clamp mid-word ("перфектно з...", "пилешко...").
- A recipe contradicts itself: meta reads "ГОТВЕНЕ: 60 МИН", step 5 reads "Печете 45 минути".
- Tags look like the clickable category chips and do nothing.
- No human breadcrumb; the category label above the title is a dead paragraph, so "show me more main dishes" is a dead end.
- ReadingProgressBar measures through related recipes, newsletter and comments, so it reads ~60% at the last cooking step.
- Cook Mode on a 1280x900 desktop is ~600px of void around one sentence.
- The dark palette is genuinely well-tuned; the doodle problem is not a palette problem.
- overused-font flags Geist, but Cyrillic coverage genuinely constrains the choice. Fonts verified loaded, no tofu.
- Zero horizontal overflow across all 20 page-loads; every img has dimensions or a sized container.
- Canonical/og:url bug: /tarsene canonicalises to the homepage rather than its own route; og:url is the homepage on /recepti and /za-ivo and absent entirely on recipe pages.

## Questions to Consider

1. Delete the doodles and change the terracotta to any other warm hue — name one thing left that says Иво rather than "a recipe site".
2. A wake lock that re-acquires after the screen sleeps, and a Cook Mode that cannot say how much кайма. Who did you picture holding that phone?
3. Every recipe shows five grey stars and a heart reading 0. Is the page better with the feature or without it?
4. Three filter rows for 24 recipes. At what corpus size does filtering beat scrolling, and are you near it?
5. The 404 line is the best sentence on the site. Why is it the only one?
