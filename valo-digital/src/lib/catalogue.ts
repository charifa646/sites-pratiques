/**
 * Everything the site says comes from the catalogue (PDF) and its 2026 cover.
 * Nothing here is invented: the words are the catalogue's, accents restored.
 */

export const brand = {
  name: "VALO DIGITAL",
  baseline: "Agence de croissance digitale",
  slogan: "Votre croissance maintenant",
  subtitles: ["Agence de croissance digitale", "Centre de formation aux métiers du numérique"],
  year: "Catalogue de formations 2026",
  title: "Catalogue des formations et solutions de croissance",
  pillars: ["Publicité", "Marketing", "Vente", "Formations"],
  promise: [
    { lead: "Développez vos", key: "compétences." },
    { lead: "Structurez votre", key: "activité." },
    { lead: "Accélérez votre", key: "croissance." },
  ],
  intro:
    "Agence de croissance digitale basée à Ouagadougou, VALO DIGITAL accompagne les entrepreneurs, TPE, PME, équipes et institutions dans la structuration de leur présence digitale, l’acquisition de prospects et le développement des ventes.",
  audience: ["Entrepreneurs", "TPE", "PME", "Équipes", "Institutions"],
  footer: "VALO DIGITAL – Une agence de croissance digitale",
};

export const contact = {
  name: "Gueswendyam Valentin WAONGO",
  initials: "GW",
  role: "Consultant formateur aux métiers du digital – Fondateur VALO DIGITAL",
  phone: "+226 54 27 77 52",
  phoneHref: "tel:+22654277752",
  whatsapp: "22654277752",
  email: "contact@valodigitalbf.com",
  address: "Wemtenga, Ouagadougou",
  mapHref: "https://www.google.com/maps/search/?api=1&query=Wemtenga%2C%20Ouagadougou",
};

export type Item = {
  id: string;
  title: string;
  price: string;
  kind: "Formation" | "Offre" | "Solution" | "Prestation";
};

export const orientation = {
  band: "Orientation du catalogue",
  title: "Lecture rapide du catalogue",
  head: { need: "Besoin client", solution: "Solution VALO DIGITAL", result: "Résultat attendu" },
  rows: [
    {
      need: "Apprendre",
      solution: "Formations pratiques",
      result: "Monter en compétence et appliquer directement les méthodes.",
      href: "#formations",
      cta: "Voir les formations",
    },
    {
      need: "Comprendre ce qui bloque",
      solution: "Diagnostic digital et plan de croissance",
      result: "Identifier les priorités et repartir avec un plan d’action.",
      href: "#diagnostic",
      cta: "Voir le diagnostic",
    },
    {
      need: "Déléguer l’exécution",
      solution: "Prestations digitales",
      result: "Installer une présence professionnelle et générer de l’acquisition.",
      href: "#prestations",
      cta: "Voir les prestations",
    },
    {
      need: "Construire et piloter la croissance",
      solution: "Accompagnement business et croissance",
      result: "Structurer l’offre, les canaux, les ventes et les indicateurs.",
      href: "#accompagnement",
      cta: "Voir l’accompagnement",
    },
  ],
};

export type Formation = Item & { format: string; modules: string[] };

const formation = (id: string, title: string, format: string, modules: string[], price: string): Formation => ({
  id,
  title,
  format,
  modules,
  price,
  kind: "Formation",
});

export const formations = {
  band: "Formations",
  title: "Formations",
  head: { format: "Format", modules: "Modules principaux", price: "Tarif" },
  items: [
    formation(
      "ads",
      "Facebook et Instagram Ads avancé",
      "Formation pratique",
      ["Page Facebook", "Meta Business Suite", "Business Manager", "ciblage", "campagnes", "budget", "analyse et optimisation"],
      "75 000 F CFA",
    ),
    formation(
      "vente",
      "Vente en ligne",
      "Formation pratique",
      ["Facebook", "TikTok", "WhatsApp Business", "acquisition clients", "contenus", "messages de vente", "tunnel WhatsApp"],
      "65 000 F CFA",
    ),
    formation(
      "marketing",
      "Marketing digital",
      "Formation ou accompagnement",
      ["Stratégie digitale", "positionnement", "acquisition", "contenu", "réseaux sociaux", "conversion", "plan d’action"],
      "65 000 F CFA",
    ),
    formation(
      "ia",
      "Intelligence artificielle pour le business",
      "Formation pratique",
      ["ChatGPT", "création de contenus", "recherche", "productivité", "prompts business", "automatisation des tâches"],
      "65 000 F CFA",
    ),
    formation(
      "contenu",
      "Création de contenu",
      "Formation pratique",
      ["Stratégie de contenu", "idées", "copywriting", "visuels", "vidéos", "calendrier éditorial", "contenu qui vend"],
      "50 000 F CFA",
    ),
    formation(
      "cm",
      "Community management",
      "Formation pratique",
      ["Stratégie réseaux sociaux", "création", "publication", "animation", "engagement", "Meta Business Suite", "reporting"],
      "Tarif selon format",
    ),
    formation(
      "cohorte",
      "Cohorte métiers du digital",
      "2 mois",
      ["Community management", "création de contenu", "Facebook Ads", "Canva", "IA", "vente en ligne", "mise en pratique"],
      "150 000 F CFA",
    ),
    formation(
      "prive",
      "Accompagnement privé",
      "Individuel",
      ["Diagnostic", "stratégie", "offre", "acquisition", "Facebook Ads", "contenu", "IA", "plan d’action personnalisé"],
      "50 000 à 100 000 F CFA",
    ),
  ],
};

export const prestations = {
  band: "Prestations VALO DIGITAL",
  title: "Prestations",
  head: { name: "Prestation", who: "Pour qui", goal: "Objectif principal", price: "Tarif" },
  rows: [
    {
      id: "standard",
      name: "Gestion réseaux sociaux – Standard",
      who: "Entreprises souhaitant être régulières",
      goal: "Présence digitale professionnelle",
      price: "À partir de 80 000 F/mois",
      href: "#offre-standard",
    },
    {
      id: "business",
      name: "Gestion réseaux sociaux – Business",
      who: "Entreprises en développement",
      goal: "Visibilité et acquisition",
      price: "À partir de 150 000 F/mois",
      href: "#offre-business",
    },
    {
      id: "premium",
      name: "Gestion réseaux sociaux – Premium Growth",
      who: "Entreprises ambitieuses",
      goal: "Visibilité, acquisition et croissance",
      price: "À partir de 300 000 F/mois",
      href: "#offre-premium-growth",
    },
    {
      id: "video",
      name: "Content vidéo",
      who: "Marques, experts, entreprises",
      goal: "Visibilité et contenu",
      price: "À partir de 80 000 F / 4 vidéos",
      href: "#content-video",
    },
    {
      id: "pub",
      name: "Publicité Facebook et Instagram",
      who: "Entreprises souhaitant acquérir",
      goal: "Prospects ou ventes",
      price: "À partir de 100 000 F hors budget publicitaire",
      href: "#publicite",
    },
    {
      id: "diagnostic",
      name: "Diagnostic digital",
      who: "TPE, PME, entrepreneurs",
      goal: "Identifier les blocages",
      price: "150 000 F",
      href: "#diagnostic",
    },
    {
      id: "accompagnement",
      name: "Accompagnement business et croissance",
      who: "Dirigeants et entrepreneurs",
      goal: "Structurer et accélérer",
      price: "À partir de 150 000 F",
      href: "#accompagnement",
    },
    {
      id: "direction",
      name: "Direction marketing externalisée",
      who: "Entreprises en croissance",
      goal: "Pilotage marketing, coordination, acquisition, KPI et reporting",
      price: "À partir de 750 000 F",
    },
  ],
};

export type Offer = Item & { anchor: string; name: string; text: string; points: string[] };

const offer = (id: string, anchor: string, name: string, text: string, points: string[], price: string, kind: Item["kind"] = "Offre"): Offer => ({
  id,
  anchor,
  name,
  title: name,
  text,
  points,
  price,
  kind,
});

export const social = {
  band: "Gestion des réseaux sociaux",
  title: "Offres de gestion des réseaux sociaux",
  offers: [
    offer(
      "standard",
      "offre-standard",
      "Offre Standard",
      "Pour maintenir une présence professionnelle et régulière.",
      ["Stratégie éditoriale de base", "Calendrier de contenu", "Publications régulières", "Création de visuels", "Animation et modération", "Suivi mensuel"],
      "À partir de 80 000 F CFA / mois",
    ),
    offer(
      "business",
      "offre-business",
      "Offre Business",
      "Pour transformer les réseaux sociaux en outil de communication et d’acquisition.",
      [
        "Audit et stratégie digitale",
        "Calendrier éditorial",
        "Création de contenus",
        "Visuels professionnels et contenus vidéo",
        "Programmation, animation et modération",
        "Reporting mensuel",
      ],
      "À partir de 150 000 F CFA / mois",
    ),
    offer(
      "premium",
      "offre-premium-growth",
      "Offre Premium Growth",
      "Pour soutenir la croissance avec une gestion complète et optimisée.",
      [
        "Stratégie digitale",
        "Gestion complète des réseaux sociaux",
        "Production de contenus vidéo",
        "Community management",
        "Publicité Facebook et Instagram",
        "Reporting stratégique et optimisation continue",
      ],
      "À partir de 300 000 F CFA / mois",
    ),
  ],
  ads: offer(
    "pub",
    "publicite",
    "Gestion publicitaire Facebook et Instagram",
    "Générer plus de visibilité, de prospects ou de ventes avec des campagnes pilotées.",
    [
      "Audit du compte publicitaire",
      "Stratégie publicitaire",
      "Définition des objectifs",
      "Ciblage",
      "Création et paramétrage des campagnes",
      "Suivi, optimisation et reporting",
    ],
    "À partir de 100 000 F CFA hors budget publicitaire",
  ),
};

export const solutions = {
  band: "Solutions spécialisées",
  title: "Solutions spécialisées",
  items: [
    offer(
      "video",
      "content-video",
      "Content vidéo",
      "Transformer l’expertise, les produits et les offres en vidéos adaptées aux réseaux sociaux.",
      ["Recherche d’idées", "Stratégie de contenu", "Scripts", "Tournage ou production", "Montage et sous-titrage", "Adaptation aux plateformes"],
      "À partir de 80 000 F CFA pour 4 vidéos",
      "Solution",
    ),
    offer(
      "diagnostic",
      "diagnostic",
      "Diagnostic digital et plan de croissance",
      "Comprendre pourquoi la présence digitale ne produit pas suffisamment de résultats.",
      [
        "Analyse du positionnement",
        "Analyse de l’offre",
        "Audit des réseaux sociaux et contenus",
        "Analyse de l’acquisition et du parcours client",
        "Recommandations prioritaires",
        "Plan d’action personnalisé",
      ],
      "150 000 F CFA",
      "Solution",
    ),
    offer(
      "accompagnement",
      "accompagnement",
      "Accompagnement business et croissance",
      "Accompagner les dirigeants dans la construction et la mise en œuvre de leur stratégie.",
      ["Positionnement et offre", "Acquisition et marketing", "Contenu et publicité", "Vente et parcours client", "KPI et plan d’action", "Optimisation continue"],
      "À partir de 150 000 F CFA",
      "Solution",
    ),
  ],
};

export const methode = {
  band: "Méthode",
  title: "Approche VALO DIGITAL",
  head: { step: "Étape", role: "Rôle", brings: "Ce que cela apporte" },
  steps: [
    { step: "Comprendre", role: "Partir de la situation réelle du client.", brings: "Une lecture claire du contexte, des forces et des blocages." },
    { step: "Structurer", role: "Identifier les priorités et construire une stratégie.", brings: "Un cadre d’action simple, cohérent et exploitable." },
    { step: "Exécuter", role: "Mettre en œuvre les méthodes et outils adaptés.", brings: "Des actions concrètes sur les bons canaux." },
    { step: "Optimiser", role: "Mesurer les résultats et améliorer ce qui doit l’être.", brings: "Une progression continue orientée performance." },
  ],
};

/** Everything a visitor can add to their selection, by id. */
export const catalogueItems: Record<string, Item> = Object.fromEntries(
  [
    ...formations.items,
    ...social.offers,
    social.ads,
    ...solutions.items,
    { id: "direction", title: "Direction marketing externalisée", price: "À partir de 750 000 F", kind: "Prestation" as const },
  ].map((i) => [i.id, { id: i.id, title: i.title, price: i.price, kind: i.kind }]),
);

/** Prices never break between the digits or before the currency. */
export const nb = (s: string) => s.replace(/(\d) (\d{3})/g, "$1 $2").replace(/ (F|CFA|à|\/)(?=[\s/]|$)/g, " $1");
