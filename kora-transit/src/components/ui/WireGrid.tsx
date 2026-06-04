import { cn } from "@/lib/utils";

/** Faint construction grid overlay (MAKEDO reference). Masked to fade at edges. */
export function WireGrid({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 bg-wireframe [mask-image:radial-gradient(120%_120%_at_50%_45%,black_20%,transparent_82%)]",
        className,
      )}
    />
  );
}
