"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState, type KeyboardEvent } from "react";
import { cta, needForOffer, offer } from "@/lib/copy";
import { useIntent } from "@/components/ui/Providers";
import { EXPO, Rise, cx } from "@/components/ui/motion";
import { BrowserMock, PhoneMock, SalesMock } from "./Mockups";
import { Eyebrow, PrimaryButton, goTo } from "./ui";

/** Each service shown on a stage of the same size, so switching never jumps. */
function Visual({ id }: { id: string }) {
  if (id === "landing") {
    return (
      <div className="grid h-full place-items-center">
        <PhoneMock className="w-[38%] max-w-[230px]" />
      </div>
    );
  }
  if (id === "vente") {
    return (
      <div className="relative h-full overflow-hidden">
        <SalesMock className="mx-auto w-[88%] pt-[4%]" />
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-t from-paper to-transparent" />
      </div>
    );
  }
  return (
    <div className="grid h-full place-items-center">
      <BrowserMock className="w-full" />
    </div>
  );
}

export function V2Services() {
  const [active, setActive] = useState(0);
  const { setNeed } = useIntent();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const item = offer.items[active];

  // arrows, Home and End move between tabs (ARIA tabs pattern)
  const onKey = (e: KeyboardEvent) => {
    const last = offer.items.length - 1;
    const next =
      e.key === "ArrowRight" ? (active === last ? 0 : active + 1) : e.key === "ArrowLeft" ? (active === 0 ? last : active - 1) : e.key === "Home" ? 0 : e.key === "End" ? last : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="services" aria-labelledby="v2-services-title" className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="text-center">
          <Rise>
            <Eyebrow>{offer.eyebrow}</Eyebrow>
          </Rise>
          <Rise delay={0.05}>
            <h2 id="v2-services-title" className="mt-5 font-display text-[clamp(2.2rem,4.6vw,4rem)] font-semibold leading-[1] tracking-[-0.04em]">
              {offer.title}
            </h2>
          </Rise>
        </div>

        <Rise delay={0.1}>
          <div role="tablist" aria-label="Nos services" className="mx-auto mt-10 grid max-w-[560px] grid-cols-3 gap-1 rounded-full bg-paper p-1.5">
            {offer.items.map((it, i) => (
              <button
                key={it.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`v2-tab-${it.id}`}
                aria-selected={i === active}
                aria-controls="v2-service-panel"
                tabIndex={i === active ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={onKey}
                className={cx(
                  "whitespace-nowrap rounded-full px-1 py-2.5 text-[12.5px] font-medium transition-[background-color,color,box-shadow] duration-300 sm:px-2 sm:text-[14px]",
                  i === active
                    ? "bg-white text-ink shadow-[0_1px_2px_rgba(12,12,13,0.08),0_6px_16px_-8px_rgba(12,12,13,0.25)]"
                    : "text-ink-soft hover:text-ink",
                )}
              >
                {it.title}
              </button>
            ))}
          </div>
        </Rise>

        <div
          id="v2-service-panel"
          role="tabpanel"
          aria-labelledby={`v2-tab-${item.id}`}
          className="mt-8 grid overflow-hidden rounded-[32px] border border-line bg-paper"
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.25 } }}
              transition={{ duration: 0.55, delay: 0.12, ease: EXPO }}
              className="grid items-center gap-10 p-6 [grid-area:1/1] sm:p-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14 lg:p-14"
            >
              <div>
                <span className="font-display text-[15px] font-medium text-ink-mute">{item.n}</span>
                <h3 className="mt-3 font-display text-[clamp(1.9rem,3.2vw,2.8rem)] font-semibold leading-[1.02] tracking-[-0.03em]">{item.title}</h3>
                <p className="mt-4 max-w-[30rem] text-[17px] leading-relaxed text-ink-soft">{item.text}</p>
                <PrimaryButton
                  className="mt-8"
                  onClick={() => {
                    setNeed(needForOffer[item.id]);
                    goTo("contact");
                  }}
                >
                  {cta.quote}
                </PrimaryButton>
              </div>
              <div className="aspect-[6/5] sm:aspect-[5/4]">
                <Visual id={item.id} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
