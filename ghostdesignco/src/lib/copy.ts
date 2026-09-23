/**
 * Ghostdesignco copy (French). Built from the client's brief; wording tightened
 * for rhythm and scannability. Facts (15+ projets, 3 ans) are the client's own.
 */

export const brand = {
  name: "Ghostdesignco",
  baseline: "Sites web sur mesure",
};

export const nav = [
  { label: "Le constat", href: "#constat" },
  { label: "L'offre", href: "#offre" },
  { label: "Contact", href: "#contact" },
];

export const cta = {
  primary: "Parlons de votre projet",
  secondary: "Découvrir l'offre",
  service: "Discutons de votre projet",
};

export const hero = {
  eyebrow: "Création de sites sur mesure",
  // Headline split so the last word can carry the accent.
  title: { lead: "Des sites qui donnent envie de", accent: "rester." },
  text: "Ghostdesignco crée des sites web sur mesure pour les entrepreneurs et les entreprises qui veulent une présence en ligne aussi soignée que leur activité.",
  scroll: "Plongez",
};

export const proof = {
  eyebrow: "En chiffres",
  stats: [
    { value: 15, suffix: "+", label: "projets réalisés" },
    { value: 3, suffix: " ans", label: "d'expérience" },
  ],
};

export const problem = {
  eyebrow: "Le constat",
  title: "Votre site ne devrait pas simplement exister.",
  text: "Il doit faire comprendre ce que vous faites, inspirer confiance et donner envie d'aller plus loin.",
  // The three jobs of a site, taken from the sentence above.
  pillars: ["Faire comprendre", "Inspirer confiance", "Donner envie"],
  kicker: "Sinon, à quoi sert-il ?",
};

export const offer = {
  eyebrow: "L'offre",
  title: "Ce que nous créons.",
  items: [
    {
      n: "01",
      id: "vitrine",
      title: "Sites vitrines",
      text: "Un site sur mesure pour présenter votre activité, vos services et votre univers.",
    },
    {
      n: "02",
      id: "landing",
      title: "Landing pages",
      text: "Une page conçue autour d'une action précise : réserver, s'inscrire, acheter ou vous contacter.",
    },
    {
      n: "03",
      id: "vente",
      title: "Pages de vente",
      text: "Une page structurée pour présenter votre offre et accompagner la décision d'achat.",
    },
  ],
};

export const contact = {
  eyebrow: "Faisons connaissance",
  title: { lead: "Et si on créait", accent: "votre reflet ?" },
  text: "Quelques mots suffisent pour commencer quelque chose de grand.",
  fields: {
    name: { label: "Votre nom", placeholder: "Alex Martin" },
    email: { label: "Votre e-mail", placeholder: "alex@entreprise.fr" },
    need: { label: "Votre besoin" },
    budget: { label: "Budget envisagé" },
    idea: { label: "Racontez-nous votre idée", placeholder: "Votre marque, vos ambitions, ce que vous imaginez…" },
  },
  needs: ["Site vitrine", "Landing page", "Page de vente", "Je ne sais pas encore"],
  budgets: ["Moins de 1 500 €", "1 500 – 3 000 €", "3 000 – 5 000 €", "Plus de 5 000 €", "À définir ensemble"],
  submit: "Préparer mon message",
  note: "Simple et sans engagement. Vous pourrez relire votre brief avant de l'envoyer depuis votre messagerie.",
  review: {
    title: "Votre brief est prêt.",
    text: "Relisez-le, puis envoyez-le par le canal de votre choix.",
    whatsapp: "Envoyer sur WhatsApp",
    email: "Envoyer par e-mail",
    edit: "Modifier",
  },
  errors: {
    name: "Indiquez votre nom.",
    idea: "Dites-nous quelques mots sur votre projet.",
    email: "Cette adresse e-mail semble incomplète.",
  },
};

export const footer = {
  line: "Sites web sur mesure pour entrepreneurs et entreprises.",
};

/** Map an offer id to the matching "besoin" option of the form. */
export const needForOffer: Record<string, string> = {
  vitrine: "Site vitrine",
  landing: "Landing page",
  vente: "Page de vente",
};
