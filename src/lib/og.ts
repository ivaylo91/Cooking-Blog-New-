import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Shared by the social-share images. ImageResponse cannot read CSS variables
 * or variable fonts, so the light-theme palette is restated here and the
 * headline serif ships as a static Lora Bold (OFL, see assets/fonts).
 */
export const OG_COLORS = {
  ink: "#111111",
  muted: "#4b4f55",
  peach: "#fde6d8",
  tomato: "#c2410c",
} as const;

export async function ogFonts() {
  const data = await readFile(join(process.cwd(), "assets/fonts/Lora-Bold.ttf"));
  return [{ name: "Lora", data, style: "normal" as const, weight: 700 as const }];
}
