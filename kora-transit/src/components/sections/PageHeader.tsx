"use client";

import { motion } from "framer-motion";
import { Duotone } from "@/components/ui/Duotone";
import { WireGrid } from "@/components/ui/WireGrid";
import { BracketLabel } from "@/components/ui/BracketLabel";
import { staggerContainer, staggerItem } from "@/lib/animations";

export function PageHeader({
  title,
  subtitle,
  text,
  image,
  bgWord,
}: {
  title: string;
  subtitle?: string;
  text?: string;
  image?: string;
  bgWord?: string;
}) {
  return (
    <section className="relative overflow-hidden pt-[72px]">
      {image && (
        <Duotone
          src={image}
          alt=""
          className="absolute inset-0"
          intensity="strong"
          priority
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/85 to-navy-deep/65" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/55 to-transparent" />
      <WireGrid />

      {/* Headlight bloom */}
      <div className="pointer-events-none absolute -right-20 top-0 h-[40vh] w-[40vh] animate-pulse-glow rounded-full bg-gold/15 blur-[150px]" />

      {bgWord && (
        <span
          aria-hidden
          className="text-stroke-ink pointer-events-none absolute -bottom-[10%] right-[-2%] select-none whitespace-nowrap font-display text-[20vw] font-bold leading-none tracking-tightest opacity-50"
        >
          {bgWord}
        </span>
      )}

      <div className="shell relative py-24 md:py-32 lg:py-40">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          <motion.div variants={staggerItem} className="mb-6 flex items-center gap-4">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
            </span>
            <span className="h-px w-10 bg-gold/40" />
            <BracketLabel className="text-ink/60">KORA TRANSIT</BracketLabel>
          </motion.div>

          <motion.h1
            variants={staggerItem}
            className="text-balance font-display text-[clamp(2.6rem,6vw,5rem)] font-bold leading-[0.96] tracking-tightest text-ink"
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

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </section>
  );
}
