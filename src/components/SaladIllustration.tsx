import { useId } from "react";

function TomatoSlice({ transform, size = 32 }: { transform: string; size?: number }) {
  return (
    <g transform={transform}>
      <circle r={size} fill="#c1622b" />
      <circle r={size * 0.62} fill="#e8a355" />
      <g stroke="#c1622b" strokeWidth="2">
        <line x1="0" y1={-size * 0.55} x2="0" y2={size * 0.55} />
        <line x1={-size * 0.48} y1={-size * 0.28} x2={size * 0.48} y2={size * 0.28} />
        <line x1={-size * 0.48} y1={size * 0.28} x2={size * 0.48} y2={-size * 0.28} />
      </g>
    </g>
  );
}

function Mozzarella({ transform }: { transform: string }) {
  return <ellipse transform={transform} rx="22" ry="26" fill="#fdf8f0" />;
}

function BasilLeaf({ transform }: { transform: string }) {
  return (
    <g transform={transform} fill="#5b7553">
      <path d="M0 -26 C 20 -22 20 20 0 28 C -20 20 -20 -22 0 -26 Z" />
      <path
        d="M0 -20 L0 22"
        stroke="#e3ead9"
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
    </g>
  );
}

export function SaladIllustration({ className = "" }: { className?: string }) {
  const uid = useId();
  const bgId = `salad-bg-${uid}`;

  return (
    <svg
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
      className={`h-full w-full ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={bgId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f3e0cd" />
          <stop offset="100%" stopColor="#d8e2c9" />
        </linearGradient>
      </defs>

      <rect width="400" height="400" fill={`url(#${bgId})`} />

      {/* scattered cherry tomatoes */}
      <g fill="#a34f20">
        <circle cx="55" cy="55" r="12" />
        <circle cx="345" cy="70" r="10" />
        <circle cx="60" cy="345" r="11" />
      </g>

      {/* plate */}
      <circle cx="200" cy="205" r="150" fill="#e3ead9" opacity="0.7" />
      <circle cx="200" cy="205" r="150" fill="none" stroke="#5b7553" strokeWidth="2" opacity="0.4" />

      {/* salad arrangement */}
      <TomatoSlice transform="translate(150,150) rotate(-10)" />
      <TomatoSlice transform="translate(235,165) rotate(15)" />
      <TomatoSlice transform="translate(175,240) rotate(6)" />
      <TomatoSlice transform="translate(255,255) rotate(-20)" />

      <Mozzarella transform="translate(200,130) rotate(-8)" />
      <Mozzarella transform="translate(120,200) rotate(10)" />
      <Mozzarella transform="translate(280,210) rotate(-12)" />
      <Mozzarella transform="translate(210,290) rotate(4)" />

      <BasilLeaf transform="translate(195,175) rotate(-20)" />
      <BasilLeaf transform="translate(140,255) rotate(30)" />
      <BasilLeaf transform="translate(260,150) rotate(-45)" />

      <circle cx="175" cy="205" r="9" fill="#5c1a2e" />
      <circle cx="245" cy="220" r="8" fill="#5c1a2e" />
    </svg>
  );
}
