"use client";

import type { ReactNode } from "react";
import { scrollToY } from "@/lib/scroll";
import { Arrow } from "@/components/ui/Button";
import { GhostMark } from "@/components/ui/Logo";
import { cx } from "@/components/ui/motion";

export const HEADER_H = 68;

/** Smooth scroll to a section, leaving room for the fixed header. */
export function goTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  scrollToY(el.getBoundingClientRect().top + window.scrollY - (id === "top" ? 0 : HEADER_H - 1), { duration: 1.2 });
}

export function V2Logo() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-ink">
        <GhostMark className="h-[18px] w-auto text-acid" />
      </span>
      <span className="font-display text-[17px] font-semibold tracking-[-0.02em] text-ink">
        Ghost<span className="font-medium text-ink-mute">design</span>co
      </span>
    </span>
  );
}

/** Section marker: its number, a hairline, its name (left aligned, no badge). */
export function Label({ n, children, dark = false, className }: { n?: string; children: ReactNode; dark?: boolean; className?: string }) {
  return (
    <p className={cx("flex items-center gap-3 text-[13px] font-medium tracking-[0.01em]", dark ? "text-fog" : "text-ink-soft", className)}>
      {n && <span className={cx("font-display tabular-nums", dark ? "text-acid" : "text-ink")}>{n}</span>}
      {n && <span aria-hidden className="h-px w-10 bg-current opacity-40" />}
      {children}
    </p>
  );
}

/** The conversion button: acid pill, arrow in a dark disc. */
export function PrimaryButton({ children, onClick, className }: { children: ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "group inline-flex items-center gap-3 rounded-full bg-acid py-2 pl-6 pr-2 text-[15px] font-medium text-acid-ink transition-shadow duration-300 hover:shadow-[0_10px_28px_-12px_rgba(126,211,33,0.9)]",
        className,
      )}
    >
      {children}
      <span className="grid h-9 w-9 place-items-center rounded-full bg-acid-ink text-acid">
        <Arrow className="h-4 w-4 transition-transform duration-300 ease-expo group-hover:translate-x-0.5" />
      </span>
    </button>
  );
}

/** The quiet alternative: an underlined text link, not a second pill. */
export function TextLink({ children, onClick, className, dark = false }: { children: ReactNode; onClick?: () => void; className?: string; dark?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "text-[15px] font-medium underline decoration-1 underline-offset-[6px] transition-colors duration-300",
        dark ? "text-bone decoration-white/30 hover:decoration-acid" : "text-ink decoration-ink/25 hover:decoration-ink",
        className,
      )}
    >
      {children}
    </button>
  );
}
