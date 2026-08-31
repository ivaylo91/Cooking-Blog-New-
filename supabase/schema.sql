-- Кулинарният блог на Иво — Supabase schema
-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Categories (Основни ястия, Супи, Салати, Десерти, Тестени, Постни, ...)
-- ---------------------------------------------------------------------------
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Tags (постно, бързо, лятно, без глутен, ...)
-- ---------------------------------------------------------------------------
create table if not exists tags (
  id uuid primary key default gen_random_uuid(),
  name text unique not null
);

-- ---------------------------------------------------------------------------
-- Recipes
-- ---------------------------------------------------------------------------
create table if not exists recipes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null default '',
  category_id uuid references categories (id) on delete set null,
  cuisine text not null default 'Българска',
  difficulty text not null default 'лесно' check (difficulty in ('лесно', 'средно', 'трудно')),
  prep_time_minutes int not null default 0,
  cook_time_minutes int not null default 0,
  servings int not null default 4,
  image_path text,
  published boolean not null default false,
  likes_count int not null default 0,
  author_id uuid references auth.users (id) on delete set null,
  search_vector tsvector generated always as (
    to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(description, ''))
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists recipes_search_idx on recipes using gin (search_vector);
create index if not exists recipes_category_idx on recipes (category_id);
create index if not exists recipes_published_idx on recipes (published);

-- ---------------------------------------------------------------------------
-- Ingredients — grouped, ordered list per recipe
-- ---------------------------------------------------------------------------
create table if not exists ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references recipes (id) on delete cascade,
  group_name text not null default '',
  position int not null default 0,
  amount numeric,
  unit text not null default '',
  item text not null,
  note text not null default ''
);

create index if not exists ingredients_recipe_idx on ingredients (recipe_id, position);

-- ---------------------------------------------------------------------------
-- Steps — ordered instructions per recipe
-- ---------------------------------------------------------------------------
create table if not exists steps (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references recipes (id) on delete cascade,
  position int not null default 0,
  text text not null,
  image_path text
);

create index if not exists steps_recipe_idx on steps (recipe_id, position);

-- ---------------------------------------------------------------------------
-- Recipe <-> Tag join table
-- ---------------------------------------------------------------------------
create table if not exists recipe_tags (
  recipe_id uuid not null references recipes (id) on delete cascade,
  tag_id uuid not null references tags (id) on delete cascade,
  primary key (recipe_id, tag_id)
);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists recipes_set_updated_at on recipes;
create trigger recipes_set_updated_at
  before update on recipes
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Public (anon) can read published recipes and their children.
-- Authenticated users (the admin account) can do everything — this is a
-- single-author blog, so no per-row ownership checks are needed.
-- ---------------------------------------------------------------------------
alter table categories enable row level security;
alter table tags enable row level security;
alter table recipes enable row level security;
alter table ingredients enable row level security;
alter table steps enable row level security;
alter table recipe_tags enable row level security;

create policy "categories are publicly readable" on categories
  for select using (true);
create policy "authenticated manage categories" on categories
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "tags are publicly readable" on tags
  for select using (true);
create policy "authenticated manage tags" on tags
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "published recipes are publicly readable" on recipes
  for select using (published = true or auth.role() = 'authenticated');
create policy "authenticated manage recipes" on recipes
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "ingredients of visible recipes are readable" on ingredients
  for select using (
    exists (
      select 1 from recipes r
      where r.id = ingredients.recipe_id
        and (r.published = true or auth.role() = 'authenticated')
    )
  );
create policy "authenticated manage ingredients" on ingredients
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "steps of visible recipes are readable" on steps
  for select using (
    exists (
      select 1 from recipes r
      where r.id = steps.recipe_id
        and (r.published = true or auth.role() = 'authenticated')
    )
  );
create policy "authenticated manage steps" on steps
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "recipe_tags of visible recipes are readable" on recipe_tags
  for select using (
    exists (
      select 1 from recipes r
      where r.id = recipe_tags.recipe_id
        and (r.published = true or auth.role() = 'authenticated')
    )
  );
create policy "authenticated manage recipe_tags" on recipe_tags
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- Storage bucket for recipe photos.
-- Create it once (Storage > New bucket), name it exactly "recipe-images",
-- mark it Public, then run the policies below.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('recipe-images', 'recipe-images', true)
on conflict (id) do nothing;

create policy "recipe images are publicly readable" on storage.objects
  for select using (bucket_id = 'recipe-images');
create policy "authenticated upload recipe images" on storage.objects
  for insert with check (bucket_id = 'recipe-images' and auth.role() = 'authenticated');
create policy "authenticated update recipe images" on storage.objects
  for update using (bucket_id = 'recipe-images' and auth.role() = 'authenticated');
create policy "authenticated delete recipe images" on storage.objects
  for delete using (bucket_id = 'recipe-images' and auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- Comments — public, anonymous comments on published recipes
-- ---------------------------------------------------------------------------
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references recipes (id) on delete cascade,
  author_name text not null,
  text text not null,
  created_at timestamptz not null default now(),
  constraint comments_author_name_length check (char_length(author_name) between 1 and 60),
  constraint comments_text_length check (char_length(text) between 1 and 1000)
);

create index if not exists comments_recipe_idx on comments (recipe_id, created_at desc);

alter table comments enable row level security;

create policy "comments on visible recipes are readable" on comments
  for select using (
    exists (
      select 1 from recipes r
      where r.id = comments.recipe_id
        and (r.published = true or auth.role() = 'authenticated')
    )
  );

create policy "anyone can comment on published recipes" on comments
  for insert with check (
    exists (select 1 from recipes r where r.id = comments.recipe_id and r.published = true)
  );

create policy "authenticated manage comments" on comments
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- Likes — anonymous, one increment per browser (enforced client-side via
-- localStorage; this function only prevents direct table tampering).
-- ---------------------------------------------------------------------------
create or replace function increment_recipe_likes(p_recipe_id uuid)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count int;
begin
  update recipes
  set likes_count = likes_count + 1
  where id = p_recipe_id and published = true
  returning likes_count into new_count;
  return new_count;
end;
$$;

grant execute on function increment_recipe_likes(uuid) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Starter categories
-- ---------------------------------------------------------------------------
insert into categories (slug, name) values
  ('osnovni-yastia', 'Основни ястия'),
  ('supi', 'Супи'),
  ('salati', 'Салати'),
  ('deserti', 'Десерти'),
  ('testeni', 'Тестени'),
  ('postni', 'Постни'),
  ('konservi', 'Консерви')
on conflict (slug) do nothing;
