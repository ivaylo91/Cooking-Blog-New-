import Image from "next/image";
import ivoPhoto from "./ivo.jpg";

/**
 * Иво's square portrait, cropped to head and shoulders so the face carries it.
 * The caller sets the width, frame and ring through `className`.
 */
export function AuthorPortrait({
  className,
  sizes,
  // Set when the portrait is above the fold, as on RecipeCard: loads eagerly
  // at high priority rather than preloading (Next 16 deprecated `priority`).
  priority = false,
}: {
  className: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative aspect-square overflow-hidden rounded-3xl ${className}`}>
      <Image
        src={ivoPhoto}
        alt="Иво в кухнята си"
        fill
        loading={priority ? "eager" : undefined}
        fetchPriority={priority ? "high" : undefined}
        placeholder="blur"
        sizes={sizes}
        className="origin-top scale-125 object-cover"
      />
    </div>
  );
}
