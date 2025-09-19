import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ShoppingCart, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductVariant {
  id: string;
  name: string;
  price?: number;
  quantity: number;
  sku?: string;
  options?: any;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  compare_at_price?: number;
  slug: string;
  quantity: number;
  product_images: {
    id: string;
    image_url: string;
    alt_text?: string;
    position: number;
  }[];
  product_variants: ProductVariant[];
}

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('products')
        .select(`
          id,
          name,
          description,
          price,
          compare_at_price,
          slug,
          quantity,
          product_images (
            id,
            image_url,
            alt_text,
            position
          ),
          product_variants (
            id,
            name,
            price,
            quantity,
            sku,
            options
          )
        `)
        .eq('id', id)
        .eq('status', 'active')
        .single();

      if (error) throw error;
      
      // Sort images by position
      if (data?.product_images) {
        data.product_images.sort((a, b) => (a.position || 0) - (b.position || 0));
      }
      
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add items to your cart.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    setAddingToCart(true);

    try {
      const { error } = await (supabase as any)
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: id,
          variant_id: selectedVariant || null,
          quantity
        });

      if (error) throw error;

      toast({
        title: "Added to Cart",
        description: `${product?.name} has been added to your cart.`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add items to your wishlist.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    try {
      const { error } = await (supabase as any)
        .from('wishlist')
        .insert({
          user_id: user.id,
          product_id: id
        });

      if (error) throw error;

      toast({
        title: "Added to Wishlist",
        description: `${product?.name} has been added to your wishlist.`,
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to add item to wishlist. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="text-center py-12">
          <p className="text-muted-foreground">Product not found.</p>
        </div>
      </div>
    );
  }

  const discountPercentage = product.compare_at_price 
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  const currentPrice = selectedVariant 
    ? product.product_variants.find(v => v.id === selectedVariant)?.price || product.price
    : product.price;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="aspect-square bg-gradient-subtle">
                {product.product_images?.[currentImageIndex] ? (
                  <img
                    src={product.product_images[currentImageIndex].image_url}
                    alt={product.product_images[currentImageIndex].alt_text || product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">No Image</span>
                  </div>
                )}
              </div>
            </Card>
            
            {/* Image Thumbnails */}
            {product.product_images && product.product_images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.product_images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      currentImageIndex === index ? 'border-primary' : 'border-border'
                    }`}
                  >
                    <img
                      src={image.image_url}
                      alt={image.alt_text || `${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
              
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-3xl font-bold text-primary">
                  ${currentPrice.toFixed(2)}
                </span>
                {product.compare_at_price && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      ${product.compare_at_price.toFixed(2)}
                    </span>
                    <Badge variant="destructive">-{discountPercentage}%</Badge>
                  </>
                )}
              </div>
            </div>

            {product.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>
            )}

            {/* Variants */}
            {product.product_variants && product.product_variants.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Options</h3>
                <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.product_variants.map((variant) => (
                      <SelectItem key={variant.id} value={variant.id}>
                        {variant.name} {variant.price && `- $${variant.price.toFixed(2)}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Quantity</h3>
              <Select value={quantity.toString()} onValueChange={(value) => setQuantity(parseInt(value))}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(Math.min(10, product.quantity || 1))].map((_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                disabled={addingToCart || product.quantity === 0}
                className="w-full"
                size="lg"
              >
                {addingToCart && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              
              <Button
                onClick={handleAddToWishlist}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Heart className="mr-2 h-5 w-5" />
                Add to Wishlist
              </Button>
            </div>

            {product.quantity > 0 && product.quantity <= 5 && (
              <Badge variant="destructive" className="text-xs">
                Only {product.quantity} left in stock!
              </Badge>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetailPage;