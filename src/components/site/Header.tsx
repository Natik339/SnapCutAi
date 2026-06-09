import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/", label: "Home" },
  { to: "/features", label: "Features" },
  { to: "/pricing", label: "Pricing" },
  { to: "/api-docs", label: "API" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 backdrop-blur-xl bg-background/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-3">
          <Logo className="h-9 w-9" />
          <span className="font-display text-lg font-bold tracking-tight">
            SnapCut <span className="text-brand-gradient">AI</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              activeProps={{ className: "px-3 py-2 text-sm text-foreground" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            Sign in
          </Button>
          <Button size="sm" className="bg-brand-gradient text-primary-foreground border-0 shadow-glow hover:opacity-95">
            Get started
          </Button>
        </div>
      </div>
    </header>
  );
}
