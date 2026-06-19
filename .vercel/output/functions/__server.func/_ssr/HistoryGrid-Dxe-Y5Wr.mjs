import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useAuth, s as supabase } from "./router-BsP_EZBf.mjs";
import { d as Clock, D as Download, l as Pen, T as Trash2, m as Check, X } from "../_libs/lucide-react.mjs";
const LOCAL_HISTORY_KEY = "bg-remover-history";
function rowToHistoryItem(row) {
  return {
    id: row.id,
    user_id: row.user_id,
    originalUrl: row.original_url,
    processedUrl: row.processed_url,
    fileName: row.file_name,
    downloadCount: row.download_count,
    generationTimeMs: row.generation_time_ms,
    timestamp: new Date(row.created_at).getTime(),
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}
function historyItemToRow(item, userId) {
  return {
    user_id: userId,
    original_url: item.originalUrl,
    processed_url: item.processedUrl,
    file_name: item.fileName,
    download_count: 0,
    generation_time_ms: item.generationTimeMs
  };
}
function loadLocalHistory() {
  try {
    const data = localStorage.getItem(LOCAL_HISTORY_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
function saveLocalHistory(history) {
  localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(history));
}
async function fetchUserHistory(userId) {
  const { data, error } = await supabase.from("image_history").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  if (error) throw error;
  return data.map(rowToHistoryItem);
}
async function insertUserHistory(userId, item) {
  const { data, error } = await supabase.from("image_history").insert(historyItemToRow(item, userId)).select("*").single();
  if (error) throw error;
  return rowToHistoryItem(data);
}
async function deleteUserHistory(userId, id) {
  const { error } = await supabase.from("image_history").delete().eq("user_id", userId).eq("id", id);
  if (error) throw error;
}
async function renameHistoryItem(id, newFileName) {
  const { data, error } = await supabase.from("image_history").update({ file_name: newFileName }).eq("id", id).select("*").single();
  if (error) throw error;
  return rowToHistoryItem(data);
}
async function incrementDownloadCount(id) {
  const { data: current, error: fetchError } = await supabase.from("image_history").select("download_count").eq("id", id).single();
  if (fetchError) throw fetchError;
  const { data, error } = await supabase.from("image_history").update({ download_count: (current.download_count || 0) + 1 }).eq("id", id).select("*").single();
  if (error) throw error;
  return rowToHistoryItem(data);
}
async function syncLocalHistoryToSupabase(userId, localHistory) {
  const remoteHistory = await fetchUserHistory(userId);
  const remoteIds = new Set(remoteHistory.map((item) => item.id));
  for (const item of localHistory) {
    if (!remoteIds.has(item.id)) {
      try {
        await insertUserHistory(userId, {
          originalUrl: item.originalUrl,
          processedUrl: item.processedUrl,
          fileName: item.fileName || "processed-image.png",
          generationTimeMs: item.generationTimeMs || 3e3
        });
      } catch {
      }
    }
  }
  return fetchUserHistory(userId);
}
function useHistory() {
  const { user, isLoading: authLoading } = useAuth();
  const [history, setHistory] = reactExports.useState([]);
  const [isLoading, setIsLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const hasSyncedRef = reactExports.useRef(false);
  const loadHistory = reactExports.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (user) {
        const localHistory = hasSyncedRef.current ? [] : loadLocalHistory();
        const remoteHistory = localHistory.length > 0 ? await syncLocalHistoryToSupabase(user.id, localHistory) : await fetchUserHistory(user.id);
        hasSyncedRef.current = true;
        setHistory(remoteHistory);
      } else {
        hasSyncedRef.current = false;
        setHistory(loadLocalHistory());
      }
    } catch (err) {
      console.error("Failed to load history:", err);
      setError("Failed to load your history. Please refresh and try again.");
      setHistory(user ? [] : loadLocalHistory());
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  reactExports.useEffect(() => {
    if (authLoading) return;
    void loadHistory();
  }, [authLoading, loadHistory]);
  const addToHistory = reactExports.useCallback(
    async (item) => {
      if (user) {
        try {
          const savedItem = await insertUserHistory(user.id, item);
          setHistory((prev) => [savedItem, ...prev]);
          return savedItem;
        } catch (err) {
          console.error("Failed to save history for user:", err);
          setError("Processed image saved locally, but cloud history sync failed.");
        }
      }
      const localItem = {
        ...item,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        downloadCount: 0
      };
      setHistory((prev) => {
        const nextHistory = [localItem, ...prev];
        saveLocalHistory(nextHistory);
        return nextHistory;
      });
      return localItem;
    },
    [user]
  );
  const deleteFromHistory = reactExports.useCallback(
    async (id) => {
      if (user) {
        try {
          await deleteUserHistory(user.id, id);
        } catch (err) {
          console.error("Failed to delete history item:", err);
          setError("Failed to delete this item. Please try again.");
          return;
        }
      }
      setHistory((prev) => {
        const nextHistory = prev.filter((item) => item.id !== id);
        if (!user) {
          saveLocalHistory(nextHistory);
        }
        return nextHistory;
      });
    },
    [user]
  );
  const renameHistoryItem$1 = reactExports.useCallback(
    async (id, newFileName) => {
      if (user) {
        try {
          const updatedItem = await renameHistoryItem(id, newFileName);
          setHistory(
            (prev) => prev.map((item) => item.id === id ? updatedItem : item)
          );
          return updatedItem;
        } catch (err) {
          console.error("Failed to rename history item:", err);
          setError("Failed to rename this item. Please try again.");
        }
      }
      setHistory((prev) => {
        const nextHistory = prev.map(
          (item) => item.id === id ? { ...item, fileName: newFileName } : item
        );
        saveLocalHistory(nextHistory);
        return nextHistory;
      });
      return history.find((item) => item.id === id);
    },
    [user, history]
  );
  const incrementDownloadCount$1 = reactExports.useCallback(
    async (id) => {
      if (user) {
        try {
          const updatedItem = await incrementDownloadCount(id);
          setHistory(
            (prev) => prev.map((item) => item.id === id ? updatedItem : item)
          );
          return updatedItem;
        } catch (err) {
          console.error("Failed to increment download count:", err);
        }
      }
      setHistory((prev) => {
        const nextHistory = prev.map(
          (item) => item.id === id ? { ...item, downloadCount: (item.downloadCount || 0) + 1 } : item
        );
        saveLocalHistory(nextHistory);
        return nextHistory;
      });
      return history.find((item) => item.id === id);
    },
    [user, history]
  );
  return {
    history,
    isLoading: authLoading || isLoading,
    error,
    isAuthenticated: !!user,
    addToHistory,
    deleteFromHistory,
    renameHistoryItem: renameHistoryItem$1,
    incrementDownloadCount: incrementDownloadCount$1,
    refreshHistory: loadHistory
  };
}
function toSecureUrl(url) {
  if (url.startsWith("http://")) {
    return url.replace("http://", "https://");
  }
  return url;
}
function formatHistoryDate(timestamp) {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function formatRelativeDate(timestamp) {
  const diffMs = Date.now() - timestamp;
  const diffMinutes = Math.floor(diffMs / 6e4);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  return formatHistoryDate(timestamp);
}
function getHistoryItemName(item) {
  try {
    const url = new URL(item.processedUrl);
    const filename = url.pathname.split("/").pop();
    if (filename) return filename;
  } catch {
  }
  return `bg-removed-${item.timestamp}.png`;
}
async function downloadImage(url, filename = "removed-bg.png") {
  try {
    const secureUrl = toSecureUrl(url);
    const response = await fetch(secureUrl);
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = downloadUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Download failed:", error);
    window.open(toSecureUrl(url), "_blank");
  }
}
function HistoryGrid({ history, onDelete, onRename, onDownload, isLoading = false }) {
  const [editingId, setEditingId] = reactExports.useState(null);
  const [editName, setEditName] = reactExports.useState("");
  const [isRenaming, setIsRenaming] = reactExports.useState(false);
  const startRename = (item) => {
    setEditingId(item.id);
    setEditName(item.fileName || "removed-bg.png");
  };
  const saveRename = async (item) => {
    if (!onRename || !editName.trim()) return;
    setIsRenaming(true);
    try {
      await onRename(item.id, editName.trim());
      setEditingId(null);
    } catch (err) {
      console.error("Failed to rename:", err);
    } finally {
      setIsRenaming(false);
    }
  };
  const handleDownload = async (item) => {
    await downloadImage(item.processedUrl, item.fileName || `bg-removed-${item.id}.png`);
    if (onDownload) {
      await onDownload(item.id);
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "py-20 px-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground", children: "Loading your history..." })
    ] });
  }
  if (history.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 px-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-8 h-8 text-muted-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold mb-2", children: "No History Yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6", children: "Start removing backgrounds and your processed results will appear here." })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-10 px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold mb-8 text-center", children: "Your Background Removals" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: history.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "glass rounded-2xl overflow-hidden shadow-card hover:shadow-glow transition-all",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-square bg-gradient-to-br from-slate-700 to-slate-900", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 left-2 text-[10px] uppercase tracking-widest text-white/70 bg-black/50 px-2 py-1 rounded-full", children: "Before" }),
              item.originalUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: item.originalUrl, alt: "Before", className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-full flex items-center justify-center text-xs text-white/50 px-2 text-center", children: "Original not stored" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "relative aspect-square",
                style: {
                  backgroundImage: "repeating-conic-gradient(oklch(0.25 0.04 265) 0% 25%, oklch(0.20 0.04 265) 0% 50%)",
                  backgroundSize: "20px 20px"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 left-2 text-[10px] uppercase tracking-widest text-white/70 bg-black/50 px-2 py-1 rounded-full", children: "After" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: item.processedUrl, alt: "After", className: "h-full w-full object-cover" }),
                  item.generationTimeMs > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-2 right-2 px-2 py-0.5 bg-black/50 text-white text-xs rounded-full flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
                    (item.generationTimeMs / 1e3).toFixed(1),
                    "s"
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: formatHistoryDate(item.timestamp) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                item.downloadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3 h-3" }),
                  item.downloadCount
                ] }),
                onRename && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => startRename(item),
                    className: "text-muted-foreground hover:text-primary transition-colors",
                    title: "Rename",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-4 h-4" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => onDelete(item.id),
                    className: "text-muted-foreground hover:text-destructive transition-colors",
                    title: "Delete from history",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
                  }
                )
              ] })
            ] }),
            editingId === item.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: editName,
                  onChange: (e) => setEditName(e.target.value),
                  className: "flex-1 px-3 py-1 text-sm bg-background border border-border rounded-lg",
                  onKeyDown: (e) => {
                    if (e.key === "Enter") saveRename(item);
                    if (e.key === "Escape") setEditingId(null);
                  },
                  autoFocus: true
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => saveRename(item),
                  disabled: isRenaming,
                  className: "p-1 text-green-400 hover:text-green-300",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setEditingId(null),
                  className: "p-1 text-muted-foreground hover:text-foreground",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
                }
              )
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground mb-3 truncate", children: item.fileName || `bg-removed-${item.id}.png` }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => handleDownload(item),
                className: "w-full py-2 px-4 bg-brand-gradient text-primary-foreground rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4" }),
                  "Download"
                ]
              }
            )
          ] })
        ]
      },
      item.id
    )) })
  ] }) });
}
export {
  HistoryGrid as H,
  downloadImage as d,
  formatRelativeDate as f,
  getHistoryItemName as g,
  useHistory as u
};
