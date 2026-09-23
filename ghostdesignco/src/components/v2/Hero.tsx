"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cta, hero, proof } from "@/lib/copy";
import { EXPO, Rise } from "@/components/ui/motion";
import { BrowserMock, PhoneMock, PriceCard } from "./Mockups";
import { Check, Eyebrow, HEADER_H, PrimaryButton, SecondaryButton, goTo } from "./ui";

// the facts under the collage, from the same copy as the main site
const facts = [
  ...proof.stats.map((s) => ({ value: `${s.value}${s.suffix}`, label: s.label })),
  { value: "5 à 15 jours", label: "pour être en ligne" },
];

/** Three kinds of pages we build, with the guide peeking over the window. */
function Collage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 0.35, ease: EXPO }}
      className="relative mx-auto mt-16 max-w-[1080px] lg:mt-20"
    >
      <div className="relative mx-auto w-[88%] sm:w-[76%] lg:w-[68%]">
        <div className="absolute right-[7%] top-0 z-0 w-[18%] -translate-y-[58%] sm:w-[15%]">
          <span
            aria-hidden
            className="absolute inset-[-30%] rounded-full bg-[radial-gradient(closest-side,rgba(182,255,59,0.4),rgba(182,255,59,0))]"
          />
          <Image src="/v2/ghost.webp" alt="" width={582} height={821} priority sizes="(min-width: 1024px) 120px, 18vw" className="v2-float relative h-auto w-full" />
        </div>
        <BrowserMock className="relative z-10" />
        <PhoneMock className="v2-float-late absolute -bottom-[12%] -right-[6%] z-20 w-[24%] sm:-right-[9%] sm:w-[20%]" />
        <PriceCard className="v2-float absolute -bottom-[10%] -left-[11%] z-20 hidden w-[27%] sm:block" />
      </div>
    </motion.div>
  );
}

export function V2Hero() {
  return (
    <section id="top" aria-labelledby="v2-hero-title" className="relative overflow-hidden" style={{ paddingTop: HEADER_H }}>
      {/* a design canvas: dots that fade away from the centre */}
      <div
        aria-hidden
        className="v2-dots pointer-events-none absolute inset-0 [mask-image:radial-gradient(70%_55%_at_50%_32%,#000_30%,transparent_100%)]"
      />
      {/* a breath of acid behind the mockups */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[62%] h-[560px] w-[min(1000px,140vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(182,255,59,0.18),rgba(182,255,59,0))]"
      />
      <div className="relative mx-auto max-w-[1240px] px-5 pb-20 pt-12 sm:px-8 lg:pb-24 lg:pt-16">
        <div className="mx-auto max-w-[920px] text-center">
          <Rise>
            <Eyebrow>{hero.eyebrow}</Eyebrow>
          </Rise>
          <Rise delay={0.05}>
            <h1
              id="v2-hero-title"
              className="mt-6 font-display text-[clamp(2.6rem,6.6vw,5.9rem)] font-semibold leading-[0.96] tracking-[-0.045em] [text-wrap:balance]"
            >
              {hero.title.lead}{" "}
              <span className="relative inline-block whitespace-nowrap pr-[0.06em] font-serif font-normal italic tracking-[-0.01em]">
                <span aria-hidden className="absolute inset-x-[-0.04em] bottom-[0.1em] h-[0.28em] rounded-full bg-acid" />
                <span className="relative">{hero.title.accent}</span>
              </span>
            </h1>
          </Rise>
          <Rise as="p" delay={0.12} className="mx-auto mt-6 max-w-[40rem] text-[17px] leading-relaxed text-ink-soft sm:text-[19px]">
            {hero.text}
          </Rise>
          <Rise delay={0.18} className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <PrimaryButton onClick={() => goTo("contact")}>{cta.quote}</PrimaryButton>
            <SecondaryButton onClick={() => goTo("services")}>{cta.secondary}</SecondaryButton>
          </Rise>
          <Rise delay={0.24} className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[14px] text-ink-soft">
            {hero.reassurance.map((r) => (
              <span key={r} className="inline-flex items-center gap-2">
                <Check />
                {r}
              </span>
            ))}
          </Rise>
        </div>

        <Collage />

        <Rise delay={0.1} className="mx-auto mt-24 grid max-w-[900px] grid-cols-3 divide-x divide-line border-y border-line sm:mt-28">
          {facts.map((f) => (
            <div key={f.label} className="px-1 py-6 text-center sm:px-2 sm:py-7">
              <div className="whitespace-nowrap font-display text-[clamp(1.05rem,4.1vw,2.3rem)] font-semibold tracking-[-0.03em]">{f.value}</div>
              <div className="mt-1 text-[11.5px] leading-snug text-ink-mute sm:text-[14px]">{f.label}</div>
            </div>
          ))}
        </Rise>
      </div>
    </section>
  );
}
