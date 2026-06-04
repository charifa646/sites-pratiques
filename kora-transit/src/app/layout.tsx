import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/providers/SmoothScroll";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Clash Display (Fontshare) — self-hosted for performance + no layout shift.
const display = localFont({
  variable: "--font-display",
  display: "swap",
  src: [
    { path: "../fonts/ClashDisplay-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/ClashDisplay-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/ClashDisplay-Semibold.woff2", weight: "600", style: "normal" },
    { path: "../fonts/ClashDisplay-Bold.woff2", weight: "700", style: "normal" },
  ],
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
        <SmoothScroll>
          <Navbar />
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
