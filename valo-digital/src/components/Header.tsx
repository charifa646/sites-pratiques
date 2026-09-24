"use client";

import { useEffect, useRef, useState } from "react";
import { contact } from "@/lib/catalogue";
import { hello, wa } from "@/lib/links";
import { NAV } from "@/lib/nav";
import { LogoInline, LogoStacked } from "@/components/brand/Logo";
import { Flag, Squares } from "@/components/brand/Motifs";
import { Close, Mail, Menu, Phone, WhatsApp } from "@/components/ui/Icons";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const firstLink = useRef<HTMLAnchorElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    firstLink.current?.focus();
    const button = menuButton.current;
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      button?.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <>
      <a href="#contenu" className="sr-only z-[70] rounded-full bg-sun px-5 py-3 font-bold text-navy focus:not-sr-only focus:fixed focus:left-4 focus:top-3">
        Aller au contenu
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 h-[var(--header)] bg-white transition-shadow duration-300 ${
          scrolled ? "shadow-[0_1px_0_#D9DDE8,0_10px_30px_-18px_rgba(4,11,82,0.35)]" : ""
        }`}
      >
        <div className="gutter mx-auto flex h-full max-w-page items-center justify-between gap-3 sm:gap-6">
          <a href="#top" className="text-brand" aria-label="VALO DIGITAL, retour en haut">
            <LogoInline />
          </a>
          <nav aria-label="Navigation principale" className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="relative whitespace-nowrap rounded-full px-3 py-2 text-[15px] font-semibold text-navy transition hover:bg-mist hover:text-electric">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <a href={wa(hello)} target="_blank" rel="noopener noreferrer" className="btn btn-blue hidden min-h-[44px] px-5 text-[14px] sm:inline-flex">
              <WhatsApp />
              WhatsApp
            </a>
            <a
              href={wa(hello)}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-11 w-11 place-items-center rounded-full bg-electric text-white sm:hidden"
              aria-label="Écrire sur WhatsApp"
            >
              <WhatsApp className="h-[21px] w-[21px]" />
            </a>
            <button
              ref={menuButton}
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="menu"
              className="grid h-11 w-11 place-items-center rounded-full border border-line text-navy xl:hidden"
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-[22px] w-[22px]" />
            </button>
          </div>
        </div>
      </header>

      <div
        id="menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`cover-blue fixed inset-0 z-[60] flex flex-col overflow-y-auto text-white transition duration-500 ease-out xl:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <Squares chain="right" className="pointer-events-none absolute -right-10 top-24 w-44 text-white/35" />
        <div className="gutter flex h-[var(--header)] shrink-0 items-center justify-between">
          <LogoStacked className="h-11 w-auto text-white" />
          <button type="button" onClick={() => setOpen(false)} className="grid h-11 w-11 place-items-center rounded-full border border-white/40" aria-label="Fermer le menu">
            <Close className="h-[22px] w-[22px]" />
          </button>
        </div>
        <nav aria-label="Menu" className="gutter relative mt-6 flex-1">
          <ul className="grid gap-1">
            {NAV.map((n, i) => (
              <li
                key={n.href}
                className={`transition duration-500 ${open ? "translate-x-0 opacity-100" : "-translate-x-6 opacity-0"}`}
                style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" }}
              >
                <a
                  ref={i === 0 ? firstLink : undefined}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-4 py-2.5 text-[clamp(1.9rem,8.5vw,2.6rem)] font-extrabold uppercase leading-none tracking-[-0.02em]"
                >
                  <Flag arrow className="h-3 w-auto shrink-0" />
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="gutter relative grid gap-3 pb-[max(28px,env(safe-area-inset-bottom))] pt-8">
          <a href={wa(hello)} target="_blank" rel="noopener noreferrer" className="btn btn-sun">
            <WhatsApp />
            Écrire sur WhatsApp
          </a>
          <div className="grid grid-cols-2 gap-3">
            <a href={contact.phoneHref} className="btn btn-glass px-3 text-[14px]">
              <Phone />
              Appeler
            </a>
            <a href={`mailto:${contact.email}`} className="btn btn-glass px-3 text-[14px]">
              <Mail />
              E-mail
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
