import { Star, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

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

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  onToggleWishlist: (productId: string) => void;
}

const ProductCard = ({ product, onAddToCart, onToggleWishlist }: ProductCardProps) => {
  const navigate = useNavigate();
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative bg-card border border-border rounded-lg overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 animate-fade-in">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-subtle">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Sale Badge */}
        {product.isOnSale && discountPercentage > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute top-3 left-3 px-2 py-1 text-xs font-bold"
          >
            -{discountPercentage}%
          </Badge>
        )}

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-sm hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={() => onToggleWishlist(product.id)}
        >
          <Heart className="h-4 w-4" />
        </Button>

        {/* Quick Add to Cart */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            onClick={() => onAddToCart(product.id)}
            className="w-full bg-primary hover:bg-primary-dark text-primary-foreground shadow-medium"
            size="sm"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 cursor-pointer" onClick={() => navigate(`/products/${product.id}`)}>
        <div className="mb-2">
          <Badge variant="secondary" className="text-xs mb-2">
            {product.category}
          </Badge>
          <h3 className="text-lg font-semibold text-card-foreground line-clamp-2 mb-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? "text-accent fill-current"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;