"use client";

import { voices } from "@/lib/copy";
import { testimonials } from "@/lib/testimonials";
import { GhostMark } from "@/components/ui/Logo";
import { Mask, Rise } from "@/components/ui/motion";

/** Reserved slot shown until the client's videos are added. */
function Slot({ i }: { i: number }) {
  return (
    <div className="relative flex aspect-[9/16] w-[44vw] max-w-[240px] shrink-0 snap-center flex-col items-center justify-center gap-3 overflow-hidden rounded-[22px] border border-dashed border-white/15 bg-white/[0.025] text-center sm:w-[200px]">
      <span
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_45%,rgba(182,255,59,0.12),transparent_70%)]"
      />
      <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-full border border-acid/40 text-acid">
        <svg viewBox="0 0 12 12" className="ml-1 h-4 w-4" fill="currentColor" aria-hidden>
          <path d="M2.5 1.2 10.4 6 2.5 10.8Z" />
        </svg>
      </span>
      <span className="relative text-[13px] font-medium text-bone">{voices.placeholder.title}</span>
      <span className="relative flex items-center gap-1.5 text-[12px] text-fog">
        <GhostMark className="h-3 w-3 text-acid/70" />
        {voices.placeholder.text}
      </span>
      <span className="sr-only">Emplacement {i + 1}</span>
    </div>
  );
}

/**
 * Témoignages: client videos. The 3D world lights a small stage for them;
 * until the videos arrive, three reserved slots hold the place.
 */
export function Voices() {
  const has = testimonials.length > 0;
  return (
    <section id="temoignages" data-station="voices" aria-labelledby="voices-title" className="relative h-[150vh]">
      <div className="sticky top-0 flex h-[100svh] items-end pb-[6svh] lg:items-start lg:pb-0 lg:pt-[17vh]">
        <div className="relative mx-auto grid w-full max-w-[1400px] grid-cols-[minmax(0,1fr)] items-start gap-8 px-5 sm:px-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
          <div className="max-w-[520px]">
            <Rise className="flex items-center gap-2.5 text-[12px] font-medium uppercase tracking-[0.22em] text-fog">
              <span className="h-px w-8 bg-acid" />
              {voices.eyebrow}
            </Rise>
            <h2
              id="voices-title"
              className="mt-4 font-display text-[clamp(2.2rem,4.8vw,4.4rem)] font-semibold leading-[1] tracking-[-0.035em] text-bone"
            >
              <Mask className="pb-[0.06em]">{voices.title.lead}</Mask>
              <Mask delay={0.08} className="pb-[0.1em]" innerClassName="font-serif font-normal italic tracking-[-0.01em] text-acid">
                {voices.title.accent}
              </Mask>
            </h2>
            <Rise as="p" delay={0.15} className="mt-4 max-w-[26rem] text-[16px] leading-relaxed text-fog sm:text-[17px]">
              {voices.text}
            </Rise>
          </div>
          <Rise delay={0.2} blur={false} className="-mx-5 min-w-0 sm:mx-0">
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:px-0 lg:gap-5 [&::-webkit-scrollbar]:hidden">
              {has
                ? testimonials.map((t) => (
                    <figure
                      key={t.video}
                      className="glass relative w-[44vw] max-w-[240px] shrink-0 snap-center overflow-hidden rounded-[22px] sm:w-[200px]"
                    >
                      <video
                        className="aspect-[9/16] w-full bg-void-800 object-cover"
                        src={t.video}
                        poster={t.poster}
                        controls
                        playsInline
                        preload="none"
                        aria-label={`${voices.play} ${t.name}`}
                      />
                      <figcaption className="px-4 py-3">
                        <span className="block text-[14px] font-medium text-bone">{t.name}</span>
                        {t.role && <span className="block text-[12px] text-fog">{t.role}</span>}
                      </figcaption>
                    </figure>
                  ))
                : [0, 1, 2].map((i) => <Slot key={i} i={i} />)}
            </div>
          </Rise>
        </div>
      </div>
    </section>
  );
}
