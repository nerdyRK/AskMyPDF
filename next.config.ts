import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse"], // or serverExternalPackages: ['pdf-parse']
  },
};

export default nextConfig;
