/** @type {import('next').NextConfig} */
const nextConfig = {
  // Strict Mode's dev-only effect replay unmounts motion components while
  // their in-view animations are resolving (framer-motion then reads a null
  // origin). Production is unaffected; this keeps `next dev` faithful to it.
  reactStrictMode: false,
  poweredByHeader: false,
};

export default nextConfig;
