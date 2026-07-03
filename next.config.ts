import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
  // ── Local-dev proxy (kept as fallback) ────────────────────────────────────
  // When NEXT_PUBLIC_API_URL is not set the baseApi falls back to the live URL
  // directly. This rewrite is only hit if you switch baseUrl back to '/api/v1'.
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'https://abroz-machinery-server.vercel.app/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
