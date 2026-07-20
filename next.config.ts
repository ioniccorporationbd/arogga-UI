import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "d3t32hsnjxo7q6.cloudfront.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
