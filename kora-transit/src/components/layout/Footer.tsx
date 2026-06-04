import Link from "next/link";
import type { SVGProps } from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { navLinks, site } from "@/lib/data";

/* Brand glyphs as inline SVG (lucide no longer ships brand logos). */
function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34V22c4.78-.79 8.43-4.94 8.43-9.94Z" />
    </svg>
  );
}
function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      aria-hidden
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.74v20.52C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.74V1.74C24 .78 23.2 0 22.22 0Z" />
    </svg>
  );
}
function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.22-6.82-5.96 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.01 4.13H5.04l12.04 15.64Z" />
    </svg>
  );
}

const socials = [
  { Icon: FacebookIcon, label: "Facebook" },
  { Icon: InstagramIcon, label: "Instagram" },
  { Icon: LinkedinIcon, label: "LinkedIn" },
  { Icon: XIcon, label: "X" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line/60 bg-navy-deep">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[40rem] -translate-x-1/2 rounded-full bg-gold/10 blur-[120px]" />

      <div className="shell relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4 lg:py-20">
        <div className="flex flex-col gap-5">
          <Link href="/" className="font-display text-xl font-extrabold tracking-tight">
            <span className="text-gold">KORA</span> <span className="text-ink">TRANSIT</span>
          </Link>
          <p className="font-display text-lg text-ink/90">{site.sloganPrincipal}</p>
          <div className="flex gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className="grid h-10 w-10 place-items-center rounded-full border border-line/70 text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/60 hover:text-gold"
              >
                <s.Icon className="h-[18px] w-[18px]" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            Navigation
          </h3>
          <ul className="flex flex-col gap-3">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-muted transition-colors hover:text-ink"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            Coordonnées
          </h3>
          <ul className="flex flex-col gap-4 text-sm text-muted">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-[18px] w-[18px] shrink-0 text-gold/80" />
              <span>{site.siege}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-[18px] w-[18px] shrink-0 text-gold/80" />
              <a
                href={`tel:${site.phone.replace(/\s/g, "")}`}
                className="transition-colors hover:text-ink"
              >
                {site.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-[18px] w-[18px] shrink-0 text-gold/80" />
              <a href={`mailto:${site.email}`} className="transition-colors hover:text-ink">
                {site.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Clock className="h-[18px] w-[18px] shrink-0 text-gold/80" />
              <span>{site.horaires}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line/60">
        <div className="shell flex flex-col gap-4 py-7 text-xs text-muted/80 md:flex-row md:items-center md:justify-between">
          <p>{site.copyright}</p>
          <p id="mentions" className="max-w-xl md:text-right">
            {site.legal}
          </p>
        </div>
      </div>
    </footer>
  );
}
