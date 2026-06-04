"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { DiaTextReveal } from "@/components/ui/DiaTextReveal";
import { hero, site, whyUs } from "@/lib/data";

const SPRING = { stiffness: 100, damping: 20 } as const;

/** Crossfade opacity for a scroll sub-range (with fade margins). */
function useBeat(p: MotionValue<number>, a: number, b: number) {
  const m = Math.min(0.04, (b - a) / 3);
  const opacity = useTransform(p, [a, a + m, b - m, b], [0, 1, 1, 0]);
  const y = useTransform(p, [a, a + m, b - m, b], [26, 0, 0, -26]);
  return { opacity, y };
}

export function BusExperience() {
  const runway = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: runway,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, SPRING);

  // ── Wordmark (hero) ──
  const wordOpacity = useTransform(p, [0, 0.1, 0.18], [1, 1, 0]);
  const wordY = useTransform(p, [0, 0.5], ["0%", "-10%"]);
  const wordScale = useTransform(p, [0, 0.5], [1, 1.1]);

  // ── Bus path across the whole experience (subtle zoom pulse per callout) ──
  const busScale = useTransform(
    p,
    [0, 0.13, 0.34, 0.48, 0.61, 0.74, 0.88, 1],
    [1, 1.0, 1.12, 1.17, 1.11, 1.17, 1.1, 0.94],
  );
  const busX = useTransform(p, [0.34, 0.46, 0.96], ["0%", "-14%", "-14%"]);
  const busY = useTransform(p, [0, 0.13, 0.32], ["0%", "0%", "-6%"]);

  // ── Beats (crossfade word→copy, clean gap before chapter) ──
  const heroCopy = useBeat(p, 0.1, 0.28);
  const chapterTitle = useTransform(p, [0.3, 0.35, 0.96, 1], [0, 1, 1, 0]);
  const chapterSub = useBeat(p, 0.32, 0.42);
  const c1 = useBeat(p, 0.42, 0.55);
  const c2 = useBeat(p, 0.55, 0.68);
  const c3 = useBeat(p, 0.68, 0.81);
  const c4 = useBeat(p, 0.81, 0.95);
  const cueOpacity = useTransform(p, [0, 0.08], [1, 0]);

  const callouts = [c1, c2, c3, c4];

  return (
    <section ref={runway} className="relative h-[520vh] bg-navy-deep">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Studio floor light */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_54%,#0E1B30_0%,#070F1C_58%)]" />
        <div className="absolute inset-x-0 top-[64%] h-px bg-gradient-to-r from-transparent via-ink/[0.06] to-transparent" />
        <div className="pointer-events-none absolute inset-0 z-[6] bg-grain opacity-[0.05] mix-blend-overlay" />

        {/* Top micro-label (hero) */}
        <motion.div
          style={{ opacity: cueOpacity }}
          className="absolute left-0 right-0 top-24 z-20 mx-auto flex max-w-7xl items-center gap-4 px-6"
        >
          <span className="font-display text-sm font-semibold text-gold">(01)</span>
          <span className="h-px w-12 bg-gold/40" />
          <span className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-ink/70">
            {site.baseline}
          </span>
        </motion.div>

        {/* Giant wordmark behind bus */}
        <motion.span
          aria-hidden
          style={{
            x: "-50%",
            y: reduce ? 0 : wordY,
            scale: reduce ? 1 : wordScale,
            opacity: reduce ? 1 : wordOpacity,
          }}
          className="absolute left-1/2 top-[26%] z-0 select-none whitespace-nowrap font-display text-[34vw] font-bold leading-none tracking-tightest text-ink sm:top-[18%] sm:text-[28vw] lg:top-[14%] lg:text-[clamp(5rem,26vw,22rem)]"
        >
          KORA
        </motion.span>

        {/* Gold halo */}
        <div className="pointer-events-none absolute left-1/2 top-[52%] z-[1] h-[42vh] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-[130px]" />

        {/* Bus */}
        <div className="absolute left-1/2 top-[50%] z-10 w-[94vw] -translate-x-1/2 -translate-y-1/2 sm:w-[80vw] lg:top-[55%] lg:w-[min(760px,60vw)]">
          <motion.div style={{ scale: reduce ? 1 : busScale, x: reduce ? 0 : busX, y: reduce ? 0 : busY }}>
            <Image
              src="/bus-cutout.png"
              alt="Autocar KORA TRANSIT, phares allumés"
              width={1091}
              height={690}
              priority
              className="h-auto w-full object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.7)]"
            />
            <div
              aria-hidden
              className="absolute left-0 top-full w-full -scale-y-100 opacity-[0.14] [mask-image:linear-gradient(to_bottom,black,transparent_55%)]"
            >
              <Image src="/bus-cutout.png" alt="" width={1091} height={690} className="h-auto w-full object-contain" />
            </div>
          </motion.div>
        </div>

        {/* Hero copy (beat 1) */}
        <motion.div
          style={{ opacity: heroCopy.opacity, y: reduce ? 0 : heroCopy.y }}
          className="absolute inset-x-0 bottom-[8%] z-20 mx-auto max-w-7xl px-6"
        >
          <div className="max-w-3xl">
            <h1 className="font-display text-[clamp(1.8rem,4.4vw,3.6rem)] font-bold leading-[0.98] tracking-tightest text-ink">
              Le transport qui ne vous fait{" "}
              <DiaTextReveal text="jamais attendre." textColor="#C9A84C" startOnView={false} />
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
              {hero.subtitle}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <ButtonLink href="/reservation" size="lg">
                {hero.ctaPrimary}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </ButtonLink>
              <ButtonLink href="/services" variant="secondary" size="lg">
                <Play className="h-4 w-4 text-gold" />
                {hero.ctaSecondary}
              </ButtonLink>
            </div>
          </div>
        </motion.div>

        {/* Chapter title (beats 2-6) */}
        <motion.div
          style={{ opacity: chapterTitle }}
          className="absolute left-0 right-0 top-28 z-20 mx-auto max-w-7xl px-6 lg:top-32"
        >
          <div className="flex items-center gap-4">
            <span className="font-display text-sm font-semibold text-gold">(02)</span>
            <span className="h-px w-12 bg-gold/40" />
            <span className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-muted">
              Pourquoi KORA TRANSIT
            </span>
          </div>
          <h2 className="mt-4 max-w-2xl font-display text-[clamp(1.8rem,4vw,3.2rem)] font-semibold leading-[1.0] tracking-tightest text-ink">
            {whyUs.title}
          </h2>
          <motion.p
            style={{ opacity: chapterSub.opacity }}
            className="mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base"
          >
            {whyUs.subtitle}
          </motion.p>
        </motion.div>

        {/* Feature callouts (beats 3-6) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[9%] z-20 mx-auto max-w-7xl px-6 lg:inset-y-0 lg:bottom-auto lg:flex lg:items-center lg:justify-end">
          <div className="relative h-[200px] lg:h-[240px] lg:w-[380px]">
            {whyUs.items.map((it, i) => (
              <motion.div
                key={it.title}
                style={{ opacity: callouts[i].opacity, y: reduce ? 0 : callouts[i].y }}
                className="glass edge-glow absolute inset-x-0 bottom-0 rounded-2xl p-6 lg:inset-y-0 lg:bottom-auto"
              >
                <div className="flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
                    <it.icon className="h-6 w-6" />
                  </div>
                  <span className="font-display text-2xl font-bold text-ink/15">0{i + 1}</span>
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-ink">{it.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{it.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div
          style={{ opacity: cueOpacity }}
          className="absolute bottom-7 left-1/2 z-20 -translate-x-1/2"
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
      </div>
    </section>
  );
}
