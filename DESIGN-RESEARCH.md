# A welcoming home kitchen

Research and implementation notes, 1 November 2026.

## Brief

The owner found the neutral magazine treatment too pale and asked for a friendly,
warm, colourful blog with a cooking background and stronger contrast. This
direction supersedes the earlier preference for neutral cards and minimal colour.

## References and application

| Reference | Observed pattern or guidance | Application here |
| --- | --- | --- |
| [RecipeTin Eats](https://www.recipetineats.com/) | A featured recipe with a direct recipe link, latest recipes and named cooking categories. | Keep one leading dish, a clear recipe action, latest recipes and visible category navigation. |
| [Love & Lemons](https://www.loveandlemons.com/) | Recipe discovery, cooking times, latest and popular recipes, and a personal author introduction. | Preserve the time/rating metadata, show Ivo with his real portrait, and retain clear recipe groupings. |
| [Good Food: easy recipes](https://www.bbcgoodfood.com/recipes/collection/easy-recipes) | Recipe lists expose time, difficulty and ratings to help readers choose. | Preserve the existing useful recipe metadata and filters as the visual presentation changes. |
| [W3C: contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) | Normal text requires at least 4.5:1 contrast; large text requires 3:1. | Test palette combinations in light, system-dark and explicitly selected dark themes. Keep patterned artwork outside the opaque reading panels. |
| [W3C: target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) | WCAG 2.2 AA specifies 24px targets with exceptions; the guidance recommends larger targets for important controls. | Retain the blog's more generous 44px minimum controls and use large, whole-card category links. |

These examples inform information structure. The illustrated background, colours
and section composition are design decisions for Ivo's stated preference, not
claims that a particular palette guarantees higher engagement. No third-party
photography, illustrations or code were copied.

## Visual direction

- Warm cream page, apricot welcome, butter-yellow featured recipe and newsletter.
- Herb-green author section with cream text creates a strong change in tone.
- Categories use distinct food colours and familiar icons, with readable labels.
- Recipe cards carry category colour beneath real, consistently cropped food photos.
- Existing SVG cooking illustrations gain tomato, herb and citrus strokes. They
  appear around the hero and newsletter panels, as well as the existing footer.
- All patterned sections place text and controls on opaque surfaces. Artwork is
  decorative, hidden from assistive technology, noninteractive and hidden in print.
- Lora and Onest retain the blog's identity and Cyrillic support. Clear heading
  sizes, aligned cards and consistent spacing keep the richer colour organized.
- Use a welcoming Bulgarian introduction, without adding unverified author claims.

## Validation

Run `node scripts/check-design-contrast.mjs` for the actual CSS token combinations.
It checks text, button labels, form placeholders, field borders and focus colours
across the three theme paths. It does not prove full WCAG conformance or replace
visual inspection of cropping, wrapping, focus, and responsive layouts.

Run `npm.cmd run build` for production compilation, TypeScript and page generation.
Browser automation was unavailable during this iteration; rendered desktop/mobile
visual inspection remains a separate verification limit.
