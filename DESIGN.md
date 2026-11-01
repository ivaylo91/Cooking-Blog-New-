---
name: Кулинарният блог на Иво
description: A welcoming Bulgarian home kitchen with colourful recipe cards, apricot and butter sections, herb-green contrast and illustrated cooking backgrounds.
colors:
  tomato: "#b9381b"
  tomato-deep: "#922a13"
  tomato-wash: "#ffdfcc"
  tomato-link: "#8f2f0a"
  on-tomato: "#ffffff"
  ink: "#2a1710"
  paper: "#fff5e5"
  surface: "#fffdf6"
  counter-tint: "#f5e6ce"
  slate-grey: "#5a4234"
  field-border: "#82614b"
  peach: "#ffd7b0"
  sage: "#d9e9bd"
  butter: "#ffe49b"
  rose: "#ffd5d0"
  wheat: "#f4d6a4"
  olive: "#e4e9ad"
  sky: "#d7e9ee"
  garden: "#284f36"
  on-garden: "#fff7e8"
  on-garden-muted: "#deebc9"
  doodle-herb: "#477b42"
  doodle-gold: "#ac681b"
  ember: "#7a2410"
  on-ember: "#fff1e3"
  on-ember-muted: "#ffd8bf"
  ember-evening: "#3a1408"
  hairline: "rgba(90, 45, 20, 0.22)"
  rule: "#efdcc6"
  herb-green: "#23632f"
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
  ink-evening: "#f8eee4"
  paper-evening: "#1a1210"
  surface-evening: "#241914"
  counter-tint-evening: "#2c201a"
  slate-grey-evening: "#cdbcae"
  field-border-evening: "#8a7a6e"
  peach-evening: "#3d2417"
  sage-evening: "#223320"
  butter-evening: "#3b3014"
  rose-evening: "#3d2025"
  wheat-evening: "#38291b"
  olive-evening: "#2f3319"
  sky-evening: "#1b303c"
  hairline-evening: "rgba(244, 241, 236, 0.12)"
  rule-evening: "#2c2c2c"
  herb-green-evening: "#4ade80"
  error-red-evening: "#f87171"
typography:
  display:
    fontFamily: "Lora, ui-serif, Georgia, serif"
    fontSize: "clamp(2.5rem, 1.9rem + 2.6vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  feature:
    fontFamily: "Lora, ui-serif, Georgia, serif"
    fontSize: "clamp(2rem, 1.4rem + 2vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.15
  section:
    fontFamily: "Lora, ui-serif, Georgia, serif"
    fontSize: "clamp(1.75rem, 1.5rem + 0.7vw, 2.125rem)"
    fontWeight: 700
    lineHeight: 1.2
  card:
    fontFamily: "Lora, ui-serif, Georgia, serif"
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1.3
  heading:
    fontFamily: "Lora, ui-serif, Georgia, serif"
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
  card-pad: "20px"
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
    padding: "20px"
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

**Creative North Star: "Come into my kitchen"**

The blog is a friendly, colourful home kitchen: apricot welcomes the reader, butter yellow warms the featured recipe, and a deep herb-green author section creates contrast. Real food photographs lead category-coloured cards. Cooking illustrations surround solid text panels in the hero and newsletter. Lora names each dish in bold sentence case; Onest sets reading text and controls. The owner's request for warmth, colour and cooking backgrounds supersedes the earlier pale magazine direction. Research and rationale are recorded in [DESIGN-RESEARCH.md](DESIGN-RESEARCH.md).

The brand mark is a drawn cooking pot with three wisps of steam in a tomato badge, beside "Кулинарният блог на Иво". The steam draws in once on load and rises in a loop while the logo is hovered.

Density is low and tap-first. The reader is a home cook at the counter, often at night, with wet or floury hands. Every control is a 44px pill or circle, quantities lead their rows, and progress state (ticked ingredients, finished steps, the step to resume from) is shown in tomato. Motion is short and purposeful: content rises in, ticks and stars pop, Cook Mode steps slide in from the direction you moved. Dark mode is designed, not inverted: an "evening kitchen" with a #121212 ground, deep warm section tones, a brighter tomato, and untouched photographs.

The world replaced the "Бакалия" grocery-label system, which was rejected as retro packaging. Retro, vintage-packaging and pastiche treatments are out. The logo and original cooking doodles supply the illustrations; use the doodles as coloured backgrounds around opaque reading panels and as a monochrome footer band.

**Key Characteristics:**
- Apricot, butter and sage sections on cream, balanced by a deep green author panel.
- Steaming-pot logo in a tomato badge, also the favicon.
- Photo first, 4:3 on grid cards, in 16px rounded frames with category-coloured bodies and cream labels.
- Lora for display and headings, Onest for body and controls; distinct page, feature, section and card title sizes.
- Every recipe carries a byline: Иво's photo, name and real published/updated dates.
- Tomato for the primary action and for progress or selected state; deep tomato for text links.
- Bordered white form fields with a visible hover and a soft tomato focus halo.
- Purposeful motion that respects reduced-motion settings.
- Designed evening-kitchen dark mode; 44px minimum touch targets.

## Colors

Warm cream, apricot, butter and herb green set the mood; tomato is the primary action colour; dark ink and warm brown carry text.

### Primary
- **Tomato** (`tomato`): the filled primary action ("Готви стъпка по стъпка", "Запиши ме", "Търси", "Към рецептите"), the logo badge, finished-step circles, checked ingredient boxes, Cook Mode progress segments, filled rating stars, the reading-progress bar, the focus ring and field focus border, text selection and the caret. 5.2:1 with white text.
- **Deep Tomato** (`tomato-deep`): hover fill for primary buttons.
- **Tomato Link** (`tomato-link`, evening `#ff9a6e`): every text link and tomato-coloured label (back link, "Всички рецепти", "Продължете", the active nav pill). Tomato itself drops to about 4.2:1 on the section tints, so text never uses it.
- **Tomato Wash** (`tomato-wash`): soft active backgrounds: the active nav pill, the "Продължете оттук" marker, the field focus halo, a liked heart and the ingredients used by the current Cook Mode step.

### Section and category colours
- **Peach** (`peach`): the patterned homepage welcome, page-title bands and main-dish cards.
- **Sage** (`sage`): the top-rated shelf, newsletter backdrop, recipe ingredients and salads category.
- **Butter** (`butter`): featured-recipe text panel, newsletter panel, "Как се получи?" and the soups category.
- **Garden** (`garden`, with `on-garden` and `on-garden-muted`): the dark green author introduction. Its link uses cream fill and green text, and its focus outline uses cream.
- **Wheat** (`wheat`): the pastry category.
- **Ember** (`ember`, with `on-ember`, `on-ember-muted`): the one deep colour, paprika, owning the footer. Focus rings there use `on-ember`, because tomato vanishes on it.
- **Olive** (`olive`): the lenten category.
- **Rose** (`rose`): the desserts category.
- **Sky** (`sky`): the preserves category.

Category colours come from `categoryTint(slug)` in `src/lib/categories.ts`. They fill recipe card bodies, category navigation cards and recipe headers. Category labels on recipe cards use a cream surface. Home category cards include an icon and name, so meaning never depends on colour alone. Borders, warm shadows and consistent photography keep the colour organized.

### Secondary
- **Herb Green** (`herb-green`, wash `herb-wash`): success messages only (rating saved, comment published, subscribed).

### Neutral
- **Ink** (`ink`): all text and headings; the fill of selected chips, the current page number and the Cook Mode ingredients toggle when open.
- **Paper** (`paper`, #fff5e5) and **Surface** (`surface`, #fffdf6): warm cream ground and lighter labels and controls. Form fields use their separate white field token.
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

**Display Font:** Lora (with ui-serif, Georgia, serif), bold, standard Cyrillic letterforms (no `lang="bg"` alternates, which Onest lacks)
**Body Font:** Onest
**Label/Mono Font:** ui-monospace only for error digest codes.

**Character:** One contemporary grotesk, Cyrillic-first, so Bulgarian sets as naturally as Latin. Weights do the ranking: 700 for names and headings, 600 for buttons, quantities and labels, 500 for links and chips, 400 for reading.

### Hierarchy
- **Display** (700, `clamp(2.5rem, 1.9rem + 2.6vw, 3.75rem)`, 1.05): page titles, recipe names and current Cook Mode step text (weight 500 there).
- **Feature** (700, 32–48px, 1.15): the homepage lead dish.
- **Section** (700, 28–34px, 1.2): section and newsletter headings. The homepage welcome uses display size.
- **Card** (700, 22px, 1.3): grid recipe titles.
- **Heading** (700, 24px, 1.25): panel titles, fact numerals, mobile menu links and Cook Mode ingredient rows.
- **Body** (400, 1.0625rem / 17px, 1.6): all reading text, buttons, inputs. Method steps cap at 65ch.
- **Small** (400, 0.875rem, 1.45): card meta rows, fact labels, group labels, tags, counters, copyright.

h1–h3 carry `letter-spacing: -0.02em` and `text-wrap: balance`. Numbers use tabular figures wherever they line up.

### Named Rules
**The Type Hierarchy Rule.** Use the named display, feature, section, heading, card, body and small tokens. Section headings read more prominently than card titles. The homepage welcome uses display size, while the leading dish uses feature size.

**The Sentence Case Rule.** Every label, button and heading is sentence case. No uppercase, no letter-spaced caps.

## Layout

Pages are a stack of full-width `Band` sections (`src/components/Band.tsx`), each holding the single centred 72rem column (`max-w-6xl`) with a 16px gutter on phones and 24px from 640px. Header is a 64px sticky white bar with a translucent blur. Card grids are 1 / 2 / 3 columns at <640 / 640 / 1024px, with 24px horizontal and 40px vertical gaps.

**Home.** Apricot opening with colourful cooking doodles: a welcoming Bulgarian introduction on a solid apricot panel, resume banner, and a 7/5 photo-and-text feature with a butter panel and "Виж рецептата" action. "Какво ви се хапва?" introduces coloured category cards with icons. "Последни рецепти" comes next on cream, followed by a swipeable highest-rated shelf on sage when ratings exist. A deep herb-green band introduces Ivo with his portrait and a cream About button. The newsletter uses an opaque butter panel over a patterned sage backdrop, followed by the paprika footer. Main sections use 48px vertical padding on phones and 64px from 640px. Recipe grids use 24px horizontal and 40px vertical gaps, matching the index. Do not render an empty latest grid when the sole recipe is already featured.

**Recipe page.** The photo and header sit on a full-width band in the recipe's category colour. On a phone the photo bleeds edge to edge at 40svh; from 640px it becomes a rounded frame (4:3, then 21:9 at 768px, 16:5 at 1024px). Below it: back link, display-size name, one line of description, the byline (44px portrait linking to /za-ivo, "Иво, сготвено и снимано в моята кухня", published and, when later, updated dates in `<time>`), then the facts (total, prep, cook, servings, difficulty) with print and share directly under them. Below 768px a sticky "Съставки | Приготвяне" segmented bar sits under the header; from 768px ingredients become a sage panel beside the method that sticks only when the whole list fits the viewport (`StickyIfFits`), so a long list is never clipped. Tags follow the method as one line of plain text; the butter "Как се получи?" panel holds the rating and the like button; then comments, related recipes and the butter newsletter band. Print shows the recipe header and a line with the blog name and recipe URL; the site header and footer are hidden.

**Index, search, about, 404, error.** A peach title band; on search it also holds the large search field. Short pages (about, 404, error) are one peach spread.

Anchors offset by 7.5rem so they land below the sticky header and tab bar.

## Elevation & Depth

Depth comes from contrasting colour sections, fine borders and warm shadows.

Shadows are tinted towards the warm palette (rgba(74, 32, 12, ...)) rather than neutral black.

### Shadow Vocabulary
- **Card** (`shadow-card`): recipe cards, the feature card, white cards on a band (resume banner, empty states, filter panel, stepper buttons), and primary buttons in Cook Mode.
- **Lift** (`shadow-lift`): a hovered recipe card, and the share menu.
- **Segment** (`shadow-sm`): the sliding indicator of the recipe segmented control.

The sticky header uses an opaque cream surface and a warm shadow. The recipe tab bar retains its translucent background.

## Shapes

Grid photographs and category cards sit in 16px frames; the feature card and large panels use 24px; form fields use 14px; buttons, chips, search fields, icon buttons, step numbers and pagination items use pills or circles. Inner rows use 12px. Ingredient checkboxes are 24px squares at 6px. The logo badge is a 14/48 rounded square.

## Motion

Keyframes and utilities live in `globals.css`; all use `--ease-out-expo` and stay under about 450ms.
- **Rise** (`animate-rise`): page titles, cards (staggered 60ms per card, capped at six), menus, the filter panel, the resume banner, Cook Mode opening.
- **Pop** (`animate-pop`): checkbox ticks, finished-step checks, filled rating stars, a liked heart, the search clear button, success messages.
- **Slide** (`animate-slide-next`, `animate-slide-prev`): the Cook Mode step text, from the side you moved towards.
- **Lift**: recipe cards rise 2px with a subtle deeper shadow on hover; the photo never moves.
- **Press**: buttons and chips scale to 0.95–0.97 while pressed.
- **Logo steam**: draws in once on load; rises in a loop while the logo is hovered.
- **Segmented control**: the indicator slides between halves. The active half is tracked with an IntersectionObserver, never a scroll listener.
- **Reading progress**: a CSS scroll-driven animation (`view-timeline` on `[data-reading-target]`); hidden in browsers without support.

Reduced motion zeroes every distance, holds scale at 1 and stops the steam; colour transitions remain.

## Components

### Logo
`LogoMark` (`src/components/Logo.tsx`): a 48×48 SVG with a tomato rounded badge, a white pot with lid and handles, and three tomato-wash steam strokes. 38px in the header beside the name in bold body size. The same mark is `src/app/icon.svg`, the favicon.

### Buttons
- **Primary:** tomato fill, white 600-weight body text, 56px tall with 28px side padding; 64px in Cook Mode's bottom bar. Hover darkens to deep tomato; press scales down.
- **Secondary:** white pill with a card shadow on a band ("Начало", "Към началото"), or counter-tint pill on white.
- **Comment submit:** tomato primary with a send icon that swaps to a spinner while posting.
- **Icon:** 44px circles (print, theme toggle, menu, servings stepper).
Focus is a 2px tomato outline offset 2px on every link, button, summary and checkbox.

### Icons
lucide-react, one per control, at 15-22px in the control's text colour, and `aria-hidden` beside a text label. Leading for actions (Запиши ме, Търси, Запази, Изтрий); trailing only for direction (Напред, Всички рецепти) and disclosure chevrons. Each category has its own sign from `CategoryIcon`. On a phone the large search button is icon-only with a screen-reader label, so the query keeps its width. Page numbers and step numbers carry no icon: the number is the content.

### Placeholders
Every text field has one, as a short example or hint in `--placeholder` (5.5:1). A placeholder never replaces the visible label, and anything needed to complete the field stays outside it, because it disappears on typing.

### Chips
- **Style:** 44px pill, ink 500-weight text, 16–20px side padding, no border. Category chips wear their category colour at rest; "Всички" and time/difficulty chips use the counter tint.
- **State:** selected chips invert to ink fill with paper text. Category chips scroll sideways in one row on a phone. A tomato count badge appears on the "Време и трудност" disclosure when filters inside it are active. Recipe tags are plain text ("Етикети: …"), never pill-shaped, since they are not interactive.

### Cards / Containers
- **Recipe card:** 16px corner, category-coloured body, border and warm shadow; 4:3 photo flush to the top; 20px text padding and a 22px title. Metadata sits at the bottom: cream category label, clock + minutes, star + rating. Hover lifts the card 2px.
- **Feature card:** 24px corner and fine border; photo on the left 7/12 from 768px with a 22rem minimum height; butter panel with a tomato divider, 32–48px title, description, metadata and "Виж рецептата" affordance. The whole card is one link without nested controls.
- **Home category link:** coloured, rounded card with a 44px cream icon circle and a visible name. Cards wrap to fill each row on phones and share one row on desktop; minimum heights are 80px on phones and 128px from 640px.
- **Panels:** 24px corner, 24px padding, card shadow: sage ingredients, butter rating; white for empty states.

### Inputs / Fields
Every field has a visible label above it (the placeholder is never the label), helper text and errors linked with `aria-describedby`, `aria-invalid` on failure, the right `autocomplete` and keyboard hints, and a pending state on submit. Forms submit through `onSubmit` + `startTransition` so a failed submit keeps what the reader typed, with the plain `action` kept for no-JavaScript use.
The `.field` class (`globals.css`): white fill, 1.5px `field-border`, 14px radius (`.field-pill` for 999px).
- **Hover:** border darkens to ink.
- **Focus:** tomato border plus a 4px tomato-wash halo.
- **Invalid** (`:user-invalid`): error-red border and halo, only after the visitor has interacted.
- **Search** (`SearchField`): leading search icon, a clear button once there is text, "/" focuses the header field from anywhere (with a `/` hint on desktop). 44px in the header; 56px with a "Търси" button on the search page.
- **Comment form:** 48px name field, resizable textarea with a live "N / 1000" counter that turns red past 90%.
- **Newsletter:** pill field and tomato button on butter. On the homepage an opaque panel keeps all text clear of the illustrated sage backdrop.
- Errors show in deep error red under the field; success in herb green.

### Navigation
Sticky 64px white header: the logo and site name on the left; "Рецепти", "За Иво" as 44px pill links (the current section in tomato-wash with tomato-link text), the search field and the theme toggle on the right from 768px. On a phone a 44px menu button opens a panel with heading-size links, search and theme toggle. Pagination is a row of 44px circles, current page in ink. The paprika footer has the blog name and tagline beside link columns (categories; blog pages and RSS).

### Ingredient list (signature)
Each row is a whole-row tap target at least 56px tall: a 24px rounded checkbox with a `field-border` outline, the quantity in 600 weight tabular figures (min 4.75rem column), then the item in body text with any note in grey. Ticking pops the check and strikes the quantity; ticks persist across reloads. Quantities print cookable fractions and round by unit family. The servings stepper is two white 44px circles around a 600-weight count, capped at double the written recipe.

### Method steps (signature)
Each step is a 44px numbered circle on tomato wash beside body text (max 65ch). Tapping the circle marks it done: the circle fills tomato and the check pops. The first unfinished step after a finished one gets a tomato-wash "Продължете оттук" pill that rises in.

### Cook Mode (signature)
A full-screen modal that rises in: dish name and a 48px close circle, 6px pill progress segments (tomato up to the current step), "Стъпка N от M" in grey, the step at display size sliding in from the direction of travel, and a bottom bar of three 64px pills (ingredients toggle, Назад, tomato Напред/Готово). The ingredients sheet washes the ones the current step uses in tomato wash. The screen is kept awake.

### Step timer
A 44px pill ("Таймер: N мин", tomato icon, card shadow) under steps that name a duration. Running, it becomes a tomato-wash pill with the countdown and 44px pause and close controls.

### About page
A peach band that answers who and what: "Здравейте, аз съм Иво", one line on what is here, the live recipe and category count, the tomato "Към рецептите" button, and a square portrait cropped to head and shoulders. Below, "Как готвя" as four short principles under tomato rules (no cards, no icon tiles), "Започнете оттук" with the three newest recipes, and a butter band inviting comments. Every claim is one the owner has confirmed; counts come from live data, never typed in.

### Bulgarian typesetting
`keepShortWords()` (`src/lib/typography.ts`) ties one-letter words (в, с, и, а, о, у, к) to the next word with a non-breaking space in headlines, descriptions, steps and About copy, so none dangles at a line end.

### Resume banner
On the home page only, in the browser that was cooking within the last week: a neutral 16px-rounded card with a quiet shadow, "Продължете: {dish} · стъпка N" in tomato link, and a 44px dismiss circle.

### Doodle band
The original doodles (whisk, herbs, steam, citrus, soup bowl, basil and tomatoes) use 2.2px line work. `Band pattern` renders them at scale 0.85 and opacity 0.32 with tomato, herb and citrus accents around opaque content panels. The footer retains a monochrome 80px strip. Artwork is aria-hidden, non-focusable, pointer-events-none and hidden when printing. Never put text directly over visible pattern lines.

### Admin (scoped exception)
`src/app/admin/**` and `src/components/admin/**` inherit the colour and font tokens only. They are not held to these component patterns, and `--stamp`, `--kraft`, `--brand` remain defined in `globals.css` solely for them.

## Do's and Don'ts

### Do:
- **Do** balance cream with apricot, butter, sage and deep green; use `categoryTint` for cards, categories and recipe headers.
- **Do** let the photograph lead: 4:3 on every card, edge to edge at 40svh on the phone recipe page.
- **Do** use the named type tokens, with section headings larger than card titles.
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
- **Don't** introduce arbitrary type sizes outside the named scale.
- **Don't** substitute the action fill for the dedicated `text-link` colour.
- **Don't** fill a section background with tomato.
- **Don't** place the doodle pattern behind any text.
- **Don't** use em-dashes in visible copy, or chain more than one ` · ` on a line.
- **Don't** attach `window` scroll listeners; use IntersectionObserver or CSS scroll-driven animations.
- **Don't** animate for decoration: no looping motion except the hovered logo steam.
- **Don't** filter or dim food photographs in dark mode.
