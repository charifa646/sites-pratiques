import { faq, offer } from "./copy";
import { site } from "./site";

/** The one address search engines should know: www.ghostdesignco.com in production (ghostdesignco.com redirects to it), the deployment's own URL elsewhere. */
export const productionUrl = "https://www.ghostdesignco.com";
export const siteUrl =
  process.env.VERCEL_ENV === "production" ? productionUrl : process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

export const seo = {
  title: "Ghostdesignco · Création de site web sur mesure",
  description:
    "Sites vitrines, landing pages et pages de vente sur mesure, en ligne en 5 à 15 jours. Textes rédigés pour vous, nom de domaine et hébergement compris.",
};

/** What search engines read about the agency: who it is, what it makes, the questions it answers. */
export function jsonLd() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": `${siteUrl}/#agence`,
        name: "Ghostdesignco",
        url: siteUrl,
        logo: `${siteUrl}/apple-icon.png`,
        image: `${siteUrl}/opengraph-image.jpg`,
        description: seo.description,
        email: site.email,
        telephone: `+${site.whatsapp}`,
        sameAs: site.social.map((s) => s.href),
        knowsLanguage: "fr",
        makesOffer: offer.items.map((o) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: o.title, description: o.text },
        })),
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#site`,
        url: siteUrl,
        name: "Ghostdesignco",
        inLanguage: "fr",
        publisher: { "@id": `${siteUrl}/#agence` },
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/#questions`,
        mainEntity: faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };
  // safe inside a <script>: no "<" can close it early
  return JSON.stringify(graph).replace(/</g, "\\u003c");
}
