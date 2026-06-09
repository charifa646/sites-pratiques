import type { NextConfig } from "next";

// Static export served under /cadran on the existing kora-transit deployment.
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/cadran",
  trailingSlash: true,
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
