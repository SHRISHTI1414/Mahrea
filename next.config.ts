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
      // Navbar TRENDING → featured earrings (until dedicated trending page is built)
      { source: "/trending",                  destination: "/earrings?sort=featured", permanent: false },
      // Editorial / legacy routes
      { source: "/indian-ethnic",             destination: "/earrings",          permanent: false },
      { source: "/gifts",                     destination: "/sets",              permanent: false },
      { source: "/wedding-lite",              destination: "/necklaces",         permanent: false },
      { source: "/shop",                      destination: "/earrings",          permanent: false },
      { source: "/collections",               destination: "/sets",              permanent: false },
      { source: "/anti-tarnish-jewellery",    destination: "/earrings",          permanent: false },
      // ShopByMood tiles
      { source: "/mood/:slug",                destination: "/earrings",          permanent: false },
    ];
  },
};

export default nextConfig;
