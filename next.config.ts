import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async redirects() {
    return [
      // Navbar links that don't have dedicated pages yet
      { source: "/new-in",                    destination: "/rings?sort=newest", permanent: false },
      { source: "/shop",                      destination: "/rings",             permanent: false },
      { source: "/collections",               destination: "/sets",              permanent: false },
      { source: "/gifts",                     destination: "/sets",              permanent: false },
      { source: "/wedding-lite",              destination: "/necklaces",         permanent: false },
      { source: "/anti-tarnish-jewellery",    destination: "/earrings",          permanent: false },
      // ShopByMood tiles
      { source: "/mood/:slug",                destination: "/rings",             permanent: false },
      // Wishlist (not built yet)
      { source: "/account/wishlist",          destination: "/account",           permanent: false },
    ];
  },
};

export default nextConfig;
