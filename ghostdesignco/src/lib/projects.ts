/**
 * Réalisations shown in the gallery, in order.
 * TODO(client): replace these preview entries with real projects. For each one:
 * - image: screenshot of the site placed in /public/projects/ (1600 × 1000 works best),
 * - title, type (Site vitrine, Landing page, Page de vente), summary, url.
 * Entries without an image are drawn by the 3D scene (preview mockups).
 */
export type Project = {
  title: string;
  type: string;
  summary?: string;
  url?: string;
  image?: string;
};

export const projects: Project[] = [
  { title: "Projet 01", type: "Site vitrine" },
  { title: "Projet 02", type: "Landing page" },
  { title: "Projet 03", type: "Page de vente" },
  { title: "Projet 04", type: "Site vitrine" },
];
