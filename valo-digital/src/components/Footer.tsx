import { brand, contact } from "@/lib/catalogue";
import { LogoStacked } from "@/components/brand/Logo";
import { Flag } from "@/components/brand/Motifs";
import { NAV } from "@/lib/nav";

export function Footer() {
  return (
    <footer className="bg-night text-white">
      <div className="gutter mx-auto grid max-w-page grid-cols-1 gap-12 py-16 lg:grid-cols-[1.3fr_1fr_1fr] lg:py-20">
        <div>
          <LogoStacked className="h-20 w-auto text-white" />
          <p className="mt-6 max-w-[22rem] text-[16px] leading-relaxed text-white/75">{brand.footer}</p>
        </div>
        <nav aria-label="Pied de page">
          <p className="eyebrow text-sun">Catalogue</p>
          <ul className="mt-4 grid gap-2.5">
            {[{ href: "#orientation", label: "Orientation" }, ...NAV.filter((n) => n.href !== "#contact")].map((n) => (
              <li key={n.href}>
                <a href={n.href} className="text-[16px] font-medium text-white/85 transition hover:text-sun">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="eyebrow text-sun">Contact</p>
          <ul className="mt-4 grid gap-2.5 text-[16px] font-medium text-white/85">
            <li>
              <a href={contact.phoneHref} className="transition hover:text-sun">
                {contact.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className="break-all transition hover:text-sun">
                {contact.email}
              </a>
            </li>
            <li>{contact.address}</li>
          </ul>
        </div>
      </div>

      {/* the cover's last line: the flag, the name of the catalogue, the long yellow bar */}
      <div className="bg-white text-electric">
        <div className="gutter mx-auto flex max-w-page items-center gap-4 py-4 sm:gap-6">
          <Flag className="h-5 w-auto shrink-0 sm:h-6" />
          <p className="min-w-0 text-[11px] font-medium uppercase tracking-[0.04em] sm:text-[13px] sm:tracking-[0.06em]">
            Catalogue de formations <b className="font-extrabold">2026</b>
          </p>
          <span aria-hidden className="h-4 min-w-[24px] flex-1 bg-sun sm:h-5" />
        </div>
      </div>
      <div className="gutter mx-auto flex max-w-page flex-col gap-2 py-5 text-[13px] text-white/55 sm:flex-row sm:justify-between">
        <p>© 2026 {brand.name}</p>
        <p>Photos d’illustration : Unsplash</p>
      </div>
    </footer>
  );
}
