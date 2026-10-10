import { useId } from "react";

/**
 * The quality mark: a round ink stamp on a white sticker, the way old Bulgarian
 * packaging carried its БДС seal. It states the blog's one claim, that every
 * recipe here was cooked in Иво's kitchen, so it is labelled for screen readers
 * rather than hidden.
 */
export function Stamp({ size = 112, className = "" }: { size?: number; className?: string }) {
  const pathId = `stamp-ring-${useId()}`;

  return (
    <svg
      role="img"
      aria-label="Изпробвано в кухнята на Иво"
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={`stamp-press pointer-events-none shrink-0 drop-shadow-sm ${className}`}
    >
      <circle cx="60" cy="60" r="58" fill="#ffffff" />
      <circle cx="60" cy="60" r="54" fill="none" stroke="var(--stamp)" strokeWidth="3" />
      <circle cx="60" cy="60" r="35" fill="none" stroke="var(--stamp)" strokeWidth="1.5" />
      <defs>
        <path id={pathId} d="M 60,60 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0" />
      </defs>
      <text
        fill="var(--stamp)"
        fontFamily="var(--font-sofia-xc), sans-serif"
        fontWeight="800"
        fontSize="13"
      >
        <textPath href={`#${pathId}`} textLength="272" lengthAdjust="spacing">
          ИЗПРОБВАНО · В КУХНЯТА · НА ИВО ·
        </textPath>
      </text>
      {/* tick, drawn rather than typed, in the centre of the seal */}
      <path
        d="M 46 61 L 56 71 L 76 49"
        fill="none"
        stroke="var(--stamp)"
        strokeWidth="6"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}
