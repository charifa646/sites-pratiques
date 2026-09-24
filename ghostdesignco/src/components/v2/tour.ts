import { TOUR_STEPS, type Locate, type Step } from "@/lib/tour";
import { offer } from "@/lib/copy";
import { HEADER_H } from "./ui";

/** The guide's line for a stop of the 3D site's tour, word for word. */
const line = (id: string) => TOUR_STEPS.find((s) => s.id === id)?.line ?? "";

/**
 * The guided tour of the V2 page: the same guide and the same lines as the
 * 3D site, walking these sections. Sections taller than the screen are
 * swept; the three offers each get their stop (their tab opens on the way).
 */
export const V2_STEPS: Step[] = [
  { id: "top", line: line("hero") },
  { id: "preuve", line: line("proof") },
  { id: "constat", line: line("problem"), sweep: 6 },
  ...offer.items.map((o, i) => ({ id: o.anchor, line: line(`offer-${i + 1}`) })),
  { id: "realisations", line: line("work") },
  { id: "temoignages", line: line("voices") },
  { id: "methode", line: line("method") },
  { id: "tarifs", line: line("pricing") },
  { id: "questions", line: line("faq") },
  { id: "contact", line: line("contact") },
];

/** A section's top (under the header) and how much of it is pinned. */
export const locateV2: Locate = (id) => {
  const el = document.getElementById(id);
  if (!el) return { top: 0, range: 0 };
  const top = el.getBoundingClientRect().top + window.scrollY - (id === "top" ? 0 : HEADER_H - 1);
  return { top: Math.max(0, top), range: Math.max(0, el.offsetHeight - window.innerHeight) };
};
