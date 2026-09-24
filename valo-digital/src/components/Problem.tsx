import { problem, start } from "@/lib/content";
import { ArrowRight } from "@/components/ui/Icons";

/** The client's situation in plain words, then the four ways in. */
export function Problem() {
  return (
    <section id="contenu" aria-labelledby="problem-title" className="bg-white pb-20 pt-14 lg:pb-32 lg:pt-20">
      <div className="gutter mx-auto max-w-page">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <h2 id="problem-title" data-reveal className="h2 text-navy lg:col-span-6">
            {problem.title[0]}
            <br />
            <span className="mark whitespace-nowrap">{problem.title[1]}</span>
          </h2>
          <div data-reveal style={{ ["--d" as string]: "0.1s" }} className="grid gap-5 text-[19px] leading-[1.6] text-body lg:col-span-5 lg:col-start-8 lg:pt-3 lg:text-[20px]">
            {problem.text.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p className="text-[16px] text-body/75">{problem.audience}</p>
          </div>
        </div>

        <h2 data-reveal className="mt-16 text-[clamp(1.6rem,3.6vw,2.4rem)] sm:mt-24 font-extrabold tracking-[-0.03em] text-navy lg:mt-36">
          {start.title}
        </h2>
        <ul className="mt-6 border-t border-navy/15 lg:mt-8">
          {start.items.map((it, i) => (
            <li key={it.need} data-reveal style={{ ["--d" as string]: `${i * 0.05}s` }} className="border-b border-navy/15">
              <a
                href={it.href}
                className="group grid grid-cols-1 gap-2 py-6 transition-colors hover:bg-mist lg:grid-cols-12 lg:items-center lg:gap-10 lg:px-4 lg:py-8"
              >
                <span className="text-[24px] font-extrabold leading-[1.1] tracking-[-0.025em] text-navy sm:text-[28px] lg:col-span-5 lg:text-[32px]">{it.need}</span>
                <span className="text-[17px] leading-relaxed text-body lg:col-span-5">{it.text}</span>
                <span className="mt-2 inline-flex items-center gap-2 text-[15px] font-bold text-electric lg:col-span-2 lg:mt-0 lg:justify-end">
                  {it.link}
                  <ArrowRight className="h-[18px] w-[18px] transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
