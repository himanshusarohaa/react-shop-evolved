import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  compare_at_price?: number;
  slug: string;
  featured: boolean;
  product_images: {
    image_url: string;
    alt_text?: string;
  }[];
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('products')
        .select(`
          id,
          name,
          price,
          compare_at_price,
          slug,
          featured,
          product_images (
            image_url,
            alt_text
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Our Products</h1>
          <p className="text-muted-foreground">
            Discover our complete collection of premium products
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const discountPercentage = product.compare_at_price 
              ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
              : 0;

            return (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="group block"
              >
                <Card className="overflow-hidden hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
                  <div className="relative aspect-square overflow-hidden bg-gradient-subtle">
                    {product.product_images?.[0] ? (
                      <img
                        src={product.product_images[0].image_url}
                        alt={product.product_images[0].alt_text || product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">No Image</span>
                      </div>
                    )}
                    
                    {product.compare_at_price && discountPercentage > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute top-3 left-3 px-2 py-1 text-xs font-bold"
                      >
                        -{discountPercentage}%
                      </Badge>
                    )}

                    {product.featured && (
                      <Badge 
                        variant="secondary" 
                        className="absolute top-3 right-3 px-2 py-1 text-xs font-bold"
                      >
                        Featured
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-card-foreground line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-primary">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.compare_at_price && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.compare_at_price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductsPage;