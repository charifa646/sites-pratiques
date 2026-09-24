"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cta, menu, nav } from "@/lib/copy";
import { whatsappDirect } from "@/lib/brief";
import { site } from "@/lib/site";
import { Arrow } from "@/components/ui/Button";
import { EXPO, cx } from "@/components/ui/motion";
import { TourButton } from "@/components/ui/Tour";
import { tour } from "@/lib/tour";
import { useActiveSection } from "@/components/ui/useActiveSection";
import { HEADER_H, V2Logo, goTo } from "./ui";

const NAV = nav;
const MENU = menu;
const SECTION_IDS = MENU.map((m) => m.href.slice(1));

/** Light bar: transparent over the hero, paper glass once the page moves; full-screen menu below lg. */
export function V2Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // open menu: page frozen and out of the tab order, Escape closes
  useEffect(() => {
    if (!open) return;
    const button = toggle.current;
    const root = document.documentElement;
    const page = [document.querySelector("main"), document.querySelector("footer")].filter(Boolean) as HTMLElement[];
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

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const wasOpen = open;
    setOpen(false);
    window.setTimeout(() => goTo(id), wasOpen ? 260 : 0);
  };

  return (
    <>
      <header
        className={cx(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-500",
          solid || open ? "bg-paper/85 shadow-[0_1px_0_#E3E1D9] backdrop-blur-xl" : "bg-transparent",
        )}
      >
        <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-5 sm:px-8" style={{ height: HEADER_H }}>
          <a href="#top" onClick={go("top")} aria-label="Ghostdesignco, retour en haut">
            <V2Logo />
          </a>
          <nav aria-label="Sections" className="hidden items-center gap-8 lg:flex">
            {NAV.map((n) => {
              const on = active === n.href.slice(1);
              return (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={go(n.href.slice(1))}
                  aria-current={on ? "location" : undefined}
                  className={cx("relative text-[14px] transition-colors duration-300 hover:text-ink", on ? "text-ink" : "text-ink-soft")}
                >
                  {n.label}
                  <span
                    aria-hidden
                    className={cx(
                      "absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-acid-deep transition-[opacity,transform] duration-500",
                      on ? "scale-100 opacity-100" : "scale-0 opacity-0",
                    )}
                  />
                </a>
              );
            })}
          </nav>
          <div className="flex items-center gap-1.5 sm:gap-4">
            <TourButton tone="light" className="hidden xl:inline-flex" />
            <TourButton tone="light" compact className="xl:hidden max-[339px]:hidden" />
            <a
              href="#contact"
              onClick={go("contact")}
              className="group inline-flex items-center gap-2 rounded-full bg-acid px-4 py-2.5 text-[13px] font-medium text-acid-ink transition-shadow duration-300 hover:shadow-[0_8px_24px_-10px_rgba(126,211,33,0.9)] sm:px-5 sm:text-[14px]"
            >
              <span className="hidden sm:inline">{cta.quote}</span>
              <span className="sm:hidden">{cta.quoteShort}</span>
              <Arrow className="h-4 w-4 transition-transform duration-300 ease-expo group-hover:translate-x-0.5" />
            </a>
            <button
              ref={toggle}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="v2-menu"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink transition-colors duration-300 hover:border-ink/30 lg:hidden"
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
            id="v2-menu"
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[45] flex flex-col overflow-y-auto bg-paper px-6 pb-[max(env(safe-area-inset-bottom),24px)] lg:hidden"
            style={{ paddingTop: HEADER_H + 28 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EXPO }}
          >
            <nav aria-label="Sections">
              <ul>
                {MENU.map((m, i) => {
                  const on = active === m.href.slice(1);
                  return (
                    <motion.li key={m.href} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.04 * i, ease: EXPO }}>
                      <a
                        href={m.href}
                        onClick={go(m.href.slice(1))}
                        aria-current={on ? "location" : undefined}
                        className={cx(
                          "flex items-center gap-3 border-b border-line py-3.5 font-display text-[clamp(1.7rem,7vw,2.4rem)] font-semibold tracking-[-0.03em] transition-colors duration-300",
                          on ? "text-ink" : "text-ink/45 hover:text-ink",
                        )}
                      >
                        {m.label}
                        {on && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-acid-deep" />}
                      </a>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>
            <motion.div className="mt-auto grid gap-3 pt-10" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.28, ease: EXPO }}>
              <a href="#contact" onClick={go("contact")} className="flex items-center justify-between rounded-full bg-acid px-6 py-4 text-[16px] font-medium text-acid-ink">
                {cta.quote}
                <Arrow className="h-5 w-5" />
              </a>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  window.setTimeout(() => tour.start(), 260);
                }}
                className="flex items-center justify-between rounded-full border border-line bg-white px-6 py-4 text-[16px] text-ink"
              >
                Lancer la visite guidée
                <svg viewBox="0 0 12 12" className="h-3 w-3" fill="currentColor" aria-hidden>
                  <path d="M2.5 1.2 10.4 6 2.5 10.8Z" />
                </svg>
              </button>
              <div className="flex flex-wrap gap-x-6 gap-y-2 pt-3 text-[14px] text-ink-soft">
                <a href={whatsappDirect()} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
                  WhatsApp <span aria-hidden>↗</span>
                </a>
                {site.social.map((s) => (
                  <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
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
