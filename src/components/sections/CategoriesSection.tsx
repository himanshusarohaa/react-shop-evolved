import { Laptop, Headphones, Smartphone, Gamepad2, Camera, Watch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    name: "Electronics",
    icon: Laptop,
    description: "Latest tech gadgets",
    color: "from-blue-500 to-purple-600"
  },
  {
    name: "Audio",
    icon: Headphones,
    description: "Premium sound equipment",
    color: "from-purple-500 to-pink-600"
  },
  {
    name: "Mobile",
    icon: Smartphone,
    description: "Smartphones & accessories",
    color: "from-green-500 to-blue-600"
  },
  {
    name: "Gaming",
    icon: Gamepad2,
    description: "Gaming gear & consoles",
    color: "from-red-500 to-orange-600"
  },
  {
    name: "Photography",
    icon: Camera,
    description: "Cameras & equipment",
    color: "from-teal-500 to-cyan-600"
  },
  {
    name: "Wearables",
    icon: Watch,
    description: "Smartwatches & fitness",
    color: "from-indigo-500 to-purple-600"
  }
];

const CategoriesSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl font-bold text-foreground mb-4">Shop by Category</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our diverse range of premium products across all categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <Button
              key={category.name}
              variant="outline"
              className="group h-auto p-6 flex flex-col items-center space-y-3 border-2 hover:border-primary hover:shadow-medium transition-all duration-300 animate-fade-in bg-gradient-card hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => navigate('/products')}
            >
              <div className={`p-4 rounded-full bg-gradient-to-r ${category.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                <category.icon className="h-8 w-8" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {category.description}
                </p>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;