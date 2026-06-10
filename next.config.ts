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
      // Navbar top-level links
      { source: "/new-in",                    destination: "/earrings?sort=newest", permanent: false },
      { source: "/trending",                  destination: "/earrings?sort=featured", permanent: false },
      // Dropdown editorial links
      { source: "/indian-ethnic",             destination: "/earrings",          permanent: false },
      { source: "/gifts",                     destination: "/sets",              permanent: false },
      { source: "/wedding-lite",              destination: "/necklaces",         permanent: false },
      // Legacy / removed nav links
      { source: "/shop",                      destination: "/earrings",          permanent: false },
      { source: "/collections",               destination: "/sets",              permanent: false },
      { source: "/anti-tarnish-jewellery",    destination: "/earrings",          permanent: false },
      // ShopByMood tiles
      { source: "/mood/:slug",                destination: "/earrings",          permanent: false },
      // Wishlist (not built yet)
      { source: "/account/wishlist",          destination: "/account",           permanent: false },
    ];
  },
};

export default nextConfig;
