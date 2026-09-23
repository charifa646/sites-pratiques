"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useRef, useState } from "react";
import { cta, work } from "@/lib/copy";
import { projects } from "@/lib/projects";
import { diveTo } from "@/lib/scroll";
import { workIndex } from "@/lib/story";
import { Button } from "@/components/ui/Button";
import { EXPO, Mask, Rise, cx } from "@/components/ui/motion";

/**
 * Réalisations: pinned gallery. While the section scrolls, the 3D gallery
 * brings each project forward and this card follows it; the last stop is an
 * invitation to be the next one.
 */
export function Work() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [index, setIndex] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => setIndex(workIndex(p, projects.length)));

  const last = index >= projects.length;
  const p = projects[Math.min(index, projects.length - 1)];

  return (
    <section ref={ref} id="realisations" data-station="work" aria-labelledby="work-title" className="relative h-[260vh]">
      <div className="sticky top-0 flex h-[100svh] items-end pb-[6svh] lg:items-center lg:pb-0">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_55%_at_25%_80%,rgba(5,5,5,0.85),transparent_75%)] lg:bg-[radial-gradient(48%_70%_at_22%_52%,rgba(5,5,5,0.78),transparent_72%)]"
        />
        <div className="relative mx-auto w-full max-w-[1400px] px-5 sm:px-10">
          <div className="max-w-[520px]">
            <Rise className="flex items-center gap-2.5 text-[12px] font-medium uppercase tracking-[0.22em] text-fog">
              <span className="h-px w-8 bg-acid" />
              {work.eyebrow}
            </Rise>
            <h2
              id="work-title"
              className="mt-4 font-display text-[clamp(2.2rem,4.8vw,4.4rem)] font-semibold leading-[1] tracking-[-0.035em] text-bone"
            >
              <Mask className="pb-[0.06em]">
                {work.title.lead} <span className="font-serif font-normal italic text-acid">{work.title.accent}</span>
              </Mask>
            </h2>
            <Rise as="p" delay={0.15} className="mt-4 max-w-[30rem] text-[16px] leading-relaxed text-fog sm:text-[17px]">
              {work.text}
            </Rise>

            <Rise delay={0.25} blur={false} className="glass relative mt-7 overflow-hidden rounded-[26px] p-6 sm:p-7">
              <div className="flex items-center justify-between text-[13px] tabular-nums text-fog">
                <span>
                  <span className="text-acid">{String(Math.min(index + 1, projects.length)).padStart(2, "0")}</span> /{" "}
                  {String(projects.length).padStart(2, "0")}
                </span>
                <span className="flex gap-1.5" aria-hidden>
                  {[...projects, null].map((_, i) => (
                    <span
                      key={i}
                      className={cx(
                        "h-1.5 rounded-full transition-all duration-500 ease-expo",
                        i === index ? "w-6 bg-acid" : "w-1.5 bg-white/20",
                      )}
                    />
                  ))}
                </span>
              </div>
              <div className="relative mt-5 min-h-[132px]" aria-live="polite">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5, ease: EXPO }}
                  >
                    {last ? (
                      <>
                        <p className="font-display text-[clamp(1.5rem,2.4vw,2rem)] font-semibold leading-tight tracking-[-0.02em] text-bone">
                          {work.next.title}
                        </p>
                        <p className="mt-3 text-[15px] leading-relaxed text-fog">{work.next.text}</p>
                        <Button className="mt-5" onClick={() => diveTo("contact")}>
                          {cta.quote}
                        </Button>
                      </>
                    ) : (
                      <>
                        <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-acid">{p.type}</p>
                        <p className="mt-2 font-display text-[clamp(1.6rem,2.6vw,2.2rem)] font-semibold leading-tight tracking-[-0.02em] text-bone">
                          {p.title}
                        </p>
                        {p.summary && <p className="mt-3 text-[15px] leading-relaxed text-fog">{p.summary}</p>}
                        {p.url && (
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center gap-2 text-[14px] text-bone underline-offset-4 transition-colors hover:text-acid hover:underline"
                          >
                            {work.visit}
                            <span aria-hidden>↗</span>
                          </a>
                        )}
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </Rise>
          </div>
        </div>
      </div>
    </section>
  );
}
