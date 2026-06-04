"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { ArrowRight, Play, MapPin } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { hero, site, images } from "@/lib/data";

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.1, ease: EASE } },
};

// Trust metrics surfaced inline beneath the CTAs.
const trust = [
  { value: "500K+", label: "Voyageurs" },
  { value: "98%", label: "Ponctualité" },
  { value: "15", label: "Destinations" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax — layers drift at different speeds while scrolling out.
  const phantomY = useTransform(scrollYProgress, [0, 1], ["0%", "38%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.5]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-navy-deep"
    >
      {/* ─────────────────────────  MEDIA LAYER  ───────────────────────── */}
      <motion.div
        style={{ scale: reduce ? 1 : mediaScale }}
        className="absolute inset-0 z-0"
      >
        <Image
          src={images.heroPoster}
          alt="Autocar KORA TRANSIT, phares allumés au crépuscule"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[68%_center]"
        />
      </motion.div>

      {/* ─────────────────────────  SCRIM LAYER  ───────────────────────── */}
      <motion.div
        style={{ opacity: reduce ? 1 : overlayOpacity }}
        className="pointer-events-none absolute inset-0 z-[1]"
      >
        {/* Left scrim — anchors the headline, lets the coach breathe on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/72 to-transparent lg:via-navy-deep/55" />
        {/* Bottom grounding */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/15 to-transparent" />
        {/* Top fade for the transparent navbar */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-navy-deep/80 to-transparent" />
        {/* Soft edge vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(130%_130%_at_50%_50%,transparent_60%,rgba(7,15,28,0.55)_100%)]" />
      </motion.div>

      {/* Warm gold light system */}
      <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
        {/* Headlight bloom, top-right */}
        <div className="absolute -right-24 top-[-10%] h-[55vh] w-[55vh] animate-pulse-glow rounded-full bg-gold/20 blur-[150px]" />
        {/* Low warm reflection bottom-left */}
        <div className="absolute -left-24 bottom-[-15%] h-[40vh] w-[40vh] rounded-full bg-gold/10 blur-[140px]" />
        {/* Thin gold horizon line */}
        <div className="absolute -inset-x-1/4 top-1/4 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        {/* Diagonal sweeping light beam */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-1/4 top-0 h-full w-1/2 animate-light-sweep bg-gradient-to-r from-transparent via-gold/[0.07] to-transparent" />
        </div>
      </div>

      {/* Grain */}
      <div className="pointer-events-none absolute inset-0 z-[3] bg-grain opacity-[0.06] mix-blend-overlay" />

      {/* ─────────────────────────  PHANTOM WORDMARK  ──────────────────── */}
      <motion.span
        aria-hidden
        style={{ y: reduce ? 0 : phantomY }}
        className="pointer-events-none absolute -bottom-[6%] left-1/2 z-[2] -translate-x-1/2 select-none whitespace-nowrap font-display text-[34vw] font-bold leading-none tracking-tightest text-ink/[0.035]"
      >
        KORA
      </motion.span>

      {/* ─────────────────────────  CONTENT  ───────────────────────────── */}
      <motion.div
        style={{ y: reduce ? 0 : contentY }}
        variants={container}
        initial="hidden"
        animate="show"
        className="shell relative z-10 grid w-full grid-cols-1 items-center gap-12 pb-20 pt-28 lg:grid-cols-12 lg:pt-20"
      >
        {/* Left — copy */}
        <div className="lg:col-span-7">
          {/* Eyebrow */}
          <motion.div
            variants={rise}
            className="inline-flex items-center gap-2.5 rounded-full border border-gold/25 bg-navy/40 px-4 py-2 backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
            </span>
            <span className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-ink/80">
              {site.baseline}
            </span>
          </motion.div>

          {/* H1 — oversized, bicolor */}
          <h1 className="mt-7 max-w-[18ch] font-display text-[clamp(2.7rem,7vw,6.5rem)] font-semibold leading-[0.96] tracking-tightest text-ink">
            <motion.span variants={rise} className="block">
              Le transport
            </motion.span>
            <motion.span variants={rise} className="block">
              qui ne vous fait
            </motion.span>
            <motion.span variants={rise} className="block">
              <span className="text-gradient-gold">jamais attendre.</span>
            </motion.span>
          </h1>

          {/* Subtitle */}
          <motion.p
            variants={rise}
            className="mt-7 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {hero.subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={rise} className="mt-9 flex flex-wrap items-center gap-4">
            <ButtonLink href="/reservation" size="lg">
              {hero.ctaPrimary}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </ButtonLink>
            <ButtonLink href="/services" variant="secondary" size="lg">
              <Play className="h-4 w-4 text-gold" />
              {hero.ctaSecondary}
            </ButtonLink>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            variants={fade}
            className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4"
          >
            {trust.map((t, i) => (
              <div key={t.label} className="flex items-center gap-8">
                <div>
                  <div className="font-display text-2xl font-semibold text-ink">
                    {t.value}
                  </div>
                  <div className="text-xs uppercase tracking-[0.18em] text-muted">
                    {t.label}
                  </div>
                </div>
                {i < trust.length - 1 && (
                  <span className="hidden h-10 w-px bg-line sm:block" />
                )}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — floating glass "next departure" card */}
        <motion.div
          variants={fade}
          className="hidden lg:col-span-5 lg:flex lg:justify-end"
        >
          <NextDepartureCard reduce={!!reduce} />
        </motion.div>
      </motion.div>

      {/* ─────────────────────────  SCROLL CUE  ─────────────────────────── */}
      <motion.div
        variants={fade}
        initial="hidden"
        animate="show"
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[0.65rem] uppercase tracking-[0.3em] text-muted">
            Défiler
          </span>
          <span className="relative flex h-9 w-5 justify-center rounded-full border border-ink/25">
            <motion.span
              animate={reduce ? {} : { y: [3, 14, 3], opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="mt-1.5 h-1.5 w-1 rounded-full bg-gold"
            />
          </span>
        </div>
      </motion.div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Floating glass card — animated city-to-city departure                     */
/* -------------------------------------------------------------------------- */
function NextDepartureCard({ reduce }: { reduce: boolean }) {
  return (
    <motion.div
      animate={reduce ? {} : { y: [0, -12, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="glass relative w-full max-w-sm rounded-3xl p-6 shadow-card"
    >
      {/* Top: label + live status */}
      <div className="flex items-center justify-between">
        <span className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-gold">
          Prochain départ
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-wider text-gold">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          À l&apos;heure
        </span>
      </div>

      {/* Route */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <div>
          <div className="text-[0.65rem] uppercase tracking-[0.2em] text-muted">Départ</div>
          <div className="mt-1 font-display text-xl font-semibold text-ink">Ouagadougou</div>
          <div className="mt-0.5 text-xs text-muted">06:00</div>
        </div>

        {/* Animated trace */}
        <div className="relative mx-1 flex-1">
          <div className="flex items-center">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-gold" />
            <div className="relative h-px flex-1">
              <div className="absolute inset-0 bg-gradient-to-r from-gold/50 via-gold/30 to-gold/50" />
              <motion.span
                aria-hidden
                animate={reduce ? {} : { left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 0.6,
                }}
                className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-gold shadow-gold-sm"
              />
            </div>
            <span className="h-2 w-2 shrink-0 rounded-full border border-gold bg-navy" />
          </div>
        </div>

        <div className="text-right">
          <div className="text-[0.65rem] uppercase tracking-[0.2em] text-muted">Arrivée</div>
          <div className="mt-1 font-display text-xl font-semibold text-ink">Abidjan</div>
          <div className="mt-0.5 text-xs text-muted">14:30</div>
        </div>
      </div>

      <div className="my-5 h-px bg-line/70" />

      {/* Footer: class + duration */}
      <div className="flex items-center justify-between">
        <span className="rounded-md border border-gold/30 bg-gold/5 px-2 py-1 text-[0.65rem] font-medium uppercase tracking-wider text-gold">
          KORA Business
        </span>
        <span className="text-xs text-muted">8h30 · directe</span>
      </div>

      {/* Corner glow accent */}
      <div className="pointer-events-none absolute -right-px -top-px h-24 w-24 rounded-tr-3xl bg-[radial-gradient(circle_at_top_right,rgba(201,168,76,0.18),transparent_70%)]" />
    </motion.div>
  );
}
