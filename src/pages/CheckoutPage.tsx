import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  quantity: number;
  product_id: string;
  variant_id?: string;
  products: {
    id: string;
    name: string;
    price: number;
  };
  product_variants?: {
    id: string;
    name: string;
    price?: number;
  };
}

const CheckoutPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    // Shipping Address
    shipping_full_name: '',
    shipping_address_line_1: '',
    shipping_address_line_2: '',
    shipping_city: '',
    shipping_state: '',
    shipping_postal_code: '',
    shipping_country: '',
    shipping_phone: '',
    
    // Billing Address
    billing_same_as_shipping: true,
    billing_full_name: '',
    billing_address_line_1: '',
    billing_address_line_2: '',
    billing_city: '',
    billing_state: '',
    billing_postal_code: '',
    billing_country: '',
    billing_phone: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchCartItems();
  }, [user, navigate]);

  const fetchCartItems = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('cart_items')
        .select(`
          id,
          quantity,
          product_id,
          variant_id,
          products (
            id,
            name,
            price
          ),
          product_variants (
            id,
            name,
            price
          )
        `)
        .eq('user_id', user?.id);

      if (error) throw error;
      if (!data || data.length === 0) {
        navigate('/cart');
        return;
      }
      setCartItems(data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast({
        title: "Error",
        description: "Failed to load cart items.",
        variant: "destructive",
      });
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product_variants?.price || item.products.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const calculateTax = (subtotal: number) => {
    return subtotal * 0.08; // 8% tax rate
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    return subtotal + tax;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || cartItems.length === 0) return;

    setProcessing(true);

    try {
      const subtotal = calculateSubtotal();
      const taxAmount = calculateTax(subtotal);
      const totalAmount = subtotal + taxAmount;
      
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Create shipping address
      const shippingAddress = {
        full_name: formData.shipping_full_name,
        address_line_1: formData.shipping_address_line_1,
        address_line_2: formData.shipping_address_line_2,
        city: formData.shipping_city,
        state: formData.shipping_state,
        postal_code: formData.shipping_postal_code,
        country: formData.shipping_country,
        phone: formData.shipping_phone,
      };

      // Create billing address
      const billingAddress = formData.billing_same_as_shipping ? shippingAddress : {
        full_name: formData.billing_full_name,
        address_line_1: formData.billing_address_line_1,
        address_line_2: formData.billing_address_line_2,
        city: formData.billing_city,
        state: formData.billing_state,
        postal_code: formData.billing_postal_code,
        country: formData.billing_country,
        phone: formData.billing_phone,
      };

      // Create order
      const { data: order, error: orderError } = await (supabase as any)
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          subtotal,
          tax_amount: taxAmount,
          shipping_amount: 0,
          total_amount: totalAmount,
          shipping_address: shippingAddress,
          billing_address: billingAddress,
          status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        product_name: item.products.name,
        variant_name: item.product_variants?.name,
        quantity: item.quantity,
        price: item.product_variants?.price || item.products.price,
        total: (item.product_variants?.price || item.products.price) * item.quantity
      }));

      const { error: itemsError } = await (supabase as any)
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      const { error: clearCartError } = await (supabase as any)
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (clearCartError) throw clearCartError;

      toast({
        title: "Order Placed Successfully!",
        description: `Your order ${orderNumber} has been placed.`,
      });

      navigate(`/orders/${order.id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Checkout</h1>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Shipping & Billing Forms */}
            <div className="space-y-6">
              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="shipping_full_name">Full Name</Label>
                    <Input
                      id="shipping_full_name"
                      value={formData.shipping_full_name}
                      onChange={(e) => handleInputChange('shipping_full_name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="shipping_address_line_1">Address Line 1</Label>
                    <Input
                      id="shipping_address_line_1"
                      value={formData.shipping_address_line_1}
                      onChange={(e) => handleInputChange('shipping_address_line_1', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="shipping_address_line_2">Address Line 2 (Optional)</Label>
                    <Input
                      id="shipping_address_line_2"
                      value={formData.shipping_address_line_2}
                      onChange={(e) => handleInputChange('shipping_address_line_2', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="shipping_city">City</Label>
                      <Input
                        id="shipping_city"
                        value={formData.shipping_city}
                        onChange={(e) => handleInputChange('shipping_city', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="shipping_state">State</Label>
                      <Input
                        id="shipping_state"
                        value={formData.shipping_state}
                        onChange={(e) => handleInputChange('shipping_state', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="shipping_postal_code">Postal Code</Label>
                      <Input
                        id="shipping_postal_code"
                        value={formData.shipping_postal_code}
                        onChange={(e) => handleInputChange('shipping_postal_code', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="shipping_country">Country</Label>
                      <Input
                        id="shipping_country"
                        value={formData.shipping_country}
                        onChange={(e) => handleInputChange('shipping_country', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="shipping_phone">Phone (Optional)</Label>
                    <Input
                      id="shipping_phone"
                      value={formData.shipping_phone}
                      onChange={(e) => handleInputChange('shipping_phone', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Billing Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Billing Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="billing_same_as_shipping"
                      checked={formData.billing_same_as_shipping}
                      onChange={(e) => handleInputChange('billing_same_as_shipping', e.target.checked.toString())}
                      className="rounded"
                    />
                    <Label htmlFor="billing_same_as_shipping">Same as shipping address</Label>
                  </div>

                  {!formData.billing_same_as_shipping && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="billing_full_name">Full Name</Label>
                        <Input
                          id="billing_full_name"
                          value={formData.billing_full_name}
                          onChange={(e) => handleInputChange('billing_full_name', e.target.value)}
                          required={!formData.billing_same_as_shipping}
                        />
                      </div>
                      {/* Add other billing fields similar to shipping */}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item) => {
                    const price = item.product_variants?.price || item.products.price;
                    return (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.products.name}</p>
                          {item.product_variants && (
                            <p className="text-sm text-muted-foreground">{item.product_variants.name}</p>
                          )}
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-medium">${(price * item.quantity).toFixed(2)}</span>
                      </div>
                    );
                  })}
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${calculateTax(calculateSubtotal()).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={processing}>
                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Place Order
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CheckoutPage;