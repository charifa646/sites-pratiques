import Image from "next/image";
import { nb, social, type Offer } from "@/lib/catalogue";
import { askAbout, wa } from "@/lib/links";
import { Band, Squares } from "@/components/brand/Motifs";
import { SelectToggle } from "@/components/selection/Selection";
import { Check, WhatsApp } from "@/components/ui/Icons";
import photo from "../../public/images/reseaux.jpg";
import ads from "../../public/images/vente.jpg";

const FROM = "À partir de ";

/** « À partir de » small above, the amount large, what it covers (« / mois », « pour 4 vidéos »…) after it. */
export function PriceBlock({ price, tone = "light", size = "lg" }: { price: string; tone?: "light" | "dark" | "sun"; size?: "lg" | "md" }) {
  const from = price.startsWith(FROM);
  const rest = from ? price.slice(FROM.length) : price;
  const [, main = rest, tail = ""] = rest.match(/^(.*?F CFA)\s*(.*)$/) ?? [];
  const color = tone === "light" ? "text-electric" : tone === "sun" ? "text-sun" : "text-white";
  const soft = tone === "light" ? "text-body/60" : "text-white/65";
  return (
    <p>
      {from && <span className={`eyebrow block text-[11px] ${soft}`}>À partir de</span>}
      <span className={`mt-1 block font-extrabold leading-[1.1] tracking-[-0.02em] ${color} ${size === "lg" ? "text-[28px] sm:text-[30px]" : "text-[24px] sm:text-[26px]"}`}>
        {nb(main)}
      </span>
      {tail && <span className={`mt-1 block text-[14px] font-semibold ${tone === "light" ? "text-navy" : "text-white/85"}`}>{nb(tail)}</span>}
    </p>
  );
}

export function Points({ points, tone = "light", cols = false }: { points: string[]; tone?: "light" | "dark" | "sun"; cols?: boolean }) {
  const dot = tone === "light" ? "bg-electric text-white" : tone === "sun" ? "bg-sun text-navy" : "bg-white text-electric";
  return (
    <ul className={`grid gap-3 ${cols ? "sm:grid-cols-2 sm:gap-x-6" : ""}`}>
      {points.map((p) => (
        <li key={p} className="flex items-start gap-3 text-[15.5px] leading-snug">
          <span aria-hidden className={`mt-[1px] grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full ${dot}`}>
            <Check className="h-[13px] w-[13px]" />
          </span>
          {p}
        </li>
      ))}
    </ul>
  );
}

export function Ask({ item, tone = "light" }: { item: Offer; tone?: "light" | "dark" }) {
  return (
    <a
      href={wa(askAbout(item))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Demander cette offre sur WhatsApp : ${item.title}`}
      className={`inline-flex min-h-[44px] items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-[14px] font-bold transition ${
        tone === "dark" ? "bg-sun text-navy hover:bg-white" : "bg-electric text-white hover:bg-deep"
      }`}
    >
      <WhatsApp className="h-[18px] w-[18px]" />
      Demander
    </a>
  );
}

const TONES = [
  { card: "border border-line bg-white text-navy", text: "text-body", rule: "bg-line", tone: "light" as const },
  { card: "bg-electric text-white shadow-[0_30px_70px_-34px_rgba(7,20,216,0.85)]", text: "text-white/85", rule: "bg-white/20", tone: "dark" as const },
  { card: "bg-night text-white shadow-[0_30px_70px_-34px_rgba(4,11,82,0.9)]", text: "text-white/80", rule: "bg-white/15", tone: "sun" as const },
];

export function Social() {
  return (
    <section id="reseaux" aria-labelledby="reseaux-title" className="bg-white py-20 lg:py-28">
      <div className="gutter mx-auto max-w-page">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Band>{social.band}</Band>
            <h2 id="reseaux-title" data-reveal className="h2 mt-8 max-w-[16ch] text-navy">
              {social.title}
            </h2>
          </div>
          <div data-reveal className="relative">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[26px] bg-mist">
              <Image src={photo} alt="" placeholder="blur" sizes="(min-width: 1024px) 480px, 92vw" className="h-full w-full object-cover object-[50%_32%]" />
            </div>
            <Squares chain="right" className="pointer-events-none absolute -right-6 -top-10 w-[110px] text-electric/40 lg:-right-10 lg:w-[140px]" />
          </div>
        </div>

        <ul className="mt-14 grid grid-cols-1 gap-5 lg:mt-20 lg:grid-cols-3">
          {social.offers.map((o, i) => {
            const t = TONES[i];
            return (
              <li
                key={o.id}
                id={o.anchor}
                data-reveal
                style={{ ["--d" as string]: `${i * 0.08}s` }}
                className={`relative flex scroll-mt-[calc(var(--header)+24px)] flex-col overflow-hidden rounded-[26px] p-7 sm:p-8 ${t.card}`}
              >
                {i === 2 && <Squares chain="right" className="pointer-events-none absolute -right-12 -top-10 w-[120px] text-white/15" />}
                <p className={`eyebrow ${i === 0 ? "text-electric" : "text-sun"}`}>{String(i + 1).padStart(2, "0")} / 03</p>
                <h3 className="mt-3 text-[26px] font-extrabold leading-[1.08] tracking-[-0.02em] sm:text-[28px]">{o.name}</h3>
                <p className={`mt-3 text-[16px] leading-relaxed ${t.text}`}>{o.text}</p>
                <div className={`my-6 h-px ${t.rule}`} />
                <Points points={o.points} tone={t.tone} />
                <div className="mt-auto pt-8">
                  <PriceBlock price={o.price} tone={i === 0 ? "light" : "sun"} />
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Ask item={o} tone={i === 0 ? "light" : "dark"} />
                    <SelectToggle id={o.id} tone={i === 0 ? "light" : "dark"} />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <article
          id={social.ads.anchor}
          data-reveal
          className="mt-5 grid scroll-mt-[calc(var(--header)+24px)] grid-cols-1 overflow-hidden rounded-[26px] border border-line bg-mist lg:grid-cols-[0.9fr_1.1fr]"
        >
          <div className="relative aspect-[16/10] lg:aspect-auto">
            <Image src={ads} alt="" placeholder="blur" sizes="(min-width: 1024px) 560px, 100vw" className="h-full w-full object-cover object-[50%_40%]" />
          </div>
          <div className="p-7 sm:p-9 lg:p-12">
            <p className="eyebrow text-electric">Facebook · Instagram</p>
            <h3 className="mt-3 text-[clamp(1.6rem,3.4vw,2.3rem)] font-extrabold leading-[1.06] tracking-[-0.025em] text-navy">{social.ads.name}</h3>
            <p className="mt-3 max-w-[36rem] text-[17px] leading-relaxed text-body">{social.ads.text}</p>
            <div className="my-7 h-px bg-line" />
            <Points points={social.ads.points} cols />
            <div className="mt-8 flex flex-wrap items-end justify-between gap-5">
              <PriceBlock price={social.ads.price} size="md" />
              <div className="flex flex-wrap gap-2">
                <Ask item={social.ads} />
                <SelectToggle id={social.ads.id} />
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
