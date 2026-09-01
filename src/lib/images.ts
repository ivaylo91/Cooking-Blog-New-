const BUCKET = "recipe-images";

export function getImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/${BUCKET}/${path}`;
}

/** Deterministic per-recipe pick between placeholder illustrations, so a given recipe always shows the same one. */
export function getPlaceholderVariant(id: string): "pot" | "salad" {
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
  return sum % 2 === 0 ? "pot" : "salad";
}
