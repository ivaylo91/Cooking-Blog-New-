-- Security hardening, step 1 of 2. Run in the Supabase SQL editor BEFORE
-- deploying the code that calls submit_rating. Safe to run on the live site:
-- public reads don't change, and every existing account becomes an admin, so
-- run it while the only account is the owner's.
--
-- Why: sign-up is a public endpoint, and the old policies trusted anyone who
-- was signed in. A stranger could register and edit recipes, delete comments
-- and read subscriber emails. Being signed in must not mean being the owner.

create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);
alter table public.admins enable row level security;

drop policy if exists "admins can see themselves" on public.admins;
create policy "admins can see themselves" on public.admins
  for select using (user_id = (select auth.uid()));

revoke all on public.admins from anon, authenticated;
grant select on public.admins to anon, authenticated;

insert into public.admins (user_id)
select id from auth.users
on conflict do nothing;

create or replace function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- Swap "any signed-in user" for "a named admin" in every existing policy.
do $$
declare
  p record;
  new_using text;
  new_check text;
  stmt text;
begin
  for p in
    select schemaname, tablename, policyname, qual, with_check
    from pg_policies
    where schemaname in ('public', 'storage')
      and (qual like '%auth.role()%' or with_check like '%auth.role()%')
  loop
    new_using := replace(replace(p.qual,
      '( SELECT auth.role() AS role) = ''authenticated''::text', '( SELECT public.is_admin() AS is_admin)'),
      'auth.role() = ''authenticated''::text', '( SELECT public.is_admin() AS is_admin)');
    new_check := replace(replace(p.with_check,
      '( SELECT auth.role() AS role) = ''authenticated''::text', '( SELECT public.is_admin() AS is_admin)'),
      'auth.role() = ''authenticated''::text', '( SELECT public.is_admin() AS is_admin)');
    stmt := format('alter policy %I on %I.%I', p.policyname, p.schemaname, p.tablename);
    if new_using is not null then stmt := stmt || format(' using (%s)', new_using); end if;
    if new_check is not null then stmt := stmt || format(' with check (%s)', new_check); end if;
    execute stmt;
  end loop;
end $$;

-- Photos only, at a size a phone produces; no SVG, which can carry scripts.
update storage.buckets
set file_size_limit = 15 * 1024 * 1024,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id = 'recipe-images';

-- One writer for ratings, so "own rating" is enforced by the server's hash
-- instead of a policy that let anyone update every row.
create or replace function public.submit_rating(p_recipe_id uuid, p_value int, p_ip_hash text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_value not between 1 and 5 then
    raise exception 'rating out of range';
  end if;
  if not exists (select 1 from public.recipes where id = p_recipe_id and published) then
    raise exception 'recipe not found';
  end if;
  insert into public.ratings (recipe_id, value, ip_hash, updated_at)
  values (p_recipe_id, p_value, p_ip_hash, now())
  on conflict (recipe_id, ip_hash)
  do update set value = excluded.value, updated_at = now();
end;
$$;

revoke all on function public.submit_rating(uuid, int, text) from public;
grant execute on function public.submit_rating(uuid, int, text) to anon, authenticated;
