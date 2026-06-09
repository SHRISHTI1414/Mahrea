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

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
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
