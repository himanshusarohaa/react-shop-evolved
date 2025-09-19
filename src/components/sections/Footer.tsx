import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const footerLinks = {
    "Shop": ["Electronics", "Fashion", "Books", "Home & Garden", "Sports", "Sale"],
    "Customer Service": ["Contact Us", "FAQ", "Shipping Info", "Returns", "Size Guide", "Track Order"],
    "Company": ["About Us", "Careers", "Press", "Sustainability", "Investors", "Terms of Service"],
    "Account": ["My Account", "Order History", "Wishlist", "Rewards", "Gift Cards", "Newsletter"]
  };

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "Youtube", icon: Youtube, href: "#" }
  ];

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="py-12 border-b border-background/20">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-background/80 mb-6">
              Subscribe to our newsletter for exclusive deals and new product announcements
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-background/10 border border-background/30 text-background placeholder-background/60 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
              <Button variant="accent" size="lg" className="whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent mb-4">
              Re-Action
            </h2>
            <p className="text-background/80 mb-6">
              Your premium destination for quality products and exceptional shopping experiences.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-background/80">
                <Mail className="h-4 w-4" />
                <span>support@re-action.com</span>
              </div>
              <div className="flex items-center space-x-3 text-background/80">
                <Phone className="h-4 w-4" />
                <span>1-800-REACTION</span>
              </div>
              <div className="flex items-center space-x-3 text-background/80">
                <MapPin className="h-4 w-4" />
                <span>New York, NY 10001</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-background mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-background/80 hover:text-accent transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-background/20 flex flex-col md:flex-row justify-between items-center">
          <div className="text-background/60 text-sm mb-4 md:mb-0">
            © 2024 Re-Action. All rights reserved.
          </div>
          
          {/* Social Links */}
          <div className="flex space-x-4">
            {socialLinks.map((social) => (
              <Button
                key={social.name}
                variant="ghost"
                size="icon"
                className="text-background/60 hover:text-accent hover:bg-background/10"
                asChild
              >
                <a href={social.href} aria-label={social.name}>
                  <social.icon className="h-5 w-5" />
                </a>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;