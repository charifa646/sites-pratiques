import { brand } from "@/lib/copy";

/** Sheet-ghost mark: dome, scalloped hem, two eyes cut out of the silhouette. */
export function GhostMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 26" className={className} aria-hidden fill="currentColor">
      <path
        fillRule="evenodd"
        d="M4 11A8 8 0 0 1 20 11V23.5Q18.7 21.3 17.3 23.5Q16 25.7 14.7 23.5Q13.3 21.3 12 23.5Q10.7 25.7 9.3 23.5Q8 21.3 6.7 23.5Q5.3 25.7 4 23.5ZM8.2 11.6a1.3 1.9 0 1 0 2.6 0a1.3 1.9 0 1 0 -2.6 0ZM13.2 11.6a1.3 1.9 0 1 0 2.6 0a1.3 1.9 0 1 0 -2.6 0Z"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <GhostMark className="h-[1.35em] w-auto text-acid drop-shadow-[0_0_10px_rgba(182,255,59,0.55)]" />
      <span className="font-display text-[1.05em] font-semibold tracking-[-0.02em] text-bone">
        Ghost<span className="font-medium text-fog">design</span>co
      </span>
      <span className="sr-only">{brand.name}</span>
    </span>
  );
}
