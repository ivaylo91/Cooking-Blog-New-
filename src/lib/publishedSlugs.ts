/**
 * Published recipe slugs, held in memory by Proxy so an unknown recipe URL
 * gets a real 404. The page itself can't send one: it streams behind a
 * loading state, and a streamed response is already 200 (Next.js loading.md,
 * "Status codes"). Known slugs answer from memory; an unknown one refreshes
 * the list at most every 30 seconds, so a recipe published a moment ago is
 * still found.
 */
const REFRESH_AFTER_MS = 30_000;
const MAX_AGE_MS = 10 * 60_000;

let slugs: Set<string> | null = null;
let fetchedAt = 0;
let pending: Promise<void> | null = null;

async function load(): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/recipes?select=slug&published=eq.true`;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const response = await fetch(url, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Slug list failed: ${response.status}`);
  const rows: { slug: string }[] = await response.json();
  slugs = new Set(rows.map((row) => row.slug));
  fetchedAt = Date.now();
}

function refresh(): Promise<void> {
  pending ??= load().finally(() => {
    pending = null;
  });
  return pending;
}

/**
 * Whether a recipe page exists. Fails open: if the database can't be
 * reached, the page renders as usual rather than every recipe turning 404.
 */
export async function isPublishedSlug(slug: string): Promise<boolean> {
  try {
    if (!slugs || Date.now() - fetchedAt > MAX_AGE_MS) await refresh();
    if (slugs!.has(slug)) return true;
    if (Date.now() - fetchedAt > REFRESH_AFTER_MS) {
      await refresh();
      return slugs!.has(slug);
    }
    return false;
  } catch {
    return true;
  }
}
