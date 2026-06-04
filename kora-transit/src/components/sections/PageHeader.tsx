"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { WireGrid } from "@/components/ui/WireGrid";
import { BracketLabel } from "@/components/ui/BracketLabel";
import { staggerContainer, staggerItem } from "@/lib/animations";

const EASE = [0.22, 1, 0.36, 1] as const;

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
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden pt-[72px]">
      {image && (
        <motion.div
          initial={{ opacity: 0, scale: 1.16 }}
          animate={
            reduce
              ? { opacity: 1, scale: 1 }
              : { opacity: 1, scale: [1.16, 1.04, 1.16] }
          }
          transition={{
            opacity: { duration: 1.3, ease: EASE },
            scale: { duration: 26, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute inset-0"
        >
          <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
        </motion.div>
      )}
      {/* Light navy tint + scrims — photo stays visible, left text legible */}
      <div className="absolute inset-0 bg-navy/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/35 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-navy-deep/80 to-transparent" />
      <WireGrid />

      {/* Headlight bloom (radial-gradient — cheap) */}
      <div className="pointer-events-none absolute -right-20 top-0 h-[48vh] w-[48vh] rounded-full bg-[radial-gradient(closest-side,rgba(201,168,76,0.14),transparent)]" />

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
