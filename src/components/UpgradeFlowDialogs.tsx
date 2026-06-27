import { Link } from "@tanstack/react-router";
import { CheckCircle2, CreditCard, Crown, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/lib/auth";
import { upgradeToPro } from "@/lib/supabase-utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

const proHighlights = [
  {
    icon: CreditCard,
    title: "10 monthly credits",
    description: "Process up to 10 images every month with your Pro subscription.",
  },
  {
    icon: Zap,
    title: "Priority processing",
    description: "Get a faster lane for edits when you're handling urgent work.",
  },
  {
    icon: ShieldCheck,
    title: "High-quality output",
    description: "Unlock up to 5K resolution exports and premium support.",
  },
];

const PURCHASE_WEBHOOK_URL = "https://natikg161b.app.n8n.cloud/webhook/purchase-made";

export function AuthRequiredDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border/60 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>Sign in to unlock Pro</DialogTitle>
          <DialogDescription>
            Create your SnapCut account or sign in to continue with the Pro upgrade flow.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-2xl bg-white/[0.03] p-4 text-sm text-muted-foreground">
          Your credits, purchases, and image history are linked to your account for a smoother experience.
        </div>
        <DialogFooter className="gap-2 sm:justify-start">
          <Button asChild onClick={() => onOpenChange(false)}>
            <Link to="/login">Sign In</Link>
          </Button>
          <Button variant="outline" asChild onClick={() => onOpenChange(false)}>
            <Link to="/signup">Create Account</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function PurchaseSuccessDialog({
  open,
  onOpenChange,
  paymentId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentId: string | null;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border/60 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <DialogTitle>Thank you for upgrading</DialogTitle>
          <DialogDescription>
            Your Pro plan is active now. Your monthly credits have been added to your account.
          </DialogDescription>
        </DialogHeader>
        {paymentId ? (
          <div className="rounded-2xl bg-white/[0.03] p-4 text-sm text-muted-foreground">
            Payment reference: <span className="font-medium text-foreground">{paymentId}</span>
          </div>
        ) : null}
        <DialogFooter className="gap-2 sm:justify-start">
          <Button asChild onClick={() => onOpenChange(false)}>
            <Link to="/dashboard">Open Dashboard</Link>
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function UpgradeDialog({
  open,
  onOpenChange,
  onRequireAuth,
  onSuccess,
  entryPoint,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRequireAuth: () => void;
  onSuccess: (paymentId: string) => void;
  entryPoint: "home" | "dashboard";
}) {
  const { user, profile, refreshProfile } = useAuth();
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendPurchaseWebhook = async ({
    paymentId,
    upgradedProfile,
  }: {
    paymentId: string;
    upgradedProfile: Awaited<ReturnType<typeof upgradeToPro>>;
  }) => {
    const payload = {
      event: {
        name: "purchase_made",
        status: "success",
        occurred_at: new Date().toISOString(),
        source: entryPoint,
        environment: import.meta.env.MODE,
      },
      customer: {
        user_id: user?.id ?? null,
        email: user?.email ?? null,
        full_name: (user?.user_metadata as { full_name?: string } | undefined)?.full_name ?? null,
      },
      payment: {
        provider: "razorpay",
        payment_id: paymentId,
        amount: 99900,
        currency: "INR",
        display_amount: "INR 999.00",
        status: "captured",
      },
      plan: {
        name: "Pro",
        billing_cycle: "monthly",
        credits_awarded: upgradedProfile.credits,
        starts_at: new Date().toISOString(),
        expires_at: upgradedProfile.pro_expires_at ?? null,
        benefits: [
          "10 monthly credits",
          "Up to 5K resolution",
          "Priority processing",
          "Premium support",
        ],
      },
      platform: {
        product_name: "SnapCut",
        website_url: typeof window !== "undefined" ? window.location.origin : null,
        current_page: typeof window !== "undefined" ? window.location.href : null,
      },
      profile_snapshot: {
        plan: upgradedProfile.plan,
        credits: upgradedProfile.credits,
        updated_at: upgradedProfile.updated_at,
      },
    };

    await fetch(PURCHASE_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.Razorpay) {
      setRazorpayLoaded(true);
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      const handleLoad = () => setRazorpayLoaded(true);
      existingScript.addEventListener("load", handleLoad);
      return () => existingScript.removeEventListener("load", handleLoad);
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, []);

  useEffect(() => {
    if (!open) {
      setError(null);
      setIsSubmitting(false);
    }
  }, [open]);

  const isActivePro = useMemo(() => {
    if (profile?.plan !== "pro" || !profile?.pro_expires_at) return false;
    return new Date(profile.pro_expires_at) > new Date();
  }, [profile]);

  const handleCheckout = async () => {
    if (!user) {
      onOpenChange(false);
      onRequireAuth();
      return;
    }

    if (isActivePro) {
      return;
    }

    if (!razorpayLoaded || !window.Razorpay) {
      setError("Payment options are still loading. Please try again in a moment.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const razorpayInstance = new window.Razorpay({
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_T1ATrVxQVLScv1",
      amount: 99900,
      currency: "INR",
      name: "SnapCut",
      description: "Pro Plan Subscription",
      image: "/favicon.svg",
      prefill: {
        name: (user.user_metadata as { full_name?: string } | undefined)?.full_name || "SnapCut User",
        email: user.email || "your.email@example.com",
      },
      notes: {
        source: entryPoint,
      },
      theme: {
        color: "#8b5cf6",
      },
      handler: async (response: { razorpay_payment_id?: string }) => {
        try {
          const upgradedProfile = await upgradeToPro(user.id);
          await refreshProfile();
          if (response.razorpay_payment_id) {
            try {
              await sendPurchaseWebhook({
                paymentId: response.razorpay_payment_id,
                upgradedProfile,
              });
            } catch (webhookError) {
              console.error("Failed to send purchase webhook:", webhookError);
            }
          }
          onOpenChange(false);
          onSuccess(response.razorpay_payment_id || "");
        } catch (err) {
          setError(err instanceof Error ? err.message : "We received the payment but could not update your plan automatically.");
        } finally {
          setIsSubmitting(false);
        }
      },
      modal: {
        ondismiss: () => {
          setIsSubmitting(false);
        },
      },
    });

    razorpayInstance.open();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-border/60 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/15 text-violet-300">
            <Crown className="h-6 w-6" />
          </div>
          <DialogTitle>Upgrade to Pro</DialogTitle>
          <DialogDescription>
            Unlock more monthly credits, faster delivery, and premium quality exports with one smooth checkout.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-3">
            {proHighlights.map((item) => (
              <div key={item.title} className="rounded-2xl bg-white/[0.03] p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/10 to-cyan-500/10 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">Pro membership</p>
            <div className="mt-4 flex items-end gap-2">
              <span className="text-4xl font-bold text-foreground">₹999</span>
              <span className="pb-1 text-sm text-muted-foreground">per month</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {entryPoint === "home"
                ? "You can pay directly from here and start using your Pro credits right away."
                : "Review the Pro benefits here, then continue to payment when you're ready."}
            </p>

            <div className="mt-5 rounded-2xl bg-black/20 p-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 text-violet-300" />
                <span>Includes 10 monthly credits, priority processing, and premium export quality.</span>
              </div>
            </div>

            {error ? (
              <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                {error}
              </div>
            ) : null}

            {isActivePro ? (
              <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-300">
                Your Pro plan is already active.
              </div>
            ) : null}

            <DialogFooter className="mt-6 gap-2 sm:flex-col sm:items-stretch sm:space-x-0">
              <Button
                onClick={handleCheckout}
                disabled={isSubmitting || isActivePro}
                className="w-full bg-brand-gradient text-primary-foreground border-0 shadow-glow hover:opacity-95"
              >
                {isSubmitting ? "Opening payment..." : "Pay ₹999 and upgrade"}
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">
                Not now
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
