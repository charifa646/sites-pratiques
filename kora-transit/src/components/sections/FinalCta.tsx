"use client";

import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { finalCta, images } from "@/lib/data";
import { staggerContainer, staggerItem, VIEWPORT } from "@/lib/animations";

export function FinalCta() {
  return (
    <section className="section relative overflow-hidden">
      <div className="shell">
        <div className="edge-glow relative overflow-hidden rounded-[2rem] px-6 py-20 text-center md:px-16 md:py-32">
          {/* Video background */}
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={images.scene.lightTrailsAlt}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30"
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy-deep/88 via-navy-deep/72 to-navy-deep/92" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy-deep/70 via-transparent to-navy-deep/70" />

          {/* Giant backdrop word */}
          <span
            aria-hidden
            className="text-stroke-ink pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-display text-[24vw] font-bold leading-none tracking-tightest opacity-50"
          >
            KORA
          </span>

          {/* Animated gold speed line */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-0 top-[42%] h-px w-1/3 animate-speed-line bg-gradient-to-r from-transparent via-gold to-transparent" />
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            className="relative mx-auto flex max-w-2xl flex-col items-center"
          >
            <motion.span
              variants={staggerItem}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
              Départs quotidiens
            </motion.span>
            <motion.h2
              variants={staggerItem}
              className="text-balance font-display text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1.0] tracking-tightest text-ink"
            >
              {finalCta.title}
            </motion.h2>
            <motion.p variants={staggerItem} className="mt-5 text-lg text-muted">
              {finalCta.subtitle}
            </motion.p>
            <motion.div variants={staggerItem} className="mt-9">
              <ButtonLink href="/reservation" size="lg">
                {finalCta.cta}
              </ButtonLink>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
