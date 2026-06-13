import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="border-t border-border/40 mt-24">
      <div className="mx-auto max-w-7xl px-6 py-12 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <Logo className="h-10 w-10" />
            <span className="font-display text-lg font-bold">
              SnapCut <span className="text-brand-gradient">AI</span>
            </span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            One click. Remove background. Pixel-perfect AI cutouts in under 5 seconds.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Product</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground transition-colors">Home</Link></li>
            <li><Link to="/" className="hover:text-foreground transition-colors">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Legal & Support</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms-conditions" className="hover:text-foreground transition-colors">Terms & Conditions</Link></li>
            <li><Link to="/refund-policy" className="hover:text-foreground transition-colors">Refund Policy</Link></li>
            <li><Link to="/shipping-delivery" className="hover:text-foreground transition-colors">Shipping & Delivery</Link></li>
            <li><Link to="/contact-us" className="hover:text-foreground transition-colors">Contact Us</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} SnapCut AI. All rights reserved.
      </div>
    </footer>
  );
}
