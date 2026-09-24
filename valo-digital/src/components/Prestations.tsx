import { nb, orientation, prestations } from "@/lib/catalogue";
import { askAbout, wa } from "@/lib/links";
import { Band } from "@/components/brand/Motifs";
import { SelectToggle } from "@/components/selection/Selection";
import { ArrowRight, WhatsApp } from "@/components/ui/Icons";

type Row = (typeof prestations.rows)[number];

function More({ row }: { row: Row }) {
  if (row.href)
    return (
      <a href={row.href} className="group/more inline-flex items-center gap-1.5 text-[14px] font-bold text-electric">
        Détails
        <ArrowRight className="h-4 w-4 transition group-hover/more:translate-x-0.5" />
      </a>
    );
  return (
    <a
      href={wa(askAbout({ title: row.name, price: row.price }))}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-[14px] font-bold text-electric"
      aria-label={`En parler sur WhatsApp : ${row.name}`}
    >
      <WhatsApp className="h-4 w-4" />
      En parler
    </a>
  );
}

/** The catalogue's summary table: every service, who it is for, what it aims at, its price. */
export function Prestations() {
  const h = prestations.head;
  return (
    <section id="prestations" aria-labelledby="prestations-title" className="bg-mist py-20 lg:py-28">
      <div className="gutter mx-auto max-w-page">
        <Band as="h2" id="prestations-title">
          {prestations.band}
        </Band>
        <p data-reveal className="mt-8 max-w-[36rem] text-[19px] leading-relaxed text-body sm:text-[21px]">
          {orientation.rows[2].result}
        </p>

        {/* wide screens: the table itself */}
        <div data-reveal className="mt-12 hidden overflow-hidden rounded-[24px] border border-line bg-white shadow-[0_30px_80px_-50px_rgba(4,11,82,0.4)] md:block">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">{prestations.title}</caption>
            <thead>
              <tr className="bg-navy text-[12px] uppercase tracking-[0.12em] text-white">
                <th scope="col" className="px-6 py-4 font-bold lg:px-7">{h.name}</th>
                <th scope="col" className="px-4 py-4 font-bold">{h.who}</th>
                <th scope="col" className="px-4 py-4 font-bold">{h.goal}</th>
                <th scope="col" className="px-4 py-4 font-bold">{h.price}</th>
                <th scope="col" className="px-6 py-4 font-bold">
                  <span className="sr-only">Sélection et détails</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {prestations.rows.map((r) => (
                <tr key={r.id} className="border-t border-line align-top transition hover:bg-mist/70">
                  <th scope="row" className="px-6 py-5 text-[16px] font-extrabold leading-snug tracking-[-0.01em] text-navy lg:px-7 lg:text-[17px]">
                    {r.name}
                  </th>
                  <td className="px-4 py-5 text-[15px] leading-snug text-body">{r.who}</td>
                  <td className="px-4 py-5 text-[15px] leading-snug text-body">{r.goal}</td>
                  <td className="price px-4 py-5 text-[16px] leading-snug">{nb(r.price)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-4">
                      <More row={r} />
                      <SelectToggle id={r.id} compact />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* phones: one card per line of the table */}
        <ul className="mt-10 grid grid-cols-1 gap-3 md:hidden">
          {prestations.rows.map((r) => (
            <li key={r.id} data-reveal className="rounded-[20px] border border-line bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-[18px] font-extrabold leading-snug tracking-[-0.01em] text-navy">{r.name}</h3>
                <SelectToggle id={r.id} compact className="-mr-1 -mt-1" />
              </div>
              <dl className="mt-3 grid gap-2 text-[15px] leading-snug">
                <div>
                  <dt className="eyebrow text-[11px] text-body/60">{h.who}</dt>
                  <dd className="mt-0.5 text-body">{r.who}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-[11px] text-body/60">{h.goal}</dt>
                  <dd className="mt-0.5 text-body">{r.goal}</dd>
                </div>
              </dl>
              <div className="mt-4 flex items-end justify-between gap-4 border-t border-line pt-4">
                <p className="price text-[17px] leading-snug">{nb(r.price)}</p>
                <div className="shrink-0">
                  <More row={r} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
