---
name: Кулинарният блог на Иво
description: Bulgarian home recipes as a warm, colourful food-magazine app. Coloured spreads, a steaming-pot logo, the photograph leads and Onest names the dish.
colors:
  tomato: "#c2410c"
  tomato-deep: "#9a3412"
  tomato-wash: "#ffe9df"
  tomato-link: "#9a3412"
  on-tomato: "#ffffff"
  ink: "#111111"
  paper: "#ffffff"
  surface: "#ffffff"
  counter-tint: "#f5f3ef"
  slate-grey: "#4b4f55"
  field-border: "#8f8a83"
  peach: "#fde6d8"
  sage: "#e2eedb"
  butter: "#fdf0c4"
  rose: "#fbe1e4"
  wheat: "#f6e7cf"
  olive: "#e8ecd0"
  sky: "#dfecf3"
  hairline: "rgba(17, 17, 17, 0.1)"
  rule: "#e7e3dc"
  herb-green: "#2f7a3f"
  herb-wash: "#e6f3e6"
  error-red: "#b91c1c"
  error-red-deep: "#991b1b"
  error-wash: "#fef2f2"
  error-border: "#fecaca"
  tomato-evening: "#ff7a45"
  tomato-deep-evening: "#ff9a6e"
  tomato-wash-evening: "rgba(255, 122, 69, 0.16)"
  tomato-link-evening: "#ff9a6e"
  on-tomato-evening: "#121212"
  ink-evening: "#f4f1ec"
  paper-evening: "#121212"
  surface-evening: "#1c1c1c"
  counter-tint-evening: "#1f1d1b"
  slate-grey-evening: "#b3b0aa"
  field-border-evening: "#77736d"
  peach-evening: "#2b1d16"
  sage-evening: "#1b2618"
  butter-evening: "#2a2412"
  rose-evening: "#2b1a1d"
  wheat-evening: "#29211a"
  olive-evening: "#22251a"
  sky-evening: "#17222a"
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
  field: "14px"
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
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0 44px"
    height: "44px"
  input-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.field}"
    padding: "0 16px"
    height: "48px"
  card-recipe:
    backgroundColor: "{colors.peach}"
    textColor: "{colors.ink}"
    rounded: "{rounded.frame}"
    padding: "16px"
  card-feature:
    backgroundColor: "{colors.butter}"
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
    backgroundColor: "{colors.paper}"
    textColor: "{colors.tomato-link}"
    rounded: "{rounded.frame}"
    padding: "8px 8px 8px 20px"
---

# Design System: Кулинарният блог на Иво

## Overview

**Creative North Star: "Списание, warm edition: a food magazine you cook from"**

The blog reads like a contemporary food-magazine app on a phone, laid out in warm colour blocks the way a printed spread is. Pages run in full-width bands of peach, sage and butter. Each recipe category has its own food colour, carried by its cards, chips and recipe header. The food photograph still leads every surface. A single confident grotesk (Onest, drawn Cyrillic-first) names each dish in bold, sentence case, with tight display leading.

The brand mark is a drawn cooking pot with three wisps of steam in a tomato badge, beside "Кулинарният блог на Иво". The steam draws in once on load and rises in a loop while the logo is hovered.

Density is low and tap-first. The reader is a home cook at the counter, often at night, with wet or floury hands. Every control is a 44px pill or circle, quantities lead their rows, and progress state (ticked ingredients, finished steps, the step to resume from) is shown in tomato. Motion is short and purposeful: content rises in, ticks and stars pop, Cook Mode steps slide in from the direction you moved. Dark mode is designed, not inverted: an "evening kitchen" with a #121212 ground, deep warm section tones, a brighter tomato, and untouched photographs.

The world replaced the "Бакалия" grocery-label system, which was rejected as retro packaging. Retro, vintage-packaging and pastiche treatments are out. The only illustrative devices are the logo and the pinned doodle pattern, printed as a fine line band in the footer.

**Key Characteristics:**
- Warm full-width colour bands; one food colour per category.
- Steaming-pot logo in a tomato badge, also the favicon.
- Photo first, 4:3 on every card, in 16px rounded frames on a tinted card body.
- Onest throughout; exactly four type sizes; rank from weight and colour.
- Tomato for the primary action and for progress or selected state; deep tomato for text links.
- Bordered white form fields with a visible hover and a soft tomato focus halo.
- Purposeful motion that respects reduced-motion settings.
- Designed evening-kitchen dark mode; 44px minimum touch targets.

## Colors

Warm section colours set the mood; tomato is the one action colour; ink and grey carry text.

### Primary
- **Tomato** (`tomato`): the filled primary action ("Готви стъпка по стъпка", "Запиши ме", "Търси", "Към рецептите"), the logo badge, finished-step circles, checked ingredient boxes, Cook Mode progress segments, filled rating stars, the reading-progress bar, the focus ring and field focus border, text selection and the caret. 5.2:1 with white text.
- **Deep Tomato** (`tomato-deep`): hover fill for primary buttons.
- **Tomato Link** (`tomato-link`, evening `#ff9a6e`): every text link and tomato-coloured label (back link, "Всички рецепти", "Продължете", the active nav pill). Tomato itself drops to about 4.2:1 on the section tints, so text never uses it.
- **Tomato Wash** (`tomato-wash`): soft active backgrounds: the active nav pill, the "Продължете оттук" marker, the field focus halo, a liked heart and the ingredients used by the current Cook Mode step.

### Section and category colours
- **Peach** (`peach`): page-title bands (home hero, recipes index, search, about, 404, error); the main-dishes category.
- **Sage** (`sage`): the home categories band and the recipe page's ingredients panel; the salads category.
- **Butter** (`butter`): the newsletter band, the "Как се получи?" rating panel and the home feature card; the soups category.
- **Wheat** (`wheat`): the footer; the pastry category.
- **Olive** (`olive`): recipe tags; the lenten category.
- **Rose** (`rose`): the desserts category.
- **Sky** (`sky`): the preserves category.

Category colours come from `categoryTint(slug)` in `src/lib/categories.ts`. A recipe card's body, its category chip at rest and its recipe page header all wear that colour. Muted text (`slate-grey`, #4b4f55) clears 6.7:1 on every tint.

### Secondary
- **Herb Green** (`herb-green`, wash `herb-wash`): success messages only (rating saved, comment published, subscribed).

### Neutral
- **Ink** (`ink`): all text and headings; the fill of selected chips, the current page number and the Cook Mode ingredients toggle when open.
- **Paper** (`paper`, `surface`): the page ground, form fields, pop-over menus, white cards that sit on a band (resume banner, empty states, servings stepper buttons).
- **Counter Tint** (`counter-tint`): secondary pills, the segmented control track and skeletons.
- **Slate Grey** (`slate-grey`): secondary text: descriptions, meta lines, fact labels, placeholders, counts.
- **Field Border** (`field-border`): the resting 1.5px border of every input and checkbox; 3:1 against white.
- **Hairline** (`hairline`): the header's bottom rule and list row dividers.
- **Error Red** (`error-red`, `error-red-deep`, `error-wash`, `error-border`): failures, invalid fields and destructive admin actions.

### The evening kitchen
Dark mode (system preference, or `data-theme="dark"` from the toggle) swaps each token for its `-evening` sibling. The section colours become deep warm tones (peach #2b1d16, sage #1b2618, butter #2a2412 and so on), so bands still read as colour without glare. Photographs receive no filter or dimming.

### Named Rules
**The Action Colour Rule.** Tomato marks the primary action, progress, or a selected or active state. Section colour comes from the band and category palette, never from tomato.

**The Link Tone Rule.** Text in the accent hue always uses `tomato-link`, never `tomato`.

## Typography

**Display Font:** Onest (with ui-sans-serif, system-ui, sans-serif)
**Body Font:** Onest
**Label/Mono Font:** ui-monospace only for error digest codes.

**Character:** One contemporary grotesk, Cyrillic-first, so Bulgarian sets as naturally as Latin. Weights do the ranking: 700 for names and headings, 600 for buttons, quantities and labels, 500 for links and chips, 400 for reading.

### Hierarchy
- **Display** (700, `clamp(2.5rem, 1.9rem + 2.6vw, 3.75rem)`, 1.05): page titles, the recipe name, the home feature card's dish name, and the current step's text in Cook Mode (weight 500 there).
- **Heading** (700, 1.5rem, 1.25): section titles, card titles, fact numerals, panel titles, mobile menu links, Cook Mode ingredient rows.
- **Body** (400, 1.0625rem / 17px, 1.6): all reading text, buttons, inputs. Method steps cap at 65ch.
- **Small** (400, 0.875rem, 1.45): meta lines ("Супи · 45 мин · 6 порции"), fact labels, group labels, tags, counters, copyright.

h1–h3 carry `letter-spacing: -0.02em` and `text-wrap: balance`. Numbers use tabular figures wherever they line up.

### Named Rules
**The Four Sizes Rule.** There are exactly four sizes, as the tokens `--text-display`, `--text-heading`, `--text-body`, `--text-small`. A new level of emphasis is made with weight or colour, never a fifth size.

**The Sentence Case Rule.** Every label, button and heading is sentence case. No uppercase, no letter-spaced caps.

## Layout

Pages are a stack of full-width `Band` sections (`src/components/Band.tsx`), each holding the single centred 72rem column (`max-w-6xl`) with a 16px gutter on phones and 24px from 640px. Header is a 64px sticky white bar with a translucent blur. Card grids are 1 / 2 / 3 columns at <640 / 640 / 1024px, with 24px horizontal and 40px vertical gaps.

**Home.** Peach band: display headline, one line, the resume banner when a dish is in progress, and the feature card. Sage band: category tiles in cook's order, each in its category colour with name, count and arrow. Plain bands: "Най-високо оценени" (when any recipe is rated) and "Последни рецепти". Butter band: newsletter. Wheat footer.

**Recipe page.** The photo and header sit on a full-width band in the recipe's category colour. On a phone the photo bleeds edge to edge at 60svh; from 640px it becomes a rounded frame (4:3, then 21:9 at 768px, 16:5 at 1024px). Below it: back link, display-size name, one line of description, and the facts row. Below 768px a sticky "Съставки | Приготвяне" segmented bar sits under the header; from 768px ingredients become a sticky sage panel beside the method. The butter rating panel follows the method, then a butter newsletter band, then comments.

**Index, search, about, 404, error.** A peach title band; on search it also holds the large search field. Short pages (about, 404, error) are one peach spread.

Anchors offset by 7.5rem so they land below the sticky header and tab bar.

## Elevation & Depth

Depth comes from colour bands first and soft shadows second.

### Shadow Vocabulary
- **Card** (`shadow-card`): recipe cards, the feature card, white cards on a band (resume banner, empty states, filter panel, stepper buttons), and primary buttons in Cook Mode.
- **Lift** (`shadow-lift`): a hovered recipe card, and the share menu.
- **Segment** (`shadow-sm`): the sliding indicator of the recipe segmented control.

The sticky header and tab bar use `background` at 90% with `backdrop-blur-md` instead of a shadow.

## Shapes

Photographs and cards sit in 16px frames; large panels and the feature card in 24px; form fields in 14px; every button, chip, search field, icon button, step number and pagination item is a full pill or circle (999px). Inner rows use 12px. Ingredient checkboxes are 24px squares at 6px. The logo badge is a 14/48 rounded square.

## Motion

Keyframes and utilities live in `globals.css`; all use `--ease-out-expo` and stay under about 450ms.
- **Rise** (`animate-rise`): page titles, cards (staggered 60ms per card, capped at six), menus, the filter panel, the resume banner, Cook Mode opening.
- **Pop** (`animate-pop`): checkbox ticks, finished-step checks, filled rating stars, a liked heart, the search clear button, success messages.
- **Slide** (`animate-slide-next`, `animate-slide-prev`): the Cook Mode step text, from the side you moved towards.
- **Lift**: recipe cards rise 4px with a deeper shadow on hover; the photo never moves.
- **Press**: buttons and chips scale to 0.95–0.97 while pressed.
- **Logo steam**: draws in once on load; rises in a loop while the logo is hovered.
- **Segmented control**: the indicator slides between halves.

Reduced motion zeroes every distance, holds scale at 1 and stops the steam; colour transitions remain.

## Components

### Logo
`LogoMark` (`src/components/Logo.tsx`): a 48×48 SVG with a tomato rounded badge, a white pot with lid and handles, and three tomato-wash steam strokes. 38px in the header beside the name in bold body size. The same mark is `src/app/icon.svg`, the favicon.

### Buttons
- **Primary:** tomato fill, white 600-weight body text, 56px tall with 28px side padding; 64px in Cook Mode's bottom bar. Hover darkens to deep tomato; press scales down.
- **Secondary:** white pill with a card shadow on a band ("Начало", "Към началото"), or counter-tint pill on white.
- **Ink:** near-black pill with white text for the comment submit; shows a spinner while pending.
- **Icon:** 44px circles (print, theme toggle, menu, servings stepper).
Focus is a 2px tomato outline offset 2px on every link, button, summary and checkbox.

### Chips
- **Style:** 44px pill, ink 500-weight text, 16–20px side padding, no border. Category chips wear their category colour at rest; "Всички" and time/difficulty chips use the counter tint.
- **State:** selected chips invert to ink fill with paper text. Category chips scroll sideways in one row on a phone. A tomato count badge appears on the "Време и трудност" disclosure when filters inside it are active. Recipe tags are a non-interactive olive variant.

### Cards / Containers
- **Recipe card:** 16px corner, body in the category colour, card shadow; 4:3 photo flush to the top; 16px text pad with a heading-size title and a small grey meta line joined by " · ". Hover lifts the card.
- **Feature card:** 24px corner, butter body, photo on the left 7/12 from 768px, display-size name on the right.
- **Category tile:** 16px corner in the category colour, name, recipe count and an arrow.
- **Panels:** 24px corner, 24px padding: sage ingredients, butter rating; white with a card shadow for empty states.

### Inputs / Fields
The `.field` class (`globals.css`): white fill, 1.5px `field-border`, 14px radius (`.field-pill` for 999px).
- **Hover:** border darkens to ink.
- **Focus:** tomato border plus a 4px tomato-wash halo.
- **Invalid** (`:user-invalid`): error-red border and halo, only after the visitor has interacted.
- **Search** (`SearchField`): leading search icon, a clear button once there is text, "/" focuses the header field from anywhere (with a `/` hint on desktop). 44px in the header; 56px with a "Търси" button on the search page.
- **Comment form:** 48px name field, resizable textarea with a live "N / 1000" counter that turns red past 90%.
- **Newsletter:** pill field and tomato button on the butter band.
- Errors show in deep error red under the field; success in herb green.

### Navigation
Sticky 64px white header: the logo and site name on the left; "Рецепти", "За Иво" as 44px pill links (the current section in tomato-wash with tomato-link text), the search field and the theme toggle on the right from 768px. On a phone a 44px menu button opens a panel with heading-size links, search and theme toggle. Pagination is a row of 44px circles, current page in ink. The wheat footer has a link row of pills and RSS.

### Ingredient list (signature)
Each row is a whole-row tap target at least 56px tall: a 24px rounded checkbox with a `field-border` outline, the quantity in 600 weight tabular figures (min 4.75rem column), then the item in body text with any note in grey. Ticking pops the check and strikes the quantity; ticks persist across reloads. Quantities print cookable fractions and round by unit family. The servings stepper is two white 44px circles around a 600-weight count, capped at double the written recipe.

### Method steps (signature)
Each step is a 44px numbered circle beside body text (max 65ch). Tapping the circle marks it done: the circle fills tomato and the check pops. The first unfinished step after a finished one gets a tomato-wash "Продължете оттук" pill that rises in.

### Cook Mode (signature)
A full-screen modal that rises in: dish name and a 48px close circle, 6px pill progress segments (tomato up to the current step), "Стъпка N от M" in grey, the step at display size sliding in from the direction of travel, and a bottom bar of three 64px pills (ingredients toggle, Назад, tomato Напред/Готово). The ingredients sheet washes the ones the current step uses in tomato wash. The screen is kept awake.

### Resume banner
On the home page only, in the browser that was cooking within the last week: a white 16px-rounded card with a card shadow on the peach band, "Продължете: {dish} · стъпка N" in tomato link, and a 44px dismiss circle.

### Doodle band
The pinned doodle pattern (whisk, herb sprig, steam, citrus, soup bowl, basil and tomatoes) in 2.2px single-weight line, at reduced opacity, filling an 80px strip at the top of the wheat footer. Nothing else sits on it.

### Admin (scoped exception)
`src/app/admin/**` and `src/components/admin/**` inherit the colour and font tokens only. They are not held to the four-size scale or these component patterns, and `--stamp`, `--kraft`, `--brand` remain defined in `globals.css` solely for them.

## Do's and Don'ts

### Do:
- **Do** build pages from full-width colour bands and give every category its food colour via `categoryTint`.
- **Do** let the photograph lead: 4:3 on every card, edge to edge at 60svh on the phone recipe page.
- **Do** use only the four type tokens and rank with weight and colour.
- **Do** use `text-link` for accent-coloured text and `tomato` for fills.
- **Do** use the `.field` class for every input so hover, focus and invalid states match.
- **Do** make every tap target at least 44px, and whole rows tappable where a wet hand needs them.
- **Do** design both themes; check every new surface in the evening kitchen.
- **Do** keep motion short and tied to an action, and honour reduced motion.
- **Do** write Tailwind colour classes literally (see the `TONES` map in `Band.tsx`).

### Don't:
- **Don't** put eyebrow or kicker labels above headings.
- **Don't** build hero-metric stat boxes; the facts row is plain numerals over labels.
- **Don't** zoom, scale or pan images on hover.
- **Don't** return to retro, vintage-packaging or pastiche treatments: no condensed caps, stamps, square label frames or kraft paper.
- **Don't** set text in uppercase or letter-spaced caps.
- **Don't** add a fifth type size.
- **Don't** set tomato (`#c2410c`) as text on a section tint; it fails contrast.
- **Don't** fill a section background with tomato.
- **Don't** place the doodle pattern behind any text.
- **Don't** animate for decoration: no looping motion except the hovered logo steam.
- **Don't** filter or dim food photographs in dark mode.
