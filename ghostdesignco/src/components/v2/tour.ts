import type { Locate, Step } from "@/lib/tour";
import { HEADER_H } from "./ui";

/**
 * The guided tour of the V2 page: the same guide and voice as the 3D site,
 * walking these sections. Sections taller than the screen are swept.
 */
export const V2_STEPS: Step[] = [
  { id: "top", line: "Bonjour ! Je suis votre guide. Suivez-moi, je vous fais visiter." },
  { id: "constat", line: "Un bon site fait comprendre, inspire confiance et donne envie. Regardez.", sweep: 6 },
  { id: "services", line: "Trois formats : le site vitrine, la landing page et la page de vente." },
  { id: "realisations", line: "Nos réalisations… et une place pour la vôtre." },
  { id: "temoignages", line: "Nos clients racontent leur projet, en vidéo." },
  { id: "methode", line: "Trois étapes, et votre site est en ligne en 5 à 15 jours." },
  { id: "tarifs", line: "Pas de prix standard : une proposition faite pour votre projet." },
  { id: "questions", line: "Les questions qu'on nous pose le plus souvent." },
  { id: "contact", line: "À vous ! Quelques mots suffisent pour commencer." },
];

/** A section's top (under the header) and how much of it is pinned. */
export const locateV2: Locate = (id) => {
  const el = document.getElementById(id);
  if (!el) return { top: 0, range: 0 };
  const top = el.getBoundingClientRect().top + window.scrollY - (id === "top" ? 0 : HEADER_H - 1);
  return { top: Math.max(0, top), range: Math.max(0, el.offsetHeight - window.innerHeight) };
};
