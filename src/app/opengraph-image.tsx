import { ImageResponse } from "next/og";
import { LogoMark } from "@/components/Logo";
import { OG_COLORS, ogFonts } from "@/lib/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: OG_COLORS.peach,
          padding: 96,
        }}
      >
        <LogoMark size={120} />
        <div
          style={{
            display: "flex",
            marginTop: 44,
            fontFamily: "Lora",
            fontSize: 76,
            fontWeight: 700,
            lineHeight: 1.1,
            color: OG_COLORS.ink,
          }}
        >
          Кулинарният блог на Иво
        </div>
        <div style={{ display: "flex", fontSize: 32, color: OG_COLORS.muted, marginTop: 20 }}>
          Домашни рецепти, изпробвани в моята кухня
        </div>
      </div>
    ),
    { ...size, fonts: await ogFonts() }
  );
}
