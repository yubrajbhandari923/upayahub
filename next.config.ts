import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Ensure next-intl works properly with turbopack
  }
};

export default nextConfig;
