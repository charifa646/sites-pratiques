import type { Metadata, Viewport } from "next";

/** Preview of the 3D site in a warm night; kept out of search engines. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0e0a08",
  colorScheme: "dark",
};

export default function WarmLayout({ children }: { children: React.ReactNode }) {
  // globals.css switches the page palette when this class is on the page
  return <div className="theme-warm">{children}</div>;
}
