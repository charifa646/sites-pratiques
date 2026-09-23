"use client";

import { contact, footer, nav } from "@/lib/copy";
import { diveTo } from "@/lib/scroll";
import { Logo } from "@/components/ui/Logo";
import { Mask, Rise } from "@/components/ui/motion";
import { BriefForm } from "./BriefForm";

export function Contact() {
  return (
    <section id="contact" data-station="contact" aria-labelledby="contact-title" className="relative">
      <div className="relative mx-auto grid min-h-[100svh] max-w-[1400px] items-center gap-10 px-5 pb-16 pt-28 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,600px)] lg:gap-16 lg:py-28">
        <div className="lg:self-start lg:pt-[8vh]">
          <Rise className="flex items-center gap-2.5 text-[12px] font-medium uppercase tracking-[0.22em] text-fog">
            <span className="h-1.5 w-1.5 rounded-full bg-acid shadow-[0_0_12px_2px_rgba(182,255,59,0.7)]" />
            {contact.eyebrow}
          </Rise>
          <h2
            id="contact-title"
            className="mt-5 font-display text-[clamp(2.5rem,5.6vw,5.4rem)] font-semibold leading-[0.96] tracking-[-0.04em] text-bone"
          >
            <Mask className="pb-[0.04em]">{contact.title.lead}</Mask>
            <Mask delay={0.1} className="pb-[0.1em]" innerClassName="glow pr-[0.1em] font-serif font-normal italic tracking-[-0.01em] text-acid">
              {contact.title.accent}
            </Mask>
          </h2>
          <Rise as="p" delay={0.25} className="mt-6 max-w-[26rem] text-[17px] leading-relaxed text-fog">
            {contact.text}
          </Rise>
        </div>
        <Rise delay={0.15} blur={false}>
          <BriefForm />
        </Rise>
      </div>

      <footer className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-5 py-10 text-[13px] text-fog sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <div className="flex flex-col gap-2">
            <Logo className="text-[15px]" />
            <p>{footer.line}</p>
          </div>
          <nav className="flex gap-6" aria-label="Pied de page">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={(e) => {
                  e.preventDefault();
                  diveTo(n.href.slice(1));
                }}
                className="transition-colors hover:text-bone"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <p>© {new Date().getFullYear()} Ghostdesignco</p>
        </div>
      </footer>
    </section>
  );
}
