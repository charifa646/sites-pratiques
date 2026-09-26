import type { Metadata, Viewport } from "next";

// The first version of the site (the 3D dive), kept at its own address, out of search results.
export const metadata: Metadata = {
  title: "Version 3D",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function V1Layout({ children }: { children: React.ReactNode }) {
  return children;
}
