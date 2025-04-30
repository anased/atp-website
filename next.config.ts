import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ['img.youtube.com', 'cdn.sanity.io'],
  },
};

export default nextConfig;
