import { useId } from "react";

/**
 * The blog's doodle pattern (whisk, herb sprig, steam, citrus, soup bowl,
 * basil and tomatoes), printed in a single ink the way packaging prints a
 * decorative band. It takes `currentColor`, so the field it sits on decides
 * the ink. It is a band, never a backdrop: keep body text off it.
 */
export function CookingBackground({
  className = "",
  opacity = 0.35,
  scale = 0.5,
}: {
  /** Positioning and colour classes, e.g. "absolute inset-0 text-white". */
  className?: string;
  opacity?: number;
  /** Pattern tile scale; the tile is 360px at 1. */
  scale?: number;
}) {
  const patternId = `doodle-${useId()}`;

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none h-full w-full print:hidden ${className}`}
    >
      <defs>
        <pattern
          id={patternId}
          width="360"
          height="360"
          patternUnits="userSpaceOnUse"
          patternTransform={`scale(${scale})`}
        >
          <g
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          >
            {/* whisk */}
            <g transform="translate(55,70) rotate(-16)">
              <line x1="0" y1="0" x2="0" y2="46" />
              <path d="M 0 0 C -15 -9, -15 -33, 0 -42" />
              <path d="M 0 0 C 15 -9, 15 -33, 0 -42" />
              <path d="M 0 0 C -8 -7, -8 -36, 0 -42" />
              <path d="M 0 0 C 8 -7, 8 -36, 0 -42" />
            </g>

            {/* steam curls */}
            <g transform="translate(65,285)">
              <path d="M 0 30 C -9 18, 9 10, 0 -2 C -9 -14, 9 -22, 0 -34" />
              <path d="M 18 34 C 9 22, 27 14, 18 2 C 9 -10, 27 -18, 18 -30" />
            </g>

            {/* citrus slice */}
            <g transform="translate(285,280)">
              <circle r="22" />
              <line x1="0" y1="-19" x2="0" y2="19" strokeWidth="2" />
              <line x1="-16" y1="-9" x2="16" y2="9" strokeWidth="2" />
              <line x1="-16" y1="9" x2="16" y2="-9" strokeWidth="2" />
            </g>

            {/* soup bowl with spoon, seen from above */}
            <g transform="translate(180,175)">
              <ellipse cx="0" cy="0" rx="30" ry="13" />
              <path d="M -15 -3 Q -8 -9 -1 -3 Q 5 3 12 -3" strokeWidth="2.4" />
              <g transform="translate(40,8) rotate(18)">
                <ellipse cx="0" cy="0" rx="6" ry="9" />
                <line x1="0" y1="9" x2="0" y2="30" />
              </g>
            </g>

            {/* basil leaf, drawn as an outline so its vein reads in one ink */}
            <g transform="translate(172,52) rotate(-10)">
              <path d="M0 -17 C 15 -15 15 12 0 18 C -15 12 -15 -15 0 -17 Z" />
              <line x1="0" y1="-13" x2="0" y2="13" strokeWidth="2" />
            </g>
          </g>

          <g fill="currentColor">
            {/* herb sprig */}
            <g transform="translate(285,55) rotate(18)">
              <path d="M0 0 Q 4 26 0 52 Q -4 26 0 0 Z" />
              <ellipse cx="-7" cy="13" rx="7" ry="3.5" transform="rotate(-30 -7 13)" />
              <ellipse cx="7" cy="22" rx="7" ry="3.5" transform="rotate(30 7 22)" />
              <ellipse cx="-7" cy="31" rx="7" ry="3.5" transform="rotate(-30 -7 31)" />
            </g>

            {/* cherry tomatoes */}
            <circle cx="200" cy="66" r="6" />
            <circle cx="210" cy="52" r="5" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} opacity={opacity} />
    </svg>
  );
}
