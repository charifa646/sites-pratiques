"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem, VIEWPORT } from "@/lib/animations";
import { cn } from "@/lib/utils";

export function SectionTitle({
  number,
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: {
  number?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {(number || eyebrow) && (
        <motion.div variants={staggerItem} className="flex items-center gap-3">
          {number && (
            <span className="font-display text-2xl font-bold text-gold">
              {number}
            </span>
          )}
          {number && <span className="h-px w-10 bg-gold/50" />}
          {eyebrow && (
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
              {eyebrow}
            </span>
          )}
        </motion.div>
      )}

      <motion.h2
        variants={staggerItem}
        className="max-w-3xl text-balance text-3xl font-bold leading-[1.08] sm:text-4xl lg:text-[2.75rem]"
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          variants={staggerItem}
          className={cn(
            "max-w-2xl text-base leading-relaxed text-muted",
            align === "center" && "mx-auto",
          )}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
