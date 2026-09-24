"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { method } from "@/lib/copy";
import { Rise, cx } from "@/components/ui/motion";
import { Label } from "./ui";

/**
 * De l'idée au site en ligne: a line draws itself from step to step as you
 * scroll, each step lights up when the line reaches it, and the ghost rides
 * the tip of the line (it is the anchor there).
 */
export function V2Method({ n }: { n?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start 0.75", "end 0.55"] });
  const size = useTransform(p, [0, 1], ["0%", "100%"]);
  const [reached, setReached] = useState(0);
  useMotionValueEvent(p, "change", (v) => {
    const n = v > 0.97 ? 3 : v > 0.48 ? 2 : v > 0.02 ? 1 : 0;
    setReached((r) => (r === n ? r : n));
  });

  return (
    <section id="methode" aria-labelledby="v2-method-title" className="bg-paper py-24 lg:py-32">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <Rise>
              <Label n={n}>{method.eyebrow}</Label>
            </Rise>
            <Rise delay={0.05}>
              <h2 id="v2-method-title" className="mt-5 font-display text-[clamp(2.2rem,4.6vw,4rem)] font-semibold leading-[1] tracking-[-0.04em]">
                {method.title}
              </h2>
            </Rise>
          </div>
          <Rise as="p" delay={0.1} className="max-w-[24rem] text-[17px] leading-relaxed text-ink-soft sm:text-[19px]">
            {method.lead}
          </Rise>
        </div>

        <div ref={ref} className="relative mt-16 lg:mt-24">
          {/* the rail: horizontal on large screens, vertical on phones */}
          <div aria-hidden className="absolute bottom-0 left-[19px] top-0 w-[2px] bg-line lg:bottom-auto lg:left-[16.6%] lg:right-[16.6%] lg:top-[19px] lg:h-[2px] lg:w-auto">
            <motion.div style={{ height: size }} className="absolute left-0 top-0 w-full bg-ink lg:hidden" />
            <motion.div style={{ width: size }} className="absolute left-0 top-0 hidden h-full bg-ink lg:block" />
            {/* tip: where the ghost rides */}
            <motion.span
              style={{ top: size }}
              data-ghost="c"
              data-ghost-x="0.5"
              data-ghost-y="-0.1"
              data-ghost-m="c"
              data-ghost-mx="5"
              data-ghost-my="-0.15"
              className="absolute left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-acid ring-4 ring-acid/30 lg:hidden"
            />
            <motion.span
              style={{ left: size }}
              data-ghost="c"
              data-ghost-x="0"
              data-ghost-y="-0.95"
              className="absolute top-1/2 hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-acid ring-4 ring-acid/30 lg:block"
            />
          </div>

          <ol className="grid gap-12 lg:grid-cols-3 lg:gap-8">
            {method.steps.map((s, i) => {
              const on = reached > i;
              return (
                <li key={s.n} className="relative pl-14 pr-20 sm:pr-28 lg:px-0 lg:text-center">
                  <span
                    className={cx(
                      "absolute left-0 top-0 grid h-10 w-10 place-items-center rounded-full border-2 font-display text-[14px] font-semibold transition-colors duration-500 lg:static lg:mx-auto",
                      on ? "border-ink bg-ink text-acid" : "border-line bg-paper text-ink-mute",
                    )}
                  >
                    {s.n}
                  </span>
                  <div
                    className={cx(
                      "transition-[opacity,transform] duration-700 ease-expo lg:mt-8",
                      on ? "translate-y-0 opacity-100" : "translate-y-3 opacity-40",
                    )}
                  >
                    <h3 className="font-display text-[clamp(1.5rem,2.2vw,2rem)] font-semibold tracking-[-0.03em]">{s.title}</h3>
                    <p className="mt-2 text-[17px] font-medium text-ink">{s.line}</p>
                    <p className="mx-auto mt-2 max-w-[22rem] text-[15px] leading-relaxed text-ink-soft lg:mt-3">{s.detail}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
