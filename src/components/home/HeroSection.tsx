import { ArrowRight, ShoppingBag, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroBanner from "@/assets/hero-banner.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: ShoppingBag,
      title: "Premium Quality",
      description: "Curated selection of high-quality products"
    },
    {
      icon: Zap,
      title: "Fast Delivery",
      description: "Express shipping on all orders"
    },
    {
      icon: Shield,
      title: "Secure Shopping",
      description: "Your data is protected with enterprise-grade security"
    }
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBanner}
          alt="E-commerce Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Shop the
              <span className="block bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
                Future
              </span>
              Today
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto lg:mx-0">
              Discover premium products with hyper-personalized shopping experiences. 
              Fast, secure, and tailored just for you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent-light text-accent-foreground shadow-glow transition-all duration-300 hover:scale-105"
                onClick={() => navigate('/products')}
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                onClick={() => navigate('/products')}
              >
                Explore Categories
              </Button>
            </div>

            {/* Features */}
            <div className="grid sm:grid-cols-3 gap-6 max-w-2xl mx-auto lg:mx-0">
              {features.map((feature, index) => (
                <div 
                  key={feature.title}
                  className="text-center lg:text-left animate-fade-in"
                  style={{ animationDelay: `${(index + 1) * 200}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg mb-3">
                    <feature.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                  <p className="text-sm text-white/70">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Stats */}
          <div className="lg:text-right animate-scale-in" style={{ animationDelay: "400ms" }}>
            <div className="grid grid-cols-2 gap-6 max-w-md mx-auto lg:mx-0 lg:ml-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-accent mb-2">50K+</div>
                <div className="text-white/80 text-sm">Happy Customers</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-accent mb-2">10K+</div>
                <div className="text-white/80 text-sm">Products</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-accent mb-2">99.9%</div>
                <div className="text-white/80 text-sm">Uptime</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-accent mb-2">24/7</div>
                <div className="text-white/80 text-sm">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-20 h-20 bg-accent/20 rounded-full animate-float"></div>
      <div className="absolute bottom-32 left-20 w-16 h-16 bg-accent-light/20 rounded-full animate-float" style={{ animationDelay: "2s" }}></div>
    </section>
  );
};

export default HeroSection;