"use server";

import { createHash } from "crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const IP_HASH_SALT = "kbi-comment-salt-v1";
const MIN_SUBMIT_SECONDS = 2;
const MAX_COMMENTS_PER_WINDOW = 3;
const RATE_WINDOW_SECONDS = 120;

export interface CommentActionState {
  status: "idle" | "success" | "rate_limited" | "error";
}

async function getIpHash(): Promise<string> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? "unknown";
  return createHash("sha256").update(`${ip}:${IP_HASH_SALT}`).digest("hex").slice(0, 32);
}

export async function addComment(
  recipeId: string,
  slug: string,
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
  if (!authorName || !text) return { status: "error" };

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

  revalidatePath(`/recepti/${slug}`);
  return { status: "success" };
}
