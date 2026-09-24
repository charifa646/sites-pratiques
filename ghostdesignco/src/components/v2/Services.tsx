"use client";

import Image from "next/image";
import { cta, needForOffer, offer } from "@/lib/copy";
import { useIntent } from "@/components/ui/Providers";
import { Arrow } from "@/components/ui/Button";
import { Rise, cx } from "@/components/ui/motion";
import { WindowBar } from "./Mockups";
import { Label, goTo } from "./ui";

/**
 * The three offers side by side, each shown on a real-looking page. The
 * pictures are illustrations made for this site (not client work), so they
 * carry an "Exemple" tag. On hover the page inside the frame scrolls.
 */
const EXAMPLES: Record<string, { src: string; w: number; h: number; alt: string }> = {
  vitrine: { src: "/v2/exemple-vitrine.jpg", w: 1600, h: 905, alt: "Exemple de site vitrine pour un restaurant" },
  landing: { src: "/v2/exemple-landing.jpg", w: 820, h: 1450, alt: "Exemple de landing page mobile pour un atelier photo" },
  vente: { src: "/v2/exemple-vente.jpg", w: 1200, h: 1607, alt: "Exemple de page de vente pour une formation en ligne" },
};

function Visual({ id }: { id: string }) {
  const ex = EXAMPLES[id];
  if (id === "landing") {
    return (
      <div className="h-[88%] rounded-[26px] bg-ink p-[7px] shadow-[0_24px_50px_-24px_rgba(12,12,13,0.5)]" style={{ aspectRatio: `${ex.w + 14} / ${ex.h * 0.84 + 14}` }}>
        <div className="relative h-full overflow-hidden rounded-[20px] bg-white">
          <Image
            src={ex.src}
            alt={ex.alt}
            width={ex.w}
            height={ex.h}
            sizes="(min-width: 1024px) 200px, 45vw"
            className="w-full transition-transform duration-[2.2s] ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:-translate-y-[16%]"
          />
        </div>
      </div>
    );
  }
  const tall = id === "vente";
  return (
    <div className={cx("overflow-hidden rounded-[12px] border border-line bg-white shadow-[0_24px_50px_-26px_rgba(12,12,13,0.4)] [container-type:inline-size]", tall ? "w-[78%]" : "w-[92%]")}>
      <WindowBar />
      <div className={cx("relative overflow-hidden", tall ? "aspect-[4/3.3]" : "aspect-[16/9.05]")}>
        <Image
          src={ex.src}
          alt={ex.alt}
          width={ex.w}
          height={ex.h}
          sizes="(min-width: 1024px) 380px, 88vw"
          className={cx(
            "w-full transition-transform duration-[2.2s] ease-[cubic-bezier(0.65,0,0.35,1)]",
            tall ? "group-hover:-translate-y-[42%]" : "group-hover:scale-[1.04]",
          )}
        />
      </div>
    </div>
  );
}

export function V2Services({ n }: { n?: string }) {
  const { setNeed } = useIntent();
  return (
    <section id="services" aria-labelledby="v2-services-title" className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <Rise>
              <Label n={n}>{offer.eyebrow}</Label>
            </Rise>
            <Rise delay={0.05}>
              <h2 id="v2-services-title" className="mt-5 font-display text-[clamp(2.3rem,4.8vw,4.2rem)] font-semibold leading-[1] tracking-[-0.04em]">
                {offer.title}
              </h2>
            </Rise>
          </div>
          <Rise as="p" delay={0.1} className="font-display text-[clamp(1.2rem,1.8vw,1.5rem)] font-medium tracking-[-0.02em] text-ink-mute">
            {offer.items.map((o) => o.title).join(" · ")}
          </Rise>
        </div>

        <ol className="mt-14 grid gap-6 lg:grid-cols-3 lg:gap-7">
          {offer.items.map((it, i) => (
            <Rise as="li" key={it.id} delay={0.06 * i} blur={false}>
              <article
                id={it.anchor}
                data-ghost={i === 2 ? "tr" : undefined}
                data-ghost-x={i === 2 ? "-0.4" : undefined}
                data-ghost-y={i === 2 ? "-0.38" : undefined}
                data-ghost-m={i === 0 ? "tr" : undefined}
                data-ghost-mx={i === 0 ? "-0.4" : undefined}
                data-ghost-my={i === 0 ? "-0.36" : undefined}
                className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-line bg-paper"
              >
                <div className="relative grid aspect-[4/3.3] place-items-center overflow-hidden bg-[linear-gradient(180deg,#EFEDE6,#F4F3EE)]">
                  <span className="absolute left-4 top-3.5 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-mute">Exemple</span>
                  <Visual id={it.id} />
                </div>
                <div className="flex flex-1 flex-col border-t border-line p-7">
                  <span className="font-display text-[15px] font-medium tabular-nums text-ink-mute">{it.n}</span>
                  <h3 className="mt-2 font-display text-[clamp(1.6rem,2.2vw,2rem)] font-semibold leading-[1.05] tracking-[-0.03em]">{it.title}</h3>
                  <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">{it.text}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setNeed(needForOffer[it.id]);
                      goTo("contact");
                    }}
                    className="group/b mt-8 inline-flex items-center gap-2 self-start rounded-full bg-ink px-5 py-3 text-[14px] font-medium text-bone transition-colors duration-300 hover:bg-[#26262a]"
                  >
                    {cta.quote}
                    <Arrow className="h-4 w-4 transition-transform duration-300 group-hover/b:translate-x-0.5" />
                  </button>
                </div>
              </article>
            </Rise>
          ))}
        </ol>
      </div>
    </section>
  );
}
