/** @type {import('next').NextConfig} */
const nextConfig = {
  // Strict Mode's dev-only effect replay unmounts motion components while
  // their in-view animations are resolving (framer-motion then reads a null
  // origin). Production is unaffected; this keeps `next dev` faithful to it.
  reactStrictMode: false,
  poweredByHeader: false,
  // the old address sends visitors and search engines to the real domain;
  // /pose, the draft of the final version, is now the home page
  async redirects() {
    return [
      { source: "/pose", destination: "/", permanent: false },
      {
        source: "/:path*",
        has: [{ type: "host", value: "ghostdesignco.vercel.app" }],
        destination: "https://www.ghostdesignco.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
