export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`motion-safe:animate-pulse rounded-xl bg-surface-muted ${className}`} />;
}
