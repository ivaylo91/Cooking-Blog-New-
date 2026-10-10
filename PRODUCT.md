# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Bulgarian home cooks who find a recipe and cook it at home, following it on a phone propped up in the kitchen. Their hands are often wet or floury, their attention is split between the screen and the stove, and they read in short glances rather than long sittings. Reading, scaling and following steps matter more than browsing.

## Product Purpose

Кулинарният блог на Иво is a personal recipe blog. It publishes recipes Иво actually cooks, photographed in his own kitchen, so that someone else can reproduce them at home. Success is a reader cooking the dish successfully from their phone and coming back for another one.

## Positioning

Every recipe is tested in Иво's own kitchen and photographed there, by him. The big Bulgarian recipe portals aggregate submissions from many authors; this blog is one cook's working repertoire. That claim is only true as long as each recipe and photo is genuinely his.

## Operating Context

- Phone first: most reading happens on a phone on a counter, mid-cook, often at night.
- The reader moves between the ingredient list and the steps repeatedly while cooking.
- Discovery happens through search engines, sharing in Viber, WhatsApp and Facebook, and the blog's own category and time filters.
- Иво publishes and edits recipes himself through the admin at `/admin`.

## Capabilities and Constraints

- Stack: Next.js 16 (App Router, Cache Components), React 19, Tailwind CSS v4, Supabase (Postgres, Auth, Storage), deployed on Vercel at www.cookingblogofivo.com.
- All content and UI are in Bulgarian (Cyrillic). Fonts must ship a Cyrillic subset.
- Existing features that must keep working: recipe listing with category, time and difficulty filters and pagination; search; recipe detail with servings scaler, ingredient checklist, numbered steps with optional step photos, Cook Mode (full-screen, wake lock), ratings, likes, print, sharing; comments with spam protection; newsletter signup; light and dark themes; RSS; structured data; the admin.
- Public pages are prerendered and cached; layout changes must not reintroduce per-request rendering.
- The blog name "Кулинарният блог на Иво" and the domain stay. The user did not pin the name, but renaming is out of scope for a redesign.

## Brand Commitments

- The illustrated doodle pattern (whisk, herb sprig, steam curls, citrus slice, soup bowl, basil and tomatoes; `src/components/CookingBackground.tsx`) is a binding brand asset and stays in the redesign. Its placement and treatment may change, but it must not sit behind recipe body text (see the 2026-10-07 critique).
- The terracotta accent, the current fonts and the current layout are not binding and may be replaced.
- Voice: plain, warm Bulgarian with kitchen idiom. The 404 line "Тази страница липсва от менюто" is the reference for tone.

## Evidence on Hand

- 24 published recipes with ingredients and steps, 23 of them with real photos taken by Иво (Supabase Storage bucket `recipe-images`). Леща яхния has no photo yet.
- One real reader comment. No ratings and no likes yet.
- No photo of Иво, no biography, and no story of where the recipes come from. These must not be invented; the About page waits on the user to supply them.
- No testimonials, press, or traffic figures exist, and none may be fabricated.

## Product Principles

1. The kitchen is the use case. Every layout decision is judged on a phone, mid-cook, with compromised hands.
2. The recipe is the product. Decoration, social proof and sharing never outrank the ingredients and steps.
3. Authenticity is the moat. Only Иво's own recipes and photos; nothing implies more people, ratings or history than exist.
4. Quantities must stay cookable at every serving size.

## Accessibility & Inclusion

WCAG 2.1 AA. Touch targets at least 44×44 px on mobile, since the primary use is touch with wet or floury fingers. Visible focus in both themes. Respect reduced-motion preferences.
