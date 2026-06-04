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

// Softer spring for a fluid, easy-to-follow ride.
const SPRING = { stiffness: 70, damping: 26 } as const;
const EASE = [0.22, 1, 0.36, 1] as const;

// Tiny blurred preview so the coach fades up from blur instead of popping in.
const BUS_BLUR =
  "data:image/webp;base64,UklGRu4AAABXRUJQVlA4WAoAAAAQAAAADwAACQAAQUxQSJAAAAANuYzof8B1bNtKc8+7OHHrIP1X5H+4O1yiPURMQLiVg51ZJROLeAqKY81m2YjZCqmezuJysUqmQjSOJ12qYVKYwWKAQSnTu7BARgEgwJhBN2vVPGe92gwIIQCgU1jHcdIawJcQmGkIc2kGs58ZCDJTAAT5G4mBwlgHQKPMyERMRGumcxkmhJmACCEGomdxmBhWUDggOAAAABACAJ0BKhAACgADgFoliAJ0fwAVzZ8HmTgA/vGjx57+thW8L2vLqZkuiAu6OgaZkdrScGWynAAA";

/** Crossfade + slide for a scroll sub-range (with generous fade margins). */
function useBeat(p: MotionValue<number>, a: number, b: number) {
  const m = Math.min(0.05, (b - a) / 3);
  const opacity = useTransform(p, [a, a + m, b - m, b], [0, 1, 1, 0]);
  const y = useTransform(p, [a, a + m, b - m, b], [24, 0, 0, -24]);
  const x = useTransform(p, [a, a + m, b - m, b], [44, 0, 0, -24]);
  return { opacity, y, x };
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
  const wordOpacity = useTransform(p, [0, 0.09, 0.16], [1, 1, 0]);
  const wordY = useTransform(p, [0, 0.5], ["0%", "-9%"]);
  const wordScale = useTransform(p, [0, 0.5], [1, 1.08]);

  // ── Bus path (smooth, continuous) ──
  const busScale = useTransform(p, [0, 0.1, 0.34, 0.7, 1], [1, 1.0, 1.1, 1.14, 0.95]);
  const busX = useTransform(p, [0.34, 0.46, 1], ["0%", "-12%", "-12%"]);
  const busY = useTransform(p, [0, 0.1, 0.34], ["0%", "0%", "-5%"]);
  const busOpacity = useTransform(p, [0.1, 0.18, 0.3, 0.36], [1, 0.45, 0.45, 1]);

  // ── Beats (slow, sequential — no overlap) ──
  const heroCopy = useBeat(p, 0.1, 0.3);
  const chapterTitle = useTransform(p, [0.34, 0.4, 0.97, 1], [0, 1, 1, 0]);
  const chapterSub = useBeat(p, 0.36, 0.46);
  // Overlapping ranges → true crossfade (no blank gap), longer holds.
  const c1 = useBeat(p, 0.4, 0.58);
  const c2 = useBeat(p, 0.54, 0.72);
  const c3 = useBeat(p, 0.68, 0.86);
  const c4 = useBeat(p, 0.82, 0.99);
  const cueOpacity = useTransform(p, [0, 0.07], [1, 0]);

  const callouts = [c1, c2, c3, c4];

  return (
    <section ref={runway} className="relative h-[460vh] bg-navy-deep md:h-[680vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Smooth entrance (no loader) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: EASE }}
          className="absolute inset-0"
        >
          {/* Studio floor light */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_54%,#0E1B30_0%,#070F1C_58%)]" />
          <div className="absolute inset-x-0 top-[64%] h-px bg-gradient-to-r from-transparent via-ink/[0.06] to-transparent" />
          <div className="pointer-events-none absolute inset-0 z-[6] hidden bg-grain opacity-[0.05] mix-blend-overlay md:block" />

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
            initial={{ opacity: 0, filter: "blur(14px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.3, ease: EASE, delay: 0.1 }}
            className="absolute left-1/2 top-[26%] z-0 sm:top-[18%] lg:top-[14%]"
            style={{ x: "-50%" }}
          >
            <motion.span
              aria-hidden
              style={{
                y: reduce ? 0 : wordY,
                scale: reduce ? 1 : wordScale,
                opacity: reduce ? 1 : wordOpacity,
                display: "block",
              }}
              className="select-none whitespace-nowrap font-display text-[34vw] font-bold leading-none tracking-tightest text-ink sm:text-[28vw] lg:text-[clamp(5rem,26vw,22rem)]"
            >
              KORA
            </motion.span>
          </motion.span>

          {/* Gold halo (radial-gradient — no blur filter, cheap on mobile) */}
          <div className="pointer-events-none absolute left-1/2 top-[52%] z-[1] h-[64vh] w-[82vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(201,168,76,0.13),transparent)]" />

          {/* Bus */}
          <div className="absolute left-1/2 top-[50%] z-10 w-[94vw] -translate-x-1/2 -translate-y-1/2 sm:w-[80vw] lg:top-[55%] lg:w-[min(760px,60vw)]">
            <motion.div
              style={{
                scale: reduce ? 1 : busScale,
                x: reduce ? 0 : busX,
                y: reduce ? 0 : busY,
                opacity: reduce ? 1 : busOpacity,
              }}
            >
              <Image
                src="/bus-cutout.webp"
                alt="Autocar KORA TRANSIT, phares allumés"
                width={1091}
                height={690}
                priority
                sizes="(max-width: 768px) 94vw, 60vw"
                placeholder="blur"
                blurDataURL={BUS_BLUR}
                className="h-auto w-full object-contain"
              />
              <div
                aria-hidden
                className="absolute left-0 top-full hidden w-full -scale-y-100 opacity-[0.14] [mask-image:linear-gradient(to_bottom,black,transparent_55%)] sm:block"
              >
                <Image src="/bus-cutout.webp" alt="" width={1091} height={690} className="h-auto w-full object-contain" />
              </div>
            </motion.div>
          </div>

          {/* Hero copy — CENTERED, oversized (beat 1) */}
          <motion.div
            style={{ opacity: heroCopy.opacity, y: reduce ? 0 : heroCopy.y }}
            className="absolute inset-0 z-20 flex items-center justify-center px-6"
          >
            <div className="relative mx-auto max-w-4xl text-center">
              <div className="pointer-events-none absolute -inset-x-24 -inset-y-20 -z-10 bg-[radial-gradient(closest-side,rgba(7,15,28,0.9),rgba(7,15,28,0.5),transparent)]" />
              <h1 className="font-display text-[clamp(2.8rem,8vw,7rem)] font-bold leading-[0.9] tracking-tightest text-ink">
                Le transport qui ne vous fait{" "}
                <DiaTextReveal text="jamais attendre." textColor="#C9A84C" startOnView={false} />
              </h1>
              <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
                {hero.subtitle}
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
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

          {/* Chapter title (beats 2-6) — left, mid-height, larger */}
          <motion.div
            style={{ opacity: chapterTitle }}
            className="absolute left-0 right-0 top-[24%] z-20 mx-auto max-w-7xl px-6 lg:top-[30%]"
          >
            <div className="flex items-center gap-4">
              <span className="font-display text-sm font-semibold text-gold">(02)</span>
              <span className="h-px w-12 bg-gold/40" />
              <span className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-muted">
                Pourquoi KORA TRANSIT
              </span>
            </div>
            <h2 className="mt-4 max-w-2xl font-display text-[clamp(2.2rem,5vw,4.2rem)] font-semibold leading-[0.98] tracking-tightest text-ink">
              {whyUs.title}
            </h2>
            <motion.p
              style={{ opacity: chapterSub.opacity }}
              className="mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base"
            >
              {whyUs.subtitle}
            </motion.p>
          </motion.div>

          {/* Feature callouts (beats 3-6) — lower-right, clear of the navbar */}
          <div className="pointer-events-none absolute inset-x-0 bottom-[8%] z-20 mx-auto max-w-7xl px-6 lg:bottom-[12%]">
            <div className="relative ml-auto h-[200px] w-full sm:w-[420px] lg:h-[230px] lg:w-[400px]">
              {whyUs.items.map((it, i) => (
                <motion.div
                  key={it.title}
                  style={{
                    opacity: callouts[i].opacity,
                    y: reduce ? 0 : callouts[i].y,
                  }}
                  className="glass edge-glow absolute inset-x-0 bottom-0 rounded-2xl p-6"
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
        </motion.div>
      </div>
    </section>
  );
}
