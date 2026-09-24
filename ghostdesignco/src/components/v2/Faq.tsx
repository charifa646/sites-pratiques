"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { faq } from "@/lib/copy";
import { EXPO, Rise, cx } from "@/components/ui/motion";
import { Label } from "./ui";

export function V2Faq({ n }: { n?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="questions" aria-labelledby="v2-faq-title" className="bg-white py-24 lg:py-32">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div data-ghost="bl" data-ghost-x="0.55" data-ghost-y="0.8" data-ghost-m="none" className="lg:self-start">
          <Rise>
            <Label n={n}>{faq.eyebrow}</Label>
          </Rise>
          <Rise delay={0.05}>
            <h2 id="v2-faq-title" className="mt-5 font-display text-[clamp(2.1rem,4vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
              {faq.title}
            </h2>
          </Rise>
        </div>
        <Rise delay={0.1} blur={false}>
          {/* phones: the ghost peeks over the first question */}
          <ul className="border-t border-ink" data-ghost="none" data-ghost-m="tr" data-ghost-mx="-0.4" data-ghost-my="0.1" data-ghost-mclip="top">
            {faq.items.map((it, i) => {
              const on = open === i;
              return (
                <li key={it.q} className="border-b border-line">
                  <h3>
                    <button
                      type="button"
                      id={`v2-faq-q${i}`}
                      aria-expanded={on}
                      aria-controls={`v2-faq-a${i}`}
                      onClick={() => setOpen(on ? null : i)}
                      className="group grid w-full grid-cols-[2.5rem_1fr_1.25rem] items-baseline gap-2 py-6 text-left"
                    >
                      <span className="font-display text-[14px] tabular-nums text-ink-mute">0{i + 1}</span>
                      <span className="text-[18px] font-medium leading-snug sm:text-[20px]">{it.q}</span>
                      <span aria-hidden className="relative block h-5 w-5 self-center text-ink">
                        <span className="absolute left-0 top-1/2 h-[1.5px] w-5 -translate-y-1/2 bg-current" />
                        <span
                          className={cx(
                            "absolute left-1/2 top-0 h-5 w-[1.5px] -translate-x-1/2 bg-current transition-transform duration-500 ease-expo",
                            on && "scale-y-0",
                          )}
                        />
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
                        <p className="max-w-[40rem] pb-7 pl-[3rem] pr-8 text-[16px] leading-relaxed text-ink-soft sm:text-[17px]">{it.a}</p>
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
