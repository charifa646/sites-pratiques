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

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 text-[12px] font-medium uppercase tracking-[0.16em] text-ink-soft",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-acid-deep" />
      {children}
    </span>
  );
}

export function Check() {
  return (
    <span className="grid h-5 w-5 place-items-center rounded-full bg-acid">
      <svg viewBox="0 0 16 16" className="h-3 w-3 text-acid-ink" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
        <path d="m3.5 8.5 3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
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

export function SecondaryButton({ children, onClick, className }: { children: ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex items-center rounded-full border border-line bg-white px-6 py-[14px] text-[15px] font-medium text-ink transition-colors duration-300 hover:border-ink/25",
        className,
      )}
    >
      {children}
    </button>
  );
}
