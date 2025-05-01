import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: [
      'img.youtube.com', 
      'cdn.sanity.io',
      // Add your Sanity project ID for extra security
      `cdn.sanity.io`
    ],
    // Increase the default image size limit if needed
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Enable AVIF format for better compression
    formats: ['image/avif', 'image/webp'],
    // Disable remote pattern security checks during development if needed
    // Remove this for production
    dangerouslyAllowSVG: process.env.NODE_ENV === 'development',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
