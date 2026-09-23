"use client";

import { useEffect, useState } from "react";
import { cta, nav } from "@/lib/copy";
import { diveTo } from "@/lib/scroll";
import { Arrow } from "./Button";
import { Logo } from "./Logo";
import { TourButton } from "./Tour";

/** Fixed bar: logo, section links, and the quote request always one tap away. */
export function Header() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    diveTo(href.slice(1));
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-[max(env(safe-area-inset-top),12px)] sm:px-6">
      <div
        className={`mx-auto flex max-w-[1400px] items-center justify-between gap-4 rounded-full py-2 pl-4 pr-2 transition-[background-color,box-shadow,backdrop-filter] duration-700 ${
          solid ? "bg-black/45 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <a href="#top" onClick={go("#top")} className="text-[15px] sm:text-base" aria-label="Ghostdesignco, retour en haut">
          <Logo />
        </a>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Sections">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={go(n.href)}
              className="text-sm text-fog transition-colors duration-300 hover:text-bone"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-4">
          <TourButton className="hidden xl:inline-flex" />
          <TourButton compact className="xl:hidden" />
          <a
            href="#contact"
            onClick={go("#contact")}
            className="group inline-flex items-center gap-2 rounded-full bg-acid px-4 py-2 text-[13px] font-medium text-acid-ink shadow-[0_8px_30px_-8px_rgba(182,255,59,0.6)] transition-shadow duration-500 hover:shadow-[0_10px_40px_-6px_rgba(182,255,59,0.85)] sm:px-5 sm:py-2.5 sm:text-sm"
          >
            <span className="hidden sm:inline">{cta.quote}</span>
            <span className="sm:hidden">{cta.quoteShort}</span>
            <Arrow className="h-4 w-4 transition-transform duration-500 ease-expo group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </header>
  );
}
