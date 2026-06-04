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
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};
const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.1, ease: EASE } },
};

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

  const phantomY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.55]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-navy-deep"
    >
      {/* ───────────── MEDIA ───────────── */}
      <motion.div style={{ scale: reduce ? 1 : mediaScale }} className="absolute inset-0 z-0">
        <Image
          src={images.heroPoster}
          alt="Autocar KORA TRANSIT, phares allumés au crépuscule"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[68%_center]"
        />
      </motion.div>

      {/* ───────────── SCRIMS ───────────── */}
      <motion.div
        style={{ opacity: reduce ? 1 : overlayOpacity }}
        className="pointer-events-none absolute inset-0 z-[1]"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/72 to-transparent lg:via-navy-deep/52" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/15 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-navy-deep/80 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(130%_130%_at_50%_50%,transparent_58%,rgba(7,15,28,0.6)_100%)]" />
      </motion.div>

      {/* ───────────── WIREFRAME GRID (MAKEDO) ───────────── */}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-wireframe [mask-image:radial-gradient(120%_120%_at_50%_40%,black_30%,transparent_85%)]" />

      {/* ───────────── GOLD LIGHT + SPEED LINES (Albatros) ───────────── */}
      <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
        {/* headlight bloom */}
        <div className="absolute -right-24 top-[-8%] h-[55vh] w-[55vh] animate-pulse-glow rounded-full bg-gold/20 blur-[150px]" />
        <div className="absolute -left-20 bottom-[-18%] h-[42vh] w-[42vh] rounded-full bg-gold/10 blur-[140px]" />
        {/* edge-glow rim hugging the ground / vehicle base */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-gold/[0.14] to-transparent mix-blend-screen" />
        {/* animated gold speed lines */}
        <div className="absolute left-0 top-[58%] h-px w-1/3 animate-speed-line bg-gradient-to-r from-transparent via-gold to-transparent" />
        <div className="absolute left-0 top-[72%] h-px w-1/4 animate-speed-line-slow bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
      </div>

      {/* grain */}
      <div className="pointer-events-none absolute inset-0 z-[3] bg-grain opacity-[0.06] mix-blend-overlay" />

      {/* ───────────── BRACKET LABELS (MAKEDO) ───────────── */}
      <div className="pointer-events-none absolute inset-0 z-[4] hidden font-mono text-[0.62rem] uppercase tracking-[0.25em] text-ink/45 lg:block">
        <span className="absolute left-8 top-28">[ 01 — Accueil ]</span>
        <span className="absolute right-8 top-28">[ 12.37°N · 1.53°O ]</span>
        <span className="absolute bottom-10 left-8">[ Réseau · Afrique de l&apos;Ouest ]</span>
        <span className="absolute bottom-10 right-8 text-gold/50">[ KORA — 2012 ]</span>
      </div>

      {/* ───────────── PHANTOM OUTLINE WORDMARK (Audi) ───────────── */}
      <motion.span
        aria-hidden
        style={{ y: reduce ? 0 : phantomY }}
        className="text-stroke-ink pointer-events-none absolute -bottom-[7%] left-1/2 z-[2] -translate-x-1/2 select-none whitespace-nowrap font-display text-[33vw] font-bold leading-none tracking-tightest opacity-60"
      >
        KORA
      </motion.span>

      {/* ───────────── CONTENT ───────────── */}
      <motion.div
        style={{ y: reduce ? 0 : contentY }}
        variants={container}
        initial="hidden"
        animate="show"
        className="shell relative z-10 grid w-full grid-cols-1 items-center gap-12 pb-24 pt-32 lg:grid-cols-12 lg:pt-24"
      >
        {/* Left — copy */}
        <div className="lg:col-span-7">
          {/* index row */}
          <motion.div variants={rise} className="flex items-center gap-4">
            <span className="font-display text-sm font-semibold text-gold">(01)</span>
            <span className="h-px w-12 bg-gold/40" />
            <span className="inline-flex items-center gap-2.5 text-[0.7rem] font-medium uppercase tracking-[0.24em] text-ink/75">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
              </span>
              {site.baseline}
            </span>
          </motion.div>

          {/* H1 — oversized Clash Display Bold, bicolor */}
          <h1 className="mt-6 max-w-[20ch] font-display text-[clamp(2.9rem,6.6vw,6.25rem)] font-bold leading-[0.94] tracking-tightest text-ink">
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

          <motion.p
            variants={rise}
            className="mt-7 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {hero.subtitle}
          </motion.p>

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

          {/* trust strip */}
          <motion.div variants={fade} className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
            {trust.map((t, i) => (
              <div key={t.label} className="flex items-center gap-8">
                <div>
                  <div className="font-display text-2xl font-semibold text-ink">{t.value}</div>
                  <div className="text-xs uppercase tracking-[0.18em] text-muted">{t.label}</div>
                </div>
                {i < trust.length - 1 && <span className="hidden h-10 w-px bg-line sm:block" />}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — floating glass departure card */}
        <motion.div variants={fade} className="hidden lg:col-span-5 lg:flex lg:justify-end">
          <NextDepartureCard reduce={!!reduce} />
        </motion.div>
      </motion.div>

      {/* ───────────── SCROLL CUE ───────────── */}
      <motion.div
        variants={fade}
        initial="hidden"
        animate="show"
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[0.65rem] uppercase tracking-[0.3em] text-muted">Défiler</span>
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
function NextDepartureCard({ reduce }: { reduce: boolean }) {
  return (
    <motion.div
      animate={reduce ? {} : { y: [0, -12, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="glass edge-glow relative w-full max-w-sm rounded-3xl p-6"
    >
      {/* bracket tag */}
      <span className="pointer-events-none absolute -top-3 left-6 bg-navy px-2 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-gold/70">
        [ live ]
      </span>

      <div className="flex items-center justify-between">
        <span className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-gold">
          Prochain départ
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-wider text-gold">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          À l&apos;heure
        </span>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <div>
          <div className="text-[0.65rem] uppercase tracking-[0.2em] text-muted">Départ</div>
          <div className="mt-1 font-display text-xl font-semibold text-ink">Ouagadougou</div>
          <div className="mt-0.5 text-xs text-muted">06:00</div>
        </div>

        <div className="relative mx-1 flex-1">
          <div className="flex items-center">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-gold" />
            <div className="relative h-px flex-1">
              <div className="absolute inset-0 bg-gradient-to-r from-gold/50 via-gold/30 to-gold/50" />
              <motion.span
                aria-hidden
                animate={reduce ? {} : { left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }}
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

      <div className="flex items-center justify-between">
        <span className="rounded-md border border-gold/30 bg-gold/5 px-2 py-1 text-[0.65rem] font-medium uppercase tracking-wider text-gold">
          KORA Business
        </span>
        <span className="text-xs text-muted">8h30 · directe</span>
      </div>

      <div className="pointer-events-none absolute -right-px -top-px h-24 w-24 rounded-tr-3xl bg-[radial-gradient(circle_at_top_right,rgba(201,168,76,0.18),transparent_70%)]" />
    </motion.div>
  );
}
