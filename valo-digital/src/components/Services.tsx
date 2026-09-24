import Image from "next/image";
import { services } from "@/lib/content";
import { ask, wa } from "@/lib/links";
import { Wave } from "@/components/Wave";
import { ArrowRight } from "@/components/ui/Icons";
import team from "../../public/images/reseaux.jpg";
import ads from "../../public/images/vente.jpg";
import video from "../../public/images/video.jpg";

function From({ price, per, light = false }: { price: string; per: string; light?: boolean }) {
  return (
    <p className="leading-tight">
      <span className={`block text-[13px] font-semibold ${light ? "text-white/70" : "text-body/70"}`}>À partir de</span>
      <span className={`text-[28px] font-extrabold tracking-[-0.025em] ${light ? "text-white" : "text-navy"}`}>{price}</span>{" "}
      <span className={`text-[15px] font-semibold ${light ? "text-white/80" : "text-body"}`}>{per}</span>
    </p>
  );
}

/** What the agency does for its clients: social media, ads, video. */
export function Services() {
  const { social } = services;
  return (
    <section id="services" aria-labelledby="services-title" className="relative bg-white pb-36 pt-20 lg:pb-52 lg:pt-28">
      <div className="gutter mx-auto max-w-page">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div data-reveal className="lg:col-span-6">
            <h2 id="services-title" className="h2 text-navy">
              {services.title[0]}
              <br />
              <span className="mark">{services.title[1]}</span>
            </h2>
            <p className="mt-6 max-w-[32rem] text-[19px] leading-[1.6] text-body lg:text-[20px]">{services.lead}</p>
          </div>
          <div data-reveal style={{ ["--d" as string]: "0.1s" }} className="relative aspect-[16/11] overflow-hidden rounded-[8px] lg:col-span-5 lg:col-start-8 lg:aspect-[4/5]">
            <Image src={team} alt="" placeholder="blur" sizes="(min-width: 1024px) 480px, 92vw" className="h-full w-full object-cover object-[50%_35%]" />
          </div>
        </div>

        <div className="mt-20 lg:mt-28">
          <div data-reveal className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:items-end lg:gap-10">
            <h3 className="text-[28px] font-extrabold leading-[1.05] tracking-[-0.03em] text-navy lg:col-span-6 lg:text-[36px]">{social.name}</h3>
            <p className="text-[17px] text-body lg:col-span-5 lg:col-start-8">{social.text}</p>
          </div>
          <div className="mt-8 grid grid-cols-1 border-y border-navy/15 lg:grid-cols-3 lg:divide-x lg:divide-navy/15">
            {social.plans.map((p, i) => (
              <div
                key={p.id}
                id={`offre-${p.id}`}
                data-reveal
                style={{ ["--d" as string]: `${i * 0.07}s` }}
                className="flex flex-col border-b border-navy/15 py-9 last:border-b-0 lg:border-b-0 lg:px-8 lg:first:pl-0 lg:last:pr-0"
              >
                <p className="text-[26px] font-extrabold tracking-[-0.025em] text-navy">{p.name}</p>
                <p className="mt-1 text-[14px] font-semibold text-body/70">{p.for}</p>
                <p className="mt-5 text-[17.5px] font-semibold leading-snug text-navy">{p.pitch}</p>
                <ul className="mt-6 grid gap-2.5 text-[15.5px] leading-snug text-body">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex gap-3">
                      <span aria-hidden className="mt-[8px] h-[6px] w-[6px] shrink-0 bg-electric" />
                      {pt}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-9">
                  <From price={p.price} per={p.per} />
                  <a
                    href={wa(ask(`${social.name}, formule ${p.name}`, `à partir de ${p.price} ${p.per}`))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="go mt-4 text-[15px] text-electric decoration-electric/25 hover:decoration-electric"
                  >
                    {social.cta}
                    <ArrowRight />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-16 lg:mt-28 lg:grid-cols-2 lg:gap-10">
          {[
            { o: services.ads, img: ads, pos: "object-[50%_40%]" },
            { o: services.video, img: video, pos: "object-[40%_50%]" },
          ].map(({ o, img, pos }, i) => (
            <article key={o.id} id={o.id === "pub" ? "publicite" : "content-video"} data-reveal style={{ ["--d" as string]: `${i * 0.08}s` }} className="flex flex-col">
              <div className="relative aspect-[3/2] overflow-hidden rounded-[8px]">
                <Image src={img} alt="" placeholder="blur" sizes="(min-width: 1024px) 600px, 92vw" className={`h-full w-full object-cover ${pos}`} />
              </div>
              <p className="mt-7 text-[14px] font-semibold text-body/70">{o.for}</p>
              <h3 className="mt-1.5 text-[28px] font-extrabold leading-[1.08] tracking-[-0.03em] text-navy lg:text-[32px]">{o.name}</h3>
              <p className="mt-4 text-[18px] font-semibold leading-snug text-navy">{o.pitch}</p>
              <p className="mt-3 text-[16.5px] leading-relaxed text-body">{o.text}</p>
              <div className="mt-auto flex flex-wrap items-end justify-between gap-x-6 gap-y-4 pt-8">
                <From price={o.price} per={o.per} />
                <a
                  href={wa(ask(o.name, `à partir de ${o.price} ${o.per}`))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="go text-[15px] text-electric decoration-electric/25 hover:decoration-electric"
                >
                  {o.cta}
                  <ArrowRight />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
      <Wave fill="#0714D8" />
    </section>
  );
}
