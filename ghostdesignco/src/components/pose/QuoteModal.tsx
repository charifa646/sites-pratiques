"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { contact, cta } from "@/lib/copy";
import { quote } from "@/lib/quote";
import { lockScroll, unlockScroll } from "@/lib/scroll";
import { BriefForm } from "@/components/sections/BriefForm";
import { EXPO } from "@/components/ui/motion";

/**
 * The quote window (the site): every « Devis » and « Demander un devis »
 * opens the brief form over the page, where the visitor is, instead of
 * scrolling down to the contact section. A card in the middle on computers,
 * a sheet rising from the bottom on phones. Escape, the cross or a click
 * outside closes it; the page stays still behind it.
 */
export function QuoteModal() {
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => quote.register(() => setOpen(true)), []);

  useEffect(() => {
    if (!open) return;
    const before = document.activeElement as HTMLElement | null;
    lockScroll();
    panel.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      unlockScroll();
      before?.focus?.({ preventScroll: true });
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="quote"
          className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            type="button"
            aria-label="Fermer"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quote-title"
            tabIndex={-1}
            data-lenis-prevent
            className="relative max-h-[92svh] w-full max-w-[640px] overflow-y-auto overscroll-contain rounded-t-[28px] border border-white/10 bg-[#0E0E10] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)] outline-none sm:rounded-[28px]"
            initial={{ y: 48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 36, opacity: 0 }}
            transition={{ duration: 0.45, ease: EXPO }}
          >
            <div className="flex items-start justify-between gap-4 px-5 pb-5 pt-6 sm:px-7 sm:pt-7">
              <div>
                <p id="quote-title" className="font-display text-[26px] font-semibold leading-tight tracking-[-0.03em] text-bone sm:text-[30px]">
                  {cta.quote}
                </p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-fog sm:text-[15px]">{contact.text}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fermer"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 text-bone transition-colors duration-300 hover:border-acid/60 hover:text-acid"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                  <path d="M5 5l10 10M15 5 5 15" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <BriefForm bare />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
