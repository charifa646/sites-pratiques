import Image from "next/image";
import { formations, nb, orientation, type Formation } from "@/lib/catalogue";
import { askAbout, hello, wa } from "@/lib/links";
import { Band, Squares } from "@/components/brand/Motifs";
import { SelectToggle } from "@/components/selection/Selection";
import { WhatsApp } from "@/components/ui/Icons";
import photo from "../../public/images/formations.jpg";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function AskLink({ item, tone = "light" }: { item: Formation; tone?: "light" | "dark" }) {
  return (
    <a
      href={wa(askAbout(item))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Demander des informations sur WhatsApp : ${item.title}`}
      className={`inline-flex min-h-[44px] items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-[14px] font-bold transition ${
        tone === "dark" ? "bg-sun text-navy hover:bg-white" : "bg-electric text-white hover:bg-deep"
      }`}
    >
      <WhatsApp className="h-[18px] w-[18px]" />
      Demander
    </a>
  );
}

function Card({ f, i }: { f: Formation; i: number }) {
  return (
    <li
      data-reveal
      style={{ ["--d" as string]: `${(i % 3) * 0.07}s` }}
      className="group relative flex flex-col rounded-[22px] border border-line bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-electric/60 hover:shadow-[0_24px_60px_-34px_rgba(7,20,216,0.55)] sm:p-7"
    >
      <p className="eyebrow flex items-center gap-2 text-electric">
        <span aria-hidden className="h-2 w-2 rounded-full bg-sun ring-2 ring-sun/30" />
        {f.format}
      </p>
      <h3 className="mt-3 text-[21px] font-extrabold leading-[1.15] tracking-[-0.02em] text-navy sm:text-[23px]">{f.title}</h3>
      <p className="eyebrow mt-5 text-[11px] text-body/60">{formations.head.modules}</p>
      <ul className="mt-2.5 flex flex-wrap gap-1.5">
        {f.modules.map((m) => (
          <li key={m} className="chip text-[12.5px]">
            {cap(m)}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-6">
        <p className="eyebrow text-[11px] text-body/60">{formations.head.price}</p>
        <p className="price mt-1 text-[24px] leading-tight sm:text-[26px]">{nb(f.price)}</p>
        <div className="mt-4 grid grid-cols-2 gap-2 min-[400px]:flex min-[400px]:flex-wrap">
          <AskLink item={f} />
          <SelectToggle id={f.id} />
        </div>
      </div>
    </li>
  );
}

export function Formations() {
  const featured = formations.items.find((f) => f.id === "cohorte")!;
  const others = formations.items.filter((f) => f.id !== "cohorte");

  return (
    <section id="formations" aria-labelledby="formations-title" className="bg-white py-20 lg:py-28">
      <div className="gutter mx-auto max-w-page">
        <Band as="h2" id="formations-title">
          {formations.title}
        </Band>
        <p data-reveal className="mt-8 max-w-[34rem] text-[19px] leading-relaxed text-body sm:text-[21px]">
          {orientation.rows[0].result}
        </p>

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:mt-14 xl:grid-cols-3">
          <li data-reveal className="relative isolate overflow-hidden rounded-[26px] bg-electric text-white md:col-span-2">
            <div className="feature-photo absolute inset-y-0 right-0 hidden w-[52%] sm:block">
              <Image src={photo} alt="" placeholder="blur" sizes="(min-width: 1024px) 420px, 50vw" className="h-full w-full object-cover object-[60%_30%]" />
            </div>
            <div className="relative h-52 overflow-hidden sm:hidden">
              <Image src={photo} alt="" placeholder="blur" sizes="100vw" className="feature-photo-top h-full w-full object-cover object-[70%_25%]" />
            </div>
            <Squares chain="right" className="pointer-events-none absolute -right-10 -top-6 hidden w-[130px] text-white/40 sm:block" />
            <div className="relative flex flex-col p-6 sm:h-full sm:max-w-[62%] sm:p-8 lg:p-10">
              <p className="eyebrow inline-flex self-start rounded-full bg-sun px-3 py-1.5 text-navy">{featured.format}</p>
              <h3 className="mt-4 text-[clamp(1.75rem,4.2vw,2.6rem)] font-extrabold leading-[1.02] tracking-[-0.025em]">{featured.title}</h3>
              <p className="eyebrow mt-6 text-[11px] text-white/65">{formations.head.modules}</p>
              <ul className="mt-2.5 flex flex-wrap gap-1.5">
                {featured.modules.map((m) => (
                  <li key={m} className="rounded-full bg-white/10 px-3 py-1 text-[12.5px] font-medium text-white ring-1 ring-white/20">
                    {cap(m)}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <p className="eyebrow text-[11px] text-white/65">{formations.head.price}</p>
                <p className="mt-1 text-[30px] font-extrabold leading-none tracking-[-0.02em] text-sun sm:text-[36px]">{nb(featured.price)}</p>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <AskLink item={featured} tone="dark" />
                  <SelectToggle id={featured.id} tone="dark" />
                </div>
              </div>
            </div>
          </li>

          {others.map((f, i) => (
            <Card key={f.id} f={f} i={i + 2} />
          ))}

          <li data-reveal className="flex flex-col justify-between gap-6 rounded-[22px] bg-navy p-7 text-white xl:hidden">
            <p className="text-[22px] font-extrabold leading-tight tracking-[-0.02em]">Une question sur une formation ?</p>
            <a href={wa(hello)} target="_blank" rel="noopener noreferrer" className="btn btn-sun self-start">
              <WhatsApp />
              Écrire sur WhatsApp
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
