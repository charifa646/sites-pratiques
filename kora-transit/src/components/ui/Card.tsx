import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Glassmorphism navy card with a soft gold hover state. */
export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "glass rounded-2xl transition-all duration-500 hover:border-gold/40 hover:shadow-card",
        className,
      )}
    >
      {children}
    </div>
  );
}
