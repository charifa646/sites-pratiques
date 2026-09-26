"use client";

import { contact } from "@/lib/copy";
import { whatsappDirect } from "@/lib/brief";
import { site } from "@/lib/site";
import { MailLink } from "@/components/ui/MailLink";
import { Mask, Rise } from "@/components/ui/motion";
import { BriefForm } from "./BriefForm";

export function Contact() {
  return (
    <section id="contact" data-station="contact" aria-labelledby="contact-title" className="relative">
      <div className="relative mx-auto grid min-h-[100svh] max-w-[1400px] items-center gap-10 px-5 pb-16 pt-28 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,600px)] lg:gap-16 lg:py-28">
        <div className="lg:self-start lg:pt-[8vh]">
          <Rise className="flex items-center gap-2.5 text-[12px] font-medium uppercase tracking-[0.22em] text-fog">
            <span className="h-1.5 w-1.5 rounded-full bg-acid shadow-[0_0_8px_1px_rgba(182,255,59,0.4)]" />
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
          <Rise delay={0.32} className="mt-8 flex flex-wrap items-center gap-3 text-[14px]">
            <span className="w-full text-fog">{contact.direct}</span>
            <a
              href={whatsappDirect()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2.5 text-bone transition-colors duration-300 hover:border-acid/60 hover:text-acid"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-acid" fill="currentColor" aria-hidden>
                <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.4-.3Z" />
              </svg>
              WhatsApp
            </a>
            {site.email && (
              <MailLink className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2.5 text-bone transition-colors duration-300 hover:border-acid/60 hover:text-acid">
                E-mail
              </MailLink>
            )}
          </Rise>
        </div>
        <Rise delay={0.15} blur={false}>
          <BriefForm />
        </Rise>
      </div>
    </section>
  );
}
