"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { guideState } from "@/lib/guide";
import { TOUR_STEPS, tour, type TourState } from "@/lib/tour";
import { GhostMark } from "./Logo";
import { EXPO, cx } from "./motion";

const NAV_KEYS = new Set(["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "]);

/** Launch button, used in the header and under the hero. */
export function TourButton({ className, compact = false, label = "Visite guidée" }: { className?: string; compact?: boolean; label?: string }) {
  return (
    <button
      type="button"
      onClick={() => tour.start()}
      aria-label="Lancer la visite guidée"
      className={cx(
        "group inline-flex items-center gap-2 rounded-full text-fog transition-colors duration-300 hover:text-bone",
        className,
      )}
    >
      <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-acid transition-colors duration-300 group-hover:border-acid/60">
        <svg viewBox="0 0 12 12" className="ml-0.5 h-2.5 w-2.5" fill="currentColor" aria-hidden>
          <path d="M2.5 1.2 10.4 6 2.5 10.8Z" />
        </svg>
        <span className="absolute inset-0 animate-ping rounded-full border border-acid/40 [animation-duration:2.4s] motion-reduce:hidden" />
      </span>
      {!compact && <span className="text-sm">{label}</span>}
    </button>
  );
}

/**
 * The tour overlay: the ghost's speech bubble (it follows the ghost on screen)
 * and a control bar. Any scroll, key or tap of the visitor pauses the tour.
 */
export function Tour() {
  const [s, setS] = useState<TourState>(tour.get());
  const bubble = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => tour.subscribe(setS), []);

  // pause on any manual interaction, stop on Escape
  useEffect(() => {
    if (!s.active) return;
    const inside = (t: EventTarget | null) => t instanceof Node && (bar.current?.contains(t) || bubble.current?.contains(t));
    const typing = (t: EventTarget | null) => t instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") tour.stop();
      else if (NAV_KEYS.has(e.key) && !inside(e.target) && !typing(e.target)) tour.pause();
    };
    const onWheel = () => tour.pause();
    const onPointer = (e: PointerEvent) => {
      if (!inside(e.target)) tour.pause();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onWheel, { passive: true });
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onWheel);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [s.active]);

  // the bubble rides above the ghost's head, docked above the bar otherwise
  useEffect(() => {
    if (!s.active) return;
    let raf = 0;
    const loop = () => {
      const el = bubble.current;
      if (el) {
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const barTop = bar.current?.getBoundingClientRect().top ?? vh - 90;
        let x = vw / 2 - w / 2;
        let y = barTop - h - 18;
        let tail = false;
        if (guideState.visible) {
          const gx = Math.min(vw - 16 - w / 2, Math.max(16 + w / 2, guideState.x));
          const gy = guideState.y - h - 22;
          if (gy > 84 && gy + h < barTop - 12) {
            x = gx - w / 2;
            y = gy;
            tail = true;
          }
        }
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        el.dataset.tail = tail ? "on" : "off";
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [s.active]);

  const step = TOUR_STEPS[s.index];
  const total = TOUR_STEPS.length;

  return (
    <AnimatePresence>
      {s.active && (
        <motion.div
          key="tour"
          className="pointer-events-none fixed inset-0 z-[55]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div ref={bubble} className="tour-bubble pointer-events-auto absolute left-0 top-0 max-w-[300px] will-change-transform" role="status" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.p
                key={s.index}
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.45, ease: EXPO }}
                className="relative rounded-2xl border border-acid/35 bg-void/85 px-4 py-3 text-[15px] leading-snug text-bone shadow-[0_18px_60px_-18px_rgba(182,255,59,0.55)] backdrop-blur-xl"
              >
                {step?.line}
              </motion.p>
            </AnimatePresence>
            <span aria-hidden className="tour-tail absolute left-1/2 top-full -mt-[7px] h-3.5 w-3.5 -translate-x-1/2 rotate-45 border-b border-r border-acid/35 bg-void/85" />
          </div>

          <div className="absolute inset-x-0 bottom-0 flex justify-center px-4 pb-[max(env(safe-area-inset-bottom),16px)]">
            <div
              ref={bar}
              className="glass pointer-events-auto flex w-full max-w-[560px] items-center gap-3 rounded-full py-2 pl-4 pr-2 text-[13px] text-fog"
            >
              <GhostMark className="h-5 w-auto shrink-0 text-acid" />
              <span className="hidden font-medium text-bone sm:inline">Visite guidée</span>
              <span className="tabular-nums">
                {s.index + 1}/{total}
              </span>
              <span className="relative mx-1 h-[3px] flex-1 overflow-hidden rounded-full bg-white/10">
                <span
                  className="absolute inset-y-0 left-0 rounded-full bg-acid transition-[width] duration-700 ease-expo"
                  style={{ width: `${((s.index + 1) / total) * 100}%` }}
                />
              </span>
              {s.done ? (
                <button
                  type="button"
                  onClick={() => tour.stop()}
                  className="rounded-full bg-acid px-4 py-2 font-medium text-acid-ink"
                >
                  Terminer
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => (s.paused ? tour.resume() : tour.pause())}
                    aria-label={s.paused ? "Reprendre la visite" : "Mettre la visite en pause"}
                    className={cx(
                      "inline-flex h-9 items-center justify-center gap-1.5 rounded-full px-3 transition-colors",
                      s.paused ? "bg-acid font-medium text-acid-ink" : "bg-white/[0.06] text-bone hover:bg-white/10",
                    )}
                  >
                    {s.paused ? (
                      <>
                        <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="currentColor" aria-hidden>
                          <path d="M2.5 1.2 10.4 6 2.5 10.8Z" />
                        </svg>
                        <span>Reprendre</span>
                      </>
                    ) : (
                      <svg viewBox="0 0 12 12" className="h-3 w-3" fill="currentColor" aria-hidden>
                        <path d="M2.5 1.5h2.4v9H2.5zM7.1 1.5h2.4v9H7.1z" />
                      </svg>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => tour.next()}
                    aria-label="Étape suivante"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] text-bone transition-colors hover:bg-white/10"
                  >
                    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                      <path d="M4 10h11M11 5.5 15.5 10 11 14.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => tour.stop()}
                aria-label="Quitter la visite"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-fog transition-colors hover:bg-white/10 hover:text-bone"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                  <path d="m5.5 5.5 9 9m0-9-9 9" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
