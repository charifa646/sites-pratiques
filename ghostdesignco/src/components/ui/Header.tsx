"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cta, menu, nav } from "@/lib/copy";
import { whatsappDirect } from "@/lib/brief";
import { diveTo } from "@/lib/scroll";
import { site } from "@/lib/site";
import { tour } from "@/lib/tour";
import { Arrow } from "./Button";
import { Logo } from "./Logo";
import { TourButton } from "./Tour";
import { EXPO, cx } from "./motion";
import { useActiveSection } from "./useActiveSection";

const SECTION_IDS = menu.map((m) => m.href.slice(1));

/**
 * Fixed bar: logo, section links (the current one lit), the guided tour and
 * the quote request always one tap away. Below lg the links move into a
 * full-screen menu.
 */
export function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // open menu: page underneath frozen and out of the tab order, Escape closes
  useEffect(() => {
    if (!open) return;
    const button = toggle.current;
    const root = document.documentElement;
    const page = [document.querySelector("main"), document.querySelector("body > footer, footer")].filter(Boolean) as HTMLElement[];
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    page.forEach((el) => el.setAttribute("inert", ""));
    panel.current?.querySelector<HTMLElement>("a, button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      root.style.overflow = prev;
      page.forEach((el) => el.removeAttribute("inert"));
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      button?.focus({ preventScroll: true });
    };
  }, [open]);

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const wasOpen = open;
    setOpen(false);
    // let the menu fade before the dive starts
    window.setTimeout(() => diveTo(href.slice(1)), wasOpen ? 260 : 0);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-[max(env(safe-area-inset-top),12px)] sm:px-6">
        <div
          className={cx(
            "mx-auto flex max-w-[1400px] items-center justify-between gap-3 rounded-full py-2 pl-3.5 pr-1.5 transition-[background-color,box-shadow,backdrop-filter] duration-700 sm:gap-4 sm:pl-4 sm:pr-2",
            solid || open ? "bg-black/45 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] backdrop-blur-xl" : "bg-transparent",
          )}
        >
          <a href="#top" onClick={go("#top")} className="text-[14px] sm:text-base" aria-label="Ghostdesignco, retour en haut">
            <Logo />
          </a>
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Sections">
            {nav.map((n) => {
              const on = active === n.href.slice(1);
              return (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={go(n.href)}
                  aria-current={on ? "location" : undefined}
                  className={cx("relative text-sm transition-colors duration-300 hover:text-bone", on ? "text-bone" : "text-fog")}
                >
                  {n.label}
                  <span
                    aria-hidden
                    className={cx(
                      "absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-acid transition-[opacity,transform] duration-500",
                      on ? "scale-100 opacity-100" : "scale-0 opacity-0",
                    )}
                  />
                </a>
              );
            })}
          </nav>
          <div className="flex items-center gap-1.5 sm:gap-4">
            <TourButton className="hidden xl:inline-flex" />
            <TourButton compact className="xl:hidden max-[339px]:hidden" />
            <a
              href="#contact"
              onClick={go("#contact")}
              className="group inline-flex items-center gap-2 rounded-full bg-acid px-3.5 py-2 text-[13px] font-medium text-acid-ink shadow-[0_8px_24px_-10px_rgba(182,255,59,0.45)] transition-shadow duration-500 hover:shadow-[0_10px_32px_-10px_rgba(182,255,59,0.6)] sm:px-5 sm:py-2.5 sm:text-sm"
            >
              <span className="hidden sm:inline">{cta.quote}</span>
              <span className="sm:hidden">{cta.quoteShort}</span>
              {/* narrowest phones: the arrow gives way so everything fits */}
              <Arrow className="h-4 w-4 transition-transform duration-500 ease-expo group-hover:translate-x-0.5 max-[374px]:hidden" />
            </a>
            <button
              ref={toggle}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-bone transition-colors duration-300 hover:border-white/30 lg:hidden"
            >
              <span aria-hidden className={cx("absolute h-[1.5px] w-4 rounded-full bg-current transition-transform duration-500 ease-expo", open ? "rotate-45" : "-translate-y-[4px]")} />
              <span aria-hidden className={cx("absolute h-[1.5px] w-4 rounded-full bg-current transition-transform duration-500 ease-expo", open ? "-rotate-45" : "translate-y-[4px]")} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            id="menu-mobile"
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[45] flex flex-col overflow-y-auto bg-void/95 px-6 pb-[max(env(safe-area-inset-bottom),24px)] pt-[calc(max(env(safe-area-inset-top),12px)+88px)] backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EXPO }}
          >
            <nav aria-label="Sections">
              <ul className="space-y-1">
                {menu.map((m, i) => {
                  const on = active === m.href.slice(1);
                  return (
                    <motion.li
                      key={m.href}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.04 * i, ease: EXPO }}
                    >
                      <a
                        href={m.href}
                        onClick={go(m.href)}
                        aria-current={on ? "location" : undefined}
                        className={cx(
                          "flex items-center gap-3 border-b border-white/[0.07] py-3.5 font-display text-[clamp(1.7rem,7vw,2.4rem)] font-semibold tracking-[-0.03em] transition-colors duration-300",
                          on ? "text-bone" : "text-bone/55 hover:text-bone",
                        )}
                      >
                        {m.label}
                        {on && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-acid" />}
                      </a>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>
            <motion.div
              className="mt-auto grid gap-3 pt-10"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.28, ease: EXPO }}
            >
              <a
                href="#contact"
                onClick={go("#contact")}
                className="flex items-center justify-between rounded-full bg-acid px-6 py-4 text-[16px] font-medium text-acid-ink"
              >
                {cta.quote}
                <Arrow className="h-5 w-5" />
              </a>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  window.setTimeout(() => tour.start(), 260);
                }}
                className="flex items-center justify-between rounded-full border border-white/15 px-6 py-4 text-[16px] text-bone"
              >
                Lancer la visite guidée
                <svg viewBox="0 0 12 12" className="h-3 w-3 text-acid" fill="currentColor" aria-hidden>
                  <path d="M2.5 1.2 10.4 6 2.5 10.8Z" />
                </svg>
              </button>
              <div className="flex flex-wrap gap-x-6 gap-y-2 pt-3 text-[14px] text-fog">
                <a href={whatsappDirect()} target="_blank" rel="noopener noreferrer" className="hover:text-bone">
                  WhatsApp <span aria-hidden>↗</span>
                </a>
                {site.social.map((s) => (
                  <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-bone">
                    {s.label} <span aria-hidden>↗</span>
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
