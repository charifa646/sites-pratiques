"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import { cta, hero, method, offer, proof } from "@/lib/copy";
import { Rise, cx } from "@/components/ui/motion";
import type { Tier } from "./HeroScene";
import { Scramble } from "./Scramble";
import { showOffer } from "./Services";
import { PrimaryButton, TextLink, goTo } from "./ui";

// the 3D stage loads after the words: the page never waits for it
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

/**
 * "Le fantôme derrière la vitre", in three layers:
 * - behind, the glass ghost rising out of a mirror floor (HeroScene);
 * - in the middle, a grid of glass cards: the clear ones show it sharp, the
 *   frosted ones blur it, and the pointer wipes the mist off them;
 * - in front, the words, centred.
 * Cards are placed from the centre line, in % of the hero's height on wide
 * screens (like the 3D ghost, so both stay together at any ratio) and of its
 * width on tall ones; their tops are in % of the height.
 */

// clear: a bare pane; glass / frost: live blur of the ghost behind (kept to
// the panes in front of it, it is costly); mist: the frosted look, no blur
type Tone = "clear" | "glass" | "frost" | "mist";
type Spot = "c" | "tl" | "tr" | "bl" | "br";
type Card = {
  x: number; // left edge, from the centre line
  y: number; // top edge
  w: number;
  h: number;
  tone: Tone;
  blur?: number;
  step?: number; // a step of the method, in brackets
  offer?: number; // or one of the three offers: the card leads to it
  at?: Spot;
  stack?: boolean; // the offer's number above its name (narrow cards)
  demo?: boolean; // the first mist wiped, to show it can be
};

type Grid = { unit: "cqh" | "cqw"; cards: Card[] };

// wide screens: columns 20 wide around a centre one of 27 that keeps the
// ghost's eyes clear however it turns its head, so the panes on either side
// cross its cheeks and arms. Rows follow it: head, body (the headline), hem
// and floor, reflection.
const XW = [-73.5, -53.5, -33.5, -13.5, 13.5, 33.5, 53.5, 73.5];
const YW = [10.5, 35, 55.5, 76, 94.5];
const cellW = (k: number, j: number, rest: Partial<Card> & { tone: Tone }, span = 1): Card => ({
  x: XW[k],
  y: YW[j],
  w: XW[k + span] - XW[k],
  h: YW[j + 1] - YW[j],
  ...rest,
});
const WIDE: Grid = {
  unit: "cqh",
  cards: [
    cellW(1, 0, { tone: "clear", step: 0, at: "c" }),
    cellW(2, 0, { tone: "glass", blur: 6 }),
    cellW(3, 0, { tone: "clear" }),
    cellW(4, 0, { tone: "frost", blur: 12, step: 1, at: "tr", demo: true }),
    cellW(6, 0, { tone: "mist" }),
    cellW(0, 1, { tone: "clear" }),
    cellW(1, 1, { tone: "clear", offer: 0, at: "tl" }),
    cellW(2, 1, { tone: "clear" }),
    cellW(3, 1, { tone: "frost", blur: 12 }),
    cellW(4, 1, { tone: "clear" }),
    cellW(5, 1, { tone: "mist", offer: 1, at: "tr" }),
    cellW(1, 2, { tone: "mist", offer: 2, at: "bl" }),
    cellW(2, 2, { tone: "glass", blur: 5 }),
    cellW(3, 2, { tone: "clear" }),
    cellW(4, 2, { tone: "frost", blur: 12 }),
    cellW(5, 2, { tone: "clear", step: 2, at: "br" }),
    cellW(0, 3, { tone: "clear" }),
    cellW(2, 3, { tone: "frost", blur: 12 }),
    cellW(3, 3, { tone: "clear" }),
    cellW(4, 3, { tone: "glass", blur: 8 }),
    cellW(6, 3, { tone: "mist" }),
  ],
};

// tall screens: the same grid on three columns, the centre one holding the
// eyes: head, headline, paragraph, button, then the three offers side by side
const XT = [-46, -46 / 3, 46 / 3, 46];
const YT = [10, 30, 50, 65, 82, 96.5];
const cellT = (k: number, j: number, rest: Partial<Card> & { tone: Tone }): Card => ({
  x: XT[k],
  y: YT[j],
  w: XT[k + 1] - XT[k],
  h: YT[j + 1] - YT[j],
  ...rest,
});
const TALL: Grid = {
  unit: "cqw",
  cards: [
    cellT(0, 0, { tone: "glass", blur: 6 }),
    cellT(1, 0, { tone: "clear" }),
    cellT(2, 0, { tone: "frost", blur: 10 }),
    cellT(0, 1, { tone: "clear" }),
    cellT(1, 1, { tone: "frost", blur: 12, demo: true }),
    cellT(2, 1, { tone: "mist" }),
    cellT(0, 2, { tone: "mist" }),
    cellT(1, 2, { tone: "clear" }),
    cellT(2, 2, { tone: "mist" }),
    cellT(0, 3, { tone: "clear" }),
    cellT(1, 3, { tone: "mist" }),
    cellT(2, 3, { tone: "clear" }),
    cellT(0, 4, { tone: "mist", offer: 0, at: "bl", stack: true }),
    cellT(1, 4, { tone: "clear", offer: 1, at: "bl", stack: true }),
    cellT(2, 4, { tone: "mist", offer: 2, at: "bl", stack: true }),
  ],
};

/** Which borders each card draws, so shared ones are drawn once. */
function edgesOf(cards: Card[]) {
  const near = (a: number, b: number) => Math.abs(a - b) < 0.01;
  return cards.map((a) => ({
    right: !cards.some((b) => b !== a && near(b.x, a.x + a.w) && b.y <= a.y + 0.01 && b.y + b.h >= a.y + a.h - 0.01),
    bottom: !cards.some((b) => b !== a && near(b.y, a.y + a.h) && b.x <= a.x + 0.01 && b.x + b.w >= a.x + a.w - 0.01),
  }));
}

const SPOT: Record<Spot, string> = {
  c: "inset-0 flex items-center justify-center",
  tl: "left-3.5 top-3",
  tr: "right-3.5 top-3",
  bl: "bottom-3 left-3.5",
  br: "bottom-3 right-3.5",
};

function Glass({ grid, className }: { grid: Grid; className: string }) {
  const u = grid.unit;
  const edges = edgesOf(grid.cards);
  return (
    <div className={cx("pointer-events-none absolute inset-0 z-[5] text-[clamp(11.5px,1.45cqh,14px)] tracking-[0.01em]", className)}>
      {grid.cards.map((card, i) => {
        const item = card.offer !== undefined ? offer.items[card.offer] : null;
        const centre = card.x + card.w / 2;
        const style = {
          left: `calc(50cqw + ${card.x}${u})`,
          top: `${card.y}cqh`,
          width: `${card.w}${u}`,
          height: `${card.h}cqh`,
          // how it drifts away when the page scrolls
          "--dx": (centre * 0.55).toFixed(2),
          "--dy": (-(10 + (card.y + card.h / 2) * 0.3)).toFixed(2),
          "--ds": (0.08 + Math.abs(centre) * 0.003).toFixed(3),
          "--i": i,
        } as CSSProperties;
        const label = item ? (
          <span
            className={cx(
              "v2-fade absolute whitespace-nowrap text-ink-soft transition-colors duration-500 group-hover:text-ink",
              card.stack && "v2-stack-label",
              SPOT[card.at ?? "bl"],
            )}
          >
            <span className={cx("font-display tabular-nums text-ink-mute", card.stack ? "mb-0.5 block" : "mr-1.5")}>{item.n}</span>
            <Scramble text={`[${item.title}]`} delay={0.5 + i * 0.05} />
            <span aria-hidden className="ml-1 inline-block -translate-x-1 opacity-0 transition duration-500 ease-expo group-hover:translate-x-0 group-hover:opacity-100">
              →
            </span>
          </span>
        ) : card.step !== undefined ? (
          <span aria-hidden className={cx("v2-fade absolute whitespace-nowrap text-ink-mute", SPOT[card.at ?? "bl"])}>
            <Scramble text={`[${method.steps[card.step].title}]`} delay={0.5 + i * 0.05} />
          </span>
        ) : null;
        const inner = (
          <>
            {card.tone === "mist" && <span aria-hidden className="v2-mist absolute inset-0" />}
            {(card.tone === "glass" || card.tone === "frost") && (
              <span aria-hidden className="v2-fog absolute inset-0" style={{ "--blur": `${card.blur ?? 8}px` } as CSSProperties} />
            )}
            <span aria-hidden className="v2-edge-x v2-fade absolute left-0 top-0 h-px w-full origin-left" />
            <span aria-hidden className="v2-edge-y v2-fade absolute left-0 top-0 h-full w-px origin-top" />
            {edges[i].right && <span aria-hidden className="v2-edge-y v2-fade absolute right-0 top-0 h-full w-px origin-bottom" />}
            {edges[i].bottom && <span aria-hidden className="v2-edge-x v2-fade absolute bottom-0 left-0 h-px w-full origin-right" />}
            {item && (
              <span aria-hidden className="pointer-events-none absolute inset-[7px] opacity-0 transition-all duration-500 ease-expo group-hover:inset-[11px] group-hover:opacity-100">
                <span className="absolute left-0 top-0 h-3 w-3 border-l-[1.5px] border-t-[1.5px] border-acid-deep" />
                <span className="absolute right-0 top-0 h-3 w-3 border-r-[1.5px] border-t-[1.5px] border-acid-deep" />
                <span className="absolute bottom-0 left-0 h-3 w-3 border-b-[1.5px] border-l-[1.5px] border-acid-deep" />
                <span className="absolute bottom-0 right-0 h-3 w-3 border-b-[1.5px] border-r-[1.5px] border-acid-deep" />
              </span>
            )}
            {label}
          </>
        );
        return (
          <div key={i} data-tone={card.tone} data-demo={card.demo ? "" : undefined} className="v2-card absolute" style={style}>
            {item ? (
              <button
                type="button"
                onClick={() => showOffer(card.offer!)}
                aria-label={`${item.title} : voir l'offre`}
                className="v2-card-in group pointer-events-auto absolute inset-0 block text-left"
              >
                {inner}
              </button>
            ) : (
              <div aria-hidden className="v2-card-in absolute inset-0">
                {inner}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Wiping the mist: under the pointer the frosted glass clears, and it mists
 * over again behind it. Once the ghost is up, one stroke shows it can be done.
 */
function useMist(host: RefObject<HTMLElement>) {
  useEffect(() => {
    const el = host.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const LIFE = 1700; // ms before the mist is back
    type Dot = { x: number; y: number; t: number };
    const trail: Dot[] = [];
    let raf = 0;

    const tick = () => {
      raf = 0;
      const now = performance.now();
      while (trail.length && now - trail[trail.length - 1].t > LIFE) trail.pop();
      const R = Math.max(56, Math.min(96, el.clientHeight * 0.085));
      el.querySelectorAll<HTMLElement>(".v2-fog").forEach((f) => {
        const r = f.getBoundingClientRect();
        if (!r.width) return;
        const holes: string[] = [];
        for (const d of trail) {
          const k = 1 - (now - d.t) / LIFE;
          const rad = R * (0.4 + 0.6 * k);
          if (d.x < r.left - rad || d.x > r.right + rad || d.y < r.top - rad || d.y > r.bottom + rad) continue;
          const clear = Math.min(1, k * 1.6);
          holes.push(
            `radial-gradient(circle ${rad.toFixed(0)}px at ${(d.x - r.left).toFixed(0)}px ${(d.y - r.top).toFixed(0)}px, rgba(0,0,0,${(1 - clear).toFixed(2)}) 40%, #000 100%)`,
          );
        }
        const mask = holes.join(",");
        f.style.setProperty("mask-image", mask);
        f.style.setProperty("-webkit-mask-image", mask);
      });
      if (trail.length) raf = requestAnimationFrame(tick);
    };
    const add = (x: number, y: number, t = performance.now()) => {
      const last = trail[0];
      if (last && Math.hypot(x - last.x, y - last.y) < 14) last.t = t;
      else trail.unshift({ x, y, t });
      if (trail.length > 16) trail.length = 16;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => add(e.clientX, e.clientY);
    el.addEventListener("pointermove", onMove, { passive: true });

    // the demo stroke: across the frosted card in front of the ghost
    let demo = 0;
    const start = window.setTimeout(() => {
      const card = Array.from(el.querySelectorAll<HTMLElement>("[data-demo]")).find((c) => c.offsetParent !== null);
      if (!card) return;
      const t0 = performance.now();
      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / 900);
        const r = card.getBoundingClientRect();
        const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        add(r.left + r.width * (0.08 + 0.84 * e), r.top + r.height * (0.5 + Math.sin(e * Math.PI * 2) * 0.16));
        if (k < 1) demo = requestAnimationFrame(step);
      };
      demo = requestAnimationFrame(step);
    }, 2100);

    return () => {
      el.removeEventListener("pointermove", onMove);
      window.clearTimeout(start);
      cancelAnimationFrame(demo);
      cancelAnimationFrame(raf);
    };
  }, [host]);
}

/**
 * The stage: a still picture first (the ghost and its reflection), then the
 * live 3D studio fades in where WebGL is available.
 */
function Stage({ host }: { host: RefObject<HTMLElement> }) {
  const [tier, setTier] = useState<Tier | null>(null);
  const [live, setLive] = useState(false);
  const [reduced, setReduced] = useState(false);
  const progress = useRef(0);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get("hero") === "off") return;
    let gl: WebGL2RenderingContext | null = null;
    try {
      gl = document.createElement("canvas").getContext("webgl2");
    } catch {
      gl = null;
    }
    if (!gl) return;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    const cores = navigator.hardwareConcurrency ?? 4;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const desktop = window.matchMedia("(pointer: fine)").matches && window.innerWidth >= 1024;
    const pinned = q.get("ghost");
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setTier(pinned === "hi" || pinned === "lo" ? pinned : memory >= 4 && (desktop ? cores >= 4 : cores >= 6) ? "hi" : "lo");
  }, []);

  // how far the hero has scrolled away (0 → 1): the scene reads it, and the
  // cards and words drift away with it (--p)
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      const el = host.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
      progress.current = p;
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          el.style.setProperty("--p", p.toFixed(4));
        });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [host]);

  return (
    <>
      {/* the still steps aside quickly: the live ghost then rises out of the mirror */}
      <div className={cx("absolute inset-0 transition-opacity duration-300", live && "opacity-0")} aria-hidden>
        {/* still: the ghost over its reflection, where the 3D one will stand */}
        <div className="v2-still absolute left-1/2">
          <Image src="/v2/ghost.webp" alt="" width={582} height={821} priority sizes="(min-aspect-ratio: 1/1) 42vh, 70vw" className="h-full w-auto max-w-none" />
        </div>
        <div className="v2-still-mirror absolute left-1/2 [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.5),transparent_45%)]">
          <Image src="/v2/ghost.webp" alt="" width={582} height={821} sizes="(min-aspect-ratio: 1/1) 42vh, 70vw" className="h-full w-auto max-w-none -scale-y-100 blur-[2px]" />
        </div>
      </div>
      {tier && (
        <div className={cx("absolute inset-0 transition-opacity duration-1000", live ? "opacity-100" : "opacity-0")} aria-hidden>
          <HeroScene
            host={host}
            progress={progress}
            reduced={reduced}
            tier={tier}
            onReady={() => setLive(true)}
            onFail={() => setTier(null)}
            onLow={() => setTier("lo")}
          />
        </div>
      )}
    </>
  );
}

/** A mention between thin brackets, as on the MAKEDO slides. */
function Bracketed({ children, className }: { children: ReactNode; className?: string }) {
  const arm = "pointer-events-none absolute inset-y-0 w-[0.5em] border-y-[1.5px] border-acid-deep";
  return (
    <span className={cx("relative inline-block px-[1em] py-[0.32em]", className)}>
      <span aria-hidden className={cx(arm, "v2-arm-l left-0 border-l-[1.5px]")} />
      <span aria-hidden className={cx(arm, "v2-arm-r right-0 border-r-[1.5px]")} />
      {children}
    </span>
  );
}

export function V2Hero() {
  const ref = useRef<HTMLElement>(null);
  useMist(ref);
  const words = hero.title.lead.split(" ");
  return (
    <section
      ref={ref}
      id="top"
      aria-labelledby="v2-hero-title"
      className="v2-hero relative h-[100svh] overflow-hidden [container-type:size]"
    >
      <Stage host={ref} />
      {/* the far end of the mirror fades into the page */}
      <div aria-hidden className="v2-floor-fade pointer-events-none absolute inset-x-0 bottom-0 z-[4] bg-gradient-to-b from-paper/0 to-paper" />

      <Glass grid={WIDE} className="v2-wide" />
      <Glass grid={TALL} className="v2-tall" />

      {/* the frame: construction lines running past the grid, as on the slides */}
      <div aria-hidden className="v2-frame pointer-events-none absolute inset-0 z-[6]">
        <span className="v2-frame-x v2-frame-top absolute inset-x-0 h-px origin-left" />
        <span className="v2-frame-x v2-frame-bottom absolute inset-x-0 h-px origin-right" />
        <span className="v2-frame-y v2-frame-left absolute inset-y-0 w-px origin-top" />
        <span className="v2-frame-y v2-frame-right absolute inset-y-0 w-px origin-bottom" />
      </div>

      <div className="v2-copy pointer-events-none absolute inset-0 z-10 flex flex-col items-center px-5 text-center sm:px-8">
        <div className="flex flex-col items-center">
          <Rise>
            <p className="text-[13px] tracking-[0.01em] text-ink-soft sm:text-[14px]">
              <Bracketed>{hero.eyebrow}</Bracketed>
            </p>
          </Rise>
          <Rise delay={0.05}>
            <h1
              id="v2-hero-title"
              className="v2-title mt-4 font-display font-semibold leading-[0.94] tracking-[-0.045em] [text-wrap:balance] sm:mt-5"
            >
              <span className="v2-line">{words.slice(0, 4).join(" ")}</span>{" "}
              <span className="v2-line">
                {words.slice(4).join(" ")}{" "}
                <span className="relative inline-block whitespace-nowrap pr-[0.06em] font-serif font-normal italic tracking-[-0.01em]">
                  <span aria-hidden className="absolute inset-x-[-0.04em] bottom-[0.1em] h-[0.28em] rounded-[0.1em] bg-acid" />
                  <span className="relative">{hero.title.accent}</span>
                </span>
              </span>
            </h1>
          </Rise>
        </div>
        <div className="v2-copy-end flex flex-col items-center">
          <Rise as="p" delay={0.12} className="v2-lede max-w-[38rem] text-[16px] leading-relaxed text-ink-soft sm:text-[17px]">
            {hero.text}
          </Rise>
          <Rise delay={0.18} className="v2-cta pointer-events-auto mt-5 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 sm:mt-7">
            <PrimaryButton onClick={() => goTo("contact")}>{cta.quote}</PrimaryButton>
            <TextLink onClick={() => goTo("services")}>{cta.secondary}</TextLink>
          </Rise>
          <Rise delay={0.22} as="p" className="v2-tall v2-reassure mt-3 text-[13px] text-ink-mute">
            {hero.reassurance.join(" · ")}
          </Rise>
        </div>
      </div>

      {/* mentions under the frame, as on the slides (tall screens: the
          reassurance already sits under the button) */}
      <div className="v2-foot pointer-events-none absolute inset-x-0 z-10 flex items-center text-[12.5px] tracking-[0.01em] text-ink-mute">
        <span className="v2-foot-l absolute">
          [ {proof.stats.map((s) => `${s.value}${s.suffix} ${s.label}`).join(" · ")} ]
        </span>
        <span className="v2-wide v2-foot-r absolute">[ {hero.reassurance.join(" · ")} ]</span>
      </div>
    </section>
  );
}
