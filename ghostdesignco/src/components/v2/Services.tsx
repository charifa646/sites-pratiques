"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { cta, needForOffer, offer } from "@/lib/copy";
import { scrollToY } from "@/lib/scroll";
import { useIntent } from "@/components/ui/Providers";
import { EXPO, Rise, cx } from "@/components/ui/motion";
import { BrowserMock, PhoneMock, SalesMock } from "./Mockups";
import { Eyebrow, PrimaryButton, goTo } from "./ui";

/** Each service on a stage of the same size, so switching never jumps. */
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

/**
 * On large screens the section is pinned: scrolling walks through the three
 * services (the tabs follow, and a click scrolls to its service). Smaller
 * screens keep plain tabs.
 */
export function V2Services() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);
  const { setNeed } = useIntent();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const item = offer.items[active];
  const count = offer.items.length;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (min-height: 640px)");
    const on = () => setPinned(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!pinned) return;
    const i = Math.min(count - 1, Math.max(0, Math.floor(v * count)));
    setActive((a) => (a === i ? a : i));
  });

  const select = (i: number) => {
    const el = ref.current;
    if (pinned && el) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      const range = el.offsetHeight - window.innerHeight;
      scrollToY(top + (range * (i + 0.5)) / count, { duration: 1 });
    }
    setActive(i);
  };

  // arrows, Home and End move between tabs (ARIA tabs pattern)
  const onKey = (e: KeyboardEvent) => {
    const last = count - 1;
    const next =
      e.key === "ArrowRight" ? (active === last ? 0 : active + 1) : e.key === "ArrowLeft" ? (active === 0 ? last : active - 1) : e.key === "Home" ? 0 : e.key === "End" ? last : null;
    if (next === null) return;
    e.preventDefault();
    select(next);
    tabs.current[next]?.focus();
  };

  return (
    <section ref={ref} id="services" aria-labelledby="v2-services-title" className={cx("relative bg-white", pinned ? "h-[300vh]" : "py-24")}>
      {/* footer links land on each service's stretch of the scroll */}
      {offer.items.map((it, i) => (
        <span key={it.anchor} id={it.anchor} aria-hidden className="absolute left-0" style={{ top: pinned ? `${(i * 100) / count}%` : 0 }} />
      ))}
      <div className={cx(pinned && "sticky top-[68px] flex h-[calc(100svh-68px)] flex-col justify-center")}>
        <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
          <div className="text-center">
            <Rise>
              <Eyebrow className="[@media(max-height:820px)]:hidden">{offer.eyebrow}</Eyebrow>
            </Rise>
            <Rise delay={0.05}>
              <h2 id="v2-services-title" className="mt-5 font-display text-[clamp(2.2rem,4.2vw,3.7rem)] font-semibold leading-[1] tracking-[-0.04em]">
                {offer.title}
              </h2>
            </Rise>
          </div>

          <Rise delay={0.1}>
            <div role="tablist" aria-label="Nos services" className="relative mx-auto mt-8 grid max-w-[560px] grid-cols-3 gap-1 rounded-full bg-paper p-1.5">
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
                  onClick={() => select(i)}
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
              {pinned && (
                <span aria-hidden className="absolute -bottom-3 left-6 right-6 h-[2px] overflow-hidden rounded-full bg-line">
                  <motion.span style={{ width: bar }} className="block h-full bg-ink" />
                </span>
              )}
            </div>
          </Rise>

          <div
            id="v2-service-panel"
            role="tabpanel"
            aria-labelledby={`v2-tab-${item.id}`}
            data-ghost="tr"
            data-ghost-x="-0.42"
            data-ghost-y="-0.4"
            data-ghost-m="tr"
            data-ghost-mx="-0.4"
            data-ghost-my="-0.36"
            className="mt-9 grid overflow-hidden rounded-[32px] border border-line bg-paper"
          >
            <AnimatePresence initial={false}>
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8, transition: { duration: 0.25 } }}
                transition={{ duration: 0.55, delay: 0.12, ease: EXPO }}
                className="grid items-center gap-10 p-6 [grid-area:1/1] sm:p-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14 lg:px-14 lg:py-10"
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
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, rotate: -1.5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, delay: 0.15, ease: EXPO }}
                  className="aspect-[6/5] sm:aspect-[5/4] lg:aspect-[16/10.5]"
                >
                  <Visual id={item.id} />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
