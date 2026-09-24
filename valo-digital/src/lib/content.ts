/**
 * The site's words. The facts (offers, contents, prices, contact) are the
 * catalogue's; the phrasing is the agency speaking to its clients. No figures,
 * testimonials or promises that the catalogue does not make.
 */

/** French typography: thin spaces before ? ! ; and inside « », no break inside prices. */
const fr = (s: string) =>
  s
    .replace(/ ([?!;»])/g, " $1")
    .replace(/« /g, "« ")
    .replace(/ :/g, " :")
    .replace(/(\d) (\d{3})/g, "$1 $2")
    .replace(/ F CFA/g, " F CFA");

function typeset<T>(v: T): T {
  if (typeof v === "string") return fr(v) as T;
  if (Array.isArray(v)) return v.map(typeset) as T;
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, typeset(x)])) as T;
  return v;
}

export const contact = typeset({
  name: "Gueswendyam Valentin WAONGO",
  role: "Consultant formateur aux métiers du digital, fondateur de VALO DIGITAL",
  phone: "+226 54 27 77 52",
  phoneHref: "tel:+22654277752",
  whatsapp: "22654277752",
  email: "contact@valodigitalbf.com",
  address: "Wemtenga, Ouagadougou",
  mapHref: "https://www.google.com/maps/search/?api=1&query=Wemtenga%2C%20Ouagadougou",
});

export const hero = typeset({
  title: ["Votre croissance,", "maintenant."],
  lead: "Nous aidons les entrepreneurs, les TPE et les PME de Ouagadougou à faire du digital une vraie source de clients. Vous voulez apprendre ? On vous forme. Vous manquez de temps ? On s’en occupe.",
  primary: "Parler de mon projet",
  secondary: "Voir les formations",
  foot: "Agence de croissance digitale et centre de formation aux métiers du numérique",
});

export const problem = typeset({
  title: ["Publier", "ne suffit pas."],
  text: [
    "Beaucoup d’entreprises postent tous les jours sans comprendre pourquoi les ventes ne suivent pas.",
    "Le plus souvent, il manque une offre claire, un plan de contenu ou une publicité bien réglée. C’est ce que nous corrigeons avec vous.",
  ],
  audience: "Nous travaillons avec des entrepreneurs, des TPE, des PME, des équipes et des institutions.",
});

export const start = typeset({
  title: "Par où commencer ?",
  items: [
    {
      need: "Vous voulez apprendre",
      text: "Des formations pratiques pour monter en compétence et appliquer les méthodes tout de suite.",
      href: "#formations",
      link: "Les formations",
    },
    {
      need: "Vous ne savez pas ce qui bloque",
      text: "Un diagnostic de votre présence digitale, et un plan d’action pour repartir sur de bonnes bases.",
      href: "#diagnostic",
      link: "Le diagnostic",
    },
    {
      need: "Vous n’avez pas le temps",
      text: "Nous prenons en main vos réseaux sociaux, vos vidéos et vos campagnes publicitaires.",
      href: "#services",
      link: "Nos services",
    },
    {
      need: "Vous voulez structurer votre croissance",
      text: "Un accompagnement de dirigeant pour travailler votre offre, vos canaux, vos ventes et vos indicateurs.",
      href: "#accompagnement",
      link: "L’accompagnement",
    },
  ],
});

export const pillars = ["Publicité", "Marketing", "Vente", "Formations"];

export type Formation = { id: string; title: string; format: string; price: string; text: string };
export type Group = { id: string; name: string; text: string; items: Formation[] };

export const formations = typeset({
  title: ["Apprenez à le faire", "vous-même."],
  lead: "Nos formations sont pratiques : vous apprenez une méthode et vous l’appliquez tout de suite.",
  cta: "M’inscrire",
  groups: [
    {
      id: "publicite-vente",
      name: "Publicité et vente en ligne",
      text: "Pour attirer des clients et conclure la vente, sur les réseaux sociaux comme sur WhatsApp.",
      items: [
        {
          id: "ads",
          title: "Facebook et Instagram Ads avancé",
          format: "Formation pratique",
          price: "75 000 F CFA",
          text: "Page Facebook, Meta Business Suite, Business Manager : vous apprenez à cibler, à lancer vos campagnes et à tenir votre budget, puis à analyser et optimiser les résultats.",
        },
        {
          id: "vente",
          title: "Vente en ligne",
          format: "Formation pratique",
          price: "65 000 F CFA",
          text: "Vendre sur Facebook, TikTok et WhatsApp Business : trouver des clients, créer vos contenus, écrire vos messages de vente et monter votre tunnel WhatsApp.",
        },
      ],
    },
    {
      id: "contenu-reseaux",
      name: "Contenu et réseaux sociaux",
      text: "Pour publier avec un plan et faire vivre vos pages au quotidien.",
      items: [
        {
          id: "contenu",
          title: "Création de contenu",
          format: "Formation pratique",
          price: "50 000 F CFA",
          text: "Stratégie de contenu, idées, copywriting, visuels, vidéos et calendrier éditorial, pour produire du contenu qui vend.",
        },
        {
          id: "cm",
          title: "Community management",
          format: "Formation pratique",
          price: "Tarif selon format",
          text: "Définir votre stratégie, créer, publier, animer et faire réagir votre communauté, avec Meta Business Suite et un reporting.",
        },
      ],
    },
    {
      id: "strategie-outils",
      name: "Stratégie et outils",
      text: "Pour poser votre stratégie et gagner du temps avec l’intelligence artificielle.",
      items: [
        {
          id: "marketing",
          title: "Marketing digital",
          format: "Formation ou accompagnement",
          price: "65 000 F CFA",
          text: "Positionnement, acquisition, contenu, réseaux sociaux et conversion : vous construisez votre stratégie digitale et vous repartez avec un plan d’action.",
        },
        {
          id: "ia",
          title: "Intelligence artificielle pour le business",
          format: "Formation pratique",
          price: "65 000 F CFA",
          text: "Utiliser ChatGPT pour créer du contenu, faire vos recherches et écrire des prompts business, puis automatiser les tâches qui vous prennent du temps.",
        },
      ],
    },
    {
      id: "parcours",
      name: "Parcours complets",
      text: "Pour aller plus loin, en cohorte sur deux mois ou en individuel.",
      items: [
        {
          id: "cohorte",
          title: "Cohorte métiers du digital",
          format: "2 mois",
          price: "150 000 F CFA",
          text: "Deux mois pour apprendre les métiers du digital : community management, création de contenu, Facebook Ads, Canva, IA et vente en ligne, avec de la mise en pratique.",
        },
        {
          id: "prive",
          title: "Accompagnement privé",
          format: "Individuel",
          price: "50 000 à 100 000 F CFA",
          text: "Un accompagnement individuel, centré sur votre projet : diagnostic, stratégie, offre, acquisition, Facebook Ads, contenu, IA et plan d’action personnalisé.",
        },
      ],
    },
  ] as Group[],
});

export type Plan = { id: string; name: string; for: string; pitch: string; points: string[]; price: string; per: string };

export const services = typeset({
  title: ["Pas le temps ?", "On s’en occupe."],
  lead: "Nous prenons en main vos réseaux sociaux, vos vidéos et vos campagnes publicitaires, pendant que vous vous occupez de vos clients.",
  social: {
    name: "Gestion des réseaux sociaux",
    text: "Trois formules, selon où en est votre entreprise.",
    cta: "Demander cette formule",
    plans: [
      {
        id: "standard",
        name: "Standard",
        for: "Pour les entreprises qui veulent être régulières",
        pitch: "Une présence professionnelle, tenue à un rythme régulier.",
        points: ["Stratégie éditoriale de base", "Calendrier de contenu", "Publications régulières", "Création de visuels", "Animation et modération", "Suivi mensuel"],
        price: "80 000 F CFA",
        per: "par mois",
      },
      {
        id: "business",
        name: "Business",
        for: "Pour les entreprises en développement",
        pitch: "Vos réseaux deviennent un outil de communication et d’acquisition.",
        points: [
          "Audit et stratégie digitale",
          "Calendrier éditorial",
          "Création de contenus",
          "Visuels professionnels et contenus vidéo",
          "Programmation, animation et modération",
          "Reporting mensuel",
        ],
        price: "150 000 F CFA",
        per: "par mois",
      },
      {
        id: "premium",
        name: "Premium Growth",
        for: "Pour les entreprises ambitieuses",
        pitch: "Une gestion complète, vidéo et publicité comprises, pour soutenir la croissance.",
        points: [
          "Stratégie digitale",
          "Gestion complète des réseaux sociaux",
          "Production de contenus vidéo",
          "Community management",
          "Publicité Facebook et Instagram",
          "Reporting stratégique et optimisation continue",
        ],
        price: "300 000 F CFA",
        per: "par mois",
      },
    ] as Plan[],
  },
  ads: {
    id: "pub",
    name: "Publicité Facebook et Instagram",
    for: "Pour les entreprises qui veulent acquérir des clients",
    pitch: "Des campagnes pilotées pour gagner en visibilité, en prospects ou en ventes.",
    text: "Nous auditons votre compte publicitaire, fixons la stratégie et les objectifs, réglons le ciblage, puis créons et paramétrons les campagnes. Ensuite, nous les suivons et les optimisons, avec un reporting.",
    price: "100 000 F CFA",
    per: "hors budget publicitaire",
    cta: "Lancer mes campagnes",
  },
  video: {
    id: "video",
    name: "Content vidéo",
    for: "Pour les marques, les experts et les entreprises",
    pitch: "Votre expertise, vos produits et vos offres, en vidéos pensées pour les réseaux sociaux.",
    text: "Nous cherchons les idées, posons la stratégie et écrivons les scripts. Viennent ensuite le tournage ou la production, le montage, le sous-titrage et l’adaptation à chaque plateforme.",
    price: "80 000 F CFA",
    per: "pour 4 vidéos",
    cta: "Parler de mes vidéos",
  },
});

export const conseil = typeset({
  title: ["Quelque chose bloque ?", "Commençons par le comprendre."],
  diagnostic: {
    id: "diagnostic",
    name: "Diagnostic digital et plan de croissance",
    pitch: "Vous êtes présent en ligne, mais les résultats ne suivent pas.",
    text: "Nous analysons votre positionnement, votre offre, vos réseaux sociaux et vos contenus, votre acquisition et votre parcours client. Vous repartez avec des recommandations prioritaires et un plan d’action personnalisé.",
    for: "Pour les TPE, les PME et les entrepreneurs",
    price: "150 000 F CFA",
    cta: "Demander un diagnostic",
  },
  others: [
    {
      id: "accompagnement",
      name: "Accompagnement business et croissance",
      for: "Pour les dirigeants et les entrepreneurs",
      text: "Nous construisons votre stratégie avec vous, puis nous la mettons en œuvre : offre et positionnement, acquisition, contenu et publicité, vente et parcours client, KPI et plan d’action, avec une optimisation continue.",
      price: "À partir de 150 000 F CFA",
      cta: "En parler",
    },
    {
      id: "direction",
      name: "Direction marketing externalisée",
      for: "Pour les entreprises en croissance",
      text: "Nous pilotons votre marketing depuis l’extérieur : coordination des actions, acquisition, suivi des KPI et reporting.",
      price: "À partir de 750 000 F CFA",
      cta: "En parler",
    },
  ],
});

export const methode = typeset({
  title: "Notre méthode",
  lead: "Quatre étapes, toujours dans cet ordre. Rien ne se lance avant que nous ayons compris votre situation.",
  steps: [
    { name: "Comprendre", text: "Nous partons de votre situation réelle, pour voir clairement le contexte, vos forces et ce qui bloque." },
    { name: "Structurer", text: "Nous fixons les priorités et construisons une stratégie : un cadre d’action simple, cohérent et applicable." },
    { name: "Exécuter", text: "Nous mettons en œuvre les méthodes et les outils adaptés, avec des actions concrètes sur les bons canaux." },
    { name: "Optimiser", text: "Nous mesurons les résultats et améliorons ce qui doit l’être, en continu." },
  ],
});

export const closing = typeset({
  title: ["Parlons de", "votre croissance."],
  text: "Un message WhatsApp suffit pour démarrer. Dites-nous où vous en êtes : nous vous orientons vers la bonne formule.",
  whatsapp: "Écrire sur WhatsApp",
  call: "Appeler",
});

export const footer = typeset({
  line: "Agence de croissance digitale et centre de formation aux métiers du numérique, à Ouagadougou.",
});

export const nav = [
  { href: "#formations", label: "Formations" },
  { href: "#services", label: "Services" },
  { href: "#conseil", label: "Conseil" },
  { href: "#methode", label: "Méthode" },
  { href: "#contact", label: "Contact" },
];
