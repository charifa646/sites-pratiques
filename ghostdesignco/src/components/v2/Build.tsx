"use client";

import { animate, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { problem } from "@/lib/copy";
import { cx } from "@/components/ui/motion";
import { Arrowhead, Bar, Photo, WindowBar } from "./Mockups";
import { HEADER_H, Label } from "./ui";

/**
 * "Votre site ne devrait pas simplement exister." — told by a page that
 * builds itself as you scroll: a bare wireframe, then clarity (it says what
 * you do), trust (proof), desire (the button, clicked). A Figma-style frame
 * walks from block to block, named after each of the three pillars.
 */

// where each pillar starts along the section's scroll
const START = [0.16, 0.42, 0.68];

function useStage(p: MotionValue<number>) {
  const [stage, setStage] = useState(0);
  useMotionValueEvent(p, "change", (v) => {
    const next = v < START[0] ? 0 : v < START[1] ? 1 : v < START[2] ? 2 : 3;
    setStage((s) => (s === next ? s : next));
  });
  return stage;
}

function Dashed({ className }: { className: string }) {
  return <span className={cx("absolute rounded-[1.2cqw] border-[0.25cqw] border-dashed border-ink/20", className)} />;
}

function Star() {
  return (
    <svg viewBox="0 0 20 20" className="h-[2.4cqw] w-[2.4cqw] text-acid-deep" fill="currentColor">
      <path d="m10 1.8 2.5 5.3 5.8.7-4.3 4 1.1 5.7L10 14.7l-5.1 2.8 1.1-5.7-4.3-4 5.8-.7Z" />
    </svg>
  );
}

function Screen({ p, stage }: { p: MotionValue<number>; stage: number }) {
  const wire = useTransform(p, [0.14, 0.3], [1, 0]);
  const clarity = useTransform(p, [0.16, 0.3], [0, 1]);
  const clarityY = useTransform(p, [0.16, 0.3], [16, 0]);
  const trust = useTransform(p, [0.42, 0.54], [0, 1]);
  const trustY = useTransform(p, [0.42, 0.54], [22, 0]);
  const desire = useTransform(p, [0.68, 0.76], [0, 1]);
  const desireScale = useTransform(p, [0.68, 0.76], [0.7, 1]);
  const navCta = useTransform(p, [0.7, 0.78], ["rgba(182,255,59,0)", "rgba(182,255,59,1)"]);
  // the cursor comes in, reaches the button, clicks
  const curX = useTransform(p, [0.74, 0.86], ["94%", "22%"]);
  const curY = useTransform(p, [0.74, 0.86], ["98%", "61%"]);
  const curO = useTransform(p, [0.72, 0.76, 0.88, 0.92], [0, 1, 1, 0]);
  const ring = useTransform(p, [0.86, 0.94], [0.4, 2.2]);
  const ringO = useTransform(p, [0.86, 0.94], [0.9, 0]);
  // selection frame: headline, then proof, then the button
  const k = [0.16, 0.4, 0.46, 0.66, 0.72, 1];
  const selL = useTransform(p, k, ["4%", "4%", "3.5%", "3.5%", "4%", "4%"]);
  const selT = useTransform(p, k, ["15%", "15%", "66%", "66%", "53%", "53%"]);
  const selW = useTransform(p, k, ["48%", "48%", "93%", "93%", "28%", "28%"]);
  const selH = useTransform(p, k, ["25%", "25%", "30%", "30%", "11%", "11%"]);
  const selO = useTransform(p, [0.13, 0.18, 0.86, 0.9], [0, 1, 1, 0]);
  // …and the sketch gives way to a finished site
  const real = useTransform(p, [0.88, 0.96], [0, 1]);
  const realScale = useTransform(p, [0.88, 0.96], [1.04, 1]);

  return (
    <div className="[container-type:inline-size]">
      <div className="overflow-hidden rounded-[2.2cqw] border border-line bg-white shadow-[0_1px_2px_rgba(12,12,13,0.05),0_40px_90px_-40px_rgba(12,12,13,0.35)]">
        <WindowBar />
        <div className="relative aspect-[1.5]">
          {/* 0. a site that merely exists: empty boxes */}
          <motion.div style={{ opacity: wire }} className="absolute inset-0">
            <Dashed className="left-[5%] top-[5%] h-[5%] w-[12%]" />
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="absolute top-[6%] h-[3%] w-[7%] rounded-full border-[0.25cqw] border-dashed border-ink/20" style={{ left: `${41 + i * 9}%` }} />
            ))}
            <Dashed className="right-[5%] top-[4.8%] h-[6.5%] w-[13%]" />
            <Dashed className="left-[5%] top-[16%] h-[22%] w-[46%]" />
            <Dashed className="left-[5%] top-[41%] h-[9%] w-[40%]" />
            <Dashed className="right-[5%] top-[15%] h-[45%] w-[40%]" />
            <Dashed className="left-[5%] top-[67%] h-[27%] w-[90%]" />
          </motion.div>

          {/* 1. clarity: it says what you do */}
          <motion.div style={{ opacity: clarity, y: clarityY }} className="absolute inset-0">
            <Bar className="absolute left-[5%] top-[6%] h-[2.2cqw] w-[11%] bg-ink/85" />
            <span className="absolute left-[42%] top-[7%] flex gap-[2.6cqw]">
              {[0, 1, 2, 3].map((i) => (
                <Bar key={i} className="h-[1cqw] w-[6cqw] bg-ink/20" />
              ))}
            </span>
            <motion.span
              style={{ backgroundColor: navCta }}
              className="absolute right-[5%] top-[4.8%] h-[4.4cqw] w-[13%] rounded-full border border-ink/15"
            />
            <div className="absolute left-[5%] top-[17%] w-[45%]">
              <Bar className="h-[3.4cqw] w-[96%] bg-ink/85" />
              <Bar className="mt-[1.8cqw] h-[3.4cqw] w-[74%] bg-ink/85" />
              <Bar className="mt-[1.8cqw] h-[3.4cqw] w-[52%] bg-ink/85" />
            </div>
            <div className="absolute left-[5%] top-[42%] w-[40%]">
              <Bar className="h-[1.2cqw] w-[94%] bg-ink/15" />
              <Bar className="mt-[1.4cqw] h-[1.2cqw] w-[80%] bg-ink/15" />
              <Bar className="mt-[1.4cqw] h-[1.2cqw] w-[58%] bg-ink/15" />
            </div>
            <Photo className="absolute right-[5%] top-[15%] h-[45%] w-[40%] rounded-[2cqw]" />
          </motion.div>

          {/* 2. trust: proof you can check */}
          <motion.div style={{ opacity: trust, y: trustY }} className="absolute left-[5%] right-[5%] top-[67%] h-[27%]">
            <span className="flex items-center gap-[0.6cqw]">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} />
              ))}
              <Bar className="ml-[1.4cqw] h-[1.1cqw] w-[14cqw] bg-ink/20" />
            </span>
            <div className="mt-[2cqw] grid grid-cols-3 gap-[2.2cqw]">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-[1.6cqw] border border-line bg-paper/60 p-[2cqw]">
                  <span className="flex items-center gap-[1.4cqw]">
                    <span className="h-[4cqw] w-[4cqw] rounded-full bg-[linear-gradient(135deg,#E5D8C5,#C9B79B)]" />
                    <Bar className="h-[1.2cqw] w-[45%] bg-ink/55" />
                  </span>
                  <Bar className="mt-[1.8cqw] h-[1cqw] w-[94%] bg-ink/15" />
                  <Bar className="mt-[1cqw] h-[1cqw] w-[70%] bg-ink/15" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* 3. desire: one clear action */}
          <motion.span
            style={{ opacity: desire, scale: desireScale }}
            className="absolute left-[5%] top-[54%] flex h-[9%] w-[26%] origin-left items-center justify-center gap-[1.4cqw] rounded-full bg-acid text-acid-ink shadow-[0_1.4cqw_3cqw_-1.2cqw_rgba(126,211,33,0.9)]"
          >
            <Bar className="h-[1.3cqw] w-[45%] bg-acid-ink/80" />
            <Arrowhead className="h-[2.4cqw] w-[2.4cqw]" />
          </motion.span>

          <motion.div style={{ opacity: real, scale: realScale }} className="absolute inset-0">
            <Image src="/v2/v1-accueil.jpg" alt="" fill sizes="(min-width: 1024px) 700px, 92vw" className="object-cover object-left-top" />
          </motion.div>

          {/* the designer's selection frame */}
          <motion.div
            style={{ left: selL, top: selT, width: selW, height: selH, opacity: selO }}
            className="pointer-events-none absolute border-[0.22cqw] border-acid-deep"
          >
            {["-left-[0.7cqw] -top-[0.7cqw]", "-right-[0.7cqw] -top-[0.7cqw]", "-bottom-[0.7cqw] -left-[0.7cqw]", "-bottom-[0.7cqw] -right-[0.7cqw]"].map((c) => (
              <span key={c} className={`absolute h-[1.3cqw] w-[1.3cqw] border-[0.22cqw] border-acid-deep bg-white ${c}`} />
            ))}
            <span className="absolute -top-[4.2cqw] left-0 whitespace-nowrap rounded-[0.8cqw] bg-acid-deep px-[1.2cqw] py-[0.5cqw] text-[1.6cqw] font-semibold text-acid-ink">
              {stage > 0 ? problem.pillars[Math.min(2, stage - 1)] : problem.pillars[0]}
            </span>
          </motion.div>

          {/* cursor + click */}
          <motion.div style={{ left: curX, top: curY, opacity: curO }} className="pointer-events-none absolute">
            <motion.span
              style={{ scale: ring, opacity: ringO }}
              className="absolute -left-[3cqw] -top-[3cqw] h-[6cqw] w-[6cqw] rounded-full border-[0.3cqw] border-ink/60"
            />
            <svg viewBox="0 0 24 24" className="relative h-[4cqw] w-[4cqw] drop-shadow-[0_0.4cqw_0.6cqw_rgba(0,0,0,0.25)]">
              <path d="M4 2.5 19.5 12l-6.6 1.6 3.7 6.9-2.6 1.4-3.7-6.9L5.5 19.4Z" fill="#0C0C0D" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/**
 * `autoplay` (the site): no pinning, the page scrolls on as usual; the site
 * builds itself on its own once the screen is in view (about 7 s), then
 * stays built. V2 keeps the pinned section, driven by the scroll.
 */
export function V2Build({ n, autoplay = false }: { n?: string; autoplay?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const clock = useMotionValue(0);
  const seen = useInView(screen, { amount: 0.55, once: true });
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!autoplay) return;
    if (reduce) {
      clock.set(1);
      return;
    }
    if (!seen) return;
    const run = animate(clock, 1, { duration: 7, ease: "linear", delay: 0.3 });
    return () => run.stop();
  }, [autoplay, seen, reduce, clock]);
  const p = autoplay ? clock : scrollYProgress;
  const stage = useStage(p);
  const kicker = useTransform(p, [0.88, 0.96], [0, 1]);
  const kickerY = useTransform(p, [0.88, 0.96], [16, 0]);
  const fill = useTransform(p, [START[0], 0.9], ["0%", "100%"]);

  return (
    <section
      ref={ref}
      id="constat"
      aria-labelledby="v2-build-title"
      className={cx("relative bg-paper", autoplay ? "py-20 lg:py-28" : "h-[260vh] lg:h-[300vh]")}
    >
      {/* pinned under the header (not behind it with a padding: no gap above it on the way in) */}
      <div
        className={cx("flex items-center", !autoplay && "v2-pin sticky overflow-hidden")}
        style={autoplay ? undefined : { top: HEADER_H, height: `calc(100svh - ${HEADER_H}px)` }}
      >
        <div className="mx-auto grid w-full max-w-[1240px] items-center gap-6 px-5 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
          <div>
            <Label n={n}>{problem.eyebrow}</Label>
            <h2 id="v2-build-title" className="mt-4 font-display text-[clamp(1.7rem,4vw,3.5rem)] font-semibold leading-[1.03] tracking-[-0.04em] lg:mt-5">
              {problem.title}
            </h2>
            <p className="mt-4 max-w-[30rem] text-[15px] leading-relaxed text-ink-soft sm:mt-5 sm:text-[17px]">{problem.text}</p>

            <div className="relative mt-5 lg:mt-9">
              {/* progress rail */}
              <span aria-hidden className="absolute bottom-3 left-[15px] top-3 hidden w-px bg-line lg:block" />
              <motion.span aria-hidden style={{ height: fill }} className="absolute left-[15px] top-3 hidden w-px bg-ink lg:block" />
              <ol className="flex flex-wrap gap-2 lg:flex-col lg:gap-4">
                {problem.pillars.map((pl, i) => {
                  const on = stage >= i + 1;
                  return (
                    <li
                      key={pl}
                      className={cx(
                        "relative flex items-center gap-3 rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors duration-500 lg:border-0 lg:p-0 lg:text-[19px]",
                        on ? "border-ink/20 bg-white text-ink lg:bg-transparent" : "border-line text-ink-mute",
                      )}
                    >
                      <span
                        className={cx(
                          "relative z-10 hidden h-[31px] w-[31px] place-items-center rounded-full border text-[12px] font-semibold transition-colors duration-500 lg:grid",
                          on ? "border-ink bg-ink text-acid" : "border-line bg-paper text-ink-mute",
                        )}
                      >
                        0{i + 1}
                      </span>
                      {pl}
                    </li>
                  );
                })}
              </ol>
            </div>
            <motion.p
              style={{ opacity: kicker, y: kickerY }}
              className="mt-5 font-serif text-[clamp(1.4rem,2.4vw,2.2rem)] italic leading-tight tracking-[-0.01em] lg:mt-9"
            >
              {problem.kicker}
            </motion.p>
          </div>

          <div
            ref={screen}
            data-ghost="r"
            data-ghost-x="0.12"
            data-ghost-y="0.18"
            data-ghost-m="tr"
            data-ghost-mx="-0.5"
            data-ghost-my="-0.12"
            data-ghost-mclip="top"
          >
            <Screen p={p} stage={stage} />
          </div>
        </div>
      </div>
    </section>
  );
}
