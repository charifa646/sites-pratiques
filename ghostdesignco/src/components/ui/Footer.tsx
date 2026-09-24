"use client";

import { cta, footer } from "@/lib/copy";
import { whatsappDirect } from "@/lib/brief";
import { diveTo } from "@/lib/scroll";
import { site } from "@/lib/site";
import { Logo } from "./Logo";

const link = "text-[15px] text-fog transition-colors duration-300 hover:text-bone";

/**
 * Footer in the spirit of the reference the client liked: logo and two-line
 * baseline, link columns, a status line, the name set huge in a silver
 * gradient (mirrored like the floor of the dive), then the legal line.
 */
export function Footer({ home = true }: { home?: boolean }) {
  // On the home page anchors dive through the world; elsewhere they navigate.
  const go = (hash: string) => (e: React.MouseEvent) => {
    if (!home) return;
    e.preventDefault();
    diveTo(hash.slice(1));
  };
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-white/10 bg-gradient-to-b from-void/40 to-void">
      <div className="mx-auto max-w-[1400px] px-5 pt-20 sm:px-10">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)]">
          <div>
            <a href="/#top" onClick={go("#top")} className="inline-block text-[20px]" aria-label="Ghostdesignco, retour en haut">
              <Logo />
            </a>
            <p className="mt-8 text-[clamp(1.3rem,2vw,1.7rem)] leading-[1.35] text-fog">
              {footer.tagline.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-4">
            {footer.columns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <p className="text-[17px] font-medium text-bone">{col.title}</p>
                <ul className="mt-6 space-y-4">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <a href={`/${l.href}`} onClick={go(l.href)} className={link}>
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
            <nav aria-label={footer.contactTitle}>
              <p className="text-[17px] font-medium text-bone">{footer.contactTitle}</p>
              <ul className="mt-6 space-y-4">
                <li>
                  <a href="/#contact" onClick={go("#contact")} className={link}>
                    {cta.quote}
                  </a>
                </li>
                <li>
                  <a href={whatsappDirect()} target="_blank" rel="noopener noreferrer" className={link}>
                    WhatsApp <span aria-hidden className="text-[0.8em]">↗</span>
                  </a>
                </li>
                {site.email && (
                  <li>
                    <a href={`mailto:${site.email}`} className={link}>
                      E-mail
                    </a>
                  </li>
                )}
              </ul>
            </nav>
            <nav aria-label={footer.social}>
              <p className="text-[17px] font-medium text-bone">{footer.social}</p>
              <ul className="mt-6 space-y-4">
                {site.social.map((s) => (
                  <li key={s.href}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className={link}>
                      {s.label} <span aria-hidden className="text-[0.8em]">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <p className="mt-16 flex items-center gap-3 text-[14px] text-fog">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-acid/60 [animation-duration:2.2s] motion-reduce:hidden" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-acid" />
          </span>
          {footer.status}
        </p>

        <svg viewBox="0 0 1180 196" className="mt-12 block w-full select-none" role="img" aria-label="Ghostdesignco">
          <defs>
            <linearGradient id="wordmark-fill" x1="0" y1="0" x2="0" y2="1">
              {/* colours from the page palette (globals.css), in style: attributes do not read variables */}
              <stop offset="0" style={{ stopColor: "rgb(var(--c-bone))" }} />
              <stop offset="0.55" style={{ stopColor: "rgb(var(--c-steel))" }} />
              <stop offset="1" style={{ stopColor: "rgb(var(--c-coal))" }} />
            </linearGradient>
            <linearGradient id="wordmark-mirror" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0.35" style={{ stopColor: "rgb(var(--c-bone))", stopOpacity: 0 }} />
              <stop offset="1" stopColor="#B6FF3B" stopOpacity="0.16" />
            </linearGradient>
          </defs>
          <text
            x="0"
            y="122"
            fontSize="150"
            textLength="1180"
            lengthAdjust="spacing"
            fill="url(#wordmark-fill)"
            style={{ fontFamily: "var(--font-clash)", fontWeight: 600, letterSpacing: "-0.04em" }}
          >
            GHOSTDESIGNCO
          </text>
          <g transform="translate(0 252) scale(1 -1)" aria-hidden>
            <text
              x="0"
              y="122"
              fontSize="150"
              textLength="1180"
              lengthAdjust="spacing"
              fill="url(#wordmark-mirror)"
              style={{ fontFamily: "var(--font-clash)", fontWeight: 600, letterSpacing: "-0.04em" }}
            >
              GHOSTDESIGNCO
            </text>
          </g>
        </svg>

        <div className="flex flex-col gap-4 border-t border-white/10 py-8 text-[14px] text-fog sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Ghostdesignco. {footer.rights}
          </p>
          <a href="/mentions-legales" className="transition-colors duration-300 hover:text-bone">
            {footer.legal}
          </a>
        </div>
      </div>
    </footer>
  );
}
