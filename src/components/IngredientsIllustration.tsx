import { useId } from "react";

export function IngredientsIllustration({ className = "" }: { className?: string }) {
  const uid = useId();
  const grainId = `grain-${uid}`;
  const bgId = `bg-${uid}`;

  return (
    <svg
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
      className={`h-full w-full ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={bgId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8a355" />
          <stop offset="100%" stopColor="#c1622b" />
        </linearGradient>
        <filter id={grainId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.06 0" />
        </filter>
      </defs>

      <rect width="400" height="400" fill={`url(#${bgId})`} />

      {/* onion half, top-left */}
      <g transform="translate(85,95)">
        <circle r="42" fill="#fdf8f0" />
        <g stroke="#e8a355" strokeWidth="2.5" fill="none">
          <path d="M -42 0 A 42 42 0 0 1 0 -42" />
          <path d="M -30 0 A 30 30 0 0 1 0 -30" />
          <path d="M -18 0 A 18 18 0 0 1 0 -18" />
        </g>
        <line x1="0" y1="-42" x2="0" y2="42" stroke="#a34f20" strokeWidth="2.5" />
      </g>

      {/* herb sprig, top-right */}
      <g transform="translate(300,80) rotate(10)">
        <path d="M0 -40 Q 18 -10 0 30 Q -18 -10 0 -40 Z" fill="#5b7553" />
        <ellipse cx="-14" cy="-8" rx="15" ry="8" fill="#5b7553" transform="rotate(-35 -14 -8)" />
        <ellipse cx="14" cy="4" rx="15" ry="8" fill="#729060" transform="rotate(35 14 4)" />
        <ellipse cx="-14" cy="16" rx="15" ry="8" fill="#5b7553" transform="rotate(-35 -14 16)" />
      </g>

      {/* garlic cloves */}
      <g transform="translate(190,150)">
        <ellipse cx="-16" cy="0" rx="14" ry="18" fill="#fdf8f0" transform="rotate(-15 -16 0)" />
        <ellipse cx="10" cy="6" rx="14" ry="18" fill="#f3e0cd" transform="rotate(12 10 6)" />
        <ellipse cx="-2" cy="-14" rx="12" ry="16" fill="#fdf8f0" transform="rotate(-2 -2 -14)" />
      </g>

      {/* chili pepper */}
      <g transform="translate(260,175) rotate(18)">
        <path
          d="M0 -55 C 22 -50 26 -20 14 10 C 6 30 -10 34 -14 18 C -20 -8 -14 -50 0 -55 Z"
          fill="#c1622b"
        />
        <path d="M0 -55 C 4 -62 -4 -66 -8 -60" stroke="#5b7553" strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>

      {/* tomato / beans cluster */}
      <g transform="translate(150,225)">
        <circle r="20" fill="#a34f20" />
        <path d="M0 -20 L4 -28 L-4 -28 Z" fill="#5b7553" />
      </g>
      <g fill="#7a3350">
        <ellipse cx="205" cy="235" rx="9" ry="12" transform="rotate(20 205 235)" />
        <ellipse cx="225" cy="245" rx="9" ry="12" transform="rotate(-10 225 245)" />
        <ellipse cx="190" cy="255" rx="9" ry="12" transform="rotate(40 190 255)" />
      </g>

      {/* diced accents, left */}
      <g fill="#a34f20" opacity="0.9">
        <rect x="60" y="200" width="14" height="14" transform="rotate(20 67 207)" />
        <rect x="45" y="230" width="12" height="12" transform="rotate(-15 51 236)" />
        <rect x="75" y="245" width="11" height="11" transform="rotate(35 80 250)" />
      </g>

      {/* pot */}
      <g transform="translate(200,330)">
        <rect x="-24" y="-32" width="16" height="26" rx="6" fill="#a34f20" />
        <rect x="8" y="-32" width="16" height="26" rx="6" fill="#a34f20" />
        <path d="M -95 -10 L 95 -10 L 78 60 Q 0 78 -78 60 Z" fill="#fdf8f0" />
        <ellipse cx="0" cy="-10" rx="95" ry="16" fill="#f3e0cd" />
        <ellipse cx="0" cy="-10" rx="95" ry="16" fill="none" stroke="#a34f20" strokeWidth="2" opacity="0.4" />
      </g>

      <rect width="400" height="400" filter={`url(#${grainId})`} opacity="0.5" />
    </svg>
  );
}
