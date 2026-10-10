---
version: 1
slug: "src-app-recepti-slug-page-tsx"
primary_target: "src/app/recepti/[slug]/page.tsx"
related_targets: ["src/app/page.tsx","src/app/recepti/page.tsx","src/app/layout.tsx"]
---

# Surface brief: public blog (recipe page leads)

Scope: the whole public site, redesigned as one world. The recipe page is the surface that must prove it; home, recipe index, search, about, 404 and error inherit it. Admin inherits tokens only.

Visitor mode: Read (recipe page, index, search, about); the home page leans Persuade inside the same world.

Audience and job: Bulgarian home cooks following a recipe on a phone propped in the kitchen, often at night, hands wet or floury. Job: read the quantities, follow the steps, not lose their place.

Constraints: all existing features keep working; doodle pattern is a pinned brand asset and never sits under body text; no invented claims, ratings, people or biography; prerendering and caching must survive.

## Direction contract

THESIS: Every recipe printed like a Bulgarian pantry staple: the front of the pack names the dish and its net-weight facts, the back carries the method. Refuses the category default of cream ground, serif display, terracotta accent and a rounded photo-card grid.

OWN-WORLD: White label stock and ink-black print; heavy 3px ink rules and hairline panel boxes; square die-cut corners, no pills. Colour arrives only as full-bleed category lid fields: Супи cobalt, Основни ястия red, Салати green, Десерти sunflower yellow, Тестени kraft, Постни olive, Консерви tomato. Sofia Sans Extra Condensed caps for names and labels, Sofia Sans for reading, tabular numerals with true fractions. A round red ink stamp reading "Изпробвано в кухнята на Иво". The doodle pattern printed in one ink as a band, never under body text.

STORY: The cook reads the dish name and its portions and minutes at a glance, trusts it was cooked by Иво, then moves between Съставки and Начин на приготвяне with wet hands, ticking ingredients and steps that stay ticked when they come back.

FIRST VIEWPORT (recipe page, 390px): the category lid field runs full-bleed: a back link to the category, the recipe name in ~56px extra-condensed caps, the description, then a ruled row of big numerals (portions, prep, cook) with the stamp overlapping its right edge. Photo window directly below. A sticky Съставки | Приготвяне tab bar. Primary action "Готви стъпка по стъпка" is the filled cobalt button heading the method. Desktop: the field spans the width, name and numerals left, photo window right.

FORM: Bulgarian dairy and flour packaging (grounded candidate 6 of 7, seed key c48ff480). Raises: tabular fractions (darkroom record); step state marks and a remembered position (cutting bench); huge numerals (alphabet storm); one strict label grid on every card (sneaker box); a colourless reading column (civic prospectus); ingredients and method one tap apart (cassette J-card).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

- About page content (photo, story, origins) waits on the user. Do not invent it.
