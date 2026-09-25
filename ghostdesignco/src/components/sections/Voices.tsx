"use client";

import { useEffect, useRef, useState } from "react";
import { voices } from "@/lib/copy";
import { embedPlayer, testimonials, type Testimonial } from "@/lib/testimonials";
import { GhostMark } from "@/components/ui/Logo";
import { Mask, Rise, cx } from "@/components/ui/motion";

/** Reserved slot shown while no video is listed. */
function Slot({ i }: { i: number }) {
  return (
    <div className="relative flex aspect-[9/16] w-[44vw] max-w-[240px] shrink-0 snap-start flex-col items-center justify-center gap-3 overflow-hidden rounded-[22px] border border-dashed border-white/15 bg-white/[0.025] text-center sm:w-[200px]">
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
 * One client video. Embedded players (Wistia, YouTube, Vimeo…) only load when
 * the visitor presses play: the page stays light and no third-party cookie is
 * set before that. Files from /public play in a native player.
 */
export function VideoCard({ t }: { t: Testimonial }) {
  const [on, setOn] = useState(false);
  const aspect = t.aspect ?? 9 / 16;
  const wide = aspect > 1;
  const player = t.embed ? embedPlayer(t.embed) : null;
  const poster = t.poster ?? player?.poster;
  const label = t.name ? `${voices.play} ${t.name}` : "Lire le témoignage vidéo";
  return (
    <figure
      className={cx(
        "glass relative shrink-0 snap-start overflow-hidden rounded-[22px]",
        wide ? "w-[78vw] max-w-[440px] sm:w-[400px]" : "w-[40vw] max-w-[240px] sm:w-[210px]",
      )}
    >
      <div className="relative w-full bg-void-800" style={{ aspectRatio: String(aspect) }}>
        {on && t.video && !player ? (
          <video className="absolute inset-0 h-full w-full object-cover" src={t.video} poster={poster} controls autoPlay playsInline aria-label={label} />
        ) : on && player ? (
          <iframe
            src={player.src}
            title={label}
            className="absolute inset-0 h-full w-full"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setOn(true)}
            aria-label={label}
            className="group absolute inset-0 flex items-center justify-center"
          >
            {/* the poster loads only when the section comes near */}
            {poster && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={poster} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
            )}
            <span
              aria-hidden
              className={cx(
                "absolute inset-0 transition-opacity duration-500 group-hover:opacity-80",
                poster
                  ? "bg-gradient-to-t from-black/75 via-black/10 to-black/30"
                  : "bg-[radial-gradient(70%_50%_at_50%_45%,rgba(182,255,59,0.16),transparent_70%)]",
              )}
            />
            <span className="relative inline-flex h-16 w-16 items-center justify-center rounded-full bg-acid text-acid-ink shadow-[0_10px_40px_-6px_rgba(182,255,59,0.8)] transition-transform duration-500 ease-expo group-hover:scale-110">
              <svg viewBox="0 0 12 12" className="ml-1 h-5 w-5" fill="currentColor" aria-hidden>
                <path d="M2.5 1.2 10.4 6 2.5 10.8Z" />
              </svg>
            </span>
            {t.duration && (
              <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-medium tabular-nums text-bone backdrop-blur-md">
                {t.duration}
              </span>
            )}
          </button>
        )}
      </div>
      <figcaption className="px-4 py-3">
        {t.name && <span className="block text-[14px] font-medium text-bone">{t.name}</span>}
        {t.role && <span className={cx("block", t.name ? "text-[12px] text-fog" : "text-[14px] font-medium text-bone")}>{t.role}</span>}
      </figcaption>
    </figure>
  );
}

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

/**
 * Témoignages: client videos in a swipeable row (arrows on every screen).
 * The 3D world lights a small stage for them.
 */
export function Voices() {
  const has = testimonials.length > 0;
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
    <section id="temoignages" data-station="voices" aria-labelledby="voices-title" className="relative h-[150vh]">
      <div className="sticky top-0 flex h-[100svh] items-end pb-[6svh] lg:items-start lg:pb-0 lg:pt-[17vh]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_45%_at_30%_62%,rgb(var(--c-void)/0.8),transparent_75%)] lg:bg-[radial-gradient(34%_34%_at_18%_30%,rgb(var(--c-void)/0.82),transparent_75%)]"
        />
        <div className="relative mx-auto grid w-full max-w-[1400px] grid-cols-[minmax(0,1fr)] items-start gap-8 px-5 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,680px)] lg:gap-16">
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
            <div
              ref={row}
              className="flex snap-x snap-mandatory items-start gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 [scrollbar-width:none] sm:scroll-px-0 sm:px-0 lg:gap-5 [&::-webkit-scrollbar]:hidden"
            >
              {has ? testimonials.map((t, i) => <VideoCard key={i} t={t} />) : [0, 1, 2].map((i) => <Slot key={i} i={i} />)}
            </div>
            {has && testimonials.length > 1 && (
              <div className="mt-4 flex items-center gap-2 px-5 sm:px-0">
                <Arrow dir={-1} disabled={edges.start} onClick={() => step(-1)} />
                <Arrow dir={1} disabled={edges.end} onClick={() => step(1)} />
                <span className="ml-2 text-[13px] text-fog">{testimonials.length} témoignages vidéo</span>
              </div>
            )}
          </Rise>
        </div>
      </div>
    </section>
  );
}
