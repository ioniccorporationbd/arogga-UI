import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "d3t32hsnjxo7q6.cloudfront.net", pathname: "/**" },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/product/:slug", destination: "/products/:slug", permanent: false },
      { source: "/profile", destination: "/account", permanent: false },
      { source: "/profile/orders", destination: "/account/orders", permanent: false },
      { source: "/profile/inbox", destination: "/account/inbox", permanent: false },
      { source: "/profile/wishlist", destination: "/account/wishlist", permanent: false },
      { source: "/profile/addresses", destination: "/account/addresses", permanent: false },
      { source: "/profile/patients", destination: "/account/patients", permanent: false },
      { source: "/profile/prescriptions", destination: "/account/prescriptions", permanent: false },
      { source: "/profile/reviews", destination: "/account/reviews", permanent: false },
    ];
  },
};

export default nextConfig;
