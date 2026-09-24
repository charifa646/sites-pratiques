"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { methode } from "@/lib/content";
import { Wave } from "@/components/Wave";
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
  useScrollProgress(track, 0.75, 0.6, onChange);

  return (
    <section id="methode" aria-labelledby="methode-title" className="relative bg-white pb-36 pt-10 lg:pb-52 lg:pt-16">
      <div className="gutter mx-auto max-w-page">
        <div data-reveal className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-end lg:gap-10">
          <h2 id="methode-title" className="h2 text-navy lg:col-span-6">
            {methode.title}
          </h2>
          <p className="max-w-[30rem] text-[19px] leading-[1.6] text-body lg:col-span-5 lg:col-start-8">{methode.lead}</p>
        </div>

        <ol ref={track} className="relative mt-14 grid grid-cols-1 gap-12 pl-10 lg:mt-20 lg:grid-cols-4 lg:gap-10 lg:pl-0 lg:pt-12">
          <span aria-hidden className="absolute bottom-2 left-[7px] top-2 w-[2px] bg-navy/15 lg:bottom-auto lg:left-0 lg:right-0 lg:top-[7px] lg:h-[2px] lg:w-auto" />
          <span aria-hidden className="method-fill absolute bottom-2 left-[7px] top-2 w-[2px] bg-sun lg:bottom-auto lg:left-0 lg:right-0 lg:top-[7px] lg:h-[2px] lg:w-auto" />
          {methode.steps.map((s, i) => (
            <li key={s.name} className={`method-step relative ${i < on ? "is-on" : ""}`}>
              <span
                data-dot
                aria-hidden
                className="method-dot absolute -left-10 top-[0.45em] h-4 w-4 border-2 border-navy/25 bg-white lg:-top-12 lg:left-0"
              />
              <h3 className="text-[30px] font-extrabold leading-none tracking-[-0.035em] text-navy lg:text-[clamp(1.7rem,2.5vw,2.3rem)]">{s.name}</h3>
              <p className="mt-4 text-[16.5px] leading-relaxed text-body">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
      <Wave fill="#0714D8" />
    </section>
  );
}
