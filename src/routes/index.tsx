import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ImageUploader } from "@/components/ImageUploader";
import { 
  Upload, 
  Sparkles, 
  Zap, 
  Shield, 
  Code2, 
  Image as ImageIcon, 
  Wand2, 
  CheckCircle2,
  Clock,
  Download,
  Trash2,
  Home,
  History
} from "lucide-react";
import { useState, useEffect } from "react";

// TypeScript interface for history items
interface HistoryItem {
  id: string;
  originalUrl: string;
  processedUrl: string;
  timestamp: number;
}

// localStorage keys
const HISTORY_KEY = "bg-remover-history";

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
  const [activeTab, setActiveTab] = useState<'home' | 'history'>('home');
  
  // Load history from localStorage
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  useEffect(() => {
    const savedHistory = localStorage.getItem(HISTORY_KEY);
    if (savedHistory) {
      try {
        const parsedHistory: HistoryItem[] = JSON.parse(savedHistory);
        const secureHistory = parsedHistory.map(item => {
          let secureProcessedUrl = item.processedUrl;
          if (secureProcessedUrl.startsWith('http://')) {
            secureProcessedUrl = secureProcessedUrl.replace('http://', 'https://');
          }
          return { ...item, processedUrl: secureProcessedUrl };
        });
        setHistory(secureHistory);
      } catch (e) {
        console.error("Failed to parse history from localStorage", e);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  // Add item to history
  const addToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: Date.now()
    };
    setHistory(prev => [newItem, ...prev]);
  };

  // Delete item from history
  const deleteFromHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  // Download image
  const downloadImage = async (url: string, filename: string = 'removed-bg.png') => {
    try {
      let secureUrl = url;
      if (secureUrl.startsWith('http://')) {
        secureUrl = secureUrl.replace('http://', 'https://');
      }
      const response = await fetch(secureUrl);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download failed:", error);
      let secureUrl = url;
      if (secureUrl.startsWith('http://')) {
        secureUrl = secureUrl.replace('http://', 'https://');
      }
      window.open(secureUrl, '_blank');
    }
  };

  // Load Razorpay Script
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Handle Razorpay Checkout
  const handlePurchase = async (amount: number) => {
    if (!razorpayLoaded || !window.Razorpay) {
      alert('Razorpay SDK is loading. Please try again in a moment.');
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_T1ATrVxQVLScv1', // Use env var, fallback to test key
      amount: amount,
      currency: 'INR',
      name: 'SnapCut AI',
      description: 'Pro Plan Subscription',
      image: '/snapcut-logo.png',
      handler: function (response: any) {
        alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
        // Here you would verify the payment on your backend
      },
      prefill: {
        name: 'Your Name',
        email: 'your.email@example.com',
        contact: '9999999999'
      },
      notes: {
        'address': 'SnapCut AI Office'
      },
      theme: {
        color: '#0ea5e9'
      }
    };

    const razorpayInstance = new (window as any).Razorpay(options);
    razorpayInstance.open();
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Tabs */}
        <div className="flex justify-center gap-2 pt-6 px-4">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-6 py-2 rounded-full flex items-center gap-2 transition-all ${
              activeTab === 'home' 
                ? 'bg-brand-gradient text-primary-foreground shadow-glow' 
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            <Home className="w-4 h-4" />
            Home
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2 rounded-full flex items-center gap-2 transition-all ${
              activeTab === 'history' 
                ? 'bg-brand-gradient text-primary-foreground shadow-glow' 
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            <History className="w-4 h-4" />
            History
            {history.length > 0 && (
              <span className="bg-foreground text-background text-xs px-2 py-0.5 rounded-full">
                {history.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'home' ? (
          <>
            <Hero 
              addToHistory={addToHistory} 
              downloadImage={downloadImage}
            />
            <LogoStrip />
            <Features />
            <HowItWorks />
            <Pricing onPurchase={handlePurchase} />
            <CTA />
          </>
        ) : (
          <HistoryView 
            history={history} 
            deleteFromHistory={deleteFromHistory}
            downloadImage={downloadImage}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

interface HeroProps {
  addToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  downloadImage: (url: string, filename?: string) => void;
}

function Hero({ addToHistory, downloadImage }: HeroProps) {
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Helper: Convert data URL to Blob
  const dataURLtoBlob = (dataurl: string) => {
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) return null;
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  // Background removal with webhook
  const handleRemoveBackground = async () => {
    if (!uploadedImage) return;
    setIsProcessing(true);

    try {
      // Convert data URL to binary blob
      const imageBlob = dataURLtoBlob(uploadedImage);
      if (!imageBlob) throw new Error("Failed to convert image");

      // Create form data to send the file
      const formData = new FormData();
      formData.append("image", imageBlob, "image.png");

      // Send to webhook
      const response = await fetch(
        "https://natikg16.app.n8n.cloud/webhook/remove-background",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status}`);
      }

      // Get processed image URL from JSON response
      const result = await response.json();
      if (result.url) {
        let secureUrl = result.url;
        if (secureUrl.startsWith('http://')) {
          secureUrl = secureUrl.replace('http://', 'https://');
        }
        setProcessedImage(secureUrl);
        // Add to history
        if (uploadedImage) {
          addToHistory({
            originalUrl: uploadedImage,
            processedUrl: secureUrl
          });
        }
      } else {
        throw new Error("No URL in webhook response");
      }
    } catch (error) {
      console.error("Error removing background:", error);
      // Fallback for demo purposes
      setProcessedImage(uploadedImage);
    } finally {
      // Always set processing to false when done
      setIsProcessing(false);
    }
  };

  return (
    <>
      <ImageUploader 
        isOpen={isUploaderOpen} 
        onClose={() => setIsUploaderOpen(false)} 
        onImageSelect={(imageUrl: string) => {
          setUploadedImage(imageUrl);
          setProcessedImage(null);
        }}
      />
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
          
          {/* Upload or Remove Background button */}
          <div className="mt-9 flex flex-col sm:flex-row justify-center gap-3">
            {!uploadedImage ? (
              <Button 
                size="lg" 
                className="bg-brand-gradient text-primary-foreground border-0 shadow-glow hover:opacity-95 h-12 px-7 text-base"
                onClick={() => setIsUploaderOpen(true)}
              >
                <Upload className="mr-2 h-5 w-5" /> Try it free
              </Button>
            ) : (
              <>
                <Button 
                  size="lg" 
                  className="bg-brand-gradient text-primary-foreground border-0 shadow-glow hover:opacity-95 h-12 px-7 text-base"
                  onClick={handleRemoveBackground}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  ) : (
                    <Wand2 className="mr-2 h-5 w-5" />
                  )}
                  {isProcessing ? "Processing..." : "Remove Background"}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="h-12 px-7 text-base bg-card/40 border-border/60 hover:bg-card"
                  onClick={() => {
                    setUploadedImage(null);
                    setProcessedImage(null);
                  }}
                >
                  Upload another
                </Button>
              </>
            )}
            {!uploadedImage && (
              <Button size="lg" variant="outline" className="h-12 px-7 text-base bg-card/40 border-border/60 hover:bg-card">
                <Code2 className="mr-2 h-5 w-5" /> View API docs
              </Button>
            )}
          </div>

        {/* Before/After Showcase */}
        <div className="mt-16 mx-auto max-w-4xl">
          <div className="glass rounded-3xl p-3 shadow-card-elevated">
            <div className="grid grid-cols-2 gap-3 rounded-2xl overflow-hidden">
              {/* Before */}
              <div className="relative aspect-[4/5] bg-gradient-to-br from-slate-700 to-slate-900 rounded-l-2xl flex items-center justify-center">
                <div className="absolute top-3 left-3 text-[10px] uppercase tracking-widest text-white/70">Before</div>
                {uploadedImage ? (
                  <img 
                    src={uploadedImage} 
                    alt="Before" 
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <Silhouette />
                )}
              </div>
              
              {/* After */}
              <div className="relative aspect-[4/5] rounded-r-2xl flex items-center justify-center bg-[conic-gradient(at_top_left,_oklch(0.21_0.045_265),_oklch(0.16_0.04_265))]"
                   style={{ backgroundImage: "repeating-conic-gradient(oklch(0.25 0.04 265) 0% 25%, oklch(0.20 0.04 265) 0% 50%)", backgroundSize: "24px 24px" }}>
                <div className="absolute top-3 left-3 text-[10px] uppercase tracking-widest text-white/70">After</div>
                {processedImage ? (
                  <div className="relative h-full w-full flex items-center justify-center">
                    <img 
                      src={processedImage} 
                      alt="After" 
                      className="h-full w-full object-contain"
                    />
                    <button
                      onClick={() => downloadImage(processedImage)}
                      className="absolute bottom-4 right-4 px-4 py-2 bg-brand-gradient text-primary-foreground rounded-full shadow-glow flex items-center gap-2 hover:opacity-90 transition-opacity"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                ) : uploadedImage && isProcessing ? (
                  <div className="flex flex-col items-center gap-2 text-white/70">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white" />
                    <span className="text-sm">Removing background...</span>
                  </div>
                ) : (
                  <Silhouette />
                )}
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Average processing time: <span className="text-foreground font-medium">3.2s</span> · Up to 5000×5000 px · JPG · PNG · WEBP</p>
        </div>
      </div>
    </section>
    </>
  );
}

// History View Component
interface HistoryViewProps {
  history: HistoryItem[];
  deleteFromHistory: (id: string) => void;
  downloadImage: (url: string, filename?: string) => void;
}

function HistoryView({ history, deleteFromHistory, downloadImage }: HistoryViewProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (history.length === 0) {
    return (
      <section className="py-20 px-6 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <Clock className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No History Yet</h2>
          <p className="text-muted-foreground mb-6">
            Start removing backgrounds and your edits will appear here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Your Background Removals</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item) => (
            <div 
              key={item.id} 
              className="glass rounded-2xl overflow-hidden shadow-card hover:shadow-glow transition-all"
            >
              <div className="grid grid-cols-2">
                <div className="relative aspect-square bg-gradient-to-br from-slate-700 to-slate-900">
                  <div className="absolute top-2 left-2 text-[10px] uppercase tracking-widest text-white/70 bg-black/50 px-2 py-1 rounded-full">Before</div>
                  <img 
                    src={item.originalUrl} 
                    alt="Before" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div 
                  className="relative aspect-square"
                  style={{ 
                    backgroundImage: "repeating-conic-gradient(oklch(0.25 0.04 265) 0% 25%, oklch(0.20 0.04 265) 0% 50%)", 
                    backgroundSize: "20px 20px" 
                  }}
                >
                  <div className="absolute top-2 left-2 text-[10px] uppercase tracking-widest text-white/70 bg-black/50 px-2 py-1 rounded-full">After</div>
                  <img 
                    src={item.processedUrl} 
                    alt="After" 
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-muted-foreground">
                    {formatDate(item.timestamp)}
                  </span>
                  <button
                    onClick={() => deleteFromHistory(item.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    title="Delete from history"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => downloadImage(item.processedUrl, `bg-removed-${item.id}.png`)}
                  className="w-full py-2 px-4 bg-brand-gradient text-primary-foreground rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          ))}
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
  { name: "Free", price: "₹0", cadence: "forever", features: ["5 images / day", "Up to 2K resolution", "Standard queue", "Community support"], cta: "Start free", amount: 0 },
  { name: "Pro", price: "₹999", cadence: "per month", features: ["Unlimited images", "Up to 5K resolution", "Priority processing", "Email support"], cta: "Go Pro", highlight: true, amount: 99900 }, // 999 INR in paise
  { name: "API / Business", price: "Custom", cadence: "talk to us", features: ["REST API access", "API keys + rate limits", "SLA + analytics", "Dedicated support"], cta: "Contact sales", amount: 0 },
];

function Pricing({ onPurchase }: { onPurchase: (amount: number) => void }) {
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
            {p.amount > 0 ? (
              <Button 
                onClick={() => onPurchase(p.amount)} 
                className={`mt-7 w-full ${p.highlight ? "bg-brand-gradient text-primary-foreground border-0 shadow-glow" : "bg-card border border-border hover:bg-muted"}`}
              >
                {p.cta}
              </Button>
            ) : (
              <Button className={`mt-7 w-full ${p.highlight ? "bg-brand-gradient text-primary-foreground border-0 shadow-glow" : "bg-card border border-border hover:bg-muted"}`}>
                {p.cta}
              </Button>
            )}
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
