import type { Metadata, Viewport } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";
import { Providers } from "@/components/ui/Providers";
import "./globals.css";

const dm = DM_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["italic"],
  variable: "--font-serif",
  display: "swap",
});

// Clash Display (Fontshare, ITF Free Font License)
const clash = localFont({
  src: [
    { path: "../fonts/ClashDisplay-Medium.woff2", weight: "500" },
    { path: "../fonts/ClashDisplay-Semibold.woff2", weight: "600" },
  ],
  variable: "--font-clash",
  display: "swap",
});

const title = "Ghostdesignco | Des sites qui donnent envie de rester";
const description =
  "Ghostdesignco crée des sites web sur mesure pour les entrepreneurs et les entreprises qui veulent une présence en ligne aussi soignée que leur activité.";

const site = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title,
  description,
  openGraph: { type: "website", locale: "fr_FR", siteName: "Ghostdesignco", title, description },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${dm.variable} ${serif.variable} ${clash.variable}`}>
      <body className="grain font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
