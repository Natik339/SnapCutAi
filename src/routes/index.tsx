import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Upload, Sparkles, Zap, Shield, Code2, Image as ImageIcon, Wand2, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SnapCut AI — One Click. Remove Background." },
      { name: "description", content: "AI-powered background removal in under 5 seconds. Pixel-perfect cutouts for creators, e-commerce, and developers." },
      { property: "og:title", content: "SnapCut AI — One Click. Remove Background." },
      { property: "og:description", content: "Pixel-perfect AI background removal in under 5 seconds." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <LogoStrip />
        <Features />
        <HowItWorks />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute top-40 right-10 h-[300px] w-[300px] rounded-full bg-accent/25 blur-[100px]" />
      </div>
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-secondary" />
          Powered by next-gen segmentation AI
        </div>
        <h1 className="mt-6 text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05]">
          Remove backgrounds.
          <br />
          <span className="text-brand-gradient">In one click.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          SnapCut AI delivers studio-grade cutouts in under 5 seconds. Built for creators,
          e-commerce teams, and developers shipping at scale.
        </p>
        <div className="mt-9 flex flex-col sm:flex-row justify-center gap-3">
          <Button size="lg" className="bg-brand-gradient text-primary-foreground border-0 shadow-glow hover:opacity-95 h-12 px-7 text-base">
            <Upload className="mr-2 h-5 w-5" /> Try it free
          </Button>
          <Button size="lg" variant="outline" className="h-12 px-7 text-base bg-card/40 border-border/60 hover:bg-card">
            <Code2 className="mr-2 h-5 w-5" /> View API docs
          </Button>
        </div>

        {/* Hero showcase */}
        <div className="mt-16 mx-auto max-w-4xl">
          <div className="glass rounded-3xl p-3 shadow-card-elevated">
            <div className="grid grid-cols-2 gap-3 rounded-2xl overflow-hidden">
              <div className="relative aspect-[4/5] bg-gradient-to-br from-slate-700 to-slate-900 rounded-l-2xl flex items-center justify-center">
                <div className="absolute top-3 left-3 text-[10px] uppercase tracking-widest text-white/70">Before</div>
                <Silhouette />
              </div>
              <div className="relative aspect-[4/5] rounded-r-2xl flex items-center justify-center bg-[conic-gradient(at_top_left,_oklch(0.21_0.045_265),_oklch(0.16_0.04_265))]"
                   style={{ backgroundImage: "repeating-conic-gradient(oklch(0.25 0.04 265) 0% 25%, oklch(0.20 0.04 265) 0% 50%)", backgroundSize: "24px 24px" }}>
                <div className="absolute top-3 left-3 text-[10px] uppercase tracking-widest text-white/70">After</div>
                <Silhouette />
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Average processing time: <span className="text-foreground font-medium">3.2s</span> · Up to 5000×5000 px · JPG · PNG · WEBP</p>
        </div>
      </div>
    </section>
  );
}

function Silhouette() {
  return (
    <svg viewBox="0 0 200 250" className="h-3/4 w-auto drop-shadow-2xl">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.82 0.14 200)" />
          <stop offset="100%" stopColor="oklch(0.65 0.20 260)" />
        </linearGradient>
      </defs>
      <path fill="url(#g1)" d="M100 35c20 0 36 18 36 42s-16 42-36 42-36-18-36-42 16-42 36-42zm-70 215c0-50 30-78 70-78s70 28 70 78z"/>
    </svg>
  );
}

function LogoStrip() {
  return (
    <section className="mx-auto max-w-7xl px-6">
      <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">Trusted by teams at</p>
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-6 opacity-60">
        {["Pixelry", "Northwind", "Studio·9", "Lumen", "Catalyst", "Forge"].map((n) => (
          <div key={n} className="text-center font-display font-semibold tracking-wide">{n}</div>
        ))}
      </div>
    </section>
  );
}

const features = [
  { icon: Zap, title: "Sub-5s processing", desc: "Edge-optimized AI pipeline returns transparent PNGs in seconds." },
  { icon: Wand2, title: "Hair & edge precision", desc: "Pixel-grade alpha matting that preserves fine strands." },
  { icon: Code2, title: "Developer API", desc: "REST endpoint with API keys, rate limits, and usage tracking." },
  { icon: Shield, title: "Private by default", desc: "Auto-deleted after 24h. HTTPS everywhere. GDPR-ready." },
  { icon: ImageIcon, title: "5K resolution", desc: "Up to 5000×5000 px input. Original quality output." },
  { icon: Sparkles, title: "Batch & bulk", desc: "Process catalogs of product shots without breaking a sweat." },
];

function Features() {
  return (
    <section className="mx-auto max-w-7xl px-6 mt-32">
      <div className="max-w-2xl">
        <h2 className="text-4xl md:text-5xl font-bold">Built for speed.<br /><span className="text-brand-gradient">Engineered for scale.</span></h2>
        <p className="mt-4 text-muted-foreground">Everything you need to ship background removal in production — without managing the infrastructure.</p>
      </div>
      <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f) => (
          <div key={f.title} className="glass rounded-2xl p-6 hover:shadow-glow transition-shadow group">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient shadow-glow">
              <f.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", t: "Upload", d: "Drag-drop or pick a JPG, PNG, or WEBP up to 10 MB." },
    { n: "02", t: "AI Cutout", d: "Our segmentation engine isolates the subject with edge precision." },
    { n: "03", t: "Download", d: "Get a transparent PNG, ready for your storefront, deck, or post." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 mt-32">
      <h2 className="text-4xl md:text-5xl font-bold text-center">How it works</h2>
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        {steps.map((s) => (
          <div key={s.n} className="relative glass rounded-2xl p-7">
            <div className="text-5xl font-display font-bold text-brand-gradient">{s.n}</div>
            <h3 className="mt-3 text-xl font-semibold">{s.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const plans = [
  { name: "Free", price: "$0", cadence: "forever", features: ["5 images / day", "Up to 2K resolution", "Standard queue", "Community support"], cta: "Start free" },
  { name: "Pro", price: "$19", cadence: "per month", features: ["Unlimited images", "Up to 5K resolution", "Priority processing", "Email support"], cta: "Go Pro", highlight: true },
  { name: "API / Business", price: "Custom", cadence: "talk to us", features: ["REST API access", "API keys + rate limits", "SLA + analytics", "Dedicated support"], cta: "Contact sales" },
];

function Pricing() {
  return (
    <section className="mx-auto max-w-7xl px-6 mt-32">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold">Simple pricing.<br /><span className="text-brand-gradient">Scale when you're ready.</span></h2>
        <p className="mt-4 text-muted-foreground">Start free. Upgrade when your catalog grows.</p>
      </div>
      <div className="mt-12 grid md:grid-cols-3 gap-5">
        {plans.map((p) => (
          <div key={p.name} className={`relative rounded-2xl p-7 ${p.highlight ? "bg-brand-soft border-2 border-primary/50 shadow-glow" : "glass"}`}>
            {p.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-gradient px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">Most popular</span>
            )}
            <h3 className="font-display text-lg font-semibold">{p.name}</h3>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-bold">{p.price}</span>
              <span className="text-sm text-muted-foreground">{p.cadence}</span>
            </div>
            <ul className="mt-6 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button className={`mt-7 w-full ${p.highlight ? "bg-brand-gradient text-primary-foreground border-0 shadow-glow" : "bg-card border border-border hover:bg-muted"}`}>
              {p.cta}
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-5xl px-6 mt-32">
      <div className="relative overflow-hidden rounded-3xl bg-brand-gradient p-12 text-center shadow-glow">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white, transparent 40%)" }} />
        <div className="relative">
          <Logo className="mx-auto h-16 w-16" />
          <h2 className="mt-5 text-4xl md:text-5xl font-bold text-primary-foreground">Ready to cut the background?</h2>
          <p className="mt-3 text-primary-foreground/80">Join thousands of creators shipping faster with SnapCut AI.</p>
          <Button size="lg" className="mt-7 bg-background text-foreground hover:bg-background/90 h-12 px-8 text-base">
            Start free — no card required
          </Button>
        </div>
      </div>
    </section>
  );
}
