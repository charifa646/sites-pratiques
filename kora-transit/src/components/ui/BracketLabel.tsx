import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Technical mono label wrapped in brackets — MAKEDO-style structural marker. */
export function BracketLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-mono text-[0.62rem] uppercase tracking-[0.25em] text-ink/45",
        className,
      )}
    >
      [ {children} ]
    </span>
  );
}
