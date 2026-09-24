"use client";

import { useState } from "react";
import { orientation } from "@/lib/catalogue";
import { Band } from "@/components/brand/Motifs";
import { ArrowRight } from "@/components/ui/Icons";

type Row = (typeof orientation.rows)[number];

function Answer({ row }: { row: Row }) {
  return (
    <div className="grid gap-5">
      <div>
        <p className="eyebrow text-electric">{orientation.head.solution}</p>
        <p className="mt-2 text-[24px] font-extrabold leading-[1.1] tracking-[-0.02em] text-navy sm:text-[28px] lg:text-[34px]">{row.solution}</p>
      </div>
      <div className="h-px bg-line" />
      <div>
        <p className="eyebrow text-electric">{orientation.head.result}</p>
        <p className="mt-2 text-[17px] leading-relaxed text-body lg:text-[19px]">{row.result}</p>
      </div>
      <a href={row.href} className="btn btn-blue mt-1 self-start">
        {row.cta}
        <ArrowRight className="nudge" />
      </a>
    </div>
  );
}

/** The catalogue's quick read, as a choice: pick a need, see the answer. */
export function Orientation() {
  const [active, setActive] = useState(0);
  const row = orientation.rows[active];

  return (
    <section id="orientation" aria-labelledby="orientation-title" className="relative overflow-hidden bg-mist py-20 lg:py-28">
      <div className="gutter relative mx-auto max-w-page">
        <Band>{orientation.band}</Band>
        <h2 id="orientation-title" data-reveal className="h2 mt-8 max-w-[18ch] text-navy">
          {orientation.title}
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:mt-14 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
          <div data-reveal>
            <p className="eyebrow mb-4 text-body/80">{orientation.head.need}</p>
            <ul className="grid gap-3">
              {orientation.rows.map((r, i) => {
                const on = i === active;
                return (
                  <li key={r.need} className={`overflow-hidden rounded-[20px] transition duration-300 ${on ? "bg-electric text-white shadow-[0_20px_50px_-24px_rgba(7,20,216,0.8)]" : "bg-white text-navy"}`}>
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      aria-expanded={on}
                      className="flex w-full items-center gap-4 px-5 py-5 text-left sm:px-6 lg:py-6"
                    >
                      <span
                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-[12px] text-[15px] font-extrabold transition ${on ? "bg-sun text-navy" : "bg-mist text-electric"}`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 text-[19px] font-extrabold leading-tight tracking-[-0.015em] sm:text-[21px]">{r.need}</span>
                      <ArrowRight className={`h-5 w-5 shrink-0 transition duration-300 ${on ? "rotate-90 text-sun lg:rotate-0" : "text-electric/60"}`} />
                    </button>
                    <div className="answer-grid lg:hidden" data-open={on}>
                      <div>
                        <div className="mx-3 mb-3 rounded-[16px] bg-white p-5 text-navy">
                          <Answer row={r} />
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div data-reveal style={{ ["--d" as string]: "0.1s" }} className="hidden lg:block">
            <div className="sticky top-[calc(var(--header)+32px)] mt-9 rounded-[28px] bg-white p-10 shadow-[0_30px_80px_-40px_rgba(4,11,82,0.35)]">
              <div key={active} className="fade-up">
                <p className="eyebrow text-body/70">
                  {orientation.head.need} · <span className="text-navy">{row.need}</span>
                </p>
                <div className="mt-6">
                  <Answer row={row} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
