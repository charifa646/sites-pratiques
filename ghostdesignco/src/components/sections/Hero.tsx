"use client";

import { cta, hero } from "@/lib/copy";
import { diveTo } from "@/lib/scroll";
import { Button } from "@/components/ui/Button";
import { TourButton } from "@/components/ui/Tour";
import { Mask, Rise } from "@/components/ui/motion";

export function Hero() {
  return (
    <section id="top" data-station="hero" aria-labelledby="hero-title" className="relative min-h-[100svh]">
      {/* readability scrim on the text side */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_18%_62%,rgba(5,5,5,0.78),transparent_70%)] lg:bg-[radial-gradient(52%_70%_at_20%_55%,rgba(5,5,5,0.72),transparent_70%)]"
      />
      <div className="relative mx-auto flex min-h-[100svh] max-w-[1400px] flex-col justify-end px-5 pb-[9svh] pt-28 sm:px-10 lg:justify-center lg:pb-0">
        <div className="max-w-[860px]">
          <Rise className="flex items-center gap-2.5 text-[12px] font-medium uppercase tracking-[0.22em] text-fog">
            <span className="h-1.5 w-1.5 rounded-full bg-acid shadow-[0_0_8px_1px_rgba(182,255,59,0.4)]" />
            {hero.eyebrow}
          </Rise>
          <h1
            id="hero-title"
            className="mt-6 font-display text-[clamp(2.7rem,7.4vw,7rem)] font-semibold leading-[0.93] tracking-[-0.04em] text-bone"
          >
            <Mask className="pb-[0.04em]">Des sites qui</Mask>
            {/* below lg: "donnent envie de / rester."; lg and up: "donnent envie / de rester." */}
            <Mask delay={0.08} className="pb-[0.04em]">
              donnent envie<span className="lg:hidden"> de</span>
            </Mask>
            <Mask delay={0.16} className="pb-[0.1em]">
              <span className="hidden lg:inline">de </span>
              <span className="glow pr-[0.1em] font-serif font-normal italic tracking-[-0.01em] text-acid">{hero.title.accent}</span>
            </Mask>
          </h1>
          <Rise as="p" delay={0.35} className="mt-7 max-w-[34rem] text-[16px] leading-relaxed text-fog sm:text-[18px]">
            {hero.text}
          </Rise>
          <Rise delay={0.5} className="mt-9 flex flex-wrap items-center gap-3">
            <Button onClick={() => diveTo("contact")}>{cta.quote}</Button>
            <Button variant="ghost" className="hidden sm:inline-flex" onClick={() => diveTo("services")}>
              {cta.secondary}
            </Button>
          </Rise>
          <Rise delay={0.62} className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-fog">
            {hero.reassurance.map((r) => (
              <span key={r} className="inline-flex items-center gap-2">
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-acid" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="m3.5 8.5 3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {r}
              </span>
            ))}
            <TourButton label="Lancer la visite guidée" className="-my-1 hidden sm:inline-flex" />
          </Rise>
        </div>
      </div>
    </section>
  );
}
