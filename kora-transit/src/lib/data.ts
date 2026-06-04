import {
  Clock,
  Armchair,
  ShieldCheck,
  Headphones,
  Bus,
  Package,
  Crown,
  BadgeCheck,
  Award,
  HeartHandshake,
  type LucideIcon,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Images — real, verified Unsplash photos (dark/premium tonality)           */
/*  next/image handles resizing; we provide a high-res source per slot.       */
/* -------------------------------------------------------------------------- */
const unsplash = (id: string, w = 1920) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=${w}`;

export const images = {
  heroPoster: unsplash("1544620347-c4fd4a3d5957", 2400),
  // Self-hosted, optimized night-road loop (kora-transit/public/hero.mp4).
  heroVideo: "/hero.mp4",
  highway: unsplash("1506277204481-fb831bb22403", 2200),
  highwayAlt: unsplash("1542705959-878ca346eb20", 2000),
  service: {
    voyageurs: unsplash("1624901713275-bbc0b448bb38", 1400),
    fret: unsplash("1682033239272-6b60b828a9a2", 1400),
    vip: unsplash("1552561018-5fea54c08479", 1400),
  },
  fleet: {
    standard: unsplash("1478359900967-91ec0c6edc60", 1400),
    business: unsplash("1633374271379-dc81c442db27", 1400),
    premium: unsplash("1554713918-6a58f3580bd2", 1400),
  },
  about: {
    story: unsplash("1553152531-b98a2fc8d3bf", 1600),
    terminal: unsplash("1600198741448-fc40d918673a", 1600),
  },
  // Cinematic section backgrounds (dark, layered behind content).
  scene: {
    headlights: unsplash("1605367811611-f6011b264cb5", 2000),
    lightTrails: unsplash("1516319915504-015b432d407c", 2200),
    lightTrailsAlt: unsplash("1494481524892-b1bf38423fd1", 2200),
    terminalNight: unsplash("1584792224177-047beb05002a", 2000),
    street: unsplash("1738427436305-453325092968", 2000),
  },
} as const;

/* -------------------------------------------------------------------------- */
/*  Brand & contact                                                           */
/* -------------------------------------------------------------------------- */
export const site = {
  name: "KORA TRANSIT",
  sloganPrincipal: "Le voyage repensé.",
  sloganSecondaire: "Fiabilité. Confort. Ponctualité.",
  baseline: "Transport premium inter-urbain en Afrique de l'Ouest",
  phone: "+226 25 00 00 00",
  email: "contact@koratransit.com",
  siege: "Avenue Kwamé N'Krumah, Ouagadougou, Burkina Faso",
  agence: "Rue du Commerce, Secteur 1, Bobo-Dioulasso",
  horaires: "Lundi – Samedi · 06h00 – 22h00",
  copyright: "© 2024 KORA TRANSIT. Tous droits réservés.",
  legal:
    "KORA TRANSIT — Société fictive créée à des fins de démonstration. Toute ressemblance avec une entreprise existante serait purement fortuite.",
  /** Replace with your real Formspree form ID, e.g. https://formspree.io/f/abcdwxyz */
  formspreeEndpoint: "https://formspree.io/f/FORMSPREE_ENDPOINT",
} as const;

export const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Notre Flotte", href: "/flotte" },
  { label: "Réservation", href: "/reservation" },
  { label: "À propos", href: "/a-propos" },
  { label: "Contact", href: "/contact" },
] as const;

/* -------------------------------------------------------------------------- */
/*  Page headers (verbatim)                                                   */
/* -------------------------------------------------------------------------- */
export const headers = {
  services: {
    title: "Nos services",
    subtitle: "Trois offres. Une seule exigence : l'excellence.",
  },
  flotte: {
    title: "Notre flotte",
    subtitle: "50 véhicules. Un seul standard : le meilleur.",
    text: "Chaque véhicule de notre flotte est révisé toutes les 72 heures. Aucun bus ne prend la route sans avoir passé notre protocole de contrôle en 47 points.",
  },
  reservation: {
    title: "Réservez votre trajet",
    subtitle: "Simple, rapide, confirmé en quelques secondes.",
  },
  apropos: {
    title: "À propos de KORA TRANSIT",
    subtitle:
      "Depuis 2012, nous transportons des personnes et des marchandises avec une seule obsession : faire mieux que ce qu'on attend de nous.",
  },
  contact: {
    title: "Contactez-nous",
    subtitle:
      "Une question, une réservation de groupe, un partenariat ? Notre équipe vous répond.",
  },
} as const;

/* -------------------------------------------------------------------------- */
/*  Home — Hero                                                               */
/* -------------------------------------------------------------------------- */
export const hero = {
  title: "Le transport qui ne vous fait jamais attendre.",
  subtitle:
    "KORA TRANSIT relie les grandes villes d'Afrique de l'Ouest avec des standards de confort et de ponctualité inégalés. Chaque trajet est une promesse tenue.",
  ctaPrimary: "Réserver mon trajet",
  ctaSecondary: "Découvrir nos services",
} as const;

/* -------------------------------------------------------------------------- */
/*  Stats / counters                                                          */
/* -------------------------------------------------------------------------- */
export type Stat = {
  value: number;
  suffix?: string;
  separator?: boolean;
  label: string;
};

export const statsHome: Stat[] = [
  { value: 500000, suffix: "+", separator: true, label: "Voyageurs transportés" },
  { value: 15, label: "Destinations desservies" },
  { value: 12, suffix: " ans", label: "D'excellence opérationnelle" },
  { value: 98, suffix: "%", label: "Taux de ponctualité" },
];

export const statsAbout: Stat[] = [
  { value: 2012, label: "Année de fondation" },
  { value: 50, suffix: "+", label: "Véhicules en flotte" },
  { value: 500000, suffix: "+", separator: true, label: "Voyageurs transportés" },
  { value: 15, label: "Destinations actives" },
  { value: 200, suffix: "+", label: "Collaborateurs" },
];

/* -------------------------------------------------------------------------- */
/*  Why us                                                                    */
/* -------------------------------------------------------------------------- */
export const whyUs = {
  title: "Un standard que peu atteignent.",
  subtitle:
    "Nous n'avons pas réinventé le transport. Nous avons simplement décidé de le faire correctement.",
  items: [
    {
      icon: Clock,
      title: "Ponctualité garantie",
      desc: "Chaque départ est respecté à la minute. Notre système de gestion en temps réel élimine les imprévus avant qu'ils ne surviennent.",
    },
    {
      icon: Armchair,
      title: "Confort premium",
      desc: "Sièges inclinables, climatisation individuelle, Wi-Fi embarqué, prises USB. Votre trajet commence dès que vous montez à bord.",
    },
    {
      icon: ShieldCheck,
      title: "Sécurité maximale",
      desc: "Chauffeurs certifiés, véhicules révisés toutes les 72h, suivi GPS en temps réel. Votre sécurité n'est pas une option.",
    },
    {
      icon: Headphones,
      title: "Service client 24h/24",
      desc: "Une équipe disponible à toute heure pour votre réservation, vos modifications ou vos questions.",
    },
  ] as { icon: LucideIcon; title: string; desc: string }[],
} as const;

/* -------------------------------------------------------------------------- */
/*  Services                                                                  */
/* -------------------------------------------------------------------------- */
export const servicesPreview = {
  title: "Ce que nous faisons, nous le faisons bien.",
  cta: "Voir tous nos services",
  items: [
    {
      icon: Bus,
      title: "Transport voyageurs",
      desc: "Liaisons inter-urbaines confortables et ponctuelles entre les principales villes de la région.",
      image: images.service.voyageurs,
    },
    {
      icon: Package,
      title: "Livraison de marchandises",
      desc: "Transport sécurisé de colis et marchandises avec suivi en temps réel et livraison garantie.",
      image: images.service.fret,
    },
    {
      icon: Crown,
      title: "Location privée",
      desc: "Véhicules avec chauffeur pour vos événements, transferts VIP et déplacements d'entreprise.",
      image: images.service.vip,
    },
  ] as { icon: LucideIcon; title: string; desc: string; image: string }[],
} as const;

export type ServiceDetail = {
  label: string;
  title: string;
  description: string;
  points: string[];
  image: string;
};

export const servicesDetail: ServiceDetail[] = [
  {
    label: "Transport de voyageurs",
    title: "Transport inter-urbain",
    description:
      "Des liaisons directes entre les principales villes d'Afrique de l'Ouest, opérées avec une flotte moderne et des équipes formées aux plus hauts standards. Départs quotidiens, horaires fixes, ponctualité garantie.",
    points: [
      "Départs quotidiens à heures fixes",
      "Sièges réservés nominativement",
      "Bagages inclus jusqu'à 25 kg",
      "Suivi GPS en temps réel",
    ],
    image: images.service.voyageurs,
  },
  {
    label: "Livraison de marchandises",
    title: "Fret & Livraison",
    description:
      "Transport sécurisé de colis, documents et marchandises entre toutes nos destinations. Prise en charge à domicile disponible. Délais respectés, marchandises assurées.",
    points: [
      "Enlèvement à domicile ou en agence",
      "Assurance marchandise incluse",
      "Notification de livraison en temps réel",
      "Livraison express disponible",
    ],
    image: images.service.fret,
  },
  {
    label: "Location privée & VIP",
    title: "Location & Transferts VIP",
    description:
      "Véhicules de prestige avec chauffeur professionnel pour vos déplacements personnels, vos événements d'entreprise ou vos transferts aéroportuaires. Discrétion, confort, ponctualité.",
    points: [
      "Chauffeurs en tenue professionnelle",
      "Véhicules haut de gamme",
      "Disponibilité 24h/24",
      "Devis personnalisé sur demande",
    ],
    image: images.service.vip,
  },
];

/* -------------------------------------------------------------------------- */
/*  Liaisons / destinations                                                   */
/* -------------------------------------------------------------------------- */
export const liaisons = {
  title: "Nos liaisons",
  note: "(Et 7 liaisons supplémentaires — voir notre grille horaire complète)",
  routes: [
    { from: "Ouagadougou", to: "Bobo-Dioulasso" },
    { from: "Ouagadougou", to: "Abidjan" },
    { from: "Ouagadougou", to: "Bamako" },
    { from: "Ouagadougou", to: "Accra" },
    { from: "Bobo-Dioulasso", to: "Abidjan" },
    { from: "Bamako", to: "Dakar" },
    { from: "Abidjan", to: "Lomé" },
    { from: "Lomé", to: "Cotonou" },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/*  Testimonials                                                              */
/* -------------------------------------------------------------------------- */
export const testimonials = {
  title: "Ils nous font confiance.",
  items: [
    {
      quote:
        "Trois ans que je fais le trajet Ouagadougou–Bobo chaque semaine. KORA TRANSIT est la seule compagnie qui n'a jamais été en retard une seule fois.",
      name: "Mamadou S.",
      role: "Directeur commercial",
      initials: "MS",
    },
    {
      quote:
        "Le niveau de confort est incomparable. On arrive reposé, pas épuisé. C'est rare.",
      name: "Aïssata K.",
      role: "Consultante indépendante",
      initials: "AK",
    },
    {
      quote:
        "Nous confions l'ensemble de notre logistique à KORA TRANSIT depuis 2021. Zéro incident, zéro retard. Un partenaire de confiance.",
      name: "Ibrahim T.",
      role: "PDG · Groupe SAHEL TRADING",
      initials: "IT",
    },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/*  Final CTA                                                                 */
/* -------------------------------------------------------------------------- */
export const finalCta = {
  title: "Votre prochain trajet mérite mieux.",
  subtitle: "Réservez en moins de 2 minutes. Voyagez différemment.",
  cta: "Réserver maintenant",
} as const;

/* -------------------------------------------------------------------------- */
/*  Fleet                                                                     */
/* -------------------------------------------------------------------------- */
export type FleetClass = {
  name: string;
  tier: string;
  description: string;
  capacity: string;
  equipment: string[];
  image: string;
  featured?: boolean;
  badge?: string;
};

export const fleet: FleetClass[] = [
  {
    name: "KORA STANDARD",
    tier: "Classe Standard",
    description:
      "Confort essentiel pour les trajets quotidiens. Climatisation, sièges rembourrés, connexion USB.",
    capacity: "45 passagers",
    equipment: ["Climatisation", "Prises USB", "Bagages inclus (25 kg)", "Wi-Fi"],
    image: images.fleet.standard,
  },
  {
    name: "KORA BUSINESS",
    tier: "Classe Business",
    description:
      "L'espace et le calme pour travailler ou vous reposer pendant le trajet. Sièges extra-larges, tablettes individuelles.",
    capacity: "30 passagers",
    equipment: [
      "Sièges XL inclinables",
      "Tablette individuelle",
      "Prises 220V",
      "Wi-Fi haut débit",
      "Rafraîchissement offert",
    ],
    image: images.fleet.business,
  },
  {
    name: "KORA PREMIUM",
    tier: "Classe Premium",
    description:
      "Notre offre la plus exclusive. Intimité, luxe et service personnalisé pour les voyageurs les plus exigeants.",
    capacity: "16 passagers",
    equipment: [
      "Sièges en cuir",
      "Espace privatif",
      "Service à bord",
      "Wi-Fi dédié",
      "Collation premium offerte",
    ],
    image: images.fleet.premium,
    featured: true,
    badge: "Le plus exclusif",
  },
];

/* -------------------------------------------------------------------------- */
/*  About — story / mission / vision / values / team                         */
/* -------------------------------------------------------------------------- */
export const about = {
  story: {
    title: "Notre histoire",
    paragraphs: [
      "En 2012, Amadou KORA fondait KORA TRANSIT avec deux autobus et une conviction simple : le transport en Afrique de l'Ouest méritait mieux que l'improvisation.",
      "Douze ans plus tard, KORA TRANSIT opère une flotte de plus de 50 véhicules, dessert 15 destinations et a transporté plus de 500 000 voyageurs. Mais ce qui n'a pas changé, c'est l'obsession du détail — chaque départ à l'heure, chaque client respecté, chaque kilomètre parcouru en sécurité.",
    ],
  },
  mission: {
    title: "Mission",
    text: "Rendre le transport inter-urbain en Afrique de l'Ouest aussi fiable, confortable et prévisible qu'il devrait toujours l'être.",
  },
  vision: {
    title: "Vision",
    text: "Devenir la référence du transport premium en Afrique francophone d'ici 2030.",
  },
  valuesTitle: "Nos valeurs",
  values: [
    {
      icon: BadgeCheck,
      title: "Fiabilité",
      desc: "Une promesse faite est une promesse tenue. Sans exception.",
    },
    {
      icon: ShieldCheck,
      title: "Sécurité",
      desc: "La sécurité de nos passagers prime sur tout le reste.",
    },
    {
      icon: Award,
      title: "Excellence",
      desc: "Nous ne nous contentons pas du minimum attendu.",
    },
    {
      icon: HeartHandshake,
      title: "Respect",
      desc: "De nos clients, de nos équipes, de nos engagements.",
    },
  ] as { icon: LucideIcon; title: string; desc: string }[],
  teamTitle: "L'équipe dirigeante",
  team: [
    { name: "Amadou KORA", role: "Fondateur & Président Directeur Général", initials: "AK" },
    { name: "Fatimata DIALLO", role: "Directrice Administrative et Financière", initials: "FD" },
    { name: "Seydou TRAORÉ", role: "Directeur des Opérations", initials: "ST" },
    { name: "Mariam OUÉDRAOGO", role: "Responsable Expérience Client", initials: "MO" },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/*  Forms (verbatim labels & messages)                                        */
/* -------------------------------------------------------------------------- */
export const bookingForm = {
  fields: {
    nom: "Nom complet",
    telephone: "Numéro de téléphone",
    depart: "Ville de départ",
    arrivee: "Ville d'arrivée",
    date: "Date du voyage",
    passagers: "Nombre de passagers",
    classe: "Classe souhaitée",
    message: "Message ou demande spéciale",
  },
  classes: ["Standard", "Business", "Premium"],
  success:
    "Votre demande a bien été reçue. Notre équipe vous contacte dans les 30 minutes pour confirmer votre réservation.",
  error:
    "Une erreur est survenue. Veuillez réessayer ou nous contacter directement au +226 25 00 00 00.",
  cta: "Envoyer ma demande",
  note: "Vos données sont traitées de manière confidentielle et ne sont jamais partagées avec des tiers.",
  reassurance: {
    title: "Confirmation en 30 minutes",
    text: "Notre équipe vous rappelle dans les 30 minutes pour confirmer votre réservation. Vos données restent strictement confidentielles.",
  },
} as const;

export const contactForm = {
  fields: {
    nom: "Nom complet",
    email: "Email",
    telephone: "Téléphone",
    sujet: "Sujet",
    message: "Message",
  },
  success:
    "Votre demande a bien été reçue. Notre équipe vous contacte dans les 30 minutes pour confirmer votre réservation.",
  error:
    "Une erreur est survenue. Veuillez réessayer ou nous contacter directement au +226 25 00 00 00.",
  cta: "Envoyer le message",
} as const;
