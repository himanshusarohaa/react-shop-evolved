import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Heart, Truck, Shield, RotateCcw } from "lucide-react";

// Sample detailed product data that would come from the database
export const getProductDetails = (id: string) => {
  const productDetails = {
    "1": {
      description: "The MacBook Pro with M3 Max chip delivers exceptional performance for professionals and creatives. Featuring a stunning 16-inch Liquid Retina XDR display, up to 128GB of unified memory, and all-day battery life. Perfect for video editing, 3D rendering, and demanding creative workflows.",
      features: [
        "M3 Max chip with 16-core CPU and 40-core GPU",
        "16-inch Liquid Retina XDR display",
        "1TB SSD storage with blazing-fast speeds",
        "Up to 22 hours of battery life",
        "Three Thunderbolt 4 ports, HDMI port, SDXC card slot",
        "1080p FaceTime HD camera with advanced image signal processor",
        "Six-speaker sound system with Spatial Audio support"
      ],
      specifications: {
        "Display": "16-inch Liquid Retina XDR",
        "Processor": "Apple M3 Max",
        "Memory": "36GB Unified Memory", 
        "Storage": "1TB SSD",
        "Graphics": "40-core GPU",
        "Weight": "4.7 pounds (2.16 kg)",
        "Battery": "Up to 22 hours"
      },
      reviews: [
        {
          id: "r1",
          user: "Sarah Chen",
          rating: 5,
          date: "2024-01-15",
          title: "Perfect for Creative Work",
          comment: "This MacBook Pro has completely transformed my video editing workflow. The M3 Max chip handles 4K footage effortlessly, and the battery life is incredible. Highly recommend for creative professionals."
        },
        {
          id: "r2", 
          user: "Mike Rodriguez",
          rating: 5,
          date: "2024-01-10",
          title: "Best Investment I've Made",
          comment: "Coming from an Intel MacBook, the performance difference is night and day. Everything is so fast and smooth. The display quality is stunning too."
        },
        {
          id: "r3",
          user: "Emily Johnson",
          rating: 4,
          date: "2024-01-08",
          title: "Great but Expensive",
          comment: "The performance is excellent and build quality is top-notch. Only downside is the price, but you definitely get what you pay for."
        }
      ]
    },
    "2": {
      description: "Experience the perfect blend of legendary sound quality and industry-leading noise cancellation with the Sony WH-1000XM5. These premium wireless headphones feature cutting-edge technology for an unparalleled audio experience.",
      features: [
        "Industry-leading noise cancellation with V1 processor",
        "Exceptional sound quality with 30mm drivers",
        "Up to 30 hours of battery life with quick charge",
        "Multipoint connection for seamless device switching",
        "Speak-to-Chat technology automatically pauses music",
        "Touch sensor controls for easy playback control",
        "Comfortable lightweight design for all-day wear"
      ],
      specifications: {
        "Driver Unit": "30mm dynamic drivers",
        "Frequency Response": "4Hz-40,000Hz",
        "Battery Life": "Up to 30 hours",
        "Connectivity": "Bluetooth 5.2, NFC",
        "Weight": "250g",
        "Charging": "USB-C quick charge",
        "Voice Assistant": "Alexa, Google Assistant"
      },
      reviews: [
        {
          id: "r4",
          user: "David Park",
          rating: 5,
          date: "2024-01-12",
          title: "Best Noise Cancelling Headphones",
          comment: "The noise cancellation is incredible - I can't hear anything when it's on. Sound quality is crisp and clear. Perfect for flights and commuting."
        },
        {
          id: "r5",
          user: "Lisa Wang",
          rating: 4,
          date: "2024-01-05",
          title: "Excellent Audio Quality",
          comment: "Great headphones with amazing sound. The battery life is fantastic. Only wish they folded smaller for travel."
        }
      ]
    },
    "3": {
      description: "The iPhone 15 Pro Max represents the pinnacle of smartphone technology. With the powerful A17 Pro chip, revolutionary titanium design, and the most advanced iPhone camera system ever, it's built for professionals who demand the best.",
      features: [
        "A17 Pro chip with 6-core GPU for console-quality gaming",
        "Titanium design - strong, light, and durable",
        "48MP Main camera with 5x Telephoto zoom",
        "Action Button for quick access to favorite features",
        "USB-C connectivity with fast data transfer",
        "All-day battery life with wireless charging",
        "iOS 17 with advanced privacy and security features"
      ],
      specifications: {
        "Display": "6.7-inch Super Retina XDR",
        "Chip": "A17 Pro",
        "Storage": "256GB",
        "Camera": "48MP triple camera system",
        "Battery": "Up to 29 hours video playback",
        "Materials": "Titanium with Ceramic Shield",
        "Water Resistance": "IP68"
      },
      reviews: [
        {
          id: "r6",
          user: "Alex Thompson",
          rating: 5,
          date: "2024-01-18",
          title: "Camera is Incredible",
          comment: "The camera quality is absolutely stunning. The 5x zoom is perfect for photography. The titanium build feels premium and the phone is noticeably lighter than previous models."
        },
        {
          id: "r7",
          user: "Maria Santos",
          rating: 5,
          date: "2024-01-14",
          title: "Best iPhone Yet",
          comment: "Upgraded from iPhone 13 Pro and the difference is huge. Much faster, better cameras, and love the new Action Button. Worth every penny."
        }
      ]
    }
  };
  
  return productDetails[id as keyof typeof productDetails] || null;
};

interface ProductDetailEnhancedProps {
  productId: string;
  productName: string;
}

const ProductDetailEnhanced = ({ productId, productName }: ProductDetailEnhancedProps) => {
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');
  const productDetails = getProductDetails(productId);

  if (!productDetails) {
    return (
      <div className="mt-8">
        <div className="border-b border-border mb-6">
          <nav className="-mb-px flex space-x-8">
            <button className="py-2 px-1 border-b-2 border-primary text-primary font-medium">
              Description
            </button>
          </nav>
        </div>
        <div className="prose max-w-none">
          <p className="text-muted-foreground">
            Experience premium quality and innovative design with {productName}. 
            This product combines cutting-edge technology with exceptional craftsmanship 
            to deliver outstanding performance and reliability.
          </p>
        </div>
      </div>
    );
  }

  const { description, features, specifications, reviews } = productDetails;

  return (
    <div className="mt-8">
      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center space-x-2">
          <Truck className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Free Shipping</span>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">2 Year Warranty</span>
        </div>
        <div className="flex items-center space-x-2">
          <RotateCcw className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">30-Day Returns</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-6">
        <nav className="-mb-px flex space-x-8">
          {['description', 'specifications', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'description' && (
          <div className="space-y-6">
            <div className="prose max-w-none">
              <p className="text-muted-foreground leading-relaxed">{description}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Key Features</h3>
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'specifications' && (
          <div className="overflow-hidden">
            <table className="min-w-full">
              <tbody className="divide-y divide-border">
                {Object.entries(specifications).map(([key, value]) => (
                  <tr key={key} className="hover:bg-muted/50">
                    <td className="py-3 px-0 text-sm font-medium text-foreground w-1/3">
                      {key}
                    </td>
                    <td className="py-3 px-0 text-sm text-muted-foreground">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Customer Reviews</h3>
                <p className="text-sm text-muted-foreground">{reviews.length} reviews</p>
              </div>
              <Button variant="outline" size="sm">
                Write a Review
              </Button>
            </div>
            
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-border pb-6 last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">{review.user}</span>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "text-accent fill-current"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <h4 className="font-medium text-sm mb-2">{review.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailEnhanced;