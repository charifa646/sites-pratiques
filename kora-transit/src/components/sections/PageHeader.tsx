"use client";

import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { staggerContainer, staggerItem } from "@/lib/animations";

export function PageHeader({
  title,
  subtitle,
  text,
}: {
  title: string;
  subtitle?: string;
  text?: string;
}) {
  return (
    <section className="relative overflow-hidden pt-[72px]">
      <AuroraBackground />
      <div className="shell relative py-20 md:py-28 lg:py-32">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          <motion.span
            variants={staggerItem}
            className="mb-6 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-gold"
          >
            <span className="h-px w-8 bg-gold/60" />
            KORA TRANSIT
          </motion.span>
          <motion.h1
            variants={staggerItem}
            className="text-balance text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              variants={staggerItem}
              className="mt-6 max-w-2xl text-lg leading-relaxed text-muted"
            >
              {subtitle}
            </motion.p>
          )}
          {text && (
            <motion.p
              variants={staggerItem}
              className="mt-4 max-w-2xl text-sm leading-relaxed text-muted/80"
            >
              {text}
            </motion.p>
          )}
        </motion.div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-line to-transparent" />
    </section>
  );
}
