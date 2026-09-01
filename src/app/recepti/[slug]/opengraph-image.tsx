import { ImageResponse } from "next/og";
import { getImageUrl } from "@/lib/images";
import { getRecipeBySlug } from "@/lib/recipes";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  const imageUrl = recipe ? getImageUrl(recipe.image_path) : null;
  const title = recipe?.title ?? "Рецепта";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: imageUrl ? "#2b241d" : "linear-gradient(135deg, #fbf7f0, #f3e0cd)",
        }}
      >
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt=""
            width={1200}
            height={630}
            style={{ position: "absolute", inset: 0, objectFit: "cover" }}
          />
        )}
        {imageUrl && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              background:
                "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.05) 100%)",
            }}
          />
        )}

        <div
          style={{
            position: "absolute",
            top: 56,
            left: 64,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 999,
              background: "#c1622b",
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fffaf5"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
              <line x1="6" y1="17" x2="18" y2="17" />
            </svg>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              fontWeight: 600,
              color: imageUrl ? "#fffaf5" : "#2b241d",
            }}
          >
            Кулинарният блог на Иво
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            padding: 64,
          }}
        >
          {recipe?.category && (
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                background: "#c1622b",
                color: "#fffaf5",
                padding: "10px 22px",
                borderRadius: 999,
                fontSize: 24,
                fontWeight: 600,
                marginBottom: 24,
                textTransform: "uppercase",
                letterSpacing: 2,
              }}
            >
              {recipe.category.name}
            </div>
          )}
          <div
            style={{
              display: "flex",
              fontSize: 66,
              fontWeight: 700,
              lineHeight: 1.1,
              color: imageUrl ? "#ffffff" : "#2b241d",
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
