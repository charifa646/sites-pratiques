"use client";

import { useMotionValueEvent, useScroll } from "framer-motion";
import { useRef, useState } from "react";
import { method } from "@/lib/copy";
import { METHOD_STEPS } from "@/lib/story";
import { Mask, Rise, cx } from "@/components/ui/motion";

/**
 * Méthode: three steps light up while the section is pinned; in the 3D world
 * the same browser goes from notes, to design, to a live site.
 */
export function Method() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [step, setStep] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => setStep(METHOD_STEPS.filter((t) => p > t).length));

  return (
    <section ref={ref} id="methode" data-station="method" aria-labelledby="method-title" className="relative h-[230vh]">
      <div className="sticky top-0 flex h-[100svh] items-end pb-[6svh] lg:items-center lg:pb-0">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_20%_78%,rgb(var(--c-void)/0.85),transparent_75%)] lg:bg-[radial-gradient(50%_70%_at_22%_50%,rgb(var(--c-void)/0.78),transparent_72%)]"
        />
        <div className="relative mx-auto w-full max-w-[1400px] px-5 sm:px-10">
          <div className="max-w-[600px]">
            <Rise className="flex items-center gap-2.5 text-[12px] font-medium uppercase tracking-[0.22em] text-fog">
              <span className="h-px w-8 bg-acid" />
              {method.eyebrow}
            </Rise>
            <h2
              id="method-title"
              className="mt-4 font-display text-[clamp(2.1rem,4.6vw,4.2rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-bone"
            >
              <Mask className="pb-[0.06em]">{method.title}</Mask>
            </h2>
            <Rise as="p" delay={0.15} className="mt-4 font-serif text-[clamp(1.25rem,2vw,1.6rem)] italic text-acid">
              {method.lead}
            </Rise>
            <ol className="mt-7 space-y-1">
              {method.steps.map((s, i) => {
                const on = step > i;
                return (
                  <li key={s.n} className="border-t border-white/10 py-4">
                    <div className="flex items-baseline gap-4">
                      <span className={cx("font-display text-sm tabular-nums transition-colors duration-700", on ? "text-acid" : "text-fog-dim")}>
                        {s.n}
                      </span>
                      <div>
                        <p
                          className={cx(
                            "font-display text-[clamp(1.2rem,2vw,1.6rem)] font-medium tracking-[-0.02em] transition-[color,text-shadow] duration-700",
                            on ? "glow text-bone" : "text-white/30",
                          )}
                        >
                          {s.title} <span className="font-sans text-[0.72em] font-normal text-fog">· {s.line}</span>
                        </p>
                        <p
                          className={cx(
                            "mt-1.5 max-w-[30rem] text-[14px] leading-relaxed transition-colors duration-700 sm:text-[15px]",
                            on ? "text-fog" : "text-white/25",
                          )}
                        >
                          {s.detail}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
