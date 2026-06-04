"use client";

import { motion } from "framer-motion";
import { VIEWPORT, EASE } from "@/lib/animations";
import { cn } from "@/lib/utils";

/**
 * Premium section header: numbered index + gold rule + eyebrow, then an
 * oversized Clash Display title and optional intro paragraph.
 */
export function SectionTitle({
  number,
  eyebrow,
  title,
  intro,
  align = "left",
  className,
}: {
  number?: string;
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div className={cn(centered && "mx-auto max-w-3xl text-center", className)}>
      {(number || eyebrow) && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, ease: EASE }}
          className={cn("flex items-center gap-4", centered && "justify-center")}
        >
          {number && (
            <span className="font-display text-sm font-semibold text-gold">
              ({number})
            </span>
          )}
          <span className="h-px w-10 bg-gold/40" />
          {eyebrow && (
            <span className="text-[0.72rem] font-medium uppercase tracking-[0.24em] text-muted">
              {eyebrow}
            </span>
          )}
        </motion.div>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.75, ease: EASE, delay: 0.05 }}
        className="mt-5 text-balance font-display text-[clamp(2rem,4.4vw,3.6rem)] font-semibold leading-[1.02] tracking-tightest text-ink"
      >
        {title}
      </motion.h2>

      {intro && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.7, ease: EASE, delay: 0.12 }}
          className={cn(
            "mt-5 text-base leading-relaxed text-muted sm:text-lg",
            centered ? "mx-auto max-w-2xl" : "max-w-2xl",
          )}
        >
          {intro}
        </motion.p>
      )}
    </div>
  );
}
