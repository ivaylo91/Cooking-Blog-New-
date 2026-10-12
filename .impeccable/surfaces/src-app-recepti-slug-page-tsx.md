---
version: 1
slug: "src-app-recepti-slug-page-tsx"
primary_target: "src/app/recepti/[slug]/page.tsx"
related_targets: ["src/app/page.tsx","src/app/recepti/page.tsx","src/app/layout.tsx"]
---

# Surface brief: public blog (recipe page leads)

Scope: the whole public site, redesigned as one world. The recipe page proves it; home, recipe index, search, about, 404 and error inherit it. Admin inherits tokens only.

Visitor mode: Read (recipe page, index, search, about); the home page leans Persuade inside the same world.

Audience and job: Bulgarian home cooks following a recipe on a phone in the kitchen, often at night, hands wet or floury. Job: read quantities, follow steps, keep their place.

Constraints: all features keep working, including the 2026-10-10 usability gains (persistent ticks, resume tab, Cook Mode dialog with ingredients sheet, fractions, sticky Съставки | Приготвяне bar, rating after the method, stocked categories only). Doodle pattern is pinned and never sits under body text. Must feel contemporary (Бакалия rejected as retro). No invented claims, ratings, people or biography. Prerendering and caching must survive.

## Direction contract

THESIS: The blog as a modern food-magazine app: the food photograph leads, a confident contemporary sans names the dish, and calm white space does the rest. Refuses both the cream-serif-terracotta recipe default and any retro or packaging pastiche.

OWN-WORLD: White ground, near-black ink #111, one grey for secondary text, a single tomato accent (#c2410c light, #ff7a45 dark) for the primary action and active states only. Onest throughout, sentence case, bold weights for names, tight display leading, four type sizes. Photos in 16px-rounded frames, cards without borders on a faint #f5f5f4 tint, 999px radius only on small chips. The doodle pattern printed in fine grey line as a footer band. Dark mode is an evening kitchen: #121212 ground, warm off-white ink, photos untouched.

STORY: The cook sees the dish first, reads its name and minutes at a glance, trusts it was cooked by Иво, then moves between ingredients and method with one tap, ticking as they go, and finds their place again after looking away.

FIRST VIEWPORT (recipe page, 390px): the photo full width, edge to edge, about 60% of the viewport; below it a back link to the category, the dish name in ~40px bold Onest, one line of description, and a facts row (portions, prep, cook) as large numerals with small grey labels. Desktop: a wide rounded photo across the container, name and facts below in a left column, the start of ingredients visible. Primary action "Готви стъпка по стъпка" is the filled tomato button heading the method.

FORM: modern food-magazine app (grounded candidate, my top pick, chosen by the user; seed key c48ff480, re-roll round 1). Raises carried: fixed photo ratio on every card; four type sizes; current step's ingredients highlighted; designed dark mode; resume link on home; doodle as a fine-line band.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

- About page content (photo, story, origins) waits on the user. Do not invent it.
