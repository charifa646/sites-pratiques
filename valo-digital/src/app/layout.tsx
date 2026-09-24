import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { contact } from "@/lib/content";
import { RevealObserver } from "@/components/ui/RevealObserver";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

const description =
  "Agence de croissance digitale basée à Ouagadougou : formations pratiques, gestion des réseaux sociaux, publicité Facebook et Instagram, content vidéo, diagnostic digital et accompagnement business.";

export const metadata: Metadata = {
  title: "VALO DIGITAL · Agence de croissance digitale à Ouagadougou",
  description,
  // a test site for the client: kept out of search engines until it is theirs
  robots: { index: false, follow: false },
  openGraph: {
    title: "VALO DIGITAL · Votre croissance, maintenant.",
    description,
    locale: "fr_FR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0714D8",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "VALO DIGITAL",
  description,
  telephone: contact.phone.replace(/\s/g, ""),
  email: contact.email,
  address: { "@type": "PostalAddress", streetAddress: "Wemtenga", addressLocality: "Ouagadougou", addressCountry: "BF" },
  founder: { "@type": "Person", name: contact.name, jobTitle: "Consultant formateur aux métiers du digital" },
  areaServed: "Ouagadougou",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={montserrat.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="font-sans">
        {children}
        <RevealObserver />
      </body>
    </html>
  );
}
