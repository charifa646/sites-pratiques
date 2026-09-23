"use client";

import { useEffect, useState } from "react";
import { cta, nav } from "@/lib/copy";
import { Arrow } from "@/components/ui/Button";
import { cx } from "@/components/ui/motion";
import { HEADER_H, V2Logo, goTo } from "./ui";

/** Light bar: transparent over the hero, paper glass once the page moves. */
export function V2Header() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    goTo(id);
  };

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-500",
        solid ? "bg-paper/85 shadow-[0_1px_0_#E3E1D9] backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-6 px-5 sm:px-8" style={{ height: HEADER_H }}>
        <a href="#top" onClick={go("top")} aria-label="Ghostdesignco, retour en haut">
          <V2Logo />
        </a>
        <nav aria-label="Sections" className="hidden items-center gap-8 lg:flex">
          {nav.map((n) => (
            <a key={n.href} href={n.href} onClick={go(n.href.slice(1))} className="text-[14px] text-ink-soft transition-colors duration-300 hover:text-ink">
              {n.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          onClick={go("contact")}
          className="group inline-flex items-center gap-2 rounded-full bg-acid px-4 py-2.5 text-[13px] font-medium text-acid-ink transition-shadow duration-300 hover:shadow-[0_8px_24px_-10px_rgba(126,211,33,0.9)] sm:px-5 sm:text-[14px]"
        >
          <span className="hidden sm:inline">{cta.quote}</span>
          <span className="sm:hidden">{cta.quoteShort}</span>
          <Arrow className="h-4 w-4 transition-transform duration-300 ease-expo group-hover:translate-x-0.5" />
        </a>
      </div>
    </header>
  );
}
