import { contact, footer, nav } from "@/lib/content";
import { LogoStacked } from "@/components/brand/Logo";

export function Footer() {
  return (
    <footer className="bg-night text-white">
      <div className="gutter mx-auto grid max-w-page grid-cols-1 gap-12 pb-14 pt-10 lg:grid-cols-12 lg:pb-16 lg:pt-12">
        <div className="lg:col-span-5">
          <LogoStacked className="h-16 w-auto text-white" />
          <p className="mt-6 max-w-[24rem] text-[15px] leading-relaxed text-white/70">{footer.line}</p>
        </div>
        <nav aria-label="Pied de page" className="lg:col-span-3 lg:col-start-7">
          <ul className="grid gap-2.5">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="text-[15px] font-medium text-white/85 transition hover:text-sun">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="grid content-start gap-2.5 text-[15px] font-medium text-white/85 lg:col-span-3">
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
      <div className="gutter mx-auto flex max-w-page flex-col gap-2 border-t border-white/10 py-6 text-[13px] text-white/50 sm:flex-row sm:justify-between">
        <p>© 2026 VALO DIGITAL</p>
        <p>Photos d’illustration : Unsplash</p>
      </div>
    </footer>
  );
}
