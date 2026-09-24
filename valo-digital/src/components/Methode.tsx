"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { methode } from "@/lib/catalogue";
import { Band, Squares } from "@/components/brand/Motifs";
import { useScrollProgress } from "@/components/ui/useScrollProgress";

/** The four steps on one line that fills in yellow as they scroll by. */
export function Methode() {
  const track = useRef<HTMLOListElement>(null);
  const marks = useRef<number[]>([]);
  const [on, setOn] = useState(0);

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const wide = window.matchMedia("(min-width: 1024px)").matches;
    const box = el.getBoundingClientRect();
    marks.current = Array.from(el.querySelectorAll<HTMLElement>("[data-dot]")).map((d) => {
      const r = d.getBoundingClientRect();
      return wide ? (r.left - box.left) / box.width : (r.top - box.top) / box.height;
    });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const onChange = useCallback((p: number) => {
    const n = marks.current.filter((m) => p > m + 0.002).length;
    setOn(p >= 0.999 ? methode.steps.length : n);
  }, []);
  useScrollProgress(track, 0.72, 0.62, onChange);

  return (
    <section id="methode" aria-labelledby="methode-title" className="cover-blue relative overflow-hidden py-20 text-white lg:py-28">
      <Squares chain="right" className="pointer-events-none absolute -right-10 top-8 w-[160px] text-white/30 lg:w-[210px]" />
      <Squares chain="left" className="pointer-events-none absolute -left-12 bottom-0 hidden w-[150px] text-white/20 sm:block" />
      <div className="gutter relative mx-auto max-w-page">
        <Band className="band-dark">{methode.band}</Band>
        <h2 id="methode-title" data-reveal className="h2 mt-8 max-w-[14ch]">
          {methode.title.replace("VALO DIGITAL", "VALO\u00a0DIGITAL")}
        </h2>

        <ol ref={track} className="relative mt-14 grid grid-cols-1 gap-10 pl-[4.5rem] lg:mt-20 lg:grid-cols-4 lg:gap-8 lg:pl-0 lg:pt-[5.5rem]">
          <span aria-hidden className="absolute bottom-6 left-[27px] top-2 w-[2px] bg-white/20 lg:bottom-auto lg:left-2 lg:right-0 lg:top-[27px] lg:h-[2px] lg:w-auto" />
          <span
            aria-hidden
            className="method-fill absolute bottom-6 left-[27px] top-2 w-[2px] bg-sun lg:bottom-auto lg:left-2 lg:right-0 lg:top-[27px] lg:h-[2px] lg:w-auto"
          />
          {methode.steps.map((s, i) => (
            <li key={s.step} className={`method-step relative ${i < on ? "is-on" : ""}`}>
              <span
                data-dot
                aria-hidden
                className="method-dot absolute -left-[4.5rem] top-0 grid h-14 w-14 place-items-center rounded-full border-2 border-white/40 bg-electric text-[17px] font-extrabold lg:-top-[5.5rem] lg:left-0"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="pt-2 text-[30px] font-extrabold leading-none tracking-[-0.025em] sm:text-[34px] lg:pt-0 lg:text-[clamp(1.6rem,2.35vw,2.2rem)]">{s.step}</h3>
              <p className="eyebrow mt-5 text-[11px] text-sun">{methode.head.role}</p>
              <p className="mt-1.5 text-[16px] leading-relaxed text-white/90">{s.role}</p>
              <div className="mt-5 rounded-[18px] bg-white/10 p-4 ring-1 ring-white/15">
                <p className="eyebrow text-[11px] text-white/70">{methode.head.brings}</p>
                <p className="mt-1.5 text-[15.5px] font-semibold leading-snug">{s.brings}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
