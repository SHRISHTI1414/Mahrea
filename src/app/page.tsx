import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSlider from "@/components/home/HeroSlider";
import ShopByMood from "@/components/home/ShopByMood";
import ShopByCategory from "@/components/home/ShopByCategory";
import TrendingCollections from "@/components/home/TrendingCollections";
import ShopByBudget from "@/components/home/ShopByBudget";
import TrustBadges from "@/components/home/TrustBadges";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import SplashVideo from "@/components/home/SplashVideo";
import OrganizationJsonLd from "@/components/seo/OrganizationJsonLd";

export const metadata: Metadata = {
  title: "Mahrea — Sparkle Everyday",
  description:
    "Premium anti-tarnish jewellery designed for the everyday you. Shop rings, earrings, necklaces, bracelets, anklets and curated sets.",
  openGraph: {
    title: "Mahrea — Sparkle Everyday",
    description: "Premium anti-tarnish jewellery designed for the everyday you.",
    url: "https://mahrea.in",
    images: [{ url: "/images/og-home.jpg", width: 1200, height: 630, alt: "Mahrea Jewellery" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mahrea — Sparkle Everyday",
    description: "Premium anti-tarnish jewellery designed for the everyday you.",
    images: ["/images/og-home.jpg"],
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SplashVideo />
      <OrganizationJsonLd />
      <Navbar />
      <main className="flex-1">
        <HeroSlider />
        <ShopByMood />
        <ShopByCategory />
        <TrendingCollections />
        <ShopByBudget />
        <TrustBadges />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
