import ProductCard from "./ProductCard";
import productLaptop from "@/assets/product-laptop.jpg";
import productHeadphones from "@/assets/product-headphones.jpg";
import productPhone from "@/assets/product-phone.jpg";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  isOnSale?: boolean;
}

interface ProductGridProps {
  title?: string;
  products?: Product[];
  maxItems?: number;
}

// Sample product data
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Premium Wireless Laptop - 16inch Display",
    price: 1299.99,
    originalPrice: 1599.99,
    image: productLaptop,
    rating: 4.8,
    reviewCount: 234,
    category: "Electronics",
    isOnSale: true,
  },
  {
    id: "2",
    name: "Professional Wireless Headphones",
    price: 299.99,
    originalPrice: 399.99,
    image: productHeadphones,
    rating: 4.6,
    reviewCount: 189,
    category: "Audio",
    isOnSale: true,
  },
  {
    id: "3",
    name: "Latest Smartphone - 256GB",
    price: 899.99,
    image: productPhone,
    rating: 4.9,
    reviewCount: 456,
    category: "Mobile",
    isOnSale: false,
  },
  {
    id: "4",
    name: "Gaming Laptop Pro - RTX 4080",
    price: 2199.99,
    originalPrice: 2499.99,
    image: productLaptop,
    rating: 4.7,
    reviewCount: 123,
    category: "Gaming",
    isOnSale: true,
  },
  {
    id: "5",
    name: "Studio Monitor Headphones",
    price: 449.99,
    image: productHeadphones,
    rating: 4.5,
    reviewCount: 87,
    category: "Audio",
    isOnSale: false,
  },
  {
    id: "6",
    name: "Flagship Phone - 512GB Pro",
    price: 1199.99,
    originalPrice: 1299.99,
    image: productPhone,
    rating: 4.8,
    reviewCount: 298,
    category: "Mobile",
    isOnSale: true,
  },
];

const ProductGrid = ({ title = "Featured Products", products = sampleProducts, maxItems }: ProductGridProps) => {
  const displayProducts = maxItems ? products.slice(0, maxItems) : products;

  const handleAddToCart = (productId: string) => {
    // TODO: Implement cart functionality
    console.log("Added to cart:", productId);
  };

  const handleToggleWishlist = (productId: string) => {
    // TODO: Implement wishlist functionality
    console.log("Toggled wishlist:", productId);
  };

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">{title}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover our handpicked selection of premium products with exceptional quality and unbeatable prices.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;