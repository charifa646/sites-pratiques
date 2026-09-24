import { closing, contact } from "@/lib/content";
import { hello, mail, wa } from "@/lib/links";
import { Wave } from "@/components/Wave";
import { Phone, WhatsApp } from "@/components/ui/Icons";

const rows = [
  { label: "Téléphone et WhatsApp", value: contact.phone, href: contact.phoneHref },
  { label: "E-mail", value: contact.email, href: mail("Demande d’informations", hello) },
  { label: "Adresse", value: contact.address, href: contact.mapHref, external: true },
];

/** The last word: talk to us, and who you will be talking to. */
export function Closing() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative bg-electric pb-32 pt-10 text-white lg:pb-44 lg:pt-16">
      <div className="gutter mx-auto grid max-w-page grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
        <div data-reveal className="lg:col-span-7">
          <h2 id="contact-title" className="relative pl-5 text-[clamp(2.6rem,9vw,5.6rem)] font-extrabold leading-[0.95] tracking-[-0.04em] sm:pl-7 lg:pl-9">
            <span aria-hidden className="absolute bottom-[0.12em] left-0 top-[0.14em] w-[6px] bg-sun lg:w-[9px]" />
            {closing.title[0]}
            <br />
            {closing.title[1]}
          </h2>
          <p className="mt-7 max-w-[30rem] text-[19px] leading-[1.6] text-white/90 lg:text-[20px]">{closing.text}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href={wa(hello)} target="_blank" rel="noopener noreferrer" className="btn btn-sun">
              <WhatsApp />
              {closing.whatsapp}
            </a>
            <a href={contact.phoneHref} className="btn btn-ghost">
              <Phone />
              {closing.call}
            </a>
          </div>
        </div>

        <div data-reveal style={{ ["--d" as string]: "0.1s" }} className="lg:col-span-4 lg:col-start-9 lg:pt-4">
          <p className="text-[20px] font-extrabold leading-tight tracking-[-0.015em]">{contact.name}</p>
          <p className="mt-1.5 text-[15px] leading-snug text-white/75">{contact.role}</p>
          <dl className="mt-8 grid gap-5 border-t border-white/25 pt-7">
            {rows.map((r) => (
              <div key={r.label}>
                <dt className="text-[13px] font-semibold text-white/65">{r.label}</dt>
                <dd className="mt-1">
                  <a
                    href={r.href}
                    {...(r.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="text-[18px] font-semibold underline decoration-white/30 underline-offset-[5px] transition hover:decoration-sun"
                  >
                    {r.value}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <Wave fill="#040B52" flip />
    </section>
  );
}
