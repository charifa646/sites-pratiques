import Image from "next/image";
import { hero } from "@/lib/content";
import { hello, wa } from "@/lib/links";
import { Wave } from "@/components/Wave";
import { ArrowRight, WhatsApp } from "@/components/ui/Icons";
import photo from "../../public/images/hero.jpg";

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-electric text-white">
      <div className="hero-photo relative h-[52svh] min-h-[360px] max-h-[600px] overflow-hidden lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:max-h-none lg:w-[50%]">
        <Image
          src={photo}
          alt=""
          priority
          placeholder="blur"
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="photo-in h-full w-full object-cover object-[50%_26%] lg:object-[50%_30%]"
        />
      </div>

      <div className="gutter relative mx-auto -mt-[120px] max-w-page pb-24 sm:-mt-[150px] sm:pb-32 lg:mt-0 lg:flex lg:min-h-[max(620px,calc(100svh-var(--header)))] lg:flex-col lg:justify-center lg:pb-40 lg:pt-16">
        <h1 id="hero-title" className="relative pl-5 text-[clamp(2.6rem,11.6vw,4.4rem)] font-extrabold leading-[0.95] tracking-[-0.04em] sm:pl-7 lg:max-w-[52vw] lg:pl-9 lg:text-[clamp(3.9rem,6.3vw,6.4rem)]">
          <span aria-hidden className="bar-grow absolute bottom-[0.12em] left-0 top-[0.14em] w-[6px] bg-sun lg:w-[9px]" />
          {hero.title.map((line, i) => (
            <span key={line} className="line-mask">
              <span className="rise" style={{ ["--d" as string]: `${i * 0.08}s` }}>
                {line}
              </span>
            </span>
          ))}
        </h1>

        <p className="fade-up mt-7 max-w-[34rem] text-[18px] leading-[1.6] text-white/90 sm:text-[20px] lg:mt-9" style={{ ["--d" as string]: "0.25s" }}>
          {hero.lead}
        </p>

        <div className="fade-up mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7" style={{ ["--d" as string]: "0.4s" }}>
          <a href={wa(hello)} target="_blank" rel="noopener noreferrer" className="btn btn-sun">
            <WhatsApp />
            {hero.primary}
          </a>
          <a href="#formations" className="go self-start text-white decoration-white/40 hover:decoration-sun sm:self-auto">
            {hero.secondary}
            <ArrowRight />
          </a>
        </div>

        <p className="fade-up mt-12 max-w-[30rem] text-[14px] font-medium text-white/65 lg:mt-16" style={{ ["--d" as string]: "0.55s" }}>
          {hero.foot}
        </p>
      </div>

      <Wave fill="#ffffff" crest />
    </section>
  );
}
