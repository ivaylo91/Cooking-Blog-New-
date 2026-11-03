import Image from "next/image";
import ivoPhoto from "./ivo.jpg";

/** The photo behind every byline, for small uses and the About page's JSON-LD. */
export { ivoPhoto };

/**
 * Иво's square portrait, cropped to head and shoulders so the face carries it.
 * The caller sets the width, frame and ring through `className`.
 */
export function AuthorPortrait({
  className,
  sizes,
  eager = false,
}: {
  className: string;
  sizes: string;
  /** For a portrait above the fold, where lazy loading would delay it. */
  eager?: boolean;
}) {
  return (
    <div className={`relative aspect-square overflow-hidden rounded-3xl ${className}`}>
      <Image
        src={ivoPhoto}
        alt="Иво в кухнята си"
        fill
        loading={eager ? "eager" : undefined}
        placeholder="blur"
        sizes={sizes}
        className="origin-top scale-125 object-cover"
      />
    </div>
  );
}
