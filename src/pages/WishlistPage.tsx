import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WishlistItem {
  id: string;
  created_at: string;
  products: {
    id: string;
    name: string;
    price: number;
    compare_at_price?: number;
    slug: string;
    product_images: {
      image_url: string;
      alt_text?: string;
    }[];
  };
}

const WishlistPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchWishlistItems();
  }, [user, navigate]);

  const fetchWishlistItems = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('wishlist')
        .select(`
          id,
          created_at,
          products (
            id,
            name,
            price,
            compare_at_price,
            slug,
            product_images (
              image_url,
              alt_text
            )
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWishlistItems(data || []);
    } catch (error) {
      console.error('Error fetching wishlist items:', error);
      toast({
        title: "Error",
        description: "Failed to load wishlist items.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (itemId: string) => {
    setRemoving(itemId);
    try {
      const { error } = await (supabase as any)
        .from('wishlist')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
      toast({
        title: "Removed from Wishlist",
        description: "Item has been removed from your wishlist.",
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist.",
        variant: "destructive",
      });
    } finally {
      setRemoving(null);
    }
  };

  const addToCart = async (productId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      const { error } = await (supabase as any)
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: productId,
          quantity: 1
        });

      if (error) throw error;

      toast({
        title: "Added to Cart",
        description: "Item has been added to your cart.",
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">My Wishlist</h1>
          <p className="text-muted-foreground">
            Keep track of items you love for later
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add items to your wishlist by clicking the heart icon on products.
            </p>
            <Link to="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => {
              const discountPercentage = item.products.compare_at_price 
                ? Math.round(((item.products.compare_at_price - item.products.price) / item.products.compare_at_price) * 100)
                : 0;

              return (
                <Card key={item.id} className="group overflow-hidden hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
                  <div className="relative aspect-square overflow-hidden bg-gradient-subtle">
                    <Link to={`/products/${item.products.id}`}>
                      {item.products.product_images?.[0] ? (
                        <img
                          src={item.products.product_images[0].image_url}
                          alt={item.products.product_images[0].alt_text || item.products.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <span className="text-muted-foreground">No Image</span>
                        </div>
                      )}
                    </Link>

                    {/* Remove from wishlist button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-sm hover:bg-background text-destructive"
                      onClick={() => removeFromWishlist(item.id)}
                      disabled={removing === item.id}
                    >
                      {removing === item.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>

                    {/* Sale badge */}
                    {item.products.compare_at_price && discountPercentage > 0 && (
                      <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground px-2 py-1 text-xs font-bold rounded">
                        -{discountPercentage}%
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <Link to={`/products/${item.products.id}`}>
                      <h3 className="text-lg font-semibold text-card-foreground line-clamp-2 mb-2 hover:text-primary transition-colors">
                        {item.products.name}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-primary">
                          ${item.products.price.toFixed(2)}
                        </span>
                        {item.products.compare_at_price && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${item.products.compare_at_price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={() => addToCart(item.products.id)}
                      className="w-full"
                      size="sm"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default WishlistPage;