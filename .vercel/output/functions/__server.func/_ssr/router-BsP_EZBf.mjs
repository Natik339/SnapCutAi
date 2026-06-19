import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
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
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const appCss = "/assets/styles-b0Cm1F3-.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
const supabaseUrl = "https://xmxgaujxriztnyjcbcmf.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhteGdhdWp4cml6dG55amNiY21mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NDU3NDgsImV4cCI6MjA5NzAyMTc0OH0.tN20-nRHFdzfj8TahVdBA5xH9qbaIoix7mQh69eRNxI";
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
async function getOrCreateUserProfile(userId, email) {
  const { data: existingProfile, error: fetchError } = await supabase.from("user_profiles").select("*").eq("id", userId).single();
  console.log("[supabase-utils] getOrCreateUserProfile - fetch result", { existingProfile, fetchError });
  if (fetchError && fetchError.code !== "PGRST116") {
    console.error("[supabase-utils] getOrCreateUserProfile fetchError", fetchError);
    throw fetchError;
  }
  if (existingProfile) {
    const profile = existingProfile;
    console.log("[supabase-utils] existing profile found", profile);
    if (profile.plan === "free" && profile.credits <= 0) {
      const { data: updatedProfile, error: updateError } = await supabase.from("user_profiles").update({ credits: 2 }).eq("id", userId).select("*").single();
      if (updateError) {
        throw updateError;
      }
      return updatedProfile;
    }
    return profile;
  }
  const { data: newProfile, error: createError } = await supabase.from("user_profiles").insert({
    id: userId,
    email,
    credits: 2,
    plan: "free"
  }).select("*").single();
  if (createError) {
    throw createError;
  }
  console.log("[supabase-utils] created new profile", newProfile);
  return newProfile;
}
async function getUserProfile(userId) {
  const { data, error } = await supabase.from("user_profiles").select("*").eq("id", userId).single();
  if (error && error.code !== "PGRST116") {
    throw error;
  }
  console.log("[supabase-utils] getUserProfile", { userId, data, error });
  return data;
}
async function useCredit(userId) {
  const { data: profile, error: fetchError } = await supabase.from("user_profiles").select("credits, plan, pro_expires_at").eq("id", userId).single();
  if (fetchError) {
    throw fetchError;
  }
  console.log("[supabase-utils] useCredit - current profile", profile);
  if (profile.plan === "pro") {
    if (profile.pro_expires_at) {
      const expiryDate = new Date(profile.pro_expires_at);
      if (expiryDate > /* @__PURE__ */ new Date()) {
        return { success: true, newCredits: profile.credits };
      } else {
        await supabase.from("user_profiles").update({ plan: "free", pro_expires_at: null }).eq("id", userId);
      }
    }
  }
  if (profile.credits <= 0) {
    return { success: false, newCredits: 0 };
  }
  const { data: updatedProfile, error: updateError } = await supabase.from("user_profiles").update({ credits: profile.credits - 1 }).eq("id", userId).select("credits").single();
  if (updateError) {
    throw updateError;
  }
  console.log("[supabase-utils] useCredit - updatedProfile", updatedProfile);
  return { success: true, newCredits: updatedProfile.credits };
}
async function upgradeToPro(userId) {
  const oneMonthFromNow = /* @__PURE__ */ new Date();
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
  const { data, error } = await supabase.from("user_profiles").update({
    plan: "pro",
    credits: 10,
    pro_expires_at: oneMonthFromNow.toISOString()
  }).eq("id", userId).select("*").single();
  if (error) {
    throw error;
  }
  return data;
}
async function getUserHistory(userId) {
  const { data, error } = await supabase.from("image_history").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  if (error) {
    throw error;
  }
  return data;
}
async function addHistoryItem(userId, originalUrl, processedUrl, fileName, generationTimeMs) {
  const { data, error } = await supabase.from("image_history").insert({
    user_id: userId,
    original_url: originalUrl,
    processed_url: processedUrl,
    file_name: fileName,
    generation_time_ms: generationTimeMs,
    download_count: 0
  }).select("*").single();
  if (error) {
    throw error;
  }
  return data;
}
async function renameHistoryItem(itemId, newFileName) {
  const { data, error } = await supabase.from("image_history").update({ file_name: newFileName }).eq("id", itemId).select("*").single();
  if (error) {
    throw error;
  }
  return data;
}
async function incrementDownloadCount(itemId) {
  const { data, error } = await supabase.from("image_history").select("download_count").eq("id", itemId).single();
  if (error) {
    throw error;
  }
  const { data: updatedData, error: updateError } = await supabase.from("image_history").update({ download_count: (data.download_count || 0) + 1 }).eq("id", itemId).select("*").single();
  if (updateError) {
    throw updateError;
  }
  return updatedData;
}
async function deleteHistoryItem(itemId) {
  const { error } = await supabase.from("image_history").delete().eq("id", itemId);
  if (error) {
    throw error;
  }
}
function calculateAverageGenerationTime(history) {
  if (history.length === 0) return 0;
  const total = history.reduce((sum, item) => sum + (item.generation_time_ms || 0), 0);
  return Math.round(total / history.length);
}
const supabaseUtils = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  addHistoryItem,
  calculateAverageGenerationTime,
  deleteHistoryItem,
  getOrCreateUserProfile,
  getUserHistory,
  getUserProfile,
  incrementDownloadCount,
  renameHistoryItem,
  upgradeToPro,
  useCredit
}, Symbol.toStringTag, { value: "Module" }));
const AuthContext = reactExports.createContext(null);
function AuthProvider({ children }) {
  const [user, setUser] = reactExports.useState(null);
  const [session, setSession] = reactExports.useState(null);
  const [profile, setProfile] = reactExports.useState(null);
  const [isLoading, setIsLoading] = reactExports.useState(true);
  const reportDebug = (hypothesisId, msg, data = {}) => {
    void fetch("http://127.0.0.1:7777/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "dashboard-stuck-routes",
        runId: "pre-fix",
        hypothesisId,
        location: "src/lib/auth.tsx",
        msg: `[DEBUG] ${msg}`,
        data,
        ts: Date.now()
      })
    }).catch(() => {
    });
  };
  const loadProfile = async (userId, email) => {
    try {
      reportDebug("A", "loadProfile start", { userId, hasEmail: Boolean(email) });
      const userProfile = await getOrCreateUserProfile(userId, email);
      reportDebug("A", "loadProfile success", {
        userId,
        hasProfile: Boolean(userProfile),
        credits: userProfile?.credits ?? null,
        plan: userProfile?.plan ?? null
      });
      setProfile(userProfile);
    } catch (err) {
      reportDebug("A", "loadProfile error", {
        userId,
        error: err instanceof Error ? err.message : String(err)
      });
    }
  };
  const refreshProfile = async () => {
    if (user) {
      const userProfile = await getUserProfile(user.id);
      setProfile(userProfile);
    }
  };
  reactExports.useEffect(() => {
    const getSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        reportDebug("B", "getSession result", {
          hasSession: Boolean(data.session),
          userId: data.session?.user?.id ?? null
        });
        setSession(data.session);
        setUser(data.session?.user ?? null);
        if (data.session?.user) {
          await loadProfile(data.session.user.id, data.session.user.email || "");
        }
      } catch (err) {
        reportDebug("B", "getSession error", {
          error: err instanceof Error ? err.message : String(err)
        });
      } finally {
        reportDebug("B", "getSession finally setIsLoading false", {});
        setIsLoading(false);
      }
    };
    getSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      reportDebug("B", "onAuthStateChange", {
        event: _event,
        userId: newSession?.user?.id ?? null,
        hasSession: Boolean(newSession)
      });
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        await loadProfile(newSession.user.id, newSession.user.email || "");
      } else {
        setProfile(null);
      }
      reportDebug("B", "onAuthStateChange setIsLoading false", {
        event: _event,
        hasUser: Boolean(newSession?.user)
      });
      setIsLoading(false);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + "/auth/callback"
      }
    });
    if (error) throw error;
    if (data?.session?.user) {
      setSession(data.session);
      setUser(data.session.user);
      await loadProfile(data.session.user.id, data.session.user.email || "");
    }
  };
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    if (data?.session?.user) {
      setSession(data.session);
      setUser(data.session.user);
      await loadProfile(data.session.user.id, data.session.user.email || "");
    }
  };
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Error signing out:", err);
    } finally {
      setUser(null);
      setSession(null);
      setProfile(null);
    }
  };
  const resendConfirmation = async (email) => {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: window.location.origin + "/auth/callback"
      }
    });
    if (error) throw error;
  };
  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password"
    });
    if (error) throw error;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthContext.Provider, { value: {
    user,
    session,
    profile,
    isLoading,
    signUp,
    signIn,
    signOut,
    resendConfirmation,
    resetPassword,
    refreshProfile
  }, children });
}
function useAuth() {
  const context = reactExports.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$d = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SnapCut AI — One Click. Remove Background." },
      { name: "description", content: "AI-powered background removal in under 5 seconds. Pixel-perfect cutouts for creators, e-commerce, and developers." },
      { name: "theme-color", content: "#0EA5FF" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap" }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$d.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }) });
}
const $$splitComponentImporter$c = () => import("./terms-conditions-UyHOVJWe.mjs");
const Route$c = createFileRoute("/terms-conditions")({
  head: () => ({
    meta: [{
      title: "Terms and Conditions | SnapCut AI"
    }, {
      name: "description",
      content: "SnapCut AI Terms and Conditions - Understand your rights and obligations when using our services"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./signup-dzAU_aOl.mjs");
const Route$b = createFileRoute("/signup")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./shipping-delivery-L2blWNPl.mjs");
const Route$a = createFileRoute("/shipping-delivery")({
  head: () => ({
    meta: [{
      title: "Shipping & Delivery | SnapCut AI"
    }, {
      name: "description",
      content: "SnapCut AI Shipping & Delivery Policy - Information about delivery of our digital services"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./settings-C_DDJO3Z.mjs");
const Route$9 = createFileRoute("/settings")({
  head: () => ({
    meta: [{
      title: "Account Settings | SnapCut AI"
    }, {
      name: "description",
      content: "Manage your account settings, update email, password, and delete your account."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./reset-password-6aa8camu.mjs");
const Route$8 = createFileRoute("/reset-password")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./refund-policy-Dd8aRd_3.mjs");
const Route$7 = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [{
      title: "Refund and Cancellation Policy | SnapCut AI"
    }, {
      name: "description",
      content: "SnapCut AI Refund and Cancellation Policy - Understand our refund and cancellation terms"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./privacy-policy-Ba9nl4YX.mjs");
const Route$6 = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [{
      title: "Privacy Policy | SnapCut AI"
    }, {
      name: "description",
      content: "SnapCut AI Privacy Policy - Learn how we collect, use, and protect your data"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./login-BeHwKb7z.mjs");
const Route$5 = createFileRoute("/login")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./forgot-password-DsPMbaTv.mjs");
const Route$4 = createFileRoute("/forgot-password")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./dashboard-Bmpg7Rmg.mjs");
const Route$3 = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{
      title: "Dashboard | SnapCut AI"
    }, {
      name: "description",
      content: "SnapCut AI Dashboard - manage your images, credits, and settings"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./contact-us-DzIgNnvK.mjs");
const Route$2 = createFileRoute("/contact-us")({
  head: () => ({
    meta: [{
      title: "Contact Us | SnapCut AI"
    }, {
      name: "description",
      content: "Get in touch with SnapCut AI - Contact information, support, and more"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./index-BJZ1k1Ai.mjs");
const Route$1 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "SnapCut AI — One Click. Remove Background."
    }, {
      name: "description",
      content: "AI-powered background removal in under 5 seconds. Pixel-perfect cutouts for creators, e-commerce, and developers."
    }, {
      property: "og:title",
      content: "SnapCut AI — One Click. Remove Background."
    }, {
      property: "og:description",
      content: "Pixel-perfect AI background removal in under 5 seconds."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./callback-Bsoa3E_H.mjs");
const Route = createFileRoute("/auth/callback")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const TermsConditionsRoute = Route$c.update({
  id: "/terms-conditions",
  path: "/terms-conditions",
  getParentRoute: () => Route$d
});
const SignupRoute = Route$b.update({
  id: "/signup",
  path: "/signup",
  getParentRoute: () => Route$d
});
const ShippingDeliveryRoute = Route$a.update({
  id: "/shipping-delivery",
  path: "/shipping-delivery",
  getParentRoute: () => Route$d
});
const SettingsRoute = Route$9.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => Route$d
});
const ResetPasswordRoute = Route$8.update({
  id: "/reset-password",
  path: "/reset-password",
  getParentRoute: () => Route$d
});
const RefundPolicyRoute = Route$7.update({
  id: "/refund-policy",
  path: "/refund-policy",
  getParentRoute: () => Route$d
});
const PrivacyPolicyRoute = Route$6.update({
  id: "/privacy-policy",
  path: "/privacy-policy",
  getParentRoute: () => Route$d
});
const LoginRoute = Route$5.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$d
});
const ForgotPasswordRoute = Route$4.update({
  id: "/forgot-password",
  path: "/forgot-password",
  getParentRoute: () => Route$d
});
const DashboardRoute = Route$3.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => Route$d
});
const ContactUsRoute = Route$2.update({
  id: "/contact-us",
  path: "/contact-us",
  getParentRoute: () => Route$d
});
const IndexRoute = Route$1.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$d
});
const AuthCallbackRoute = Route.update({
  id: "/auth/callback",
  path: "/auth/callback",
  getParentRoute: () => Route$d
});
const rootRouteChildren = {
  IndexRoute,
  ContactUsRoute,
  DashboardRoute,
  ForgotPasswordRoute,
  LoginRoute,
  PrivacyPolicyRoute,
  RefundPolicyRoute,
  ResetPasswordRoute,
  SettingsRoute,
  ShippingDeliveryRoute,
  SignupRoute,
  TermsConditionsRoute,
  AuthCallbackRoute
};
const routeTree = Route$d._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  supabaseUtils as a,
  router as r,
  supabase as s,
  useAuth as u
};
