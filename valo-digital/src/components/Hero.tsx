import Image from "next/image";
import { brand } from "@/lib/catalogue";
import { hello, wa } from "@/lib/links";
import { CoverIcons, Squares } from "@/components/brand/Motifs";
import { ArrowDown, WhatsApp } from "@/components/ui/Icons";
import hero from "../../public/images/hero.jpg";

/** The 2026 cover, alive: the photo sinks into the blue, the name in white capitals on the yellow bar. */
export function Hero() {
  return (
    <section id="top" aria-label="VALO DIGITAL" className="cover-blue relative isolate overflow-hidden text-white">
      <div className="hero-photo relative h-[58svh] min-h-[390px] max-h-[640px] overflow-hidden lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:max-h-none lg:w-[54%]">
        <Image
          src={hero}
          alt=""
          priority
          placeholder="blur"
          sizes="(min-width: 1024px) 54vw, 100vw"
          className="photo-in h-full w-full object-cover object-[50%_28%] lg:object-[50%_30%]"
        />
      </div>

      <Squares chain="right" className="pointer-events-none absolute -right-12 top-[30svh] w-[150px] text-white/50 sm:w-[180px] lg:-right-6 lg:bottom-[-24px] lg:top-auto lg:w-[230px]" />
      <Squares chain="left" className="pointer-events-none absolute -left-16 bottom-[6%] hidden w-[150px] text-white/25 lg:block" />

      <div className="gutter relative mx-auto -mt-[150px] max-w-page pb-14 sm:-mt-[170px] lg:mt-0 lg:flex lg:min-h-[max(640px,calc(100svh-var(--header)))] lg:flex-col lg:justify-center lg:py-16">
        <h1 className="relative max-w-[640px] pl-5 sm:pl-7 lg:pl-9">
          <span aria-hidden className="bar-grow absolute bottom-[0.35rem] left-0 top-[0.35rem] w-[6px] bg-sun lg:w-[10px]" />
          <span className="block text-[clamp(3.6rem,18vw,6.4rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.02em] lg:text-[clamp(5.4rem,8.4vw,8.9rem)]">
            <span className="line-mask">
              <span className="rise">Valo</span>
            </span>
            <span className="line-mask">
              <span className="rise" style={{ ["--d" as string]: "0.08s" }}>
                Digital
              </span>
            </span>
          </span>
          <span className="sr-only"> : </span>
          <span className="fade-up mt-3 block text-[clamp(0.92rem,4.1vw,1.1rem)] font-bold uppercase tracking-[0.045em] lg:mt-4 lg:text-[1.45rem]" style={{ ["--d" as string]: "0.25s" }}>
            {brand.slogan}
          </span>
        </h1>

        <div className="fade-up mt-8 max-w-[34rem] lg:mt-10" style={{ ["--d" as string]: "0.38s" }}>
          <div className="rule rule-in" style={{ ["--d" as string]: "0.4s" }} />
          <ul className="grid gap-1.5 py-4 text-[16px] font-medium leading-snug sm:text-[18px]">
            {brand.subtitles.map((s) => (
              <li key={s} className="flex items-baseline gap-3">
                <span aria-hidden className="h-[7px] w-[7px] shrink-0 translate-y-[-2px] rounded-full bg-sun" />
                {s}
              </li>
            ))}
          </ul>
          <div className="rule rule-in" style={{ ["--d" as string]: "0.5s" }} />
        </div>

        <div className="fade-up mt-8 flex flex-col gap-3 sm:flex-row" style={{ ["--d" as string]: "0.5s" }}>
          <a href="#orientation" className="btn btn-sun">
            Trouver ma solution
            <ArrowDown className="nudge" />
          </a>
          <a href={wa(hello)} target="_blank" rel="noopener noreferrer" className="btn btn-glass">
            <WhatsApp />
            Écrire sur WhatsApp
          </a>
        </div>

        <div className="fade-up mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-6" style={{ ["--d" as string]: "0.65s" }}>
          <p className="bg-sky px-4 py-1.5 text-[13px] font-semibold tracking-[0.02em]">{brand.year}</p>
          <CoverIcons className="text-white/90" />
        </div>
      </div>
    </section>
  );
}
