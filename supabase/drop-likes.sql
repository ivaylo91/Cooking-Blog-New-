-- One-off cleanup for databases created before likes were removed.
--
-- Run this in the Supabase SQL editor only AFTER the site version that no
-- longer selects `likes_count` is deployed; an older deployment still reads
-- the column and would fail once it is gone. It permanently deletes every
-- recipe's like count.

drop function if exists increment_recipe_likes(uuid);

alter table recipes drop column if exists likes_count;
