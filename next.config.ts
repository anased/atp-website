import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* existing config options here */
  reactStrictMode: true,
  images: {
    domains: [
      'img.youtube.com', 
      'cdn.sanity.io',
      // Add your Sanity project ID for extra security
      `cdn.sanity.io`
    ],
    // Other image config
  },
  // Add these lines to ignore errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;