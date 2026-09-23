"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useRef, useState } from "react";
import { problem } from "@/lib/copy";
import { PROBLEM_KICKER, PROBLEM_STEPS } from "@/lib/story";
import { EXPO, Mask, Rise, cx } from "@/components/ui/motion";

/**
 * Sticky scrollytelling: while the section is pinned, the three jobs of a
 * website light up one by one (the 3D browser comes alive in sync).
 */
export function Problem() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [step, setStep] = useState(0);
  const [kicker, setKicker] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setStep(PROBLEM_STEPS.filter((t) => p > t).length);
    setKicker(p > PROBLEM_KICKER);
  });

  return (
    <section ref={ref} id="constat" data-station="problem" aria-labelledby="constat-title" className="relative h-[240vh]">
      <div className="sticky top-0 flex h-[100svh] items-end pb-[7svh] lg:items-center lg:pb-0">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_20%_75%,rgba(5,5,5,0.85),transparent_75%)] lg:bg-[radial-gradient(50%_70%_at_22%_50%,rgba(5,5,5,0.78),transparent_72%)]"
        />
        <div className="relative mx-auto w-full max-w-[1400px] px-5 sm:px-10">
          <div className="max-w-[640px]">
            <Rise className="flex items-center gap-2.5 text-[12px] font-medium uppercase tracking-[0.22em] text-fog">
              <span className="h-px w-8 bg-acid" />
              {problem.eyebrow}
            </Rise>
            <h2
              id="constat-title"
              className="mt-5 font-display text-[clamp(2.1rem,4.6vw,4.2rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-bone"
            >
              <Mask className="pb-[0.05em]">Votre site ne devrait pas</Mask>
              <Mask delay={0.08} className="pb-[0.08em]">
                simplement{" "}
                <span className="font-serif font-normal italic tracking-[-0.01em] text-fog">exister.</span>
              </Mask>
            </h2>
            <Rise as="p" delay={0.25} className="mt-5 max-w-[32rem] text-[16px] leading-relaxed text-fog sm:text-[18px]">
              {problem.text}
            </Rise>

            <ol className="mt-8 space-y-1 sm:mt-10">
              {problem.pillars.map((p, i) => {
                const on = step > i;
                return (
                  <li key={p} className="flex items-center gap-4 border-t border-white/10 py-3.5">
                    <span
                      className={cx(
                        "font-display text-sm tabular-nums transition-colors duration-700",
                        on ? "text-acid" : "text-fog-dim",
                      )}
                    >
                      0{i + 1}
                    </span>
                    <span
                      className={cx(
                        "font-display text-[clamp(1.25rem,2.2vw,1.9rem)] font-medium tracking-[-0.02em] transition-[color,text-shadow] duration-700",
                        on ? "glow text-bone" : "text-white/25",
                      )}
                    >
                      {p}
                    </span>
                    <span
                      className={cx(
                        "ml-auto h-2 w-2 rounded-full transition-all duration-700",
                        on ? "bg-acid shadow-[0_0_14px_3px_rgba(182,255,59,0.7)]" : "bg-white/15",
                      )}
                    />
                  </li>
                );
              })}
            </ol>

            <motion.p
              className="mt-7 font-serif text-[clamp(1.7rem,3vw,2.6rem)] italic leading-tight text-acid glow"
              initial={false}
              animate={kicker ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 18, filter: "blur(8px)" }}
              transition={{ duration: 0.9, ease: EXPO }}
            >
              {problem.kicker}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
