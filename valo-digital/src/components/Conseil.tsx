import Image from "next/image";
import { conseil } from "@/lib/content";
import { ask, wa } from "@/lib/links";
import { Wave } from "@/components/Wave";
import { ArrowRight, WhatsApp } from "@/components/ui/Icons";
import photo from "../../public/images/accompagnement.jpg";

/** Advice: the diagnostic first, then the longer engagements. */
export function Conseil() {
  const d = conseil.diagnostic;
  return (
    <section id="conseil" aria-labelledby="conseil-title" className="relative bg-electric pb-36 pt-10 text-white lg:pb-52 lg:pt-16">
      <div className="gutter mx-auto max-w-page">
        <h2 id="conseil-title" data-reveal className="h2 max-w-[17ch]">
          {conseil.title[0]} <span className="text-sun">{conseil.title[1]}</span>
        </h2>

        <div id={d.id} className="mt-14 grid scroll-mt-[calc(var(--header)+24px)] grid-cols-1 gap-10 lg:mt-20 lg:grid-cols-12 lg:items-center">
          <div data-reveal className="lg:col-span-7">
            <p className="text-[14px] font-semibold text-white/70">{d.for}</p>
            <h3 className="mt-2 text-[28px] font-extrabold leading-[1.08] tracking-[-0.03em] lg:text-[34px]">{d.name}</h3>
            <p className="mt-5 text-[21px] font-semibold leading-snug lg:text-[24px]">{d.pitch}</p>
            <p className="mt-4 max-w-[38rem] text-[17px] leading-relaxed text-white/85">{d.text}</p>
            <div className="mt-9 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
              <p className="text-[34px] font-extrabold leading-none tracking-[-0.03em] text-sun">{d.price}</p>
              <a href={wa(ask(d.name, d.price))} target="_blank" rel="noopener noreferrer" className="btn btn-sun self-start sm:self-auto">
                <WhatsApp />
                {d.cta}
              </a>
            </div>
          </div>
          <div data-reveal style={{ ["--d" as string]: "0.1s" }} className="relative aspect-[16/11] overflow-hidden rounded-[8px] lg:col-span-4 lg:col-start-9 lg:aspect-[4/5]">
            <Image src={photo} alt="" placeholder="blur" sizes="(min-width: 1024px) 400px, 92vw" className="h-full w-full object-cover object-[45%_40%]" />
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-12 border-t border-white/25 pt-12 lg:mt-24 lg:grid-cols-2 lg:gap-16">
          {conseil.others.map((o, i) => (
            <div key={o.id} id={o.id} data-reveal style={{ ["--d" as string]: `${i * 0.08}s` }} className="flex scroll-mt-[calc(var(--header)+24px)] flex-col">
              <p className="text-[14px] font-semibold text-white/70">{o.for}</p>
              <h3 className="mt-2 text-[24px] font-extrabold leading-[1.1] tracking-[-0.025em] lg:text-[28px]">{o.name}</h3>
              <p className="mt-4 text-[16.5px] leading-relaxed text-white/85">{o.text}</p>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-3 pt-7">
                <p className="text-[20px] font-extrabold tracking-[-0.02em] text-sun">{o.price}</p>
                <a href={wa(ask(o.name, o.price))} target="_blank" rel="noopener noreferrer" className="go text-[15px] text-white decoration-white/35 hover:decoration-sun">
                  {o.cta}
                  <ArrowRight />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Wave fill="#ffffff" flip />
    </section>
  );
}
