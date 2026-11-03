# What makes a recipe blog look professional

Research and audit notes, 3 November 2026.

## Summary

- Looking polished earns trust, but it has limits. Nielsen Norman Group (NN/g) reports that attractive designs are perceived as more usable and buy tolerance for "minor usability problems, but not of large ones" ([NN/g](https://www.nngroup.com/articles/aesthetic-usability-effect/)). Their trust research names design quality, up-front disclosure, current content and connection to the web as the four credibility factors ([NN/g](https://www.nngroup.com/articles/trustworthy-design/)).
- Professional layout comes from a clear hierarchy built on contrast, scale and grouping, and from consistency, more than from any one style ([NN/g](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/), [NN/g](https://www.nngroup.com/articles/ten-usability-heuristics/)).
- The blog already meets most of the research. Real photos lead, whole cards are links, the grids are consistent, the byline shows Ivo's real photo and dates, the recipe starts straight away with no preamble, every target is 44px or more, and the structured data is complete.
- The largest gaps are mechanical, not visual. The resume banner shifts the home page after it loads. The two sticky bars take a large share of a short or zoomed screen. Keyboard focus can end up under the sticky header. On a phone, only two top-level links sit behind a menu button.
- Smaller gains: a home heading that says what the site is rather than greeting, an opaque recipe tab bar, a wider tablet search field, and extra recipe image crops for Google.

## Brief

Find what research says makes a recipe or food blog's layout look and feel professional, then measure this blog against it. Recommendations stay within the owner's documented decisions: the warm colourful palette, the doodle backgrounds and the Bulgarian copy ([PRODUCT.md](PRODUCT.md), [DESIGN.md](DESIGN.md), [DESIGN-RESEARCH.md](DESIGN-RESEARCH.md)). Sources are the organisations that own the research. Anything not verified at its source is listed under "Not verified".

## 1. What drives perceived professionalism and trust

| Factor | What the research says | Source |
| --- | --- | --- |
| Aesthetics | Users "perceive attractive products as more usable". The effect goes back to Kurosu and Kashimura (1995), who tested 26 ATM layouts with 252 participants. It forgives small problems, not large ones. | [NN/g: aesthetic-usability effect](https://www.nngroup.com/articles/aesthetic-usability-effect/) |
| Credibility | Four factors: design quality, up-front disclosure, comprehensive and current content, and connection to the rest of the web. "Typos, broken links, and other mistakes quickly degrade credibility." | [NN/g: trustworthy design](https://www.nngroup.com/articles/trustworthy-design/) |
| Visual hierarchy | Hierarchy guides the eye "in the order of intended importance" and is built from "color and contrast, scale, and grouping". For simple designs NN/g suggests about 2 primary and 2 secondary colours and no more than 3 type sizes. | [NN/g: visual hierarchy](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/) |
| Whitespace and grouping | Grouping is "conveyed implicitly through proximity and the use of white space or explicitly through enclosure". | [NN/g: visual hierarchy](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/) |
| Consistency | "Users should not have to wonder whether different words, situations, or actions mean the same thing." Keep internal consistency and follow industry conventions. | [NN/g: 10 heuristics, #4](https://www.nngroup.com/articles/ten-usability-heuristics/) |
| Restraint | "Interfaces should not contain information that is irrelevant or rarely needed." | [NN/g: 10 heuristics, #8](https://www.nngroup.com/articles/ten-usability-heuristics/) |
| Imagery | In eyetracking, users "pay attention to information-carrying images" and "ignore purely decorative images". | [NN/g: photos as content (2010)](https://www.nngroup.com/articles/photos-as-web-content/) |
| Typography | Body text reads best at 50–75 characters per line. Apple's default iOS body size is 17pt. | [Baymard: line length](https://baymard.com/blog/line-length-readability), [Apple HIG: accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility) |
| Scanning | The "layer-cake" pattern, where readers fixate on headings and subheadings, is "by far the most effective way" to scan. It depends on meaningful, visually distinct headings. | [NN/g: text scanning patterns](https://www.nngroup.com/articles/text-scanning-patterns-eyetracking/) |

In short, a site looks professional when its hierarchy is unambiguous, when similar things look and act the same way, when images carry real content, and when nothing obviously breaks.

## 2. Layout patterns for recipe content

### Recipe page structure

- **Answer first.** The inverted pyramid puts "the most important information" first, so a reader "can stop reading at any point" and still have the point ([NN/g](https://www.nngroup.com/articles/inverted-pyramid/)). For a recipe, that means ingredients and steps. I found no primary research on the "jump to recipe" button itself. It exists to work around preamble text, which this blog does not have.
- **Ingredients that never clip.** NN/g's iPad study (fieldwork 2010) saw a participant miss chocolate in a cookie recipe because the ingredient box scrolled with "no affordance for scrolling". The same study praised the Epicurious app because the recipe reads "without much scrolling and zooming in, or touching the screen… when your hands are dirty" ([NN/g report, 2nd ed.](https://www.nngroup.com/reports/ipad-app-and-website-usability/)).
- **Breadcrumbs only when the hierarchy is deep.** "For sites with flat hierarchies with only 1 or 2 levels of categories, a breadcrumb isn't needed as a wayfinding device", and "on mobile, the cost of using breadcrumbs can quickly overwhelm the benefits" ([NN/g](https://www.nngroup.com/articles/breadcrumbs/)).
- **Search appearance.** Google requires only `name` and `image`. It recommends `author`, times, `recipeIngredient`, `recipeInstructions`, `recipeYield`, `aggregateRating` and others. For images it recommends several high-resolution images "with the following aspect ratios: 16x9, 4x3, and 1x1". A `HowToStep` can carry a `url` that "directly links to the step" ([Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/recipe)).

### Card grids

Cards are "better suited when users browse… than when they search". Most implementations make "clicking or tapping anywhere on the card" open the details page, a larger touch zone that "substantially improves usability". The costs are that cards "deemphasize the ranking of content", are "less scannable than lists" and "take more space" ([NN/g: cards](https://www.nngroup.com/articles/cards-component/)).

### Home page

The home page is an elevator pitch. Generic "welcomes" "do not provide any information", so NN/g recommends "meaningful taglines instead". It also says "thoughtfully curated content examples are more effective… than broad, umbrella terms", and primary navigation should be "in a highly noticeable place" ([NN/g: homepage principles](https://www.nngroup.com/articles/homepage-design-principles/)). For horizontal shelves, let the next item bleed off the edge as a cue, keep to "5 or fewer frames", avoid dots on mobile and "do not auto-forward" ([NN/g: carousels](https://www.nngroup.com/articles/designing-effective-carousels/)).

### Navigation and search

- Hidden navigation is "less discoverable than visible or partially visible navigation". NN/g measured a drop of more than 20% in discoverability. "If your site has 4 or fewer top-level navigation links, display them as visible links" ([NN/g: hamburger menus, 2016](https://www.nngroup.com/articles/hamburger-menus/)).
- "Icon-only search makes sense on mobile devices", but on desktop "retain an open text-entry field" ([NN/g: magnifying-glass icon](https://www.nngroup.com/articles/magnifying-glass-icon/)). The field should be "wide enough to contain the typical query" ([NN/g: search visible and simple](https://www.nngroup.com/articles/search-visible-and-simple/)).

### Mobile: reach, sticky elements, one hand

- Steven Hoober observed 1,333 people. Of the 780 touching the screen, 49% held the phone in one hand, 36% cradled it and 15% used two hands ([UXmatters, 2013](https://www.uxmatters.com/mt/archives/2013/02/how-do-users-really-hold-mobile-devices.php)). He later retracted his thumb-reach drawings ("Please, please everyone ignore those drawings"). His later finding is that people "prefer to view and touch the center of the screen" and shift their grip constantly. Centre targets can be "as small as 7 millimeters, while corner target sizes must be about 12 millimeters" ([UXmatters, 2017](https://www.uxmatters.com/mt/archives/2017/03/design-for-fingers-touch-and-people-part-1.php)).
- Sticky headers should "minimize the vertical height" and "must be an opaque color". NN/g also advises: "it's best to not use animation at all" ([NN/g: sticky headers](https://www.nngroup.com/articles/sticky-headers/)).
- Apple's default control size is 44×44pt. Apple also says to "consider spacing between controls as important as size", with about 12pt of padding around bezelled elements ([Apple HIG](https://developer.apple.com/design/human-interface-guidelines/accessibility)). Material Design sets the minimum touch target at 48dp ([Android Developers, Material guidance](https://developer.android.com/develop/ui/compose/accessibility/api-defaults)).

### Print

I found no primary usability research on printing recipes. The site's print behaviour (below) is an owner design choice, not a cited requirement.

## 3. Accessibility and performance requirements that shape layout

| Requirement | Rule | Source |
| --- | --- | --- |
| Target size | 2.5.8 (AA): 24×24 CSS px with exceptions. 2.5.5 (AAA): 44×44 CSS px, which helps people with tremors and people using a phone "in environments where they are exposed to shaking". | [WCAG 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [WCAG 2.5.5](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html) |
| Reflow | 1.4.10: content works at 320 CSS px wide (1280px at 400% zoom) without two-way scrolling. Sticky content "can pose significant issues", and W3C "strongly suggest[s]" making it static at small viewport sizes (technique C34). | [WCAG 1.4.10](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), [C34](https://www.w3.org/WAI/WCAG22/Techniques/css/C34) |
| Focus not obscured | 2.4.11 (AA): a focused component is "not entirely hidden due to author-created content". The usual culprits are sticky headers and footers. Sufficient technique C43 uses CSS `scroll-padding`. | [WCAG 2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html), [C43](https://www.w3.org/WAI/WCAG22/Techniques/css/C43) |
| Contrast | Text needs 4.5:1, or 3:1 when large. UI component boundaries and states need "at least 3:1 against adjacent color(s)". | [WCAG 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [WCAG 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) |
| Core Web Vitals | Good means LCP within 2.5 s, INP of 200 ms or less and CLS of 0.1 or less, measured at the 75th percentile of page loads. | [web.dev: Web Vitals](https://web.dev/articles/vitals) |
| CLS causes | Images without dimensions, web fonts, and "banners or UI that pop in" and push content down. If space can't be reserved, place the content "later on the page". | [web.dev: optimise CLS](https://web.dev/articles/optimize-cls) |
| LCP | "Never lazy-load your LCP image". Use `fetchpriority="high"`, but setting it on more than one or two images reduces its value. | [web.dev: optimise LCP](https://web.dev/articles/optimize-lcp) |
| Ranking | "Core Web Vitals are used by our ranking systems", but relevance comes first. Google also asks whether visitors can "easily distinguish the main content". | [Google: page experience](https://developers.google.com/search/docs/appearance/page-experience) |

## 4. Audit of this site

### Already meets the guidance

| Finding | Where | Rule or source |
| --- | --- | --- |
| Real photos lead every card at one 4:3 ratio, and the doodles stay decorative, away from text. | `src/components/RecipeCard.tsx`, `Band.tsx` | DESIGN.md "Do let the photograph lead" and "Doodle band". NN/g photos as content. |
| The whole card is one link, with no nested controls. | `RecipeCard.tsx` | DESIGN.md Feature card. NN/g cards. |
| A single 72rem column with 1/2/3-column grids and fixed 24/40px gaps on home, index, related and about. | `Band.tsx`, `page.tsx`, `recepti/page.tsx`, `za-ivo/page.tsx` | DESIGN.md Layout. NN/g consistency heuristic. |
| One action colour (tomato) gives one clear focal point, while category colours carry meaning and always come with a name and icon. | `globals.css`, `categories.ts` | DESIGN.md Action Colour Rule. NN/g hierarchy (contrast, not hue, ranks). |
| Every recipe has a byline with Ivo's real portrait and real published and updated dates, plus an About page with confirmed claims and live counts. | `recepti/[slug]/page.tsx`, `za-ivo/page.tsx` | NN/g credibility: disclosure, current content. PRODUCT.md "Authenticity is the moat". |
| The recipe starts right after the header. There is no preamble, so no jump link is needed. | `recepti/[slug]/page.tsx` | NN/g inverted pyramid. |
| The ingredients panel sticks only when the whole list fits, so it never clips. | `StickyIfFits.tsx` | Avoids the clipped ingredient box in NN/g's iPad study. |
| A category back link and `BreadcrumbList` JSON-LD, with no visible breadcrumb trail. | `recepti/[slug]/page.tsx` | NN/g: breadcrumbs are not needed on flat hierarchies. |
| The top-rated shelf has at most 3 items, a 78% width so the next card peeks, no dots and no auto-advance. | `page.tsx` | NN/g carousels. |
| Search is an icon on phones and an open field from 768px. | `Header.tsx` | NN/g magnifying-glass icon. |
| The sticky header is opaque. | `Header.tsx` | NN/g sticky headers. DESIGN.md Elevation. |
| Controls are 44px or more, ingredient rows 56px, and Cook Mode buttons 64px. | throughout | WCAG 2.5.5 AAA, Apple 44pt. DESIGN.md "Do make every tap target at least 44px". |
| Body text is 17px, and method steps are capped at 65ch. | `globals.css`, `RecipeSteps.tsx` | Apple 17pt default. Baymard 50–75 characters. |
| Images sit in aspect-ratio boxes. The LCP hero is preloaded. Fonts use `next/font` fallbacks. | `RecipeCard.tsx`, `recepti/[slug]/page.tsx`, `layout.tsx` | web.dev CLS and LCP. [Next.js fonts](https://nextjs.org/docs/app/getting-started/fonts) ("no layout shift"). |
| Recipe JSON-LD has every required property and most recommended ones. The rating is omitted when the count is zero. | `recepti/[slug]/page.tsx` | Google recipe structured data. |
| Contrast is checked by script in all three theme paths, and field borders reach 3:1. | `scripts/check-design-contrast.mjs` | WCAG 1.4.3 and 1.4.11. |
| Print hides the site chrome, checkboxes and step photos, and adds the blog name and URL. | `recepti/[slug]/page.tsx`, ingredients and steps | Owner choice (no primary source found). |

One tension to note: NN/g suggests about four colours for simple designs, and this blog deliberately uses many more. That is a standing owner decision (PRODUCT.md, 1 November). The site already handles it the way the research would suggest: colour encodes category, and only tomato signals action. I do not recommend reducing it.

### Prioritised recommendations

**High**

1. **Stop the resume banner from shifting the home page.** `ResumeCooking` returns `null` in the prerendered page. It appears after hydration above the featured recipe, so the feature card is pushed down for returning cooks. web.dev names "banners or UI that pop in" as a CLS cause and recommends placing such content "later on the page" or overlaying it ([web.dev](https://web.dev/articles/optimize-cls)). Move it below the feature card, or render it as a fixed bottom card that overlays the page (also nearer the thumb). Files: `src/components/ResumeCooking.tsx`, `src/app/page.tsx`. DESIGN.md's home order ("resume banner, and a 7/5 photo-and-text feature") would need updating.

2. **Keep keyboard focus clear of the sticky bars.** `globals.css` sets `scroll-margin-top` on `[id]`, which only helps anchor jumps. No `scroll-padding` is set anywhere in `src/`, so a tabbed-to link can scroll under the 64px header and, on recipe pages, the tab bar. Add `html { scroll-padding-top: calc(var(--header-h) + 3.5rem); }`, following WCAG 2.4.11 technique C43 ([W3C](https://www.w3.org/WAI/WCAG22/Techniques/css/C43)). Files: `src/app/globals.css`. No conflict.

3. **Un-stick the header and tab bar on short viewports.** On a recipe page below 768px, the header (64px) and tab bar (about 60px, an estimate from its classes) are both sticky. At 400% zoom the viewport is about 318×236px ([W3C Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)), so these bars cover roughly half the screen. A phone propped on its side at the counter is also only about 360–430px tall. Add a `max-height` media query that makes both static, per technique C34 ([W3C](https://www.w3.org/WAI/WCAG22/Techniques/css/C34)). Files: `Header.tsx`, `RecipeTabs.tsx`, `globals.css`. This touches DESIGN.md's "64px sticky bar" rule, which would gain a short-screen exception.

**Medium**

4. **Show the top-level links on phones.** There are only two ("Рецепти", "За Иво"), and both sit behind the menu button. NN/g: with "4 or fewer top-level navigation links, display them as visible links" ([NN/g](https://www.nngroup.com/articles/hamburger-menus/)). Show at least "Рецепти" in the bar and keep the menu for categories and theme. First verify at 320px, because the logo, name, search and menu already share the bar. Files: `src/components/Header.tsx`. This changes DESIGN.md's Navigation description.

5. **Make the home `h1` say what the site is.** "Добре дошли в моята кухня" is a greeting. The useful facts (Ivo's own recipes, exact amounts, clear steps) sit in the paragraph below. NN/g recommends "meaningful taglines" over welcomes ([NN/g](https://www.nngroup.com/articles/homepage-design-principles/)). One option keeps the warmth: an `h1` such as "Домашни рецепти от моята кухня", with the greeting moved into the paragraph. File: `src/app/page.tsx`. **Conflict flag:** DESIGN-RESEARCH.md asks for "a welcoming Bulgarian introduction". The owner should choose the wording.

6. **Make the recipe tab bar opaque.** It uses `bg-background/90` with backdrop blur. NN/g says sticky bars "must be an opaque color" ([NN/g](https://www.nngroup.com/articles/sticky-headers/)). At 90% the risk is small, but solid `bg-background` costs nothing. File: `src/components/RecipeTabs.tsx`. **Conflict flag:** DESIGN.md says "The recipe tab bar retains its translucent background".

7. **Widen the header search field on tablets.** From 768px to 1023px the field is `w-40` (160px) with 44px of side padding, leaving about 70px for text (estimated). That is too narrow for a query like "баница със спанак". NN/g: "wide enough to contain the typical query" ([NN/g](https://www.nngroup.com/articles/search-visible-and-simple/)). Show the nav pills as icon and label only from `lg`, or give the field more width at `md`. File: `Header.tsx`.

8. **Add image crops and step links to the recipe JSON-LD.** Today `image` is one URL. Google recommends 16×9, 4×3 and 1×1 versions of at least 50,000 pixels each. Steps have no `id` or `url` ([Google](https://developers.google.com/search/docs/appearance/structured-data/recipe)). Generate the crops at upload, give each step `<li>` an id, and add `url` to each `HowToStep`. Files: `recepti/[slug]/page.tsx`, `RecipeSteps.tsx`, the admin upload path.

**Low**

9. **Mark only one or two images as high priority.** The index page passes `priority` to three cards, so each gets `fetchPriority="high"`. On a phone only one is visible. web.dev says more than one or two reduces its usefulness ([web.dev](https://web.dev/articles/optimize-lcp)). Keep `high` on the first card and plain `eager` on the next two. Files: `src/app/recepti/page.tsx`, `RecipeCard.tsx`.

10. **Add space between adjacent targets.** The phone header's search and menu buttons sit edge to edge in the top-right corner, where Hoober's centre-and-edge study found people need larger targets ([UXmatters](https://www.uxmatters.com/mt/archives/2017/03/design-for-fingers-touch-and-people-part-1.php)). Print and share are 8px apart, and the menu's category chips are 6px apart. Apple suggests about 12pt of padding ([Apple HIG](https://developer.apple.com/design/human-interface-guidelines/accessibility)). Add `gap-2` or `gap-3`, or use 48px buttons (Material). Files: `Header.tsx`, `recepti/[slug]/page.tsx`.

11. **Cap descriptions at 65ch.** Recipe and home descriptions use `max-w-2xl` (42rem), roughly 75–80 characters at 17px Onest (estimated). That is at or above Baymard's 75 ([Baymard](https://baymard.com/blog/line-length-readability)). `max-w-[65ch]` would match the steps. Files: `recepti/[slug]/page.tsx`, `page.tsx`.

12. **Check the facts grid at 320px.** At 320px each of the three columns is about 80px. "Подготовка" plus its icon may be wider, and a single word cannot wrap ([WCAG 1.4.10](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)). Inspect in a browser. If it overflows, use two columns below 360px. File: `recepti/[slug]/page.tsx`.

13. **Keep the type scale from growing.** On phones, card (22px), heading (24px) and section (28px) titles sit close together. NN/g warns against many near-equal sizes ([NN/g](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/)). No change is needed now, but do not add sizes. If titles ever seem to compete, the gap between card and section is the place to widen it. This is DESIGN.md's Type Hierarchy Rule, so any change belongs there.

## Not verified

- **Stanford Web Credibility guidelines** ("design your site so it looks professional", and the often-quoted figure that about 46% of people judged credibility on visual design). `credibility.stanford.edu` failed TLS verification, and the archive copy could not be fetched. Neither claim is used above.
- **Material 3 pages** (`m3.material.io`) render client-side and could not be read. The 48dp figure comes from Google's Android Developers page, which cites the Material guidelines.
- **Jump-to-recipe buttons and recipe printing**: no primary usability research was found.
- **Pixel estimates** (tab bar height, search text width, characters per line, the facts column, and the CSS px to millimetre comparison) come from reading the classes, not from rendering. Browser automation was not used, so check them in a real browser.

## Sources

- NN/g: [Aesthetic-usability effect](https://www.nngroup.com/articles/aesthetic-usability-effect/), [Trustworthy design](https://www.nngroup.com/articles/trustworthy-design/), [Visual hierarchy](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/), [10 usability heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/), [Text scanning patterns](https://www.nngroup.com/articles/text-scanning-patterns-eyetracking/), [Photos as web content](https://www.nngroup.com/articles/photos-as-web-content/), [Inverted pyramid](https://www.nngroup.com/articles/inverted-pyramid/), [Cards](https://www.nngroup.com/articles/cards-component/), [Homepage design principles](https://www.nngroup.com/articles/homepage-design-principles/), [Carousels](https://www.nngroup.com/articles/designing-effective-carousels/), [Hamburger menus](https://www.nngroup.com/articles/hamburger-menus/), [Magnifying-glass icon](https://www.nngroup.com/articles/magnifying-glass-icon/), [Search: visible and simple](https://www.nngroup.com/articles/search-visible-and-simple/), [Breadcrumbs](https://www.nngroup.com/articles/breadcrumbs/), [Sticky headers](https://www.nngroup.com/articles/sticky-headers/), [iPad App and Website Usability, 2nd ed.](https://www.nngroup.com/reports/ipad-app-and-website-usability/)
- Baymard Institute: [Line length readability](https://baymard.com/blog/line-length-readability)
- Steven Hoober, UXmatters: [How do users really hold mobile devices? (2013)](https://www.uxmatters.com/mt/archives/2013/02/how-do-users-really-hold-mobile-devices.php), [Design for fingers, touch, and people, part 1 (2017)](https://www.uxmatters.com/mt/archives/2017/03/design-for-fingers-touch-and-people-part-1.php)
- W3C WCAG 2.2: [1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [1.4.10](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), [1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html), [2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html), [2.5.5](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html), [2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [C34](https://www.w3.org/WAI/WCAG22/Techniques/css/C34), [C43](https://www.w3.org/WAI/WCAG22/Techniques/css/C43)
- Google: [Web Vitals](https://web.dev/articles/vitals), [Optimize CLS](https://web.dev/articles/optimize-cls), [Optimize LCP](https://web.dev/articles/optimize-lcp), [Page experience](https://developers.google.com/search/docs/appearance/page-experience), [Recipe structured data](https://developers.google.com/search/docs/appearance/structured-data/recipe), [Android: minimum touch target (Material)](https://developer.android.com/develop/ui/compose/accessibility/api-defaults)
- Apple: [Human Interface Guidelines: Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- Next.js: [Fonts](https://nextjs.org/docs/app/getting-started/fonts)
