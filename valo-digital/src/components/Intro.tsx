"use client";

import { useRef } from "react";
import { brand } from "@/lib/catalogue";
import { useScrollProgress } from "@/components/ui/useScrollProgress";

/** The catalogue's opening page: its title, who it is for, and the promise lighting up word by word. */
export function Intro() {
  const promise = useRef<HTMLDivElement>(null);
  useScrollProgress(promise, 0.9, 0.55);

  const words = brand.promise.flatMap((line, l) => [
    ...line.lead.split(" ").map((w) => ({ w, key: false, l })),
    { w: line.key, key: true, l },
  ]);
  const n = words.length;

  return (
    <section id="contenu" aria-labelledby="intro-title" className="relative bg-white pb-20 pt-16 lg:pb-32 lg:pt-24">
      <div className="gutter mx-auto max-w-page">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div data-reveal>
            <p className="eyebrow text-electric">{brand.name}</p>
            <h2 id="intro-title" className="h2 mt-4 text-navy">
              {brand.title}
            </h2>
          </div>
          <div data-reveal style={{ ["--d" as string]: "0.1s" }} className="lg:pt-10">
            <p className="text-[18px] leading-[1.65] text-body sm:text-[20px]">{brand.intro}</p>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Pour qui">
              {brand.audience.map((a) => (
                <li key={a} className="chip border border-line bg-white">
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div ref={promise} className="mt-16 lg:mt-28" style={{ ["--n" as string]: n }}>
          <p className="sr-only">{brand.promise.map((p) => `${p.lead} ${p.key}`).join(" ")}</p>
          <div aria-hidden className="grid gap-1 text-[clamp(2.3rem,8.6vw,6.6rem)] font-extrabold leading-[0.98] tracking-[-0.035em] text-navy">
            {brand.promise.map((_, l) => (
              <p key={l}>
                {words.map((x, i) =>
                  x.l === l ? (
                    <span key={i} className="promise-word" style={{ ["--i" as string]: i }}>
                      {x.key ? <span className="promise-key text-electric">{x.w}</span> : x.w}{" "}
                    </span>
                  ) : null,
                )}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
