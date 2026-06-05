"use client";

import ScrollExpandMedia from "@/components/ui/ScrollExpandMedia";
import { ButtonLink } from "@/components/ui/Button";
import { hero, site, whyUs, images } from "@/lib/data";

/** Mobile entrance — scroll-to-expand hero, then verbatim copy + Pourquoi KORA. */
export function MobileHero() {
  return (
    <ScrollExpandMedia
      mediaSrc={images.heroPoster}
      bgImageSrc={images.scene.lightTrails}
      title="KORA TRANSIT"
      date={site.sloganSecondaire}
      scrollToExpand="Défiler"
    >
      <div className="mx-auto max-w-xl text-center">
        <h2 className="font-display text-[clamp(1.9rem,8vw,2.8rem)] font-bold leading-[0.96] tracking-tightest text-ink">
          Le transport qui ne vous fait{" "}
          <span className="text-gradient-gold">jamais attendre.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-muted">
          {hero.subtitle}
        </p>
        <div className="mt-7 flex flex-col gap-3">
          <ButtonLink href="/reservation" size="lg" className="w-full">
            {hero.ctaPrimary}
          </ButtonLink>
          <ButtonLink href="/services" variant="secondary" size="lg" className="w-full">
            {hero.ctaSecondary}
          </ButtonLink>
        </div>
      </div>

      {/* Pourquoi KORA — stacked cards */}
      <div className="mx-auto mt-16 max-w-xl">
        <div className="flex items-center gap-3">
          <span className="font-display text-sm font-semibold text-gold">(02)</span>
          <span className="h-px w-10 bg-gold/40" />
          <span className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-muted">
            Pourquoi KORA TRANSIT
          </span>
        </div>
        <h2 className="mt-3 font-display text-2xl font-semibold tracking-tightest text-ink">
          {whyUs.title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">{whyUs.subtitle}</p>

        <div className="mt-6 grid gap-4">
          {whyUs.items.map((it) => (
            <div
              key={it.title}
              className="rounded-2xl border border-line/70 bg-navy-light/40 p-5"
            >
              <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
                <it.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold text-ink">{it.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </ScrollExpandMedia>
  );
}
