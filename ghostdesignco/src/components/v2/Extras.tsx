"use client";

import { useEffect, useRef } from "react";
import { offer } from "@/lib/copy";
import { GhostMark } from "@/components/ui/Logo";
import { cx } from "@/components/ui/motion";

/** A soft acid light under the pointer, for dark bands (mouse only). */
export function Spotlight({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = host.getBoundingClientRect();
      el.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
      el.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
      el.style.opacity = "1";
    };
    const onLeave = () => {
      el.style.opacity = "0";
    };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);
  return <div ref={ref} aria-hidden className={cx("v2-spot pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500", className)} />;
}

/** The three services running by in big type, outlined and solid in turn. */
export function Marquee() {
  const words = offer.items.map((i) => i.title);
  const run = (key: string) => (
    <span key={key} className="flex shrink-0 items-center">
      {words.map((w, i) => (
        <span key={w} className="flex items-center">
          <span className={cx("px-6 font-display text-[clamp(2.6rem,7vw,6rem)] font-semibold leading-none tracking-[-0.04em] sm:px-10", i % 2 === 1 && "v2-outline")}>
            {w}
          </span>
          <GhostMark className="h-[clamp(1.6rem,3.6vw,3rem)] w-auto text-acid-deep" />
        </span>
      ))}
    </span>
  );
  return (
    <div aria-hidden className="relative overflow-hidden border-y border-line bg-white py-8 sm:py-10">
      <div className="v2-marquee flex w-max">
        {run("a")}
        {run("b")}
      </div>
    </div>
  );
}
