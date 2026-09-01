export function CookingBackground() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full print:hidden"
    >
      <defs>
        <pattern
          id="cooking-pattern"
          width="360"
          height="360"
          patternUnits="userSpaceOnUse"
        >
          {/* whisk */}
          <g
            stroke="var(--accent)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.06"
            transform="translate(55,70) rotate(-16)"
          >
            <line x1="0" y1="0" x2="0" y2="46" />
            <path d="M 0 0 C -15 -9, -15 -33, 0 -42" />
            <path d="M 0 0 C 15 -9, 15 -33, 0 -42" />
            <path d="M 0 0 C -8 -7, -8 -36, 0 -42" />
            <path d="M 0 0 C 8 -7, 8 -36, 0 -42" />
          </g>

          {/* herb sprig */}
          <g
            fill="var(--secondary)"
            opacity="0.06"
            transform="translate(285,55) rotate(18)"
          >
            <path d="M0 0 Q 4 26 0 52 Q -4 26 0 0 Z" />
            <ellipse cx="-7" cy="13" rx="7" ry="3.5" transform="rotate(-30 -7 13)" />
            <ellipse cx="7" cy="22" rx="7" ry="3.5" transform="rotate(30 7 22)" />
            <ellipse cx="-7" cy="31" rx="7" ry="3.5" transform="rotate(-30 -7 31)" />
          </g>

          {/* steam curls */}
          <g
            stroke="var(--accent)"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.06"
            transform="translate(65,285)"
          >
            <path d="M 0 30 C -9 18, 9 10, 0 -2 C -9 -14, 9 -22, 0 -34" />
            <path d="M 18 34 C 9 22, 27 14, 18 2 C 9 -10, 27 -18, 18 -30" />
          </g>

          {/* citrus slice */}
          <g transform="translate(285,280)" opacity="0.06">
            <circle r="22" fill="var(--accent-soft)" />
            <circle r="22" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
            <g stroke="var(--accent)" strokeWidth="1">
              <line x1="0" y1="-19" x2="0" y2="19" />
              <line x1="-16" y1="-9" x2="16" y2="9" />
              <line x1="-16" y1="9" x2="16" y2="-9" />
            </g>
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#cooking-pattern)" />
    </svg>
  );
}
