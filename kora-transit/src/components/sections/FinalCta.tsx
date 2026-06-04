"use client";

import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { ButtonLink } from "@/components/ui/Button";
import { finalCta, images } from "@/lib/data";
import { staggerContainer, staggerItem, VIEWPORT } from "@/lib/animations";

export function FinalCta() {
  return (
    <section className="section relative overflow-hidden">
      <div className="shell">
        <div className="relative overflow-hidden rounded-[2rem] border border-gold/20 px-6 py-20 text-center md:px-16 md:py-28">
          {/* Video background */}
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={images.highway}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.22]"
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>

          {/* Layered overlays */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy/90 via-navy/75 to-navy/92" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy/60 via-transparent to-navy/60" />

          {/* Aurora glow */}
          <AuroraBackground />

          {/* Gold border shimmer */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[2rem] border border-gold/10 shadow-[inset_0_0_60px_rgba(201,168,76,0.06)]"
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            className="relative mx-auto flex max-w-2xl flex-col items-center"
          >
            <motion.span
              variants={staggerItem}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
              Départs quotidiens
            </motion.span>

            <motion.h2
              variants={staggerItem}
              className="text-balance font-display text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl"
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
