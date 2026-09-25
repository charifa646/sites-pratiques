import type { Metadata, Viewport } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "@/components/ui/Providers";
import { seo, siteUrl } from "@/lib/seo";
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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: seo.title, template: "%s · Ghostdesignco" },
  description: seo.description,
  applicationName: "Ghostdesignco",
  authors: [{ name: "Ghostdesignco", url: siteUrl }],
  creator: "Ghostdesignco",
  publisher: "Ghostdesignco",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: { type: "website", locale: "fr_FR", siteName: "Ghostdesignco", title: seo.title, description: seo.description },
  twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
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
        <Analytics />
      </body>
    </html>
  );
}
