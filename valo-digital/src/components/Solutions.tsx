import Image from "next/image";
import { solutions, type Offer } from "@/lib/catalogue";
import { Band, CoverIcons, Squares } from "@/components/brand/Motifs";
import { SelectToggle } from "@/components/selection/Selection";
import { Ask, PriceBlock } from "@/components/Social";
import video from "../../public/images/video.jpg";
import coaching from "../../public/images/accompagnement.jpg";

const PHOTOS = { video, accompagnement: coaching } as const;

/** The diagnostic has no photo: the cover's magnifier, drawn large on the blue. */
function DiagnosticVisual() {
  return (
    <div className="cover-blue relative grid h-full min-h-[260px] place-items-center overflow-hidden text-white">
      <Squares chain="right" className="pointer-events-none absolute -right-8 -top-6 w-[150px] text-white/35" />
      <Squares chain="left" className="pointer-events-none absolute -bottom-16 -left-10 w-[130px] text-white/25" />
      <svg viewBox="0 0 48 48" className="relative h-40 w-40 sm:h-48 sm:w-48" fill="none" stroke="currentColor" strokeLinecap="round" aria-hidden>
        <circle cx="24" cy="24" r="22" strokeDasharray="1.2 3.2" strokeWidth="0.7" className="cover-icon-ring" />
        <circle cx="27" cy="21" r="7.4" strokeWidth="1.6" />
        <path d="M21.8 26.2l-8 8" strokeWidth="2.6" />
        <path d="M23.6 22.6l2.2 1.8 4-5" strokeWidth="1.5" className="text-sun" stroke="#FDEC05" />
      </svg>
      <CoverIcons className="absolute bottom-6 left-1/2 -translate-x-1/2 scale-[0.8] text-white/70" />
    </div>
  );
}

function Solution({ s, i }: { s: Offer; i: number }) {
  const photo = PHOTOS[s.id as keyof typeof PHOTOS];
  return (
    <li id={s.anchor} className="stack-card scroll-mt-[calc(var(--header)+24px)]" style={{ ["--i" as string]: i }}>
      <article
        data-reveal
        className="grid grid-cols-1 overflow-hidden rounded-[28px] border border-line bg-white shadow-[0_-10px_50px_-30px_rgba(4,11,82,0.35)] lg:min-h-[540px] lg:grid-cols-2"
      >
        <div className={`relative aspect-[16/10] lg:aspect-auto ${i % 2 === 1 ? "lg:order-2" : ""}`}>
          {photo ? (
            <Image src={photo} alt="" placeholder="blur" sizes="(min-width: 1024px) 600px, 100vw" className="h-full w-full object-cover" />
          ) : (
            <DiagnosticVisual />
          )}
        </div>
        <div className="flex flex-col p-7 sm:p-9 lg:p-12">
          <p className="eyebrow text-electric">
            {String(i + 1).padStart(2, "0")} / {String(solutions.items.length).padStart(2, "0")}
          </p>
          <h3 className="mt-3 text-[clamp(1.35rem,6.8vw,2.3rem)] font-extrabold leading-[1.04] tracking-[-0.025em] text-navy lg:text-[clamp(1.9rem,2.6vw,2.5rem)]">{s.name}</h3>
          <p className="mt-3 text-[17px] leading-relaxed text-body">{s.text}</p>
          <ol className="mt-7 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {s.points.map((p, k) => (
              <li key={p} className="flex items-start gap-3 border-t border-line pt-3 text-[15.5px] font-medium leading-snug text-navy">
                <span className="text-[13px] font-extrabold text-electric">{String(k + 1).padStart(2, "0")}</span>
                {p}
              </li>
            ))}
          </ol>
          <div className="mt-auto flex flex-wrap items-end justify-between gap-5 pt-9">
            <PriceBlock price={s.price} size="md" />
            <div className="flex flex-wrap gap-2">
              <Ask item={s} />
              <SelectToggle id={s.id} />
            </div>
          </div>
        </div>
      </article>
    </li>
  );
}

export function Solutions() {
  return (
    <section id="solutions" aria-labelledby="solutions-title" className="bg-mist py-20 lg:py-28">
      <div className="gutter mx-auto max-w-page">
        <Band as="h2" id="solutions-title">
          {solutions.title}
        </Band>
        <ul className="mt-12 grid grid-cols-1 gap-5 lg:mt-16 lg:gap-8">
          {solutions.items.map((s, i) => (
            <Solution key={s.id} s={s} i={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
