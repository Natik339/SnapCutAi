import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ImageUploader } from "@/components/ImageUploader";
import {
  AuthRequiredDialog,
  PurchaseSuccessDialog,
  UpgradeDialog,
} from "@/components/UpgradeFlowDialogs";
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
  Home,
  History,
  Lock,
  AlertCircle,
  CreditCard
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useHistory } from "@/hooks/useHistory";
import { HistoryGrid } from "@/components/HistoryGrid";
import { downloadImage, getHistoryItemName } from "@/lib/history-utils";
import type { HistoryInsert } from "@/types/history";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SnapCut — One Click. Remove Background." },
      { name: "description", content: "AI-powered background removal in under 5 seconds. Pixel-perfect cutouts for creators, e-commerce, and developers." },
      { property: "og:title", content: "SnapCut — One Click. Remove Background." },
      { property: "og:description", content: "Pixel-perfect AI background removal in under 5 seconds." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const [activeTab, setActiveTab] = useState<'home' | 'history'>('home');
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);
  const [purchaseSuccessId, setPurchaseSuccessId] = useState<string | null>(null);
  const { user } = useAuth();
  const { history, isLoading, addToHistory, deleteFromHistory, renameHistoryItem, incrementDownloadCount } = useHistory();

  // Handle Razorpay Checkout
  const handlePurchase = async (_amount: number) => {
    if (!user) {
      setIsAuthDialogOpen(true);
      return;
    }

    setIsUpgradeDialogOpen(true);
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
              incrementDownloadCount={incrementDownloadCount}
            />
            <LogoStrip />
            <Features />
            <HowItWorks />
            <Pricing onPurchase={handlePurchase} />
            <CTA />
          </>
        ) : (
          <HistoryGrid
            history={history}
            onDelete={deleteFromHistory}
            onRename={renameHistoryItem}
            onDownload={incrementDownloadCount}
            isLoading={isLoading}
          />
        )}
      </main>
      <Footer />
      <AuthRequiredDialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
      <UpgradeDialog
        open={isUpgradeDialogOpen}
        onOpenChange={setIsUpgradeDialogOpen}
        onRequireAuth={() => setIsAuthDialogOpen(true)}
        onSuccess={(paymentId) => setPurchaseSuccessId(paymentId)}
        entryPoint="home"
      />
      <PurchaseSuccessDialog
        open={Boolean(purchaseSuccessId)}
        onOpenChange={(open) => {
          if (!open) {
            setPurchaseSuccessId(null);
          }
        }}
        paymentId={purchaseSuccessId}
      />
    </div>
  );
}

interface HeroProps {
  addToHistory: (item: HistoryInsert) => Promise<unknown>;
  downloadImage: (url: string, filename?: string) => Promise<void>;
  incrementDownloadCount: (id: string) => Promise<unknown>;
}

function Hero({ addToHistory, downloadImage, incrementDownloadCount }: HeroProps) {
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generationTime, setGenerationTime] = useState<number>(0);
  const [lastHistoryId, setLastHistoryId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user, profile, refreshProfile, isLoading: authLoading } = useAuth();
  const processableImagesLeft =
    profile?.plan === 'pro' && profile?.pro_expires_at && new Date(profile.pro_expires_at) > new Date()
      ? null
      : Math.max(0, profile?.credits ?? 0);

  // Check if user can use credits
  const canUseCredit = () => {
    console.log('[Hero] canUseCredit - user:', user?.id, 'profile:', profile)
    if (!user) return false;
    if (!profile) return false;
    
    // Pro users have unlimited
    if (profile.plan === 'pro' && profile.pro_expires_at) {
      const expiryDate = new Date(profile.pro_expires_at);
      if (expiryDate > new Date()) {
        return true;
      }
    }
    
    // Free users need credits
    return (profile.credits || 0) > 0;
  };

  // Log profile changes for debugging
  useEffect(() => {
    if (user) {
      console.log('[Hero] user logged in:', user.id)
      console.log('[Hero] profile on mount/update:', profile)
    }
  }, [user, profile])

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

  // Handle download with increment
  const handleDownload = async () => {
    if (!processedImage) return;
    await downloadImage(processedImage, getHistoryItemName({ fileName: 'removed-bg.png' } as any));
    if (lastHistoryId) {
      await incrementDownloadCount(lastHistoryId);
    }
  };

  // Background removal with webhook
  const handleRemoveBackground = async () => {
    if (!uploadedImage) return;
    
    // Check authentication
    if (!user) {
      setError('Please login to remove backgrounds');
      return;
    }

    // Check credits
    if (!canUseCredit()) {
      setError('You have no credits left. Please upgrade to Pro.');
      return;
    }

    setError(null);
    setIsProcessing(true);
    const requestStartedAt = Date.now();

    try {
      // Convert data URL to binary blob
      const imageBlob = dataURLtoBlob(uploadedImage);
      if (!imageBlob) throw new Error("Failed to convert image");

      // Create form data to send the file
      const formData = new FormData();
      formData.append("image", imageBlob, "image.png");

      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 45000);

      // Send to webhook
      let response: Response;
      try {
        response = await fetch("https://natikg16.app.n8n.cloud/webhook/remove-background", {
          method: "POST",
          body: formData,
          signal: controller.signal,
        });
      } finally {
        window.clearTimeout(timeoutId);
      }

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
        
        const genTime = Date.now() - requestStartedAt;
        setGenerationTime(genTime);
        setProcessedImage(secureUrl);
        
        // Use credit
        try {
          const { useCredit } = await import('@/lib/supabase-utils');
          const creditResult = await useCredit(user.id);
          console.log('[Hero] creditResult after useCredit', creditResult)
          if (!creditResult.success) {
            setError('Failed to use credit');
          } else {
            await refreshProfile();
          }
        } catch (err) {
          console.error('Failed to use credit:', err);
        }
        
        // Add to history
        if (uploadedImage) {
          const historyItem = await addToHistory({
            originalUrl: uploadedImage,
            processedUrl: secureUrl,
            fileName: 'removed-bg.png',
            generationTimeMs: genTime
          });
          setLastHistoryId((historyItem as any).id);
        }
      } else {
        throw new Error("No URL in webhook response");
      }
    } catch (error) {
      console.error("Error removing background:", error);
      if (error instanceof DOMException && error.name === "AbortError") {
        setError("Background removal timed out. Please try again.");
      } else {
        setError(error instanceof Error ? error.message : "Failed to remove background");
      }
    } finally {
      // Always set processing to false when done
      setIsProcessing(false);
    }
  };

  // If not logged in, show auth prompt
  if (!user) {
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
              SnapCut delivers studio-grade cutouts in under 5 seconds. Built for creators,
              e-commerce teams, and developers shipping at scale.
            </p>
            
            <div className="mt-9 flex flex-col items-center gap-4">
              <div className="glass p-6 rounded-2xl max-w-md mx-auto flex items-center gap-4">
                <Lock className="w-8 h-8 text-cyan-400" />
                <div className="text-left">
                  <p className="font-semibold text-foreground">Authentication Required</p>
                  <p className="text-sm text-muted-foreground">Please login or create an account to remove backgrounds</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button asChild size="lg" className="bg-brand-gradient text-primary-foreground border-0 shadow-glow hover:opacity-95 h-12 px-7 text-base">
                  <Link to="/login">
                    Login
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 px-7 text-base">
                  <Link to="/signup">
                    Create Account
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <ImageUploader 
        isOpen={isUploaderOpen} 
        onClose={() => setIsUploaderOpen(false)} 
        onImageSelect={(imageUrl: string) => {
          setUploadedImage(imageUrl);
          setProcessedImage(null);
          setError(null);
        }}
      />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute top-40 right-10 h-[300px] w-[300px] rounded-full bg-accent/25 blur-[100px]" />
        </div>
        <div className="mx-auto max-w-7xl px-6 pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground mb-4">
            <CreditCard className="h-3.5 w-3.5 text-cyan-400" />
            {profile?.plan === 'pro' && profile?.pro_expires_at && new Date(profile.pro_expires_at) > new Date() ? (
              <span>Pro Plan - Unlimited Credits</span>
            ) : authLoading || !profile ? (
              <span>Loading credits...</span>
            ) : (
              <span>Free Plan - {profile.credits} Credits Remaining</span>
            )}
          </div>
          <div className="mx-auto mb-4 max-w-2xl rounded-2xl bg-white/[0.03] px-5 py-4 text-sm text-white/90 backdrop-blur-sm">
            {processableImagesLeft === null ? (
              <span>Your current plan gives you up to 10 monthly credits to process images.</span>
            ) : (
              <span>You can process {processableImagesLeft} more image{processableImagesLeft === 1 ? '' : 's'} with {profile?.credits ?? 0} credit{(profile?.credits ?? 0) === 1 ? '' : 's'} left.</span>
            )}
          </div>
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
            SnapCut delivers studio-grade cutouts in under 5 seconds. Built for creators,
            e-commerce teams, and developers shipping at scale.
          </p>
          
          {error && (
            <div className="mt-6 max-w-md mx-auto p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}
          
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
                  disabled={isProcessing || !canUseCredit()}
                >
                  {isProcessing ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  ) : (
                    <Wand2 className="mr-2 h-5 w-5" />
                  )}
                  {isProcessing ? "Processing..." : !canUseCredit() ? "No Credits" : "Remove Background"}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="h-12 px-7 text-base bg-card/40 border-border/60 hover:bg-card"
                  onClick={() => {
                    setUploadedImage(null);
                    setProcessedImage(null);
                    setError(null);
                  }}
                >
                  Upload another
                </Button>
              </>
            )}
            {!uploadedImage && (
              <Button size="lg" variant="outline" className="h-12 px-7 text-base bg-card/40 border-border/60 hover:bg-card" asChild>
                <Link to="/contact-us">
                  <Code2 className="mr-2 h-5 w-5" /> View API docs
                </Link>
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
                      onClick={handleDownload}
                      className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-400 px-4 py-2 text-white shadow-lg shadow-fuchsia-950/35 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-fuchsia-950/45"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    {generationTime > 0 && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 text-white text-xs rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {(generationTime / 1000).toFixed(1)}s
                      </div>
                    )}
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
  { name: "Free", price: "₹0", cadence: "forever", features: ["2 free credits", "Up to 2K resolution", "Standard queue", "Community support"], cta: "Start free", amount: 0 },
  { name: "Pro", price: "₹999", cadence: "per month", features: ["10 credits/month", "Up to 5K resolution", "Priority processing", "Email support"], cta: "Go Pro", highlight: true, amount: 99900 }, // 999 INR in paise
  { name: "API / Business", price: "Custom", cadence: "talk to us", features: ["REST API access", "API keys + rate limits", "SLA + analytics", "Dedicated support"], cta: "Contact sales", amount: 0 },
];

function Pricing({ onPurchase }: { onPurchase: (amount: number) => void }) {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 mt-32">
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
            ) : p.name === "Free" ? (
              <Button className={`mt-7 w-full ${p.highlight ? "bg-brand-gradient text-primary-foreground border-0 shadow-glow" : "bg-card border border-border hover:bg-muted"}`} asChild>
                <Link to="/signup">
                  {p.cta}
                </Link>
              </Button>
            ) : (
              <Button className={`mt-7 w-full ${p.highlight ? "bg-brand-gradient text-primary-foreground border-0 shadow-glow" : "bg-card border border-border hover:bg-muted"}`} asChild>
                <Link to="/contact-us">
                  {p.cta}
                </Link>
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
          <p className="mt-3 text-primary-foreground/80">Join thousands of creators shipping faster with SnapCut.</p>
          <Button size="lg" className="mt-7 bg-background text-foreground hover:bg-background/90 h-12 px-8 text-base" asChild>
            <Link to="/signup">
              Start free — no card required
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
