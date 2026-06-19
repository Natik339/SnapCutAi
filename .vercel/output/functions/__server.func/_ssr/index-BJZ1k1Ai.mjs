import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { H as Header, F as Footer } from "./Footer-ZEVolTtg.mjs";
import { B as Button } from "./button-DA2gxxPy.mjs";
import { L as Logo } from "./Logo-CQWWpRYe.mjs";
import { u as useAuth } from "./router-BsP_EZBf.mjs";
import { u as useHistory, d as downloadImage, H as HistoryGrid, g as getHistoryItemName } from "./HistoryGrid-Dxe-Y5Wr.mjs";
import { g as House, H as History, h as Sparkles, i as Lock, b as CreditCard, a as CircleAlert, c as Upload, W as WandSparkles, j as CodeXml, D as Download, d as Clock, Z as Zap, k as Shield, I as Image, C as CircleCheck, X } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
function ImageUploader({ isOpen, onClose, onImageSelect }) {
  const [isDragging, setIsDragging] = reactExports.useState(false);
  const [preview, setPreview] = reactExports.useState(null);
  const [isMounted, setIsMounted] = reactExports.useState(false);
  const fileInputRef = reactExports.useRef(null);
  const dropZoneRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    setIsMounted(true);
  }, []);
  const handleFile = reactExports.useCallback((file) => {
    if (!isMounted) return;
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [isMounted]);
  const confirmImage = () => {
    if (preview && onImageSelect) {
      onImageSelect(preview);
      onClose();
      setPreview(null);
    }
  };
  const onDragOver = reactExports.useCallback((e) => {
    if (!isMounted) return;
    e.preventDefault();
    setIsDragging(true);
  }, [isMounted]);
  const onDragLeave = reactExports.useCallback((e) => {
    if (!isMounted) return;
    e.preventDefault();
    setIsDragging(false);
  }, [isMounted]);
  const onDrop = reactExports.useCallback((e) => {
    if (!isMounted) return;
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile, isMounted]);
  const onFileSelect = reactExports.useCallback((e) => {
    if (!isMounted) return;
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile, isMounted]);
  reactExports.useEffect(() => {
    if (!isMounted || typeof window === "undefined") return;
    const handlePaste = (e) => {
      if (!isOpen) return;
      if (e.clipboardData && e.clipboardData.files.length > 0) {
        const file = e.clipboardData.files[0];
        if (file.type.startsWith("image/")) {
          handleFile(file);
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [isOpen, handleFile, isMounted]);
  if (!isOpen || !isMounted) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-2xl bg-background rounded-3xl shadow-2xl border border-border", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: onClose,
        className: "absolute top-4 right-4 p-2 rounded-full hover:bg-muted hover:text-muted-foreground transition-colors",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-center mb-2", children: "Upload your image" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center mb-8", children: "Drag & drop, click to browse, or paste (Ctrl+V / Cmd+V)" }),
      preview ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: preview,
            alt: "Preview",
            className: "w-full h-96 object-contain rounded-2xl border border-border mb-6"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setPreview(null),
              className: "px-6 py-2 bg-background border border-border rounded-full hover:bg-muted transition-colors",
              children: "Choose another image"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: confirmImage,
              className: "px-6 py-2 bg-brand-gradient text-primary-foreground rounded-full border-0 shadow-glow hover:opacity-95 transition-opacity",
              children: "Use this image"
            }
          )
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          ref: dropZoneRef,
          onDragOver,
          onDragLeave,
          onDrop,
          onClick: () => fileInputRef.current?.click(),
          className: `
                relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all
                ${isDragging ? "border-brand-foreground bg-brand-soft/50" : "border-border hover:border-brand-foreground/50"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                ref: fileInputRef,
                type: "file",
                accept: "image/*",
                onChange: onFileSelect,
                className: "sr-only"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto w-16 h-16 rounded-full bg-brand-soft/30 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-8 h-8 text-brand-gradient" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium mb-1", children: "Drop image here or click to browse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Supports JPG, PNG, WEBP up to 10MB" })
          ]
        }
      )
    ] })
  ] }) });
}
function Landing() {
  const [activeTab, setActiveTab] = reactExports.useState("home");
  const {
    user,
    profile,
    refreshProfile
  } = useAuth();
  const {
    history,
    isLoading,
    addToHistory,
    deleteFromHistory,
    renameHistoryItem,
    incrementDownloadCount
  } = useHistory();
  const [razorpayLoaded, setRazorpayLoaded] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  const handlePurchase = async (amount) => {
    if (!user) {
      alert("Please login to purchase");
      return;
    }
    if (!razorpayLoaded || !window.Razorpay) {
      alert("Razorpay SDK is loading. Please try again in a moment.");
      return;
    }
    const options = {
      key: "rzp_test_T1ATrVxQVLScv1",
      amount,
      currency: "INR",
      name: "SnapCut AI",
      description: "Pro Plan Subscription",
      image: "/snapcut-logo.png",
      handler: async function(response) {
        alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
        try {
          const {
            upgradeToPro
          } = await import("./router-BsP_EZBf.mjs").then((n) => n.a);
          await upgradeToPro(user.id);
          await refreshProfile();
        } catch (err) {
          console.error("Failed to upgrade to Pro:", err);
          alert("Failed to upgrade plan. Please contact support.");
        }
      },
      prefill: {
        name: "Your Name",
        email: user.email || "your.email@example.com",
        contact: "9999999999"
      },
      notes: {
        "address": "SnapCut AI Office"
      },
      theme: {
        color: "#0ea5e9"
      }
    };
    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center gap-2 pt-6 px-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveTab("home"), className: `px-6 py-2 rounded-full flex items-center gap-2 transition-all ${activeTab === "home" ? "bg-brand-gradient text-primary-foreground shadow-glow" : "bg-muted hover:bg-muted/80"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "w-4 h-4" }),
          "Home"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveTab("history"), className: `px-6 py-2 rounded-full flex items-center gap-2 transition-all ${activeTab === "history" ? "bg-brand-gradient text-primary-foreground shadow-glow" : "bg-muted hover:bg-muted/80"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "w-4 h-4" }),
          "History",
          history.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-foreground text-background text-xs px-2 py-0.5 rounded-full", children: history.length })
        ] })
      ] }),
      activeTab === "home" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Hero, { addToHistory, downloadImage, incrementDownloadCount }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(LogoStrip, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Features, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(HowItWorks, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Pricing, { onPurchase: handlePurchase }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CTA, {})
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(HistoryGrid, { history, onDelete: deleteFromHistory, onRename: renameHistoryItem, onDownload: incrementDownloadCount, isLoading })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
function Hero({
  addToHistory,
  downloadImage: downloadImage2,
  incrementDownloadCount
}) {
  const [isUploaderOpen, setIsUploaderOpen] = reactExports.useState(false);
  const [uploadedImage, setUploadedImage] = reactExports.useState(null);
  const [processedImage, setProcessedImage] = reactExports.useState(null);
  const [isProcessing, setIsProcessing] = reactExports.useState(false);
  const [processingStartTime, setProcessingStartTime] = reactExports.useState(0);
  const [generationTime, setGenerationTime] = reactExports.useState(0);
  const [lastHistoryId, setLastHistoryId] = reactExports.useState(null);
  const [error, setError] = reactExports.useState(null);
  const {
    user,
    profile,
    refreshProfile
  } = useAuth();
  const canUseCredit = () => {
    console.log("[Hero] canUseCredit - user:", user?.id, "profile:", profile);
    if (!user) return false;
    if (!profile) return false;
    if (profile.plan === "pro" && profile.pro_expires_at) {
      const expiryDate = new Date(profile.pro_expires_at);
      if (expiryDate > /* @__PURE__ */ new Date()) {
        return true;
      }
    }
    return (profile.credits || 0) > 0;
  };
  reactExports.useEffect(() => {
    if (user) {
      console.log("[Hero] user logged in:", user.id);
      console.log("[Hero] profile on mount/update:", profile);
    }
  }, [user, profile]);
  const dataURLtoBlob = (dataurl) => {
    const arr = dataurl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) return null;
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
      type: mime
    });
  };
  const handleDownload = async () => {
    if (!processedImage) return;
    await downloadImage2(processedImage, getHistoryItemName({
      fileName: "removed-bg.png"
    }));
    if (lastHistoryId) {
      await incrementDownloadCount(lastHistoryId);
    }
  };
  const handleRemoveBackground = async () => {
    if (!uploadedImage) return;
    if (!user) {
      setError("Please login to remove backgrounds");
      return;
    }
    if (!canUseCredit()) {
      setError("You have no credits left. Please upgrade to Pro.");
      return;
    }
    setError(null);
    setIsProcessing(true);
    setProcessingStartTime(Date.now());
    try {
      const imageBlob = dataURLtoBlob(uploadedImage);
      if (!imageBlob) throw new Error("Failed to convert image");
      const formData = new FormData();
      formData.append("image", imageBlob, "image.png");
      const response = await fetch("https://natikg16.app.n8n.cloud/webhook/remove-background", {
        method: "POST",
        body: formData
      });
      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status}`);
      }
      const result = await response.json();
      if (result.url) {
        let secureUrl = result.url;
        if (secureUrl.startsWith("http://")) {
          secureUrl = secureUrl.replace("http://", "https://");
        }
        const genTime = Date.now() - processingStartTime;
        setGenerationTime(genTime);
        setProcessedImage(secureUrl);
        try {
          const {
            useCredit
          } = await import("./router-BsP_EZBf.mjs").then((n) => n.a);
          const creditResult = await useCredit(user.id);
          console.log("[Hero] creditResult after useCredit", creditResult);
          if (!creditResult.success) {
            setError("Failed to use credit");
          } else {
            await refreshProfile();
          }
        } catch (err) {
          console.error("Failed to use credit:", err);
        }
        if (uploadedImage) {
          const historyItem = await addToHistory({
            originalUrl: uploadedImage,
            processedUrl: secureUrl,
            fileName: "removed-bg.png",
            generationTimeMs: genTime
          });
          setLastHistoryId(historyItem.id);
        }
      } else {
        throw new Error("No URL in webhook response");
      }
    } catch (error2) {
      console.error("Error removing background:", error2);
      setError(error2 instanceof Error ? error2.message : "Failed to remove background");
    } finally {
      setIsProcessing(false);
    }
  };
  if (!user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ImageUploader, { isOpen: isUploaderOpen, onClose: () => setIsUploaderOpen(false), onImageSelect: (imageUrl) => {
        setUploadedImage(imageUrl);
        setProcessedImage(null);
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 -z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-20 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/20 blur-[120px]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-40 right-10 h-[300px] w-[300px] rounded-full bg-accent/25 blur-[100px]" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-6 pt-20 pb-24 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5 text-secondary" }),
            "Powered by next-gen segmentation AI"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-6 text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05]", children: [
            "Remove backgrounds.",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-brand-gradient", children: "In one click." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-6 max-w-2xl text-lg text-muted-foreground", children: "SnapCut AI delivers studio-grade cutouts in under 5 seconds. Built for creators, e-commerce teams, and developers shipping at scale." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-9 flex flex-col items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass p-6 rounded-2xl max-w-md mx-auto flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-8 h-8 text-cyan-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "Authentication Required" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Please login or create an account to remove backgrounds" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", className: "bg-brand-gradient text-primary-foreground border-0 shadow-glow hover:opacity-95 h-12 px-7 text-base", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", children: "Login" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", variant: "outline", className: "h-12 px-7 text-base", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/signup", children: "Create Account" }) })
            ] })
          ] })
        ] })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ImageUploader, { isOpen: isUploaderOpen, onClose: () => setIsUploaderOpen(false), onImageSelect: (imageUrl) => {
      setUploadedImage(imageUrl);
      setProcessedImage(null);
      setError(null);
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 -z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-20 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/20 blur-[120px]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-40 right-10 h-[300px] w-[300px] rounded-full bg-accent/25 blur-[100px]" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-6 pt-20 pb-24 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-3.5 w-3.5 text-cyan-400" }),
          profile?.plan === "pro" && profile?.pro_expires_at && new Date(profile.pro_expires_at) > /* @__PURE__ */ new Date() ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Pro Plan - Unlimited Credits" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Free Plan - ",
            profile?.credits || 0,
            " Credits Remaining"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5 text-secondary" }),
          "Powered by next-gen segmentation AI"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-6 text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05]", children: [
          "Remove backgrounds.",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-brand-gradient", children: "In one click." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-6 max-w-2xl text-lg text-muted-foreground", children: "SnapCut AI delivers studio-grade cutouts in under 5 seconds. Built for creators, e-commerce teams, and developers shipping at scale." }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 max-w-md mx-auto p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-5 h-5 text-red-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-300", children: error })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-9 flex flex-col sm:flex-row justify-center gap-3", children: [
          !uploadedImage ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "lg", className: "bg-brand-gradient text-primary-foreground border-0 shadow-glow hover:opacity-95 h-12 px-7 text-base", onClick: () => setIsUploaderOpen(true), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "mr-2 h-5 w-5" }),
            " Try it free"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "lg", className: "bg-brand-gradient text-primary-foreground border-0 shadow-glow hover:opacity-95 h-12 px-7 text-base", onClick: handleRemoveBackground, disabled: isProcessing || !canUseCredit(), children: [
              isProcessing ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(WandSparkles, { className: "mr-2 h-5 w-5" }),
              isProcessing ? "Processing..." : !canUseCredit() ? "No Credits" : "Remove Background"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", variant: "outline", className: "h-12 px-7 text-base bg-card/40 border-border/60 hover:bg-card", onClick: () => {
              setUploadedImage(null);
              setProcessedImage(null);
              setError(null);
            }, children: "Upload another" })
          ] }),
          !uploadedImage && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "lg", variant: "outline", className: "h-12 px-7 text-base bg-card/40 border-border/60 hover:bg-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CodeXml, { className: "mr-2 h-5 w-5" }),
            " View API docs"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-16 mx-auto max-w-4xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-3xl p-3 shadow-card-elevated", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 rounded-2xl overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[4/5] bg-gradient-to-br from-slate-700 to-slate-900 rounded-l-2xl flex items-center justify-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-3 left-3 text-[10px] uppercase tracking-widest text-white/70", children: "Before" }),
              uploadedImage ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: uploadedImage, alt: "Before", className: "h-full w-full object-contain" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Silhouette, {})
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[4/5] rounded-r-2xl flex items-center justify-center bg-[conic-gradient(at_top_left,_oklch(0.21_0.045_265),_oklch(0.16_0.04_265))]", style: {
              backgroundImage: "repeating-conic-gradient(oklch(0.25 0.04 265) 0% 25%, oklch(0.20 0.04 265) 0% 50%)",
              backgroundSize: "24px 24px"
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-3 left-3 text-[10px] uppercase tracking-widest text-white/70", children: "After" }),
              processedImage ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-full w-full flex items-center justify-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: processedImage, alt: "After", className: "h-full w-full object-contain" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleDownload, className: "absolute bottom-4 right-4 px-4 py-2 bg-brand-gradient text-primary-foreground rounded-full shadow-glow flex items-center gap-2 hover:opacity-90 transition-opacity", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4" }),
                  "Download"
                ] }),
                generationTime > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-4 left-4 px-3 py-1 bg-black/50 text-white text-xs rounded-full flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
                  (generationTime / 1e3).toFixed(1),
                  "s"
                ] })
              ] }) : uploadedImage && isProcessing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 text-white/70", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-10 w-10 border-b-2 border-white" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "Removing background..." })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Silhouette, {})
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 text-xs text-muted-foreground", children: [
            "Average processing time: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: "3.2s" }),
            " · Up to 5000×5000 px · JPG · PNG · WEBP"
          ] })
        ] })
      ] })
    ] })
  ] });
}
function Silhouette() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 200 250", className: "h-3/4 w-auto drop-shadow-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "g1", x1: "0", y1: "0", x2: "1", y2: "1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "oklch(0.82 0.14 200)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "oklch(0.65 0.20 260)" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "url(#g1)", d: "M100 35c20 0 36 18 36 42s-16 42-36 42-36-18-36-42 16-42 36-42zm-70 215c0-50 30-78 70-78s70 28 70 78z" })
  ] });
}
function LogoStrip() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs uppercase tracking-[0.2em] text-muted-foreground", children: "Trusted by teams at" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-6 opacity-60", children: ["Pixelry", "Northwind", "Studio·9", "Lumen", "Catalyst", "Forge"].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center font-display font-semibold tracking-wide", children: n }, n)) })
  ] });
}
const features = [{
  icon: Zap,
  title: "Sub-5s processing",
  desc: "Edge-optimized AI pipeline returns transparent PNGs in seconds."
}, {
  icon: WandSparkles,
  title: "Hair & edge precision",
  desc: "Pixel-grade alpha matting that preserves fine strands."
}, {
  icon: CodeXml,
  title: "Developer API",
  desc: "REST endpoint with API keys, rate limits, and usage tracking."
}, {
  icon: Shield,
  title: "Private by default",
  desc: "Auto-deleted after 24h. HTTPS everywhere. GDPR-ready."
}, {
  icon: Image,
  title: "5K resolution",
  desc: "Up to 5000×5000 px input. Original quality output."
}, {
  icon: Sparkles,
  title: "Batch & bulk",
  desc: "Process catalogs of product shots without breaking a sweat."
}];
function Features() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-6 mt-32", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-4xl md:text-5xl font-bold", children: [
        "Built for speed.",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-brand-gradient", children: "Engineered for scale." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground", children: "Everything you need to ship background removal in production — without managing the infrastructure." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5", children: features.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6 hover:shadow-glow transition-shadow group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient shadow-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(f.icon, { className: "h-5 w-5 text-primary-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-4 text-lg font-semibold", children: f.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground leading-relaxed", children: f.desc })
    ] }, f.title)) })
  ] });
}
function HowItWorks() {
  const steps = [{
    n: "01",
    t: "Upload",
    d: "Drag-drop or pick a JPG, PNG, or WEBP up to 10 MB."
  }, {
    n: "02",
    t: "AI Cutout",
    d: "Our segmentation engine isolates the subject with edge precision."
  }, {
    n: "03",
    t: "Download",
    d: "Get a transparent PNG, ready for your storefront, deck, or post."
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-6 mt-32", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-4xl md:text-5xl font-bold text-center", children: "How it works" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 grid md:grid-cols-3 gap-6", children: steps.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative glass rounded-2xl p-7", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl font-display font-bold text-brand-gradient", children: s.n }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-3 text-xl font-semibold", children: s.t }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: s.d })
    ] }, s.n)) })
  ] });
}
const plans = [
  {
    name: "Free",
    price: "₹0",
    cadence: "forever",
    features: ["2 free credits", "Up to 2K resolution", "Standard queue", "Community support"],
    cta: "Start free",
    amount: 0
  },
  {
    name: "Pro",
    price: "₹999",
    cadence: "per month",
    features: ["10 credits/month", "Up to 5K resolution", "Priority processing", "Email support"],
    cta: "Go Pro",
    highlight: true,
    amount: 99900
  },
  // 999 INR in paise
  {
    name: "API / Business",
    price: "Custom",
    cadence: "talk to us",
    features: ["REST API access", "API keys + rate limits", "SLA + analytics", "Dedicated support"],
    cta: "Contact sales",
    amount: 0
  }
];
function Pricing({
  onPurchase
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-6 mt-32", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-2xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-4xl md:text-5xl font-bold", children: [
        "Simple pricing.",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-brand-gradient", children: "Scale when you're ready." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground", children: "Start free. Upgrade when your catalog grows." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 grid md:grid-cols-3 gap-5", children: plans.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative rounded-2xl p-7 ${p.highlight ? "bg-brand-soft border-2 border-primary/50 shadow-glow" : "glass"}`, children: [
      p.highlight && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-gradient px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground", children: "Most popular" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-semibold", children: p.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-baseline gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl font-bold", children: p.price }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: p.cadence })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-6 space-y-3", children: p.features.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-secondary mt-0.5 flex-shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: f })
      ] }, f)) }),
      p.amount > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => onPurchase(p.amount), className: `mt-7 w-full ${p.highlight ? "bg-brand-gradient text-primary-foreground border-0 shadow-glow" : "bg-card border border-border hover:bg-muted"}`, children: p.cta }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: `mt-7 w-full ${p.highlight ? "bg-brand-gradient text-primary-foreground border-0 shadow-glow" : "bg-card border border-border hover:bg-muted"}`, children: p.cta })
    ] }, p.name)) })
  ] });
}
function CTA() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-5xl px-6 mt-32", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-3xl bg-brand-gradient p-12 text-center shadow-glow", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-20", style: {
      backgroundImage: "radial-gradient(circle at 20% 20%, white, transparent 40%)"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, { className: "mx-auto h-16 w-16" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-5 text-4xl md:text-5xl font-bold text-primary-foreground", children: "Ready to cut the background?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-primary-foreground/80", children: "Join thousands of creators shipping faster with SnapCut AI." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", className: "mt-7 bg-background text-foreground hover:bg-background/90 h-12 px-8 text-base", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/signup", children: "Start free — no card required" }) })
    ] })
  ] }) });
}
export {
  Landing as component
};
