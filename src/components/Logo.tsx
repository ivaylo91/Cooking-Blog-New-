/**
 * The blog's mark: a cooking pot with rising steam on a tomato badge. The
 * steam paths sit in `.logo-steam`, which globals.css draws in once on load
 * and sets rising again on hover of the surrounding `.logo-link`.
 */
export function LogoMark({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <rect width="48" height="48" rx="14" fill="#c2410c" />
      <g className="logo-steam" fill="none" stroke="#ffe9df" strokeWidth="2.4" strokeLinecap="round">
        <path d="M17 18c-2-2.5 2-4.5 0-7" />
        <path d="M24 17c-2-2.5 2-4.5 0-7.5" />
        <path d="M31 18c-2-2.5 2-4.5 0-7" />
      </g>
      {/* lid rim, pot body and handles */}
      <rect x="10" y="21" width="28" height="3.5" rx="1.75" fill="#ffffff" />
      <path d="M12.5 25.5h23v7a6 6 0 0 1-6 6h-11a6 6 0 0 1-6-6z" fill="#ffffff" />
      <path
        d="M12.5 28H9.5a2 2 0 0 0 0 4h3M35.5 28h3a2 2 0 0 1 0 4h-3"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
