/**
 * Ghostdesignco copy (French). Built from the client's brief and answers;
 * wording tightened for rhythm and scannability. Facts (15+ projets, 3 ans,
 * 5 à 15 jours, livraison express, domaine et hébergement, maintenance,
 * textes rédigés puis validés) are the client's own.
 */

export const brand = {
  name: "Ghostdesignco",
  baseline: "Sites web sur mesure",
};

export const nav = [
  { label: "Services", href: "#services" },
  { label: "Réalisations", href: "#realisations" },
  { label: "Méthode", href: "#methode" },
  { label: "Tarifs", href: "#tarifs" },
];

/** Full list for the mobile menu (the desktop bar keeps the four above). */
export const menu = [
  { label: "Services", href: "#services" },
  { label: "Réalisations", href: "#realisations" },
  { label: "Témoignages", href: "#temoignages" },
  { label: "Méthode", href: "#methode" },
  { label: "Tarifs", href: "#tarifs" },
  { label: "Questions fréquentes", href: "#questions" },
];

/** One name for the main action everywhere, a quieter one for exploring. */
export const cta = {
  quote: "Demander un devis",
  quoteShort: "Devis",
  secondary: "Découvrir nos services",
};

export const hero = {
  eyebrow: "Création de site web sur mesure",
  // Headline split so the last word can carry the accent.
  title: { lead: "Des sites qui donnent envie de", accent: "rester." },
  text: "Ghostdesignco crée des sites web sur mesure pour les entrepreneurs et les entreprises qui veulent une présence en ligne aussi soignée que leur activité.",
  reassurance: ["Sans engagement", "En ligne en 5 à 15 jours"],
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
  eyebrow: "Services",
  title: "Ce que nous créons.",
  items: [
    {
      n: "01",
      id: "vitrine",
      anchor: "sites-vitrines",
      title: "Sites vitrines",
      text: "Un site sur mesure pour présenter votre activité, vos services et votre univers.",
    },
    {
      n: "02",
      id: "landing",
      anchor: "landing-pages",
      title: "Landing pages",
      text: "Une page conçue autour d'une action précise : réserver, s'inscrire, acheter ou vous contacter.",
    },
    {
      n: "03",
      id: "vente",
      anchor: "pages-de-vente",
      title: "Pages de vente",
      text: "Une page structurée pour présenter votre offre et accompagner la décision d'achat.",
    },
  ],
};

export const work = {
  eyebrow: "Réalisations",
  title: { lead: "Des sites qui", accent: "travaillent." },
  text: "Une sélection de projets récents, chacun pensé pour l'activité de son client.",
  next: {
    title: "Le prochain, c'est le vôtre ?",
    text: "Parlez-nous de votre activité : on imagine le site qui lui ressemble.",
  },
  visit: "Voir le site",
};

export const voices = {
  eyebrow: "Témoignages",
  title: { lead: "Ils en parlent", accent: "mieux que nous." },
  text: "Nos clients racontent leur projet, en vidéo.",
  placeholder: { title: "Témoignage vidéo", text: "Bientôt en ligne" },
  play: "Lire le témoignage de",
};

export const method = {
  eyebrow: "Méthode",
  title: "De l'idée au site en ligne.",
  lead: "En 5 à 15 jours, selon la complexité de votre projet.",
  steps: [
    {
      n: "01",
      title: "Échange",
      line: "On parle de votre projet.",
      detail: "Un appel pour comprendre votre activité, vos objectifs et vos envies.",
    },
    {
      n: "02",
      title: "Création",
      line: "On conçoit et développe le site.",
      detail: "Nous rédigeons les textes et créons le design. Vous validez avant la suite.",
    },
    {
      n: "03",
      title: "Mise en ligne",
      line: "Vous validez. On met en ligne.",
      detail: "Nom de domaine et hébergement compris, selon votre situation.",
    },
  ],
};

export const pricing = {
  eyebrow: "Tarifs",
  title: "Pas de tarif standard.",
  sub: "Chaque projet est différent.",
  text: "Parlons de votre besoin et construisons une proposition adaptée à votre projet.",
  perks: ["En ligne en 5 à 15 jours", "Livraison express possible", "Sans engagement"],
};

export const faq = {
  eyebrow: "Questions fréquentes",
  title: "Vous vous demandez sûrement…",
  items: [
    {
      q: "En combien de temps mon site sera-t-il en ligne ?",
      a: "En général entre 5 et 15 jours, selon la complexité du projet. Besoin d'aller plus vite ? Une livraison express est possible, avec un supplément.",
    },
    {
      q: "Pourrai-je modifier mon site moi-même ?",
      a: "Oui, si vous le souhaitez : on vous donne la main pour faire vos modifications. Vous préférez ne pas y toucher ? On propose aussi la maintenance, et on s'en occupe pour vous.",
    },
    {
      q: "Qui écrit les textes du site ?",
      a: "Nous. Les textes sont rédigés pour vous, puis vous les validez avant la mise en ligne.",
    },
    {
      q: "Le nom de domaine et l'hébergement sont-ils compris ?",
      a: "Oui, ils sont inclus dans le tarif. Selon votre situation (un nom de domaine déjà acheté, un hébergement existant…), on adapte ensemble la meilleure solution.",
    },
  ],
};

export const contact = {
  eyebrow: "Faisons connaissance",
  title: { lead: "Et si on créait", accent: "votre reflet ?" },
  text: "Quelques mots suffisent pour commencer quelque chose de grand.",
  direct: "Vous préférez écrire directement ?",
  fields: {
    name: { label: "Votre nom", placeholder: "Alex Martin" },
    email: { label: "Votre e-mail", placeholder: "alex@entreprise.fr" },
    need: { label: "Votre besoin" },
    budget: { label: "Votre budget", optional: "facultatif", placeholder: "Ex. : 2 000 € ou 1 000 000 FCFA" },
    idea: { label: "Racontez-nous votre idée", placeholder: "Votre marque, vos ambitions, ce que vous imaginez…" },
  },
  needs: ["Site vitrine", "Landing page", "Page de vente", "Je ne sais pas encore"],
  submit: "Préparer mon message",
  note: "Simple et sans engagement. Vous pourrez relire votre brief avant de l'envoyer depuis votre messagerie.",
  review: {
    title: "Votre brief est prêt.",
    text: "Relisez-le, puis envoyez-le par le canal de votre choix.",
    whatsapp: "Envoyer sur WhatsApp",
    email: "Envoyer par e-mail",
    edit: "Modifier",
    copied: "Votre brief est copié : collez-le dans la conversation WhatsApp qui s'ouvre.",
    // computers: the e-mail button opens Gmail; the other ways, under it
    notGmail: "Pas sur Gmail ?",
    mailApp: "Ouvrir votre messagerie",
    or: "ou",
    copyMail: "copier le message",
    copiedMail: "Message copié : collez-le dans un e-mail à",
  },
  errors: {
    name: "Indiquez votre nom.",
    idea: "Dites-nous quelques mots sur votre projet.",
    email: "Cette adresse e-mail semble incomplète.",
  },
};

export const footer = {
  tagline: ["Un site plus clair.", "Une image plus forte."],
  columns: [
    {
      title: "Services",
      links: [
        { label: "Sites vitrines", href: "#sites-vitrines" },
        { label: "Landing pages", href: "#landing-pages" },
        { label: "Pages de vente", href: "#pages-de-vente" },
      ],
    },
    {
      title: "Agence",
      links: [
        { label: "Réalisations", href: "#realisations" },
        { label: "Témoignages", href: "#temoignages" },
        { label: "Méthode", href: "#methode" },
        { label: "Tarifs", href: "#tarifs" },
        { label: "Questions fréquentes", href: "#questions" },
      ],
    },
  ],
  contactTitle: "Contact",
  social: "Restons connectés",
  status: "Disponibles pour de nouveaux projets",
  rights: "Tous droits réservés.",
  legal: "Mentions légales & confidentialité",
};

/** Map an offer id to the matching "besoin" option of the form. */
export const needForOffer: Record<string, string> = {
  vitrine: "Site vitrine",
  landing: "Landing page",
  vente: "Page de vente",
};
