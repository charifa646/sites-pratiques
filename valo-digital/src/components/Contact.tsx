import { brand, contact } from "@/lib/catalogue";
import { hello, mail, wa } from "@/lib/links";
import { Band } from "@/components/brand/Motifs";
import { Mail, Phone, Pin, WhatsApp } from "@/components/ui/Icons";

const rows = [
  { label: "Téléphone", value: contact.phone, href: contact.phoneHref, icon: Phone },
  { label: "WhatsApp", value: contact.phone, href: wa(hello), icon: WhatsApp, external: true },
  { label: "E-mail", value: contact.email, href: mail("Demande d’informations", hello), icon: Mail },
  { label: "Adresse", value: contact.address, href: contact.mapHref, icon: Pin, external: true },
];

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative bg-white py-20 lg:py-28">
      <div className="gutter mx-auto max-w-page">
        <Band as="h2" id="contact-title">
          Contact
        </Band>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:mt-16 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16">
          <div data-reveal>
            <p className="relative pl-5 text-[clamp(2rem,10.4vw,6.2rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.03em] text-navy sm:pl-7 lg:pl-9">
              <span aria-hidden className="absolute bottom-2 left-0 top-2 w-[6px] bg-sun lg:w-[10px]" />
              Votre croissance <span className="text-electric">maintenant</span>
            </p>
            <ul className="mt-8 grid gap-1.5 text-[17px] font-medium text-body sm:text-[19px]">
              {brand.subtitles.map((s) => (
                <li key={s} className="flex items-baseline gap-3">
                  <span aria-hidden className="h-[7px] w-[7px] shrink-0 translate-y-[-2px] rounded-full bg-electric" />
                  {s}
                </li>
              ))}
            </ul>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href={wa(hello)} target="_blank" rel="noopener noreferrer" className="btn btn-blue">
                <WhatsApp />
                Écrire sur WhatsApp
              </a>
              <a href={contact.phoneHref} className="btn btn-line">
                <Phone />
                Appeler le {contact.phone}
              </a>
            </div>
          </div>

          <div data-reveal style={{ ["--d" as string]: "0.1s" }} className="relative overflow-hidden rounded-[28px] bg-night p-7 text-white sm:p-9">
            <div className="flex items-center gap-5">
              <span aria-hidden className="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-full bg-sun text-[24px] font-extrabold tracking-[-0.02em] text-navy ring-4 ring-sun/25">
                {contact.initials}
              </span>
              <div>
                <p className="text-[20px] font-extrabold leading-tight tracking-[-0.01em] sm:text-[22px]">{contact.name}</p>
                <p className="mt-1 text-[14px] leading-snug text-white/75">{contact.role}</p>
              </div>
            </div>
            <ul className="mt-8 grid gap-2">
              {rows.map(({ label, value, href, icon: Icon, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex items-center gap-4 rounded-[16px] px-3 py-3 transition hover:bg-white/10"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 text-sun ring-1 ring-white/15 transition group-hover:bg-sun group-hover:text-navy">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="eyebrow block text-[11px] text-white/60">{label}</span>
                      <span className="block truncate text-[16px] font-semibold sm:text-[17px]">{value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
