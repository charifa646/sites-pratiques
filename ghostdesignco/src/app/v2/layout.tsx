import type { Metadata, Viewport } from "next";
import "./v2.css";

// Draft of a calmer, lighter version: reachable by its address, kept out of search results.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#F4F3EE",
  colorScheme: "light",
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return <div className="v2 min-h-screen bg-paper font-sans text-ink">{children}</div>;
}
