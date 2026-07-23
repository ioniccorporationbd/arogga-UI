import type { NextConfig } from "next";

const securityHeaders = [
  { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' https://fonts.gstatic.com; media-src 'self' https: blob:; connect-src 'self' https:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self), payment=()" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "d3t32hsnjxo7q6.cloudfront.net", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "cdn.dummyjson.com", pathname: "/**" },
      { protocol: "https", hostname: "i.dummyjson.com", pathname: "/**" },
    ],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
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
