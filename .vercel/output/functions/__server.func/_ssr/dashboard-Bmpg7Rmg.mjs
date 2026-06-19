import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth } from "./router-BsP_EZBf.mjs";
import { u as useHistory, H as HistoryGrid, g as getHistoryItemName, f as formatRelativeDate, d as downloadImage } from "./HistoryGrid-Dxe-Y5Wr.mjs";
import { b as CreditCard, P as Plus, L as LayoutDashboard, c as Upload, H as History, K as Key, S as Settings, C as CircleCheck, I as Image, d as Clock, D as Download } from "../_libs/lucide-react.mjs";
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
function DashboardPage() {
  const [activeNav, setActiveNav] = reactExports.useState("dashboard");
  const navigate = useNavigate();
  const {
    user,
    profile,
    isLoading: authLoading,
    refreshProfile
  } = useAuth();
  const {
    history,
    isLoading: historyLoading,
    deleteFromHistory,
    renameHistoryItem,
    incrementDownloadCount
  } = useHistory();
  const reportDebug = (hypothesisId, msg, data = {}) => {
    void fetch("http://127.0.0.1:7777/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sessionId: "dashboard-stuck-routes",
        runId: "pre-fix",
        hypothesisId,
        location: "src/routes/dashboard.tsx",
        msg: `[DEBUG] ${msg}`,
        data,
        ts: Date.now()
      })
    }).catch(() => {
    });
  };
  reactExports.useEffect(() => {
    reportDebug("C", "dashboard state snapshot", {
      authLoading,
      hasUser: Boolean(user),
      hasProfile: Boolean(profile),
      credits: profile?.credits ?? null,
      plan: profile?.plan ?? null,
      historyLoading,
      historyCount: history.length,
      activeNav
    });
  }, [activeNav, authLoading, history.length, historyLoading, profile, user]);
  reactExports.useEffect(() => {
    reportDebug("E", "dashboard redirect check", {
      authLoading,
      hasUser: Boolean(user)
    });
    if (!authLoading && !user) {
      navigate({
        to: "/login"
      });
    }
  }, [authLoading, user, navigate]);
  const sidebarLinks = [{
    id: "dashboard",
    label: "Dashboard",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { className: "w-5 h-5" })
  }, {
    id: "upload",
    label: "Upload",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-5 h-5" })
  }, {
    id: "history",
    label: "History",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "w-5 h-5" })
  }, {
    id: "billing",
    label: "Billing",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-5 h-5" })
  }, {
    id: "api",
    label: "API Keys",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { className: "w-5 h-5" })
  }, {
    id: "settings",
    label: "Settings",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-5 h-5" })
  }];
  const stats = reactExports.useMemo(() => {
    const now = /* @__PURE__ */ new Date();
    const thisMonthCount = history.filter((item) => {
      const itemDate = new Date(item.timestamp);
      return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
    }).length;
    const totalTime = history.reduce((sum, item) => sum + (item.generationTimeMs || 0), 0);
    const avgTime = history.length > 0 ? totalTime / history.length : 0;
    return {
      totalProcessed: history.length,
      thisMonth: thisMonthCount,
      creditsRemaining: profile?.credits || 0,
      plan: profile?.plan || "free",
      avgTimeMs: avgTime
    };
  }, [history, profile]);
  reactExports.useEffect(() => {
    reportDebug("D", "dashboard stats computed", {
      totalProcessed: stats.totalProcessed,
      thisMonth: stats.thisMonth,
      creditsRemaining: stats.creditsRemaining,
      plan: stats.plan,
      avgTimeMs: stats.avgTimeMs
    });
  }, [stats]);
  const recentImages = history.slice(0, 10);
  if (authLoading || !user) {
    reportDebug("C", "dashboard loading render", {
      authLoading,
      hasUser: Boolean(user)
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-gray-950 text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400 mx-auto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-gray-400", children: "Loading dashboard..." })
    ] }) });
  }
  const handleUpgrade = () => {
    alert("Payment integration would go here! For demo purposes, we are upgrading you to Pro.");
  };
  const renderContent = () => {
    if (activeNav === "history") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gray-950 rounded-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(HistoryGrid, { history, onDelete: deleteFromHistory, onRename: renameHistoryItem, onDownload: incrementDownloadCount, isLoading: historyLoading }) });
    }
    if (activeNav === "upload") {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto text-center py-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-8 h-8 text-cyan-400" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold mb-3", children: "Upload a new image" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 mb-8", children: "Remove a background from the home page. Your processed results are saved to your account automatically." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 text-sm font-semibold shadow-lg shadow-cyan-500/25 hover:opacity-90 transition-opacity", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
          "Go to upload"
        ] })
      ] });
    }
    if (activeNav === "billing") {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto py-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold mb-8", children: "Billing & Plans" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold mb-4", children: "Free Plan" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold mb-4", children: "₹0 / forever" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 mb-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2 text-gray-300", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-green-400" }),
                "2 free credits"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2 text-gray-300", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-green-400" }),
                "Up to 2K resolution"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2 text-gray-300", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-green-400" }),
                "Standard queue"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2 text-gray-300", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-green-400" }),
                "Community support"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400", children: "Current plan" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6 border-2 border-cyan-500/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-block px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider rounded-full mb-4", children: "Most Popular" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold mb-4", children: "Pro Plan" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold mb-4", children: "₹999 / month" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 mb-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2 text-gray-300", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-green-400" }),
                "10 credits per month"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2 text-gray-300", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-green-400" }),
                "Up to 5K resolution"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2 text-gray-300", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-green-400" }),
                "Priority processing"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2 text-gray-300", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-green-400" }),
                "Email support"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleUpgrade, className: "w-full bg-gradient-to-r from-cyan-500 to-violet-500", children: "Upgrade to Pro" })
          ] })
        ] })
      ] });
    }
    if (activeNav !== "dashboard") {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto text-center py-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold mb-3 capitalize", children: activeNav }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400", children: "This section is coming soon." })
      ] });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-900 border border-gray-800 rounded-2xl p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "w-5 h-5 text-blue-400" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-3xl font-bold mb-1", children: stats.totalProcessed }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-sm", children: "Images Processed" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-900 border border-gray-800 rounded-2xl p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { className: "w-5 h-5 text-cyan-400" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-3xl font-bold mb-1", children: stats.creditsRemaining }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-sm", children: "Credits Remaining" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-900 border border-gray-800 rounded-2xl p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "w-5 h-5 text-violet-400" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-3xl font-bold mb-1", children: stats.thisMonth }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-sm", children: "This Month" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-900 border border-gray-800 rounded-2xl p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-5 h-5 text-green-400" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-3xl font-bold mb-1", children: [
            (stats.avgTimeMs / 1e3).toFixed(1),
            "s"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-sm", children: "Avg. Time" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold mb-4", children: "Quick Actions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "bg-gray-900 border border-gray-800 rounded-2xl p-6 text-left hover:border-cyan-500/50 transition-all group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-6 h-6 text-blue-400" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold mb-1", children: "Upload Image" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-sm", children: "Remove background from a new image" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setActiveNav("history"), className: "bg-gray-900 border border-gray-800 rounded-2xl p-6 text-left hover:border-violet-500/50 transition-all group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "w-6 h-6 text-violet-400" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold mb-1", children: "View History" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-sm", children: "Access your saved processed images" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setActiveNav("billing"), className: "bg-gray-900 border border-gray-800 rounded-2xl p-6 text-left hover:border-pink-500/50 transition-all group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-fuchsia-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-6 h-6 text-purple-400" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold mb-1", children: "Manage Billing" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-sm", children: "Upgrade your plan or view invoices" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Recent Images" }),
          history.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setActiveNav("history"), className: "text-sm text-cyan-400 hover:text-cyan-300", children: "View all" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden", children: historyLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-12 text-center text-gray-400", children: "Loading your saved results..." }) : recentImages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-12 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 mb-4", children: "No processed images saved yet." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4" }),
            "Upload your first image"
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-gray-800/50 text-gray-400", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-6 py-3 font-medium", children: "Image" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-6 py-3 font-medium", children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-6 py-3 font-medium", children: "Time" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-6 py-3 font-medium", children: "Downloads" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-6 py-3 font-medium" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-gray-800", children: recentImages.map((img) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-gray-800/50 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: img.processedUrl, alt: getHistoryItemName(img), className: "h-full w-full object-cover" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300", children: getHistoryItemName(img) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-gray-400", children: formatRelativeDate(img.timestamp) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-gray-400", children: img.generationTimeMs > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
              (img.generationTimeMs / 1e3).toFixed(1),
              "s"
            ] }) : "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-gray-400", children: img.downloadCount > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3 h-3" }),
              img.downloadCount
            ] }) : "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
              downloadImage(img.processedUrl, getHistoryItemName(img));
              incrementDownloadCount(img.id);
            }, className: "text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 text-sm font-medium ml-auto", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4" }),
              "Download"
            ] }) })
          ] }, img.id)) })
        ] }) })
      ] })
    ] });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen bg-gray-950 text-white", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-64 bg-gray-900 border-r border-gray-800 flex flex-col sticky top-0 h-screen overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center font-bold", children: "S" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-lg", children: "SnapCut AI" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-xs text-gray-500 truncate", children: user.email })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 px-4 py-2", children: sidebarLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
        if (link.id === "upload") {
          navigate({
            to: "/"
          });
          return;
        }
        if (link.id === "settings") {
          navigate({
            to: "/settings"
          });
          return;
        }
        setActiveNav(link.id);
      }, className: `w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${activeNav === link.id ? "bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-cyan-400 border border-cyan-500/20" : "text-gray-400 hover:text-white hover:bg-gray-800"}`, children: [
        link.icon,
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: link.label })
      ] }, link.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-t border-gray-800", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-800/50 rounded-xl p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-cyan-400 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wider", children: stats.plan === "pro" ? "Pro Plan" : "Free Plan" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-400 mb-3", children: [
          stats.creditsRemaining,
          " credits left"
        ] }),
        stats.plan !== "pro" && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setActiveNav("billing"), className: "w-full py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 text-sm font-semibold shadow-lg shadow-cyan-500/20", children: "Upgrade to Pro" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "px-8 py-6 border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold capitalize", children: activeNav }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 text-sm font-semibold shadow-lg shadow-cyan-500/25 hover:opacity-90 transition-opacity", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
          "New Upload"
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 p-8 overflow-y-auto", children: renderContent() })
    ] })
  ] });
}
function Button({
  children,
  onClick,
  className = "",
  disabled = false,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick, disabled, className: `px-4 py-2 rounded-lg font-medium transition-all ${disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"} ${className}`, ...props, children });
}
export {
  DashboardPage as component
};
