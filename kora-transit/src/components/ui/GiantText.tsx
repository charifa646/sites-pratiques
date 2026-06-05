"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Oversized typographic backdrop word/number (Audi / MAKEDO / Оклейка reference).
 * Sits behind content; an image or card can overlap it ("text the image lands on").
 * Subtle parallax drift as the section scrolls through the viewport.
 */
export function GiantText({
  children,
  className,
  outline = false,
  parallax = true,
}: {
  children: React.ReactNode;
  className?: string;
  outline?: boolean;
  parallax?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

  return (
    <motion.span
      ref={ref}
      aria-hidden
      style={{ y: reduce || !parallax ? 0 : y }}
      className={cn(
        "pointer-events-none absolute select-none whitespace-nowrap font-display font-bold leading-none tracking-tightest",
        // Soft blend: gentle blur + radial mask so the word dissolves into the bg.
        "blur-[1.5px] [mask-image:radial-gradient(125%_100%_at_50%_50%,#000_18%,transparent_78%)]",
        outline ? "text-stroke-ink opacity-[0.65]" : "text-ink/[0.028]",
        className,
      )}
    >
      {children}
    </motion.span>
  );
}
