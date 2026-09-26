"use client";

import { contact } from "@/lib/copy";
import { whatsappDirect } from "@/lib/brief";
import { site } from "@/lib/site";
import { BriefForm } from "@/components/sections/BriefForm";
import { MailLink } from "@/components/ui/MailLink";
import { Rise } from "@/components/ui/motion";
import { Label } from "./ui";

const pill =
  "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2.5 text-bone transition-colors duration-300 hover:border-acid/60 hover:text-acid";

/** Dark closing band: the same brief form as the main site, on flat black. */
export function V2Contact({ n }: { n?: string }) {
  return (
    <section id="contact" aria-labelledby="v2-contact-title" data-ghost-dark className="border-t border-white/10 bg-[#0B0B0C] text-bone">
      <div className="relative">
        <div className="relative mx-auto grid max-w-[1240px] items-start gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:gap-16 lg:py-28">
          <div className="lg:pt-6">
            <Rise>
              <Label n={n} dark>
                {contact.eyebrow}
              </Label>
            </Rise>
            <Rise delay={0.05}>
              <h2 id="v2-contact-title" className="mt-5 font-display text-[clamp(2.4rem,5vw,4.6rem)] font-semibold leading-[0.98] tracking-[-0.04em]">
                {contact.title.lead}{" "}
                <span className="whitespace-nowrap pr-[0.06em] font-serif font-normal italic tracking-[-0.01em] text-acid">{contact.title.accent}</span>
              </h2>
            </Rise>
            <Rise as="p" delay={0.12} className="mt-6 max-w-[26rem] text-[17px] leading-relaxed text-fog">
              {contact.text}
            </Rise>
            <Rise delay={0.18} className="mt-8 flex flex-wrap items-center gap-3 text-[14px]">
              <span className="w-full text-fog">{contact.direct}</span>
              <a href={whatsappDirect()} target="_blank" rel="noopener noreferrer" className={pill}>
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-acid" fill="currentColor" aria-hidden>
                  <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.4-.3Z" />
                </svg>
                WhatsApp
              </a>
              {site.email && <MailLink className={pill}>E-mail</MailLink>}
            </Rise>
          </div>
          {/* the companion ends its trip peeking over the form */}
          <div data-ghost="tr" data-ghost-x="-0.6" data-ghost-y="-0.06" data-ghost-m="tr" data-ghost-mx="-0.55" data-ghost-my="-0.08" data-ghost-clip="top">
            <Rise delay={0.1} blur={false}>
              <BriefForm />
            </Rise>
          </div>
        </div>
      </div>
    </section>
  );
}
