"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";

/** Arrow used by every call to action. */
export function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 10h11M11 5.5 15.5 10 11 14.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type Props = {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "acid" | "ghost";
  className?: string;
  type?: "button" | "submit";
};

/**
 * Magnetic pill button: follows the pointer a few pixels, the arrow slides on
 * hover. Acid is the conversion button, ghost the quiet alternative.
 */
export function Button({ children, onClick, href, variant = "acid", className, type = "button" }: Props) {
  const ref = useRef<HTMLElement>(null);

  const move = (e: MouseEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.18;
    const y = (e.clientY - r.top - r.height / 2) * 0.28;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };
  const leave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  const base =
    "group relative inline-flex items-center justify-center gap-3 rounded-full px-6 py-3.5 text-[15px] font-medium transition-[transform,background-color,color,box-shadow] duration-500 ease-expo will-change-transform";
  const skin =
    variant === "acid"
      ? "bg-acid text-acid-ink shadow-[0_0_0_1px_rgba(182,255,59,0.6),0_10px_40px_-8px_rgba(182,255,59,0.55)] hover:shadow-[0_0_0_1px_rgba(182,255,59,0.9),0_16px_60px_-6px_rgba(182,255,59,0.8)]"
      : "border border-white/15 bg-white/[0.03] text-bone backdrop-blur-md hover:border-acid/60 hover:text-acid";
  const content = (
    <>
      <span>{children}</span>
      <span className="relative -mr-1 inline-flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-black/10">
        <Arrow className="h-4 w-4 transition-transform duration-500 ease-expo group-hover:translate-x-[140%]" />
        <Arrow className="absolute h-4 w-4 -translate-x-[140%] transition-transform duration-500 ease-expo group-hover:translate-x-0" />
      </span>
    </>
  );

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        onClick={onClick}
        onMouseMove={move}
        onMouseLeave={leave}
        className={`${base} ${skin} ${className ?? ""}`}
      >
        {content}
      </a>
    );
  }
  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      onMouseMove={move}
      onMouseLeave={leave}
      className={`${base} ${skin} ${className ?? ""}`}
    >
      {content}
    </button>
  );
}
