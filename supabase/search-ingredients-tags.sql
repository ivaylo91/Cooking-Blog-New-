-- ===========================================================================
-- Search recipes by their ingredients and tags, not only title and
-- description. Run once in Supabase: SQL Editor > New query > paste > Run.
-- It runs in one transaction, so a failure changes nothing. Safe to re-run.
--
-- Before: search_vector was a generated column, which can only read the
-- recipe row itself. Now it is a plain column kept up to date by triggers
-- on recipes, ingredients, recipe_tags and tags.
--
-- Weights rank where a word was found: title (A), description and tags (B),
-- ingredients (C). The site's prefix search (src/lib/recipes.ts) is unchanged.
-- ===========================================================================

begin;

-- ---------------------------------------------------------------------------
-- 1. updated_at means "the recipe was edited". Rebuilding the search index,
--    a like or a rating also writes the row, and must not move the
--    "обновено" date or the sitemap's lastmod.
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
set search_path to 'public'
as $$
declare
  -- total_time_minutes is generated, so it is still NULL in NEW here and
  -- would make every update look like an edit.
  not_edits constant text[] := array[
    'search_vector', 'updated_at', 'likes_count', 'rating_sum', 'rating_count',
    'total_time_minutes'
  ];
begin
  if (to_jsonb(new) - not_edits) = (to_jsonb(old) - not_edits) then
    new.updated_at = old.updated_at;
  else
    new.updated_at = now();
  end if;
  return new;
end;
$$ language plpgsql;

-- ---------------------------------------------------------------------------
-- 2. The search document for one recipe.
-- ---------------------------------------------------------------------------
create or replace function public.recipe_search_document(
  p_recipe_id uuid,
  p_title text,
  p_description text
)
returns tsvector
language sql
stable
set search_path to 'public'
as $$
  select
    setweight(to_tsvector('simple', coalesce(p_title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(p_description, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce((
      select string_agg(t.name, ' ')
      from recipe_tags rt
      join tags t on t.id = rt.tag_id
      where rt.recipe_id = p_recipe_id
    ), '')), 'B') ||
    setweight(to_tsvector('simple', coalesce((
      select string_agg(i.item, ' ')
      from ingredients i
      where i.recipe_id = p_recipe_id
    ), '')), 'C');
$$;

-- ---------------------------------------------------------------------------
-- 3. Swap the generated column for a plain one. Dropping the column also
--    drops its index, which is recreated below.
-- ---------------------------------------------------------------------------
alter table public.recipes drop column if exists search_vector;
alter table public.recipes add column search_vector tsvector;
create index if not exists recipes_search_idx on public.recipes using gin (search_vector);

-- ---------------------------------------------------------------------------
-- 4. Triggers. Security definer so an index refresh never depends on what
--    the editing role may update; they only ever write search_vector.
-- ---------------------------------------------------------------------------

-- The recipe's own text: set before the row is written.
create or replace function public.recipes_search_on_recipe()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
begin
  new.search_vector := recipe_search_document(new.id, new.title, new.description);
  return new;
end;
$$;

drop trigger if exists recipes_search_on_recipe on public.recipes;
create trigger recipes_search_on_recipe
  before insert or update of title, description on public.recipes
  for each row execute function public.recipes_search_on_recipe();

-- Ingredients and tag links: refresh the recipe they belong to. The UPDATE
-- sets only search_vector, so it doesn't re-fire the trigger above.
create or replace function public.recipes_search_on_child()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  affected uuid := coalesce(new.recipe_id, old.recipe_id);
begin
  update recipes r
  set search_vector = recipe_search_document(r.id, r.title, r.description)
  where r.id = affected;
  return null;
end;
$$;

drop trigger if exists ingredients_search_refresh on public.ingredients;
create trigger ingredients_search_refresh
  after insert or update or delete on public.ingredients
  for each row execute function public.recipes_search_on_child();

drop trigger if exists recipe_tags_search_refresh on public.recipe_tags;
create trigger recipe_tags_search_refresh
  after insert or update or delete on public.recipe_tags
  for each row execute function public.recipes_search_on_child();

-- A renamed tag: refresh every recipe that carries it.
create or replace function public.recipes_search_on_tag()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
begin
  update recipes r
  set search_vector = recipe_search_document(r.id, r.title, r.description)
  where r.id in (select rt.recipe_id from recipe_tags rt where rt.tag_id = new.id);
  return null;
end;
$$;

drop trigger if exists tags_search_refresh on public.tags;
create trigger tags_search_refresh
  after update of name on public.tags
  for each row execute function public.recipes_search_on_tag();

-- Trigger functions are not meant to be called through the API.
revoke all on function public.recipes_search_on_recipe() from public, anon, authenticated;
revoke all on function public.recipes_search_on_child() from public, anon, authenticated;
revoke all on function public.recipes_search_on_tag() from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 5. Fill the index for every existing recipe. updated_at stays as it was
--    (step 1).
-- ---------------------------------------------------------------------------
update public.recipes r
set search_vector = public.recipe_search_document(r.id, r.title, r.description);

commit;
