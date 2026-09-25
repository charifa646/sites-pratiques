import type { Metadata, Viewport } from "next";
import "../v2/v2.css";
import "./pose.css";

// Draft: the 3D site's hero, then V2's calm sections on the dark side. Reachable by its address, kept out of search results.
export const metadata: Metadata = {
  title: "Version posée",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function PoseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
