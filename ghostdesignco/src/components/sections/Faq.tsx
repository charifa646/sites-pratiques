"use client";

import { useId, useState } from "react";
import { faq } from "@/lib/copy";
import { Mask, Rise, cx } from "@/components/ui/motion";

/** Questions fréquentes: each answer lifts one objection before the form. */
export function Faq() {
  const uid = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="questions" data-station="faq" aria-labelledby="faq-title" className="relative">
      <div className="relative mx-auto min-h-[100svh] w-full max-w-[1400px] px-5 pb-24 pt-28 sm:px-10 lg:py-32">
        <div className="max-w-[720px]">
          <Rise className="flex items-center gap-2.5 text-[12px] font-medium uppercase tracking-[0.22em] text-fog">
            <span className="h-px w-8 bg-acid" />
            {faq.eyebrow}
          </Rise>
          <h2
            id="faq-title"
            className="mt-4 font-display text-[clamp(2.1rem,4.4vw,4rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-bone"
          >
            <Mask className="pb-[0.06em]">{faq.title}</Mask>
          </h2>
          <Rise delay={0.15} blur={false} className="glass mt-9 rounded-[28px] p-2 sm:p-3">
            {faq.items.map((item, i) => {
              const isOpen = open === i;
              const btn = `${uid}-q${i}`;
              const panel = `${uid}-a${i}`;
              return (
                <div key={item.q} className={cx("rounded-[22px] transition-colors duration-500", isOpen && "bg-white/[0.04]")}>
                  <h3>
                    <button
                      id={btn}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panel}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left sm:px-6"
                    >
                      <span className={cx("text-[16px] font-medium leading-snug transition-colors sm:text-[17px]", isOpen ? "text-bone" : "text-bone/80")}>
                        {item.q}
                      </span>
                      <span
                        aria-hidden
                        className={cx(
                          "relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ease-expo",
                          isOpen ? "rotate-45 border-acid bg-acid text-acid-ink" : "border-white/15 text-bone",
                        )}
                      >
                        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M8 3v10M3 8h10" strokeLinecap="round" />
                        </svg>
                      </span>
                    </button>
                  </h3>
                  <div
                    id={panel}
                    role="region"
                    aria-labelledby={btn}
                    className={cx("grid transition-[grid-template-rows] duration-500 ease-expo", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
                  >
                    <div className="overflow-hidden" aria-hidden={!isOpen}>
                      <p className="max-w-[36rem] px-5 pb-6 text-[15px] leading-relaxed text-fog sm:px-6 sm:text-[16px]">{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </Rise>
        </div>
      </div>
    </section>
  );
}
