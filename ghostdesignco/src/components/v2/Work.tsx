"use client";

import Image from "next/image";
import { useRef, type PointerEvent } from "react";
import { cta, work } from "@/lib/copy";
import { projects, type Project } from "@/lib/projects";
import { Rise, cx } from "@/components/ui/motion";
import { BrowserMock, PhoneMock, WindowBar } from "./Mockups";
import { Eyebrow, PrimaryButton, goTo } from "./ui";

/** Cards lean toward the pointer (mouse only). */
function useTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1200px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-4px)`;
  };
  const leave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return { ref, move, leave };
}

/** A real capture in a browser frame, or a drawn preview until it arrives. */
function Shot({ p }: { p: Project }) {
  if (p.image) {
    return (
      <div className="overflow-hidden rounded-[18px] border border-line bg-white shadow-[0_24px_60px_-30px_rgba(12,12,13,0.35)] [container-type:inline-size]">
        <WindowBar />
        <div className="relative aspect-[16/10]">
          <Image src={p.image} alt={`${p.title}, ${p.type}`} fill sizes="(min-width: 1024px) 560px, 92vw" className="object-cover object-top" />
        </div>
      </div>
    );
  }
  if (p.type === "Landing page") {
    return (
      <div className="grid aspect-[16/11] place-items-center">
        <PhoneMock className="w-[34%]" />
      </div>
    );
  }
  return (
    <div className="grid aspect-[16/11] place-items-center">
      <BrowserMock className="w-full" />
    </div>
  );
}

function Card({ p, i }: { p: Project; i: number }) {
  const tilt = useTilt();
  return (
    <Rise delay={(i % 2) * 0.08} blur={false} className={cx(i % 2 === 1 && "lg:mt-16")}>
      <div
        ref={tilt.ref}
        onPointerMove={tilt.move}
        onPointerLeave={tilt.leave}
        className="group rounded-[30px] border border-line bg-paper p-5 transition-transform duration-500 ease-expo will-change-transform sm:p-7"
      >
        <div className="rounded-[22px] bg-[radial-gradient(90%_80%_at_50%_0%,#ffffff,transparent_70%)] p-2 sm:p-4">
          <Shot p={p} />
        </div>
        <div className="mt-5 flex items-center justify-between gap-4 px-1">
          <div>
            <h3 className="font-display text-[22px] font-semibold tracking-[-0.02em]">{p.title}</h3>
            {p.summary && <p className="mt-1 text-[15px] text-ink-soft">{p.summary}</p>}
          </div>
          <span className="shrink-0 rounded-full border border-line bg-white px-3 py-1 text-[13px] text-ink-soft">{p.type}</span>
        </div>
        {p.url && (
          <a href={p.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block px-1 text-[14px] font-medium text-ink underline decoration-acid-deep decoration-2 underline-offset-4">
            {work.visit} <span aria-hidden>↗</span>
          </a>
        )}
      </div>
    </Rise>
  );
}

export function V2Work() {
  return (
    <section id="realisations" aria-labelledby="v2-work-title" className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <Rise>
              <Eyebrow>{work.eyebrow}</Eyebrow>
            </Rise>
            <Rise delay={0.05}>
              <h2 id="v2-work-title" className="mt-5 font-display text-[clamp(2.2rem,4.6vw,4rem)] font-semibold leading-[1] tracking-[-0.04em]">
                {work.title.lead}{" "}
                <span className="relative inline-block whitespace-nowrap pr-[0.06em] font-serif font-normal italic tracking-[-0.01em]">
                  <span aria-hidden className="absolute inset-x-[-0.04em] bottom-[0.1em] h-[0.26em] rounded-full bg-acid" />
                  <span className="relative">{work.title.accent}</span>
                </span>
              </h2>
            </Rise>
          </div>
          <Rise as="p" delay={0.1} className="max-w-[26rem] text-[17px] leading-relaxed text-ink-soft">
            {work.text}
          </Rise>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {projects.map((p, i) => (
            <Card key={p.title} p={p} i={i} />
          ))}
        </div>

        <Rise blur={false} className="mt-8 lg:mt-16">
          <div
            data-ghost="tr"
            data-ghost-x="-0.5"
            data-ghost-y="-0.42"
            data-ghost-m="tr"
            data-ghost-mx="-0.45"
            data-ghost-my="-0.4"
            className="relative overflow-hidden rounded-[32px] bg-[#0B0B0C] px-7 py-10 text-bone sm:px-12 sm:py-14"
          >
            <span aria-hidden className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(182,255,59,0.22),transparent)]" />
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="font-display text-[clamp(1.8rem,3.4vw,3rem)] font-semibold leading-[1.02] tracking-[-0.03em]">{work.next.title}</h3>
                <p className="mt-3 max-w-[32rem] text-[17px] leading-relaxed text-fog">{work.next.text}</p>
              </div>
              <PrimaryButton className="self-start lg:self-auto" onClick={() => goTo("contact")}>
                {cta.quote}
              </PrimaryButton>
            </div>
          </div>
        </Rise>
      </div>
    </section>
  );
}
