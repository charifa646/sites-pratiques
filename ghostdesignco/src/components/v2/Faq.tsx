"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { faq } from "@/lib/copy";
import { EXPO, Rise, cx } from "@/components/ui/motion";
import { Eyebrow } from "./ui";

export function V2Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="questions" aria-labelledby="v2-faq-title" className="bg-white py-24 lg:py-32">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div data-ghost="bl" data-ghost-x="0.55" data-ghost-y="0.8" data-ghost-m="edge-b" data-ghost-my="0.35" className="lg:self-start">
          <Rise>
            <Eyebrow>{faq.eyebrow}</Eyebrow>
          </Rise>
          <Rise delay={0.05}>
            <h2 id="v2-faq-title" className="mt-5 font-display text-[clamp(2.1rem,4vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
              {faq.title}
            </h2>
          </Rise>
        </div>
        <Rise delay={0.1} blur={false}>
          <ul className="divide-y divide-line border-y border-line">
            {faq.items.map((it, i) => {
              const on = open === i;
              return (
                <li key={it.q}>
                  <h3>
                    <button
                      type="button"
                      id={`v2-faq-q${i}`}
                      aria-expanded={on}
                      aria-controls={`v2-faq-a${i}`}
                      onClick={() => setOpen(on ? null : i)}
                      className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                    >
                      <span className="text-[18px] font-medium leading-snug sm:text-[20px]">{it.q}</span>
                      <span
                        aria-hidden
                        className={cx(
                          "relative grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-[background-color,border-color,transform] duration-500 ease-expo",
                          on ? "rotate-45 border-ink bg-ink text-acid" : "border-line text-ink group-hover:border-ink/30",
                        )}
                      >
                        <span className="absolute h-[1.5px] w-3.5 rounded-full bg-current" />
                        <span className="absolute h-3.5 w-[1.5px] rounded-full bg-current" />
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div
                        id={`v2-faq-a${i}`}
                        role="region"
                        aria-labelledby={`v2-faq-q${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: EXPO }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-[40rem] pb-7 pr-16 text-[16px] leading-relaxed text-ink-soft sm:text-[17px]">{it.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </Rise>
      </div>
    </section>
  );
}
