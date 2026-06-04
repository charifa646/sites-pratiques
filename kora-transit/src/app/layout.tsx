import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://koratransit.com"),
  title: {
    default: "KORA TRANSIT — Le voyage repensé.",
    template: "%s · KORA TRANSIT",
  },
  description:
    "Transport premium inter-urbain en Afrique de l'Ouest. Fiabilité, confort, ponctualité — chaque trajet est une promesse tenue.",
  keywords: [
    "transport",
    "autocar",
    "Afrique de l'Ouest",
    "voyageurs",
    "fret",
    "Ouagadougou",
    "KORA TRANSIT",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    title: "KORA TRANSIT — Le voyage repensé.",
    description:
      "Transport premium inter-urbain en Afrique de l'Ouest. Fiabilité, confort, ponctualité.",
    siteName: "KORA TRANSIT",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${display.variable}`}>
      <body className="bg-navy font-sans text-ink antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
