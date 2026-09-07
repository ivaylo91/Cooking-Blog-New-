import { createClient } from "@supabase/supabase-js";

/**
 * Cookie-free Supabase client for public, read-only content.
 *
 * The cookie-based client in `./server` reads `cookies()`, which opts every
 * page that touches it into dynamic rendering. Published recipes are the same
 * for everyone, so reading them through the anon key instead lets those pages
 * be prerendered and cached. Anything that needs the admin session (writes, or
 * reading unpublished rows) must keep using `./server`.
 */
export const publicClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
