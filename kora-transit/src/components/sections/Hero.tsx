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
import { DiaTextReveal } from "@/components/ui/DiaTextReveal";
import { hero, site } from "@/lib/data";

const SPRING = { stiffness: 100, damping: 20 } as const;

export function Hero() {
  const runway = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: runway,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, SPRING);

  // ── Beat A (top): product + wordmark.  Beat B (scroll): copy reveals. ──
  const wordY = useTransform(p, [0, 1], ["0%", "-12%"]);
  const wordScale = useTransform(p, [0, 1], [1, 1.12]);
  const wordOpacity = useTransform(p, [0.18, 0.5], [1, 0.12]);

  const busScale = useTransform(p, [0, 0.3, 0.62], [1, 1.02, 0.82]);
  const busY = useTransform(p, [0, 0.3, 0.62], ["0%", "0%", "-16%"]);

  const copyOpacity = useTransform(p, [0.26, 0.46], [0, 1]);
  const copyY = useTransform(p, [0.26, 0.55], [28, 0]);

  const cueOpacity = useTransform(p, [0, 0.18], [1, 0]);

  return (
    <section ref={runway} className="relative h-[230vh] bg-navy-deep">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Studio floor light */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_54%,#0E1B30_0%,#070F1C_58%)]" />
        {/* Reflective floor seam */}
        <div className="absolute inset-x-0 top-[64%] h-px bg-gradient-to-r from-transparent via-ink/[0.06] to-transparent" />
        {/* grain */}
        <div className="pointer-events-none absolute inset-0 z-[6] bg-grain opacity-[0.05] mix-blend-overlay" />

        {/* Top micro-label */}
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

        {/* ── Giant wordmark BEHIND the bus ── */}
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

        {/* Gold halo behind product */}
        <div className="pointer-events-none absolute left-1/2 top-[52%] z-[1] h-[42vh] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-[130px]" />

        {/* ── Product (cut-out bus) ── */}
        <div className="absolute left-1/2 top-[50%] z-10 w-[94vw] -translate-x-1/2 -translate-y-1/2 sm:w-[80vw] lg:top-[57%] lg:w-[min(780px,62vw)]">
          <motion.div style={{ scale: reduce ? 1 : busScale, y: reduce ? 0 : busY }}>
            <Image
              src="/bus-cutout.png"
              alt="Autocar KORA TRANSIT, phares allumés"
              width={1091}
              height={690}
              priority
              className="h-auto w-full object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.7)]"
            />
            {/* Reflection */}
            <div
              aria-hidden
              className="absolute left-0 top-full w-full -scale-y-100 opacity-[0.14] [mask-image:linear-gradient(to_bottom,black,transparent_55%)]"
            >
              <Image
                src="/bus-cutout.png"
                alt=""
                width={1091}
                height={690}
                className="h-auto w-full object-contain"
              />
            </div>
          </motion.div>
        </div>

        {/* ── Copy (revealed on scroll — Beat B) ── */}
        <motion.div
          style={{ opacity: copyOpacity, y: reduce ? 0 : copyY }}
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
