import Image from "next/image";
import { formations } from "@/lib/content";
import { enrol, wa } from "@/lib/links";
import { ArrowRight } from "@/components/ui/Icons";
import photo from "../../public/images/formations.jpg";

/** The eight formations, in four families. */
export function Formations() {
  return (
    <section id="formations" aria-labelledby="formations-title" className="bg-mist pb-24 pt-20 lg:pb-32 lg:pt-28">
      <div className="gutter mx-auto max-w-page">
        <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12">
          <div data-reveal className="lg:col-span-6">
            <h2 id="formations-title" className="h2 text-navy">
              {formations.title[0]} <span className="whitespace-nowrap">{formations.title[1]}</span>
            </h2>
            <p className="mt-6 max-w-[30rem] text-[19px] leading-[1.6] text-body lg:text-[20px]">{formations.lead}</p>
          </div>
          <div data-reveal style={{ ["--d" as string]: "0.1s" }} className="relative aspect-[16/10] overflow-hidden rounded-[8px] lg:col-span-5 lg:col-start-8 lg:aspect-[4/3]">
            <Image src={photo} alt="" placeholder="blur" sizes="(min-width: 1024px) 480px, 92vw" className="h-full w-full object-cover object-[62%_30%]" />
          </div>
        </div>

        <div className="mt-16 lg:mt-24">
          {formations.groups.map((g) => (
            <div key={g.id} className="grid grid-cols-1 gap-6 border-t border-navy/15 py-10 lg:grid-cols-12 lg:gap-10 lg:py-14">
              <div data-reveal className="lg:col-span-4">
                <h3 className="text-[26px] font-extrabold leading-[1.1] tracking-[-0.025em] text-navy lg:text-[30px]">{g.name}</h3>
                <p className="mt-3 max-w-[22rem] text-[16.5px] leading-relaxed text-body">{g.text}</p>
              </div>
              <ul className="grid grid-cols-1 gap-8 lg:col-span-8">
                {g.items.map((f, i) => (
                  <li key={f.id} data-reveal style={{ ["--d" as string]: `${0.06 + i * 0.06}s` }} className="rounded-[8px] bg-white p-6 sm:p-7">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                      <h4 className="text-[21px] font-extrabold leading-snug tracking-[-0.02em] text-navy sm:text-[23px]">{f.title}</h4>
                      <p className="whitespace-nowrap text-[18px] font-extrabold tracking-[-0.01em] text-electric">{f.price}</p>
                    </div>
                    <p className="mt-1 text-[14px] font-semibold text-body/70">{f.format}</p>
                    <p className="mt-4 max-w-[44rem] text-[16.5px] leading-relaxed text-body">{f.text}</p>
                    <a href={wa(enrol(f.title, f.price))} target="_blank" rel="noopener noreferrer" className="go mt-5 text-[15px] text-electric decoration-electric/25 hover:decoration-electric">
                      {formations.cta}
                      <ArrowRight />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
