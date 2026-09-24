"use client";

import { useEffect, useRef, useState } from "react";
import { voices } from "@/lib/copy";
import { testimonials } from "@/lib/testimonials";
import { VideoCard } from "@/components/sections/Voices";
import { Rise, cx } from "@/components/ui/motion";
import { Label } from "./ui";

function Arrow({ dir, disabled, onClick }: { dir: -1 | 1; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir < 0 ? "Témoignage précédent" : "Témoignage suivant"}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-bone transition-[color,border-color,opacity] duration-300 hover:border-acid/60 hover:text-acid disabled:pointer-events-none disabled:opacity-30"
    >
      <svg viewBox="0 0 20 20" className={cx("h-4 w-4", dir < 0 && "rotate-180")} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path d="M4 10h11M11 5.5 15.5 10 11 14.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

/** Client videos on a full-width dark band (players load only on play), with the arrows and count of the 3D site. */
export function V2Voices({ n }: { n?: string }) {
  const row = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const update = () => setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const step = (dir: -1 | 1) => {
    const el = row.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const by = (card?.offsetWidth ?? 220) + 20;
    el.scrollBy({ left: dir * by, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return (
    <section id="temoignages" aria-labelledby="v2-voices-title" data-ghost-dark className="bg-[#0B0B0C] text-bone">
      <div
        data-ghost="tr"
        data-ghost-x="-0.55"
        data-ghost-y="0.5"
        data-ghost-m="edge-t"
        data-ghost-my="0.55"
        className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 lg:py-32"
      >
        <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <Rise>
              <Label n={n} dark>
                {voices.eyebrow}
              </Label>
            </Rise>
            <Rise delay={0.05}>
              <h2 id="v2-voices-title" className="mt-5 font-display text-[clamp(2.2rem,4.6vw,4rem)] font-semibold leading-[1] tracking-[-0.04em]">
                {voices.title.lead}{" "}
                <span className="whitespace-nowrap pr-[0.06em] font-serif font-normal italic tracking-[-0.01em] text-acid">{voices.title.accent}</span>
              </h2>
            </Rise>
          </div>
          <Rise as="p" delay={0.1} className="max-w-[24rem] text-[17px] leading-relaxed text-fog">
            {voices.text}
          </Rise>
        </div>

        <Rise delay={0.15} blur={false} className="-mx-5 mt-12 sm:-mx-8">
          <div
            ref={row}
            className="flex snap-x snap-mandatory items-end gap-4 overflow-x-auto scroll-px-5 px-5 pb-4 [scrollbar-width:none] sm:gap-5 sm:scroll-px-8 sm:px-8 [&::-webkit-scrollbar]:hidden"
          >
            {testimonials.map((t, i) => (
              <VideoCard key={i} t={t} />
            ))}
          </div>
          {testimonials.length > 1 && (
            <div className="mt-4 flex items-center gap-2 px-5 sm:px-8">
              <Arrow dir={-1} disabled={edges.start} onClick={() => step(-1)} />
              <Arrow dir={1} disabled={edges.end} onClick={() => step(1)} />
              <span className="ml-2 text-[13px] text-fog">{testimonials.length} témoignages vidéo</span>
            </div>
          )}
        </Rise>
      </div>
    </section>
  );
}
