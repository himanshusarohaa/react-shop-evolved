import Header from "@/components/layout/Header";
import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/sections/CategoriesSection";
import ProductGrid from "@/components/products/ProductGrid";
import Footer from "@/components/sections/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <CategoriesSection />
        <ProductGrid title="Featured Products" maxItems={8} />
        <ProductGrid title="Best Sellers" maxItems={4} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
