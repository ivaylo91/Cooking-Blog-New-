"use server";

import { createHmac } from "crypto";
import { headers } from "next/headers";
import { updateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { RECIPES_TAG } from "@/lib/recipes";

const MIN_SUBMIT_SECONDS = 2;
const MAX_COMMENTS_PER_WINDOW = 3;
const RATE_WINDOW_SECONDS = 120;

export interface CommentActionState {
  /** "invalid": the name or text was empty. "error": the comment could not be saved. */
  status: "idle" | "success" | "rate_limited" | "invalid" | "error";
}

/**
 * The secret behind every IP fingerprint. A key anyone can read in the repo
 * would let them hash all 4.3 billion IPv4 addresses and read the stored
 * fingerprints back, so production refuses to run without IP_HASH_SALT.
 */
function ipHashKey(): string {
  const key = process.env.IP_HASH_SALT;
  if (key) return key;
  if (process.env.VERCEL_ENV === "production") {
    throw new Error("IP_HASH_SALT is not set: comments and ratings are disabled until it is.");
  }
  return "local-development-only";
}

/**
 * A keyed one-way fingerprint (HMAC-SHA-256) of the visitor's IP, the kind
 * EDPB Guidelines 01/2025 on pseudonymisation prefer over a plain hash.
 */
async function getIpHash(): Promise<string> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? "unknown";
  return createHmac("sha256", ipHashKey()).update(ip).digest("hex").slice(0, 32);
}

export async function addComment(
  recipeId: string,
  _prevState: CommentActionState,
  formData: FormData
): Promise<CommentActionState> {
  // Honeypot and time-trap catches are almost certainly bots — fake a normal
  // success so we never tip off what tripped the filter.
  if (String(formData.get("website") ?? "").trim()) return { status: "success" };

  const renderedAt = Number(formData.get("form_rendered_at"));
  if (Number.isFinite(renderedAt) && Date.now() - renderedAt < MIN_SUBMIT_SECONDS * 1000) {
    return { status: "success" };
  }

  const authorName = String(formData.get("author_name") ?? "").trim().slice(0, 60);
  const text = String(formData.get("text") ?? "").trim().slice(0, 1000);
  if (!authorName || !text) return { status: "invalid" };

  const supabase = await createClient();
  const ipHash = await getIpHash();

  const { data: recentCount } = await supabase.rpc("count_recent_comments", {
    p_ip_hash: ipHash,
    p_window_seconds: RATE_WINDOW_SECONDS,
  });
  if (typeof recentCount === "number" && recentCount >= MAX_COMMENTS_PER_WINDOW) {
    return { status: "rate_limited" };
  }

  const { error } = await supabase
    .from("comments")
    .insert({ recipe_id: recipeId, author_name: authorName, text, ip_hash: ipHash });

  if (error) return { status: "error" };

  // Expire (not just refresh) so the commenter sees their own comment on the
  // next request instead of a stale cached list.
  updateTag(`comments:${recipeId}`);
  return { status: "success" };
}

export interface RatingActionState {
  status: "idle" | "success" | "error";
  value: number | null;
}

/**
 * One rating per IP per recipe. `submit_rating` is the only way in: the unique
 * constraint on (recipe_id, ip_hash) turns a repeat vote into an update rather
 * than a second vote, and a trigger keeps recipes.rating_sum / rating_count exact.
 */
export async function rateRecipe(
  recipeId: string,
  slug: string,
  _prevState: RatingActionState,
  formData: FormData
): Promise<RatingActionState> {
  const value = Number(formData.get("value"));
  if (!Number.isInteger(value) || value < 1 || value > 5) {
    return { status: "error", value: null };
  }

  const supabase = await createClient();
  const ipHash = await getIpHash();

  const { error } = await supabase.rpc("submit_rating", {
    p_recipe_id: recipeId,
    p_value: value,
    p_ip_hash: ipHash,
  });

  if (error) return { status: "error", value: null };

  updateTag(`recipe:${slug}`);
  updateTag(RECIPES_TAG);
  return { status: "success", value };
}

export interface SubscribeActionState {
  status: "idle" | "success" | "duplicate" | "invalid" | "error";
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribe(
  _prevState: SubscribeActionState,
  formData: FormData
): Promise<SubscribeActionState> {
  // Same honeypot the comment form uses.
  if (String(formData.get("website") ?? "").trim()) return { status: "success" };

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!EMAIL_PATTERN.test(email) || email.length > 254) return { status: "invalid" };

  // Only the address: nothing reads an IP for subscribers, and an IP
  // doesn't prove consent anyway (COOKIES-PRIVACY-RESEARCH.md).
  const supabase = await createClient();
  const { error } = await supabase.from("subscribers").insert({ email });

  // 23505 = unique violation, i.e. already subscribed.
  if (error?.code === "23505") return { status: "duplicate" };
  if (error) return { status: "error" };

  return { status: "success" };
}
