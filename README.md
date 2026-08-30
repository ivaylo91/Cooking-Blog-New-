# Кулинарният блог на Иво

Recipe blog built with Next.js (App Router) and Supabase.

## Stack

- **Next.js 16** — React framework, App Router, TypeScript
- **Supabase** — Postgres database, Auth, Storage (recipe photos)
- **Tailwind CSS 4** — styling
- Recipe pages emit `schema.org/Recipe` JSON-LD for Google rich results

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In **Project Settings → API**, copy the **Project URL** and **anon public key**.
3. Copy `.env.local.example` to `.env.local` and fill in those two values.
4. In **Storage**, create a bucket named exactly `recipe-images` and mark it **Public**
   (the schema below also does this for you if the bucket doesn't exist yet).
5. Open **SQL Editor → New query**, paste the contents of [`supabase/schema.sql`](supabase/schema.sql),
   and run it. This creates all tables, row-level security policies, storage policies,
   and seeds the starter categories.
6. In **Authentication → Users**, click **Add user** and create your own admin account
   (email + password). Only authenticated users can write recipes — there is no public
   sign-up.

## 2. Run locally

```bash
npm install
npm run dev
```

- Public site: [http://localhost:3000](http://localhost:3000)
- Admin login: [http://localhost:3000/admin/login](http://localhost:3000/admin/login) —
  sign in with the Supabase user you created above.

## 3. Writing recipes

Log in at `/admin`, click **Нова рецепта**, and fill in the form: title, category,
times, servings, ingredients (grouped, with amounts so the servings scaler works),
steps, tags, and a cover photo. A recipe is only visible on the public site once its
**Публикувана** checkbox is on.

## 4. Deploy

Push this repo to GitHub and import it in [Vercel](https://vercel.com/new) — it
detects Next.js automatically. Add the same two `NEXT_PUBLIC_SUPABASE_*` environment
variables in the Vercel project settings, plus `NEXT_PUBLIC_SITE_URL` set to your
production domain (used by the sitemap and robots.txt).

## Project structure

```
src/app/                 public pages (home, /recepti, /recepti/[slug], /tarsene)
src/app/admin/           admin dashboard + recipe editor (auth-gated by src/proxy.ts)
src/lib/supabase/        browser/server/proxy Supabase clients
src/lib/recipes.ts       data-fetching for the public site
src/components/          shared UI (RecipeCard, JsonLd, servings scaler, ...)
src/components/admin/    recipe form, image upload, dashboard row actions
supabase/schema.sql      full database schema — run once in Supabase's SQL editor
```
