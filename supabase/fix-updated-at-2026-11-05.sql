-- ===========================================================================
-- One-off repair after search-ingredients-tags.sql (run on 5 Nov 2026).
-- Run once in Supabase: SQL Editor > New query > paste > Run.
--
-- That migration's set_updated_at missed one column: total_time_minutes is
-- generated, so it is still NULL in NEW inside a BEFORE trigger, every
-- update looked like an edit, and the index backfill stamped all 27 recipes
-- as edited at 2026-11-05 10:14:17 UTC. This fixes the function and puts
-- back each recipe's previous updated_at (read from the sitemap built just
-- before). Only rows still carrying that stamp are touched; safe to re-run.
-- ===========================================================================

begin;

create or replace function public.set_updated_at()
returns trigger
set search_path to 'public'
as $$
declare
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

alter table public.recipes disable trigger recipes_set_updated_at;

update public.recipes r
set updated_at = v.ts::timestamptz
from (values
  ('amerikanski-palachinki', '2026-09-05T17:15:19.231896+00:00'),
  ('baklava', '2026-09-05T16:35:25.949585+00:00'),
  ('banitsa-sas-sirene', '2026-09-05T16:32:28.713258+00:00'),
  ('chiyzkeyk', '2026-09-05T16:53:51.942967+00:00'),
  ('gyuvecheta', '2026-10-16T10:20:37.989728+00:00'),
  ('kashkaval-pane', '2026-09-05T17:00:59.796928+00:00'),
  ('krem-karamel', '2026-09-05T16:39:04.980861+00:00'),
  ('kurabiyki', '2026-09-05T17:14:07.286237+00:00'),
  ('leshta-yahniya', '2026-10-16T10:06:32.797311+00:00'),
  ('mekitsi', '2026-09-05T17:22:52.841733+00:00'),
  ('mish-mash', '2026-09-05T17:25:51.88121+00:00'),
  ('mlyako-s-oriz', '2026-10-16T10:11:44.028525+00:00'),
  ('musaka', '2026-09-08T10:41:29.857947+00:00'),
  ('myufini-sas-shokoladovi-kapki', '2026-09-05T17:09:36.321594+00:00'),
  ('palachinki', '2026-09-05T16:33:23.280436+00:00'),
  ('rulo-ot-tikvichki', '2026-09-05T16:52:32.907951+00:00'),
  ('rulo-stefani', '2026-09-05T17:11:00.66664+00:00'),
  ('salata-tsezar', '2026-09-05T17:20:42.448799+00:00'),
  ('shokoladovo-brauni', '2026-09-05T17:08:27.78331+00:00'),
  ('shokoladovo-sufle', '2026-09-05T16:59:27.170591+00:00'),
  ('sladko-ot-praskovi', '2026-10-16T10:12:20.913182+00:00'),
  ('snezhanka-salata', '2026-09-05T16:40:33.065528+00:00'),
  ('solen-keks', '2026-09-05T17:06:46.189725+00:00'),
  ('solena-palachinkova-torta', '2026-09-05T17:05:33.886163+00:00'),
  ('spanachena-supa', '2026-09-07T12:50:38.328627+00:00'),
  ('tiramisu', '2026-09-05T16:49:58.190981+00:00'),
  ('torta-rafaelo', '2026-09-05T16:51:13.964717+00:00')
) as v(slug, ts)
where r.slug = v.slug
  and r.updated_at = '2026-11-05T10:14:17.332306+00:00';

alter table public.recipes enable trigger recipes_set_updated_at;

commit;
