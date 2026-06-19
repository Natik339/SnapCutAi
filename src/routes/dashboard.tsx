import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Upload,
  History,
  CreditCard,
  Key,
  Settings,
  Plus,
  Image as ImageIcon,
  Clock,
  Download,
  CheckCircle2,
  LayoutDashboard,
  Eye,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useHistory } from "@/hooks/useHistory";
import { HistoryGrid } from "@/components/HistoryGrid";
import { downloadImage, formatRelativeDate, getHistoryItemName } from "@/lib/history-utils";
import {
  AuthRequiredDialog,
  PurchaseSuccessDialog,
  UpgradeDialog,
} from "@/components/UpgradeFlowDialogs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard | SnapCut" },
      { name: "description", content: "SnapCut Dashboard - manage your images, credits, and settings" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);
  const [purchaseSuccessId, setPurchaseSuccessId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, profile, isLoading: authLoading } = useAuth();
  const { history, isLoading: historyLoading, deleteFromHistory, renameHistoryItem, incrementDownloadCount } = useHistory();

  // #region debug-point C:dashboard-report
  const reportDebug = (hypothesisId: string, msg: string, data: Record<string, unknown> = {}) => {
    void fetch("http://127.0.0.1:7777/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "dashboard-stuck-routes",
        runId: "pre-fix",
        hypothesisId,
        location: "src/routes/dashboard.tsx",
        msg: `[DEBUG] ${msg}`,
        data,
        ts: Date.now(),
      }),
    }).catch(() => {});
  };
  // #endregion

  useEffect(() => {
    // #region debug-point C:dashboard-state
    reportDebug("C", "dashboard state snapshot", {
      authLoading,
      hasUser: Boolean(user),
      hasProfile: Boolean(profile),
      credits: profile?.credits ?? null,
      plan: profile?.plan ?? null,
      historyLoading,
      historyCount: history.length,
      activeNav,
    });
    // #endregion
  }, [activeNav, authLoading, history.length, historyLoading, profile, user]);

  useEffect(() => {
    // #region debug-point E:dashboard-redirect-check
    reportDebug("E", "dashboard redirect check", {
      authLoading,
      hasUser: Boolean(user),
    });
    // #endregion
    if (!authLoading && !user) {
      navigate({ to: "/login" });
    }
  }, [authLoading, user, navigate]);

  const sidebarLinks = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "upload", label: "Upload", icon: <Upload className="w-5 h-5" /> },
    { id: "history", label: "History", icon: <History className="w-5 h-5" /> },
    { id: "billing", label: "Billing", icon: <CreditCard className="w-5 h-5" /> },
    { id: "api", label: "API Keys", icon: <Key className="w-5 h-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
  ];

  const stats = useMemo(() => {
    const now = new Date();
    const thisMonthCount = history.filter((item) => {
      const itemDate = new Date(item.timestamp);
      return (
        itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear()
      );
    }).length;

    // Calculate average generation time
    const totalTime = history.reduce((sum, item) => sum + (item.generationTimeMs || 0), 0);
    const avgTime = history.length > 0 ? totalTime / history.length : 0;

    return {
      totalProcessed: history.length,
      thisMonth: thisMonthCount,
      creditsRemaining: (profile?.credits as number) || 0,
      plan: profile?.plan || 'free',
      avgTimeMs: avgTime,
    };
  }, [history, profile]);

  useEffect(() => {
    // #region debug-point D:dashboard-stats
    reportDebug("D", "dashboard stats computed", {
      totalProcessed: stats.totalProcessed,
      thisMonth: stats.thisMonth,
      creditsRemaining: stats.creditsRemaining,
      plan: stats.plan,
      avgTimeMs: stats.avgTimeMs,
    });
    // #endregion
  }, [stats])

  const recentImages = history.slice(0, 10);
  const processableImagesLeft = stats.plan === 'pro' ? null : Math.max(0, stats.creditsRemaining);

  if (authLoading) {
    // #region debug-point C:dashboard-loading-render
    reportDebug("C", "dashboard loading render", {
      authLoading,
      hasUser: Boolean(user),
    });
    // #endregion
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400 mx-auto" />
          <p className="mt-4 text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleUpgrade = () => {
    if (!user) {
      setIsAuthDialogOpen(true);
      return;
    }
    setIsUpgradeDialogOpen(true);
  };

  const renderContent = () => {
    if (activeNav === "history") {
      return (
        <div className="bg-gray-950 rounded-2xl">
          <HistoryGrid
            history={history}
            onDelete={deleteFromHistory}
            onRename={renameHistoryItem}
            onDownload={incrementDownloadCount}
            isLoading={historyLoading}
          />
        </div>
      );
    }

    if (activeNav === "upload") {
      return (
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center mx-auto mb-6">
            <Upload className="w-8 h-8 text-cyan-400" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Upload a new image</h2>
          <p className="text-gray-400 mb-8">
            Remove a background from the home page. Your processed results are saved to your account
            automatically.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 text-sm font-semibold shadow-lg shadow-cyan-500/25 hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Go to upload
          </Link>
        </div>
      );
    }

    if (activeNav === "billing") {
      return (
        <div className="max-w-4xl mx-auto py-12">
          <h2 className="text-3xl font-bold mb-8">Billing & Plans</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">Free Plan</h3>
              <p className="text-3xl font-bold mb-4">₹0 / forever</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  2 free credits
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  Up to 2K resolution
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  Standard queue
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  Community support
                </li>
              </ul>
              <p className="text-sm text-gray-400">Current plan</p>
            </div>

            <div className="glass rounded-2xl p-6 border-2 border-cyan-500/50">
              <div className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
                Most Popular
              </div>
              <h3 className="text-xl font-bold mb-4">Pro Plan</h3>
              <p className="text-3xl font-bold mb-4">₹999 / month</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  10 credits per month
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  Up to 5K resolution
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  Priority processing
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  Email support
                </li>
              </ul>
              <Button 
                onClick={handleUpgrade}
                className="w-full bg-gradient-to-r from-cyan-500 to-violet-500"
              >
                Upgrade to Pro
              </Button>
            </div>
          </div>
        </div>
      );
    }

    if (activeNav !== "dashboard") {
      return (
        <div className="max-w-2xl mx-auto text-center py-16">
          <h2 className="text-2xl font-bold mb-3 capitalize">{activeNav}</h2>
          <p className="text-gray-400">This section is coming soon.</p>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.totalProcessed}</h3>
            <p className="text-gray-400 text-sm">Images Processed</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <Key className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.creditsRemaining}</h3>
            <p className="text-gray-400 text-sm">Credits Remaining</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <History className="w-5 h-5 text-violet-400" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.thisMonth}</h3>
            <p className="text-gray-400 text-sm">This Month</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-400" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">
              {(stats.avgTimeMs / 1000).toFixed(1)}s
            </h3>
            <p className="text-gray-400 text-sm">Avg. Time</p>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-amber-500/10 p-6 shadow-lg shadow-violet-950/20">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">Processing allowance</p>
              {processableImagesLeft === null ? (
                <h2 className="mt-2 text-2xl font-bold text-white">Your Pro plan is active with up to 10 monthly credits.</h2>
              ) : (
                <h2 className="mt-2 text-2xl font-bold text-white">You can process {processableImagesLeft} image{processableImagesLeft === 1 ? '' : 's'} with {stats.creditsRemaining} credit{stats.creditsRemaining === 1 ? '' : 's'} left.</h2>
              )}
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-gray-200">
              Credits only decrease when an image is processed. Deleting history never restores credits.
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Link
              to="/"
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-left hover:border-cyan-500/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-semibold mb-1">Upload Image</h3>
              <p className="text-gray-400 text-sm">Remove background from a new image</p>
            </Link>

            <button
              type="button"
              onClick={() => setActiveNav("history")}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-left hover:border-violet-500/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <History className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="font-semibold mb-1">View History</h3>
              <p className="text-gray-400 text-sm">Access your saved processed images</p>
            </button>

            <button
              type="button"
              onClick={() => setActiveNav("billing")}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-left hover:border-pink-500/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-fuchsia-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CreditCard className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-semibold mb-1">Manage Billing</h3>
              <p className="text-gray-400 text-sm">Upgrade your plan or view invoices</p>
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Images</h2>
            {history.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveNav("history")}
                className="text-sm text-cyan-400 hover:text-cyan-300"
              >
                View all
              </button>
            )}
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            {historyLoading ? (
              <div className="px-6 py-12 text-center text-gray-400">Loading your saved results...</div>
            ) : recentImages.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-400 mb-4">No processed images saved yet.</p>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium"
                >
                  <Upload className="w-4 h-4" />
                  Upload your first image
                </Link>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-800/50 text-gray-400">
                  <tr>
                    <th className="text-left px-6 py-3 font-medium">Image</th>
                    <th className="text-left px-6 py-3 font-medium">Date</th>
                    <th className="text-left px-6 py-3 font-medium">Time</th>
                    <th className="text-left px-6 py-3 font-medium">Downloads</th>
                    <th className="text-right px-6 py-3 font-medium" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {recentImages.map((img) => (
                    <tr key={img.id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="group relative w-10 h-10 rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center">
                            <img
                              src={img.processedUrl}
                              alt={getHistoryItemName(img)}
                              className="h-full w-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => setPreviewImage({ url: img.processedUrl, name: getHistoryItemName(img) })}
                              className="absolute inset-0 flex items-center justify-center bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                              aria-label={`Preview ${getHistoryItemName(img)}`}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                          <span className="text-gray-300">{getHistoryItemName(img)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{formatRelativeDate(img.timestamp)}</td>
                      <td className="px-6 py-4 text-gray-400">
                        {img.generationTimeMs > 0 ? (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {(img.generationTimeMs / 1000).toFixed(1)}s
                          </span>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {img.downloadCount > 0 ? (
                          <span className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            {img.downloadCount}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={async () => {
                            await downloadImage(img.processedUrl, getHistoryItemName(img));
                            await incrementDownloadCount(img.id);
                          }}
                          className="ml-auto inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-400 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-fuchsia-950/30 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-fuchsia-950/40"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col sticky top-0 h-screen overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center font-bold">
              S
            </div>
            <span className="font-bold text-lg">SnapCut</span>
          </div>
          <p className="mt-3 text-xs text-gray-500 truncate">{user.email}</p>
        </div>

        <nav className="flex-1 px-4 py-2">
          {sidebarLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => {
                if (link.id === "upload") {
                  navigate({ to: "/" });
                  return;
                }
                if (link.id === "settings") {
                  navigate({ to: "/settings" });
                  return;
                }
                setActiveNav(link.id);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${
                activeNav === link.id
                  ? "bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-cyan-400 border border-cyan-500/20"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              {link.icon}
              <span className="font-medium">{link.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
              <CreditCard className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                {stats.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-3">{stats.creditsRemaining} credits left</p>
            {stats.plan !== 'pro' && (
              <button
                type="button"
                onClick={handleUpgrade}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 text-sm font-semibold shadow-lg shadow-cyan-500/20"
              >
                Upgrade to Pro
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <header className="px-8 py-6 border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold capitalize">{activeNav}</h1>
            <Link
              to="/"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 text-sm font-semibold shadow-lg shadow-cyan-500/25 hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              New Upload
            </Link>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">{renderContent()}</main>
      </div>

      <Dialog open={Boolean(previewImage)} onOpenChange={(open) => !open && setPreviewImage(null)}>
        <DialogContent className="max-w-3xl border-gray-800 bg-gray-950 text-white">
          <DialogHeader>
            <DialogTitle>Image preview</DialogTitle>
            <DialogDescription className="text-gray-400">
              {previewImage?.name}
            </DialogDescription>
          </DialogHeader>
          {previewImage && (
            <div className="overflow-hidden rounded-2xl border border-gray-800 bg-black/30">
              <img
                src={previewImage.url}
                alt={previewImage.name}
                className="max-h-[70vh] w-full object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
      <AuthRequiredDialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
      <UpgradeDialog
        open={isUpgradeDialogOpen}
        onOpenChange={setIsUpgradeDialogOpen}
        onRequireAuth={() => setIsAuthDialogOpen(true)}
        onSuccess={(paymentId) => setPurchaseSuccessId(paymentId)}
        entryPoint="dashboard"
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

function Button({ 
  children, 
  onClick, 
  className = "", 
  disabled = false,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-medium transition-all ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
