-- Security hardening, step 2 of 2. Run in the Supabase SQL editor only AFTER
-- the code from the same commit is live on Vercel: older code reads
-- comments.* and writes ratings directly, and would fail once this runs.
--
-- Least privilege for the public key, which ships in every page: read what
-- the site shows, add a comment or a subscriber, nothing else.

-- Ratings are written only through submit_rating, and nobody needs to read
-- individual votes: pages use the totals on recipes.
drop policy if exists "anyone can rate a published recipe" on public.ratings;
drop policy if exists "anyone can change their own rating" on public.ratings;
drop policy if exists "ratings of visible recipes are readable" on public.ratings;
create policy "admins read ratings" on public.ratings
  for select using ((select public.is_admin()));

revoke all on public.categories, public.tags, public.recipes, public.ingredients,
  public.steps, public.recipe_tags, public.comments, public.ratings, public.subscribers
  from anon;

grant select on public.categories, public.tags, public.recipes, public.ingredients,
  public.steps, public.recipe_tags to anon;

-- IP hashes stay out of reach of anyone holding the public key.
grant select (id, recipe_id, author_name, text, created_at) on public.comments to anon;
grant insert (recipe_id, author_name, text, ip_hash) on public.comments to anon;
grant insert (email, ip_hash) on public.subscribers to anon;

revoke select on public.comments from authenticated;
grant select (id, recipe_id, author_name, text, created_at) on public.comments to authenticated;

-- Nobody but the database needs these on any table.
revoke truncate, trigger, references on public.categories, public.tags, public.recipes,
  public.ingredients, public.steps, public.recipe_tags, public.comments, public.ratings,
  public.subscribers from anon, authenticated;
