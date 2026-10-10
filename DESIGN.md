---
name: Кулинарният блог на Иво
description: A Bulgarian home-cooking blog printed like a pantry label — white stock, ink-black rules, colour only on category lids.
colors:
  label-stock: "#ffffff"
  ink: "#14161a"
  ink-muted: "#4a505a"
  surface-muted: "#f1f2f4"
  border-subtle: "rgba(20, 22, 26, 0.16)"
  brand-cobalt: "#1f3fbf"
  brand-cobalt-deep: "#172f91"
  accent: "#1f3fbf"
  accent-strong: "#172f91"
  accent-soft: "#e4e9fb"
  secondary: "#1b6e37"
  secondary-soft: "#e3f1e7"
  destructive: "#c8231b"
  destructive-strong: "#a01b14"
  destructive-soft: "#fdecea"
  destructive-border: "#f3b9b4"
  stamp-red: "#c8231b"
  kraft: "#c89b63"
  tin-background: "#0e1013"
  tin-surface: "#16191d"
  tin-surface-muted: "#1d2126"
  tin-ink: "#f1f2f4"
  tin-ink-muted: "#a6acb6"
  tin-border-subtle: "rgba(241, 242, 244, 0.16)"
  tin-accent: "#8ea2ff"
  tin-accent-strong: "#b4c1ff"
  tin-accent-soft: "rgba(142, 162, 255, 0.16)"
  tin-secondary: "#5fc27e"
  tin-destructive: "#ff6b63"
  tin-destructive-strong: "#ff9b95"
  lid-osnovni-yastia: "#c8231b"
  lid-supi: "#1f3fbf"
  lid-salati: "#1b6e37"
  lid-testeni: "#c89b63"
  lid-postni: "#55631a"
  lid-deserti: "#f5c400"
  lid-konservi: "#e8590c"
  lid-fallback: "#14161a"
  lid-ink-light: "#ffffff"
  lid-ink-dark: "#14161a"
typography:
  display:
    fontFamily: "Sofia Sans Extra Condensed, Sofia Sans, ui-sans-serif, sans-serif"
    fontSize: "clamp(3rem, 13vw, 6rem)"
    fontWeight: 900
    lineHeight: 0.86
    letterSpacing: "-0.005em"
  headline:
    fontFamily: "Sofia Sans Extra Condensed, Sofia Sans, ui-sans-serif, sans-serif"
    fontSize: "2.75rem"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "0.025em"
  title:
    fontFamily: "Sofia Sans Extra Condensed, Sofia Sans, ui-sans-serif, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "0.025em"
  numeral:
    fontFamily: "Sofia Sans Extra Condensed, Sofia Sans, ui-sans-serif, sans-serif"
    fontSize: "2.6rem"
    fontWeight: 900
    lineHeight: 1
    fontFeature: "\"tnum\" 1"
  quantity:
    fontFamily: "Sofia Sans Extra Condensed, Sofia Sans, ui-sans-serif, sans-serif"
    fontSize: "1.4rem"
    fontWeight: 800
    lineHeight: 1
    fontFeature: "\"tnum\" 1"
  body:
    fontFamily: "Sofia Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "\"lnum\" 1"
  body-step:
    fontFamily: "Sofia Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Sofia Sans Extra Condensed, Sofia Sans, ui-sans-serif, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.025em"
  label-lid:
    fontFamily: "Sofia Sans Extra Condensed, Sofia Sans, ui-sans-serif, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.12em"
rounded:
  none: "0px"
spacing:
  hairline: "1px"
  rule-panel: "2px"
  rule-heavy: "3px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  section: "64px"
  gutter-mobile: "16px"
  gutter-desktop: "24px"
  target: "44px"
  target-large: "56px"
  container: "72rem"
components:
  button-brand:
    backgroundColor: "{colors.brand-cobalt}"
    textColor: "{colors.label-stock}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "56px"
  button-brand-hover:
    backgroundColor: "{colors.brand-cobalt-deep}"
  button-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.label-stock}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "56px"
  button-accent-hover:
    backgroundColor: "{colors.accent-strong}"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.label-stock}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "56px"
  button-outline:
    backgroundColor: "{colors.label-stock}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 12px"
    height: "44px"
  button-outline-hover:
    backgroundColor: "{colors.surface-muted}"
  filter-tile:
    backgroundColor: "{colors.label-stock}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 12px"
    height: "44px"
  filter-tile-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.label-stock}"
  input-field:
    backgroundColor: "{colors.label-stock}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0 12px"
    height: "44px"
  recipe-card:
    backgroundColor: "{colors.label-stock}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "12px"
  lid-stripe:
    backgroundColor: "{colors.lid-supi}"
    textColor: "{colors.lid-ink-light}"
    typography: "{typography.label-lid}"
    padding: "0 12px"
    height: "32px"
  step-number:
    backgroundColor: "{colors.label-stock}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    size: "56px"
  step-number-done:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.label-stock}"
  tab-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.label-stock}"
    typography: "{typography.label}"
    height: "48px"
---

# Design System: Кулинарният блог на Иво

## Overview

**Creative North Star: "Бакалия: the pantry label"**

Every recipe is printed like a Bulgarian pantry staple. The front of the pack is a full-bleed field in the category's lid colour that names the dish in towering extra-condensed caps and prints its net-weight facts (portions, prep minutes, cook minutes) as huge tabular numerals, sealed with a round red ink stamp. The back of the pack is plain white label stock carrying the method: a ruled ingredient panel and numbered steps, set in a colourless reading column.

The world is flat, square and ruled. Structure comes from ink: heavy 3px rules under headers and section heads, 2px panel boxes around cards, buttons and fields, hairline dividers between rows. Corners are die-cut square everywhere on the public site. Colour is wayfinding, not decoration: it arrives only as category lid fields and stripes, the cobalt blog lid, the kraft footer and the red stamp. Density is generous for a phone propped on a counter: 17px body, 44px minimum targets, 56px primary controls.

The dark theme is "the same label printed on a dark tin": the ground goes near-black and ink goes light, while lid fields, kraft, the stamp and the brand cobalt keep their exact printed values in both themes. It explicitly refuses the cooking-blog category default of cream ground, serif display, terracotta accent and a rounded photo-card grid.

**Key Characteristics:**
- White label stock and ink-black print; heavy 3px rules and 2px panel boxes.
- Square corners (0px) on every public element; no pills.
- Colour only on full-bleed category lid fields and lid stripes, never in the reading column.
- Sofia Sans Extra Condensed caps for names, labels and numerals; Sofia Sans for reading.
- Tabular numerals and true fractions (½, ¼, ¾) for every quantity.
- One authored motion: the stamp pressed onto the label once.
- The doodle pattern printed in one ink as a band, never under text.

## Colors

A monochrome ink-on-white label with a fixed set of printed lid colours that mean category, plus one blog-owned cobalt.

### Primary
- **Kiselo Mlyako Cobalt** (brand-cobalt): the blog's own lid. Fills the header wordmark panel, the home and About hero fields, and the Cook Mode primary buttons ("Готви стъпка по стъпка", "Напред", "Готово"). Identical in both themes, always with white text; hover deepens to brand-cobalt-deep.
- **Accent** (accent / tin-accent): the interactive colour. Focus outlines, text selection, caret, the reading-progress bar, input focus borders, and the filled accent buttons (newsletter submit, 404 and error actions). In light it equals brand cobalt; in dark it lifts to tin-accent with dark text so it passes contrast as text and outline on the tin ground.

### Secondary
- **Field Green** (secondary / tin-secondary): success messages only ("Благодарим за оценката!", subscription and comment confirmations).

### Tertiary
- **Stamp Red** (stamp-red): the quality stamp's ink and the "Продължете оттук" resume tab on the method; the error page's top rule. Constant across themes.
- **Destructive** family (destructive, destructive-strong, destructive-soft, destructive-border): error text uses destructive-strong; the soft/border pair is used by the admin.

### Neutral
- **Label Stock** (label-stock / tin-background, tin-surface): page and panel ground.
- **Print Ink** (ink / tin-ink): all text, all rules (`--rule` equals ink), selected tiles, filled step numbers, the ink button.
- **Faded Ink** (ink-muted / tin-ink-muted): descriptions, dates, ingredient notes, checked-off items, filter group names.
- **Shelf Grey** (surface-muted / tin-surface-muted): hover fill for outline controls and tiles, image wells, skeletons.
- **Hairline** (border-subtle / tin-border-subtle): row dividers inside panels (ingredient rows, step rows, share menu items).
- **Kraft** (kraft): the footer, a flour sack printed in one ink (`#14161a`) in both themes.

### Category Lids
Each category is a product line with its own lid (src/lib/categories.ts), ordered as a cook would, not alphabetically: Основни ястия red (lid-osnovni-yastia), Супи cobalt (lid-supi), Салати green (lid-salati), Тестени kraft (lid-testeni), Постни olive (lid-postni), Десерти sunflower (lid-deserti), Консерви tomato (lid-konservi). A recipe with no category gets ink (lid-fallback). The ink printed on each field is fixed per lid: white (lid-ink-light) on red, cobalt, green, olive and ink; near-black (lid-ink-dark) on kraft, sunflower and tomato, each at ≥5:1. Lids are exposed to components as `--lid` and `--lid-fg` via `lidStyle()`, and any element carrying a lid gets the `lid-field` class so focus outlines switch to `currentColor`.

### Named Rules
**The Lid Rule.** Colour means category. It appears only as a full-bleed lid field, a card's 32px lid stripe, a selected category tile, or a 14px lid swatch; the reading column (ingredients, steps, comments) is ink on stock only.

**The Printed Ink Rule.** Lid fields, kraft, stamp red and brand cobalt are printed values and do not change with the theme. Only the stock, ink, muted, hairline and interactive accent tokens swap for dark.

**The Two Blues Rule.** Brand cobalt is the blog's lid and Cook Mode's filled action, white text in both themes. The accent token is the interactive colour and lightens in dark mode for contrast. Never use the dark-mode accent as a fill under white text.

## Typography

**Display Font:** Sofia Sans Extra Condensed (with Sofia Sans, ui-sans-serif)
**Body Font:** Sofia Sans (with ui-sans-serif, system-ui)
**Label/Mono Font:** labels use the extra-condensed cut; ui-monospace appears only for error digests.

**Character:** Both cuts are drawn by Lettersoup in Sofia and ship Bulgarian Cyrillic forms, triggered by `lang="bg"` on `<html>`. The extra-condensed caps set names and labels the way dairy and flour packaging does; Sofia Sans reads comfortably at arm's length.

### Hierarchy
- **Display** (900, clamp(3rem, 13vw, 6rem), 0.86, uppercase, balanced wrap): the recipe name on its lid field, the home and About heroes, the Рецепти and Търсене page titles, 404 and error headings. Hero variants use slightly different clamp floors (3.4rem/14.5vw on home, 4rem/20vw on About) but all cap at 6rem.
- **Headline** (800, 2.5–3rem section heads; 2.75rem for Съставки and Начин на приготвяне; 0.9, uppercase, wide tracking): printed section heads sitting on a 3px rule.
- **Title** (800, 1.75rem, 0.95, uppercase): recipe card names; 1.6rem on category shelf tiles; 2xl/1.5rem for panel heads such as "Как се получи?".
- **Numeral** (900, 2.6rem rising to 3rem at sm, tabular): the portions/prep/cook facts row. Units sit beside them at 1rem–1.125rem 800.
- **Quantity** (800, 1.4rem, tabular, min-width 5.25rem): ingredient amounts, the loudest thing in the ingredient panel. Step numbers use 900 at 2rem in a 56px box.
- **Body** (400, 1.0625rem/17px, 1.6, lining numerals): default reading text. Step text steps up to 1.1875rem with relaxed leading and a 65ch measure; Cook Mode step text is 1.85rem rising to 2.4rem, medium weight.
- **Label** (700–800, 1.125rem, uppercase, 0.025em tracking): nav links, buttons, filter tiles, tabs, back links, rating summary. Small lid labels and fact captions use 0.75–0.875rem with 0.12em tracking.

### Named Rules
**The Caps-Are-Print Rule.** Everything that names or labels (dish names, section heads, buttons, tabs, filters, categories) is extra-condensed uppercase. Everything meant to be read through (descriptions, steps, comments) is Sofia Sans in sentence case.

**The Net-Weight Rule.** Every number a cook acts on (portions, minutes, quantities, page numbers, counts) is set tabular. Quantities print halves and quarters as true fractions (1½, ¾), round mass to 5 g below 100 and 10 g above, switch to кг/л at 1000, never print fewer than ½ of a countable unit, and never print decimals like 1,33.

**The 6rem Ceiling.** Display type never exceeds 6rem.

## Layout

A single centred container (max-width 72rem) with 16px side gutters on phones and 24px from sm. Lid fields and hero fields break out of the container and run full-bleed; their content re-enters it. The header is sticky, 64px tall, with a 3px rule beneath; on mobile the recipe page adds a sticky two-cell Съставки | Приготвяне tab bar directly under it, and all anchors carry a 7.5rem scroll margin so they land below both.

The recipe page is front and back of a pack. Front (lid field): back link, display name, description, the ruled facts row with the stamp overlapping its right edge, difficulty, then the photo window (4:3 full-bleed on mobile, 5:4 framed in a 3px border to the right on desktop in a 1.15fr / 1fr grid). Back: from md a two-column grid with a sticky ingredient panel (22rem, 25rem at lg) and the method column; one column on mobile and in print.

Recipe grids are 1 column, 2 from sm, 3 from lg, with 24px gaps. The home category shelf is 2 columns, 3 from sm, and from lg exactly as many columns as stocked categories. Sections are separated by 64px. Breakpoints are Tailwind defaults (sm 640, md 768, lg 1024). Every interactive target is at least 44px; primary actions are 56px; Cook Mode controls are 64px tall.

### Named Rules
**The Doodle Band Rule.** The doodle pattern (whisk, herb sprig, steam, citrus, soup bowl, basil, tomatoes) is a pinned brand asset printed in one ink via `currentColor`. It appears only as a band in its own ruled strip (56px bands above and below the cobalt hero; a 96px band at the top of the kraft footer) and never sits under any text.

## Elevation & Depth

The system is flat. Depth is conveyed by ink rules and fills, never by shadow: heavy 3px rules separate header, lid fields and section heads; 2px boxes frame panels; state is shown by filling with ink (selected tiles, done steps, active tab, liked heart) or with shelf grey on hover. The single exception is a small drop shadow under the stamp sticker, so the white disc reads as stuck on top of a coloured field.

### Shadow Vocabulary
- **Sticker lift** (`filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.15))`, Tailwind `drop-shadow-sm`): the stamp only.

### Named Rules
**The Ruled-Not-Raised Rule.** Separation is a printed line, not a shadow. If a surface needs to stand apart, box it in a 2px ink rule.

## Shapes

Die-cut square corners: 0px radius on every public element, including buttons, inputs, cards, tiles, menus, checkboxes and the stamp's surrounding layout. The only curves are the round stamp itself and the doodle drawing. Border weight carries the hierarchy: 3px for structural rules (header, lid field edges, section heads, tab bar, Cook Mode frame bars, the desktop photo window), 2px for panels and controls, 1px hairlines for rows. Two printed cut-outs recur: the subscribe panel's dashed outer border (a coupon cut line) and the resume tab's notched right edge (a clip-path flag).

### Named Rules
**The Die-Cut Rule.** No `rounded-*` and no pills on public UI. Corners are square.

## Components

### Buttons
Tactile, square and loud: extra-condensed caps on solid fills or 2px ink boxes.
- **Shape:** square (0px), 2px ink border on outline variants.
- **Brand (Cook Mode):** brand cobalt fill, white text, 56px tall (64px inside Cook Mode), 24px horizontal padding, Utensils/arrow icon. Hover deepens to brand-cobalt-deep. Same in both themes.
- **Accent:** accent fill with accent-foreground text, 56px; hover to accent-strong. Used for newsletter submit, 404 and error primary actions. In dark mode this renders periwinkle with near-black text.
- **Ink:** ink fill, stock text, 56px; hover drops to 85% opacity. Comment submit and search submit.
- **Outline:** 2px ink box, 44px (56px for secondary page actions), hover fills shelf grey. Print, like, share toggle, servings stepper, pagination, theme toggle (which hovers to a full ink fill).
- **Text action:** 44px tall caps link with icon, underline on hover (Започни отначало, Махни отметките, Изчисти филтрите, section-head actions).
- **On a field:** white-filled button with ink text that inverts to transparent with a white border on hover (home hero CTA).
- **Focus:** 3px accent outline offset 2px; on lid fields the outline uses `currentColor`.
- **Disabled:** 30% opacity (stepper, pagination ends, Cook Mode back), 60% while a form is pending.

### Chips (Filter tiles)
- **Style:** 44px square tiles, 2px ink border, label type. Unselected category tiles show a 14px square lid swatch before the name.
- **State:** selected neutral tiles fill with ink; a selected category tile fills with its own lid colour and lid ink. Hover fills shelf grey. Category tiles scroll sideways in one row on phones rather than wrapping. Time and difficulty sit behind a "Време и трудност" disclosure with an ink count badge.

### Cards / Containers
- **Corner Style:** square (0px).
- **Background:** stock; hover fills shelf grey and underlines the name.
- **Shadow Strategy:** none (see Elevation).
- **Border:** 2px ink frame; 2px rule under the 4:3 photo window and above the facts row.
- **Internal Padding:** 12px.
- **Grid:** one strict label grid on every card: photo window, 32px lid stripe with the category name in label-lid type, title, two-line muted description, a ruled tabular run of minutes, portions, difficulty and (when rated) a score out of 5.
- **Panels:** "Как се получи?" box, comments, empty states and 404/error frames are 2px ink boxes with a ruled head.

### Inputs / Fields
- **Style:** 2px ink border, stock ground, square, 44px in the header, 48–56px on pages; search fields carry a leading 17–20px search icon.
- **Focus:** border shifts to accent (no second outline).
- **Checkbox:** custom 24px square, 2px ink border, fills ink with a square-capped stock tick when checked; the whole 56px row is the tap target.
- **Error / Success:** messages below the field in 1rem semibold, destructive-strong or secondary, in a live region.

### Navigation
- **Header:** sticky, stock ground, 3px rule beneath. The wordmark is the blog's lid: a 44px cobalt panel with the name in white extra-condensed caps. Desktop nav links are 44px label-type caps that underline on hover, followed by the search field and theme toggle. Mobile collapses to a 44px boxed menu button that opens a ruled panel with 56px rows.
- **Recipe tabs (mobile):** sticky two-cell bar under the header; the active side fills ink, tracked by scroll position.
- **Footer:** kraft field, doodle band strip at top, large wordmark, a boxed row of 48px links that invert to ink on hover, and a ruled copyright line.
- **Pagination:** 44px square boxed numbers, current page filled ink, gaps as an ellipsis.

### Stamp (signature)
A round red ink stamp on a white sticker reading "ИЗПРОБВАНО · В КУХНЯТА · НА ИВО" around a drawn square-capped tick. It is labelled for screen readers ("Изпробвано в кухнята на Иво"). Sizes 92–132px. It overlaps the right edge of the recipe facts row and the hero CTA on phones. It is pressed on once: rotate -14° at 1.35 scale settling to -9° at 1 over 0.5s, `cubic-bezier(0.16, 1, 0.3, 1)`, 0.25s delay; disabled under reduced motion.

### Ingredient Panel and Method (signature)
The ingredients panel: headline on a 3px rule, a ruled Порции stepper (44px −/+ boxes around a 900-weight tabular count, capped at double the base servings), then 56px rows of checkbox, quantity and item. The method: each step's 56px number box is also its state toggle (fills ink with a tick when done); the first unfinished step after a finished one gets a stamp-red notched "Продължете оттук" tab. Ticks and done steps persist per recipe in local storage.

### Cook Mode (signature)
A full-screen modal: a lid-coloured title band with a 48px close box, a progress row of ruled cells filled ink up to the current step, the step at 1.85–2.4rem, and a 64px control bar (ingredients toggle, Назад outline, Напред/Готово in brand cobalt). Keeps the screen awake and remembers the step.

## Do's and Don'ts

### Do:
- **Do** keep every public corner square (0px) and frame controls and panels in 2px ink, structure in 3px ink.
- **Do** put colour only on lid fields, lid stripes, selected category tiles and lid swatches, using the lid table and its fixed lid ink.
- **Do** set names, labels and buttons in Sofia Sans Extra Condensed uppercase, and reading text in Sofia Sans at 17px/1.6 or larger.
- **Do** set every actionable number tabular and print quantities through the fraction and rounding rules.
- **Do** make touch targets at least 44px on mobile, and 56px for primary actions.
- **Do** use brand cobalt (#1f3fbf) with white text for Cook Mode's filled buttons in both themes.
- **Do** show state with ink fills and the 3px accent focus outline (currentColor on lid fields).
- **Do** keep the stamp press as the only authored motion and honour `prefers-reduced-motion`.

### Don't:
- **Don't** use pills or `rounded-full` (or any radius) on public UI.
- **Don't** put kicker or eyebrow labels above headings.
- **Don't** build hero-metric stat boxes; the stamp stands beside the name instead.
- **Don't** set display text above 6rem.
- **Don't** place the doodle pattern under body copy or any text; it is a band in its own ruled strip.
- **Don't** add colour to the reading column or use lid colours as decoration.
- **Don't** add shadows to cards, panels or buttons; the stamp's sticker lift is the only one.
- **Don't** fill with the dark-mode accent under white text.

### Scoped exception: admin
The admin (`src/app/admin/**`, `src/components/admin/**`) inherits the colour tokens only and deliberately keeps its own rounded controls (rounded-lg fields, rounded-2xl cards, rounded-full buttons and toggles, small shadows). This is a scoped tool surface, not part of the public system; do not copy its shapes into public pages.
