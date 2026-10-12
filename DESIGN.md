---
name: Кулинарният блог на Иво
description: Bulgarian home recipes as a modern food-magazine app. The photograph leads, Onest names the dish, white space does the rest.
colors:
  tomato: "#c2410c"
  tomato-deep: "#9a3412"
  tomato-wash: "#fff1ea"
  on-tomato: "#ffffff"
  ink: "#111111"
  paper: "#ffffff"
  surface: "#ffffff"
  counter-tint: "#f5f5f4"
  slate-grey: "#5f6368"
  hairline: "rgba(17, 17, 17, 0.1)"
  rule: "#e7e5e4"
  herb-green: "#15803d"
  herb-wash: "#ecfdf3"
  error-red: "#b91c1c"
  error-red-deep: "#991b1b"
  error-wash: "#fef2f2"
  error-border: "#fecaca"
  tomato-evening: "#ff7a45"
  tomato-deep-evening: "#ff9a6e"
  tomato-wash-evening: "rgba(255, 122, 69, 0.14)"
  on-tomato-evening: "#121212"
  ink-evening: "#f4f1ec"
  paper-evening: "#121212"
  surface-evening: "#1c1c1c"
  counter-tint-evening: "#1f1f1f"
  slate-grey-evening: "#a3a3a3"
  hairline-evening: "rgba(244, 241, 236, 0.12)"
  rule-evening: "#2c2c2c"
  herb-green-evening: "#4ade80"
  error-red-evening: "#f87171"
typography:
  display:
    fontFamily: "Onest, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 1.9rem + 2.6vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  heading:
    fontFamily: "Onest, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Onest, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  small:
    fontFamily: "Onest, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "normal"
rounded:
  check: "6px"
  inner: "12px"
  frame: "16px"
  panel: "24px"
  pill: "999px"
spacing:
  gutter-mobile: "16px"
  gutter: "24px"
  card-pad: "16px"
  panel-pad: "24px"
  panel-pad-wide: "40px"
  grid-gap-x: "24px"
  grid-gap-y: "40px"
  section: "64px"
  section-wide: "80px"
  target: "44px"
components:
  button-primary:
    backgroundColor: "{colors.tomato}"
    textColor: "{colors.on-tomato}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0 28px"
    height: "56px"
  button-primary-hover:
    backgroundColor: "{colors.tomato-deep}"
    textColor: "{colors.on-tomato}"
  button-secondary:
    backgroundColor: "{colors.counter-tint}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0 28px"
    height: "56px"
  button-secondary-hover:
    backgroundColor: "{colors.hairline}"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "0 28px"
    height: "56px"
  button-icon:
    backgroundColor: "{colors.counter-tint}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    size: "44px"
  chip:
    backgroundColor: "{colors.counter-tint}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "44px"
  chip-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "44px"
  input-search:
    backgroundColor: "{colors.counter-tint}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0 16px 0 40px"
    height: "44px"
  input-field:
    backgroundColor: "{colors.counter-tint}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.inner}"
    padding: "0 16px"
    height: "48px"
  card-recipe:
    backgroundColor: "{colors.counter-tint}"
    textColor: "{colors.ink}"
    rounded: "{rounded.frame}"
    padding: "16px"
  card-feature:
    backgroundColor: "{colors.counter-tint}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "40px"
  panel:
    backgroundColor: "{colors.counter-tint}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "24px"
  step-number:
    backgroundColor: "{colors.counter-tint}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    size: "44px"
  step-number-done:
    backgroundColor: "{colors.tomato}"
    textColor: "{colors.on-tomato}"
    rounded: "{rounded.pill}"
    size: "44px"
  resume-banner:
    backgroundColor: "{colors.tomato-wash}"
    textColor: "{colors.tomato}"
    rounded: "{rounded.frame}"
    padding: "8px 8px 8px 20px"
---

# Design System: Кулинарният блог на Иво

## Overview

**Creative North Star: "Списание: the modern food-magazine app"**

The blog reads like a contemporary food-magazine app on a phone. The food photograph leads every surface and carries all of the colour; the interface is white ground, near-black ink and one grey, and gets out of the photo's way. A single confident grotesk (Onest, drawn Cyrillic-first) names each dish in bold, sentence case, with tight display leading. Calm white space, not ornament, separates one thing from the next.

Density is low and tap-first. The reader is a home cook at the counter, often at night, with wet or floury hands, so every control is a 44px pill or circle, quantities lead their rows, and state (ticked ingredients, finished steps, the step to resume from) is shown in the one accent colour. Dark mode is designed, not inverted: an "evening kitchen" with a #121212 ground, warm off-white ink, a brighter tomato, and photographs left untouched.

The world replaced the "Бакалия" grocery-label system, which was rejected as retro packaging. Retro, vintage-packaging and pastiche treatments are out. The only illustrative device is the pinned doodle pattern, printed as a fine grey line band in the footer.

**Key Characteristics:**
- Photo first, at one fixed 4:3 ratio on every card, in 16px rounded frames.
- Onest throughout; exactly four type sizes; rank from weight and colour.
- One tomato accent, reserved for the primary action and active or selected states.
- Borderless cards on a faint #f5f5f4 counter tint; pills (999px) for every chip and button.
- Doodle pattern as a footer band only, never under text.
- Designed evening-kitchen dark mode; 44px minimum touch targets.

## Colors

A white-and-ink interface with one tomato accent; the food photograph supplies everything else.

### Primary
- **Tomato** (`tomato`): the filled primary action ("Готви стъпка по стъпка", "Запиши ме", "Към рецептите", "Към началото"), finished-step circles, checked ingredient boxes, Cook Mode progress segments, filled rating stars, the reading-progress bar, the focus ring, text selection and the input caret. Also colours the one navigational text link per block (category back link, a section's "Всички" link, "Изчисти", "Махни отметките", "Започни отначало"). 5.2:1 against white both as fill and as text.
- **Deep Tomato** (`tomato-deep`): hover fill for primary buttons only.
- **Tomato Wash** (`tomato-wash`): soft active backgrounds: the "Продължете оттук" marker, the home resume banner, a liked heart, and the ingredients used by the current Cook Mode step.

### Secondary
- **Herb Green** (`herb-green`, wash `herb-wash`): success messages only (rating saved, comment published, subscribed). Never decorative.

### Neutral
- **Ink** (`ink`): all text and headings; also the fill of selected chips, the current page number and the Cook Mode ingredients toggle when open.
- **Paper** (`paper`, `surface`): the page ground and pop-over menus.
- **Counter Tint** (`counter-tint`): every card, panel, chip, input and icon button sits on it. It replaces borders as the way a surface is separated from the page.
- **Slate Grey** (`slate-grey`): secondary text: descriptions, meta lines, fact labels, placeholders, counts.
- **Hairline** (`hairline`): the header's bottom rule, ingredient and step row dividers, the "Време и трудност" summary outline, and the hover fill of tint-coloured controls.
- **Rule** (`rule`): reserved neutral rule colour.
- **Error Red** (`error-red`, `error-red-deep`, `error-wash`, `error-border`): failure messages and destructive admin actions.

### The evening kitchen
Dark mode (system preference, or `data-theme="dark"` from the toggle) swaps each token for its `-evening` sibling: ground `paper-evening`, cards `counter-tint-evening`, ink `ink-evening`, grey `slate-grey-evening`, accent `tomato-evening` with `on-tomato-evening` text on it. Photographs receive no filter or dimming.

### Named Rules
**The One Voice Rule.** Tomato marks the primary action, a selected or active state, or the single navigational text link of a block. It never decorates, never fills a section background, never colours a category.

**The Photo Carries Colour Rule.** The interface stays white, ink and grey so the dish is the only saturated thing on screen.

## Typography

**Display Font:** Onest (with ui-sans-serif, system-ui, sans-serif)
**Body Font:** Onest
**Label/Mono Font:** ui-monospace only for error digest codes.

**Character:** One contemporary grotesk, Cyrillic-first, so Bulgarian sets as naturally as Latin. Weights do the ranking: 700 for names and headings, 600 for buttons, quantities and labels, 500 for links and chips, 400 for reading.

### Hierarchy
- **Display** (700, `clamp(2.5rem, 1.9rem + 2.6vw, 3.75rem)`, 1.05): page titles, the recipe name, the home feature card's dish name, and the current step's text in Cook Mode (weight 500 there).
- **Heading** (700, 1.5rem, 1.25): section titles, card titles, fact numerals, panel titles, mobile menu links, Cook Mode ingredient rows.
- **Body** (400, 1.0625rem / 17px, 1.6): all reading text, buttons, inputs. Method steps cap at 65ch.
- **Small** (400, 0.875rem, 1.45): meta lines ("Супи · 45 мин · 6 порции"), fact labels, group labels, tags, dates, copyright.

h1–h3 carry `letter-spacing: -0.02em` and `text-wrap: balance`. Numbers use tabular figures wherever they line up (quantities, minutes, counts, page numbers).

### Named Rules
**The Four Sizes Rule.** There are exactly four sizes, as the tokens `--text-display`, `--text-heading`, `--text-body`, `--text-small`. A new level of emphasis is made with weight or colour, never a fifth size.

**The Sentence Case Rule.** Every label, button and heading is sentence case. No uppercase, no letter-spaced caps.

## Layout

A single centred container, max 72rem (`max-w-6xl`), with a 16px gutter on phones and 24px from 640px. Header is a 64px sticky bar with a translucent blur. Sections are separated by white space: 56–64px between home sections, 80px before the subscribe panel and comments. Card grids are 1 / 2 / 3 columns at <640 / 640 / 1024px, with 24px horizontal and 40px vertical gaps.

**Recipe page.** On a phone the photo bleeds edge to edge at 60svh; from 640px it becomes a rounded frame (4:3, then 21:9 at 768px, 16:5 at 1024px). Below it: back link to the category, display-size name, one line of description, and the facts row (servings, prep, cook) as heading-size numerals over small grey labels. From 1024px name and facts split into two columns. Below 768px a sticky "Съставки | Приготвяне" segmented bar sits under the header; from 768px ingredients become a sticky 22–25rem left column beside the method. The rating, like, print and share panel follows the method, after cooking.

**Home.** Display headline and one line, the resume banner when there is a dish in progress, a feature card (7/5 photo/text split from 768px), a sideways-scrolling category chip row in cook's order (main dishes, soups, salads, pastry, lenten, desserts, preserves; stocked categories only), then card grids.

Anchors offset by 7.5rem so they land below the sticky header and tab bar.

## Elevation & Depth

Flat by default. Depth comes from tonal layering: white page, #f5f5f4 surfaces, and in the evening kitchen #121212 / #1c1c1c / #1f1f1f. Cards and panels have no border and no shadow.

### Shadow Vocabulary
- **Segment lift** (`shadow-sm`, Tailwind default): the active half of the recipe segmented control.
- **Pop-over** (`shadow-lg`, Tailwind default): the share menu, the only floating surface, which also carries a hairline border.

The sticky header and tab bar use `background` at 90% with `backdrop-blur-md` instead of a shadow.

### Named Rules
**The Tint-Not-Line Rule.** A surface is separated from the page by the counter tint, not by a border or shadow. Hairlines appear only between rows of a list and under the header.

## Shapes

Soft, consistent geometry. Photographs and cards sit in 16px frames; large panels (feature card, subscribe, "Как се получи?", empty states) in 24px; every button, chip, input, icon button, step number and pagination item is a full pill or circle (999px). Inner rows (menu items, share menu items, comment fields, Cook Mode ingredient rows, skeletons) use 12px. Ingredient checkboxes are 24px squares at 6px. Photos inside a frame are `object-cover` with no inset or stroke.

## Components

### Buttons
Calm, round, thumb-sized.
- **Shape:** full pill (999px).
- **Primary:** tomato fill, white 600-weight body text, 56px tall with 28px side padding; 64px in Cook Mode's bottom bar. One per view.
- **Hover / Focus:** fill darkens to deep tomato over the default 150ms colour transition. Focus is a 2px tomato outline offset 2px on every link, button, summary and checkbox.
- **Secondary:** counter-tint pill, ink text, hover to hairline fill ("Всички рецепти" on the 404, "Назад" in Cook Mode).
- **Ink:** near-black pill with white text for the comment submit; hover drops opacity to 85%.
- **Icon:** 44px circles (print, theme toggle, menu, servings stepper) on tint or transparent with a tint hover.

### Chips
- **Style:** 44px pill, counter tint, ink 500-weight text, 16–20px side padding, no border.
- **State:** selected chips invert to ink fill with paper text. Category chips scroll sideways in one row on a phone rather than wrap. A tomato count badge (24px circle) appears on the "Време и трудност" disclosure when filters inside it are active. Recipe tags are a non-interactive small-text variant on the tint.

### Cards / Containers
- **Recipe card:** 16px corner, counter tint, no border, no shadow; 4:3 photo flush to the top; 16px text pad with a heading-size bold title and one small grey meta line joined by " · ". Hover underlines the title; the photo never moves.
- **Feature card:** 24px corner, photo bleeding to the card edge on the left 7/12, display-size name, description and meta on the right with 24–40px padding.
- **Panels:** 24px corner, tint, 24–40px padding, used for subscribe, rating, and empty states.

### Inputs / Fields
- **Style:** tint fill, no border; search and subscribe are pills (44px header search with a leading search icon, 56px page search and subscribe), comment fields are 12px rounded.
- **Focus:** 2px tomato ring; caret is tomato.
- **Error:** message in deep error red under the field; success in herb green.

### Navigation
Sticky 64px header: site name in bold body size on the left; "Рецепти", "За Иво" as 44px pill links with tint hover, a search pill and the theme toggle on the right from 768px. On a phone a 44px menu button opens a panel with heading-size links, search and theme toggle. Pagination is a row of 44px circles, current page in ink. The footer has a link row of pills and RSS.

### Ingredient list (signature)
Each row is a whole-row tap target at least 56px tall: a 24px rounded checkbox, the quantity in 600 weight tabular figures (min 4.75rem column), then the item in body text with any note in grey. Ticked rows strike the quantity and grey the text; ticks persist across reloads. Quantities print cookable fractions (½, ¼, ¾) and round by unit family (countables and spoons to halves, grams and millilitres to 5 or 10, switching to кг/л past 1000). The servings stepper is two 44px circles around a 600-weight count, capped at double the written recipe.

### Method steps (signature)
Each step is a 44px numbered circle beside body text (max 65ch). Tapping the circle marks it done: the circle fills tomato with a check and the text greys. The first unfinished step after a finished one gets a small tomato-wash "Продължете оттук" pill.

### Cook Mode (signature)
A full-screen modal on the paper ground: dish name and a 48px close circle, a row of 6px pill progress segments (tomato up to the current step), "Стъпка N от M" in grey, the step at display size, and a bottom bar of three 64px pills (ingredients toggle, Назад, tomato Напред/Готово). The ingredients sheet lists every quantity at heading size, washing the ones the current step uses in tomato wash. The screen is kept awake.

### Resume banner
On the home page only, in the browser that was cooking within the last week: a 16px-rounded tomato-wash strip, "Продължете: {dish} · стъпка N" in tomato, and a 44px dismiss circle.

### Doodle band
The pinned doodle pattern (whisk, herb sprig, steam, citrus, soup bowl, basil and tomatoes) in 2.2px single-weight `currentColor` line, slate grey at 45% opacity, scale 0.4, filling an 80px strip at the top of the footer. Nothing else sits on it.

### Admin (scoped exception)
`src/app/admin/**` and `src/components/admin/**` inherit the colour and font tokens only. They are not held to the four-size scale or these component patterns, and `--stamp`, `--kraft`, `--brand` remain defined in `globals.css` solely for them.

## Do's and Don'ts

### Do:
- **Do** let the photograph lead: 4:3 on every card, edge to edge at 60svh on the phone recipe page.
- **Do** use only the four type tokens (`text-display`, `text-heading`, `text-body`, `text-small`) and rank with weight and colour.
- **Do** keep tomato for the primary action, active or selected state, and one navigational text link per block.
- **Do** separate surfaces with the #f5f5f4 counter tint, not borders.
- **Do** use 16px for photo and card frames, 24px for panels, 999px for every chip and button.
- **Do** make every tap target at least 44px, and whole rows tappable where a wet hand needs them.
- **Do** design both themes; check every new surface in the evening kitchen.
- **Do** keep the doodle pattern as a fine grey line band in its own strip.
- **Do** honour reduced motion; transitions are colour and opacity only, about 150ms.

### Don't:
- **Don't** put eyebrow or kicker labels above headings.
- **Don't** build hero-metric stat boxes; the recipe facts row is plain numerals over labels, unboxed.
- **Don't** zoom, scale or pan images on hover.
- **Don't** return to retro, vintage-packaging or pastiche treatments: no condensed caps, colour-coded category lids, stamps, square label frames or kraft paper.
- **Don't** set text in uppercase or letter-spaced caps.
- **Don't** add a fifth type size.
- **Don't** colour categories, decorate with tomato, or fill section backgrounds with the accent.
- **Don't** place the doodle pattern behind any text.
- **Don't** filter or dim food photographs in dark mode.
