"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { LightRays } from "@/components/ui/LightRays";
import { BlurFade } from "@/components/ui/BlurFade";
import { DiaTextReveal } from "@/components/ui/DiaTextReveal";
import { hero, site, images } from "@/lib/data";

// Spring per spec: stiffness 100 / damping 20.
const SPRING = { stiffness: 100, damping: 20 } as const;

export function Hero() {
  const runway = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: runway,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, SPRING);

  // Scroll-driven choreography (2D): the coach zooms while content drifts out.
  const busScale = useTransform(p, [0, 1], [1.06, 1.34]);
  const busY = useTransform(p, [0, 1], ["0%", "-6%"]);
  const wordX = useTransform(p, [0, 1], ["0%", "-16%"]);
  const wordOpacity = useTransform(p, [0, 0.8], [1, 0.25]);
  const contentY = useTransform(p, [0, 0.85], ["0%", "-14%"]);
  const contentOpacity = useTransform(p, [0, 0.55, 0.82], [1, 1, 0]);
  const cueOpacity = useTransform(p, [0, 0.25], [1, 0]);

  const stat = (v: string, l: string) => ({ v, l });
  const trust = [stat("500K+", "Voyageurs"), stat("98%", "Ponctualité"), stat("15", "Destinations")];

  return (
    <section ref={runway} className="relative h-[200vh] bg-navy-deep">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        {/* ───── MEDIA ───── */}
        <motion.div style={{ scale: reduce ? 1 : busScale, y: reduce ? 0 : busY }} className="absolute inset-0 z-0">
          <Image
            src={images.heroPoster}
            alt="Autocar KORA TRANSIT, phares allumés au crépuscule"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[68%_center]"
          />
        </motion.div>

        {/* ───── SCRIMS ───── */}
        <div className="pointer-events-none absolute inset-0 z-[1]">
          <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/72 to-transparent lg:via-navy-deep/52" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/15 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-navy-deep/80 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(130%_130%_at_50%_50%,transparent_58%,rgba(7,15,28,0.6)_100%)]" />
        </div>

        {/* ───── GOLD HEADLIGHT RAYS ───── */}
        <LightRays className="z-[2] opacity-70" count={8} length="80vh" blur={42} />
        <div className="pointer-events-none absolute -right-24 top-[-8%] z-[2] h-[55vh] w-[55vh] animate-pulse-glow rounded-full bg-gold/20 blur-[150px]" />

        {/* grain */}
        <div className="pointer-events-none absolute inset-0 z-[3] bg-grain opacity-[0.06] mix-blend-overlay" />

        {/* ───── GIANT OUTLINE WORDMARK ───── */}
        <motion.span
          aria-hidden
          style={{ x: reduce ? 0 : wordX, opacity: reduce ? 0.5 : wordOpacity }}
          className="text-stroke-ink pointer-events-none absolute -bottom-[7%] left-1/2 z-[2] -translate-x-1/2 select-none whitespace-nowrap font-display text-[33vw] font-bold leading-none tracking-tightest"
        >
          KORA
        </motion.span>

        {/* ───── CONTENT ───── */}
        <motion.div
          style={{ y: reduce ? 0 : contentY, opacity: reduce ? 1 : contentOpacity }}
          className="shell relative z-10 w-full"
        >
          <div className="max-w-3xl">
            <BlurFade delay={0.05} inView>
              <div className="flex items-center gap-4">
                <span className="font-display text-sm font-semibold text-gold">(01)</span>
                <span className="h-px w-12 bg-gold/40" />
                <span className="inline-flex items-center gap-2.5 text-[0.7rem] font-medium uppercase tracking-[0.24em] text-ink/75">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
                  </span>
                  {site.baseline}
                </span>
              </div>
            </BlurFade>

            <h1 className="mt-6 font-display text-[clamp(2.9rem,6.6vw,6.25rem)] font-bold leading-[0.94] tracking-tightest text-ink">
              <BlurFade delay={0.15} inView className="block">
                Le transport
              </BlurFade>
              <BlurFade delay={0.27} inView className="block">
                qui ne vous fait
              </BlurFade>
              <span className="block">
                <DiaTextReveal text="jamais attendre." textColor="#C9A84C" delay={0.6} duration={1.6} />
              </span>
            </h1>

            <BlurFade delay={0.5} inView>
              <p className="mt-7 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                {hero.subtitle}
              </p>
            </BlurFade>

            <BlurFade delay={0.62} inView>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <ButtonLink href="/reservation" size="lg">
                  {hero.ctaPrimary}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </ButtonLink>
                <ButtonLink href="/services" variant="secondary" size="lg">
                  <Play className="h-4 w-4 text-gold" />
                  {hero.ctaSecondary}
                </ButtonLink>
              </div>
            </BlurFade>

            <BlurFade delay={0.74} inView>
              <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
                {trust.map((t, i) => (
                  <div key={t.l} className="flex items-center gap-8">
                    <div>
                      <div className="font-display text-2xl font-semibold text-ink">{t.v}</div>
                      <div className="text-xs uppercase tracking-[0.18em] text-muted">{t.l}</div>
                    </div>
                    {i < trust.length - 1 && <span className="hidden h-10 w-px bg-line sm:block" />}
                  </div>
                ))}
              </div>
            </BlurFade>
          </div>
        </motion.div>

        {/* ───── SCROLL CUE ───── */}
        <motion.div style={{ opacity: cueOpacity }} className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2">
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
