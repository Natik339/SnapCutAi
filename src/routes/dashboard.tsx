import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import {
  Upload,
  History,
  CreditCard,
  Key,
  Settings,
  Plus,
  TrendingUp,
  TrendingDown,
  Image as ImageIcon,
  Clock,
  Download,
  CheckCircle2
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard | SnapCut AI" },
      { name: "description", content: "SnapCut AI Dashboard - manage your images, credits, and settings" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const [activeNav, setActiveNav] = useState("dashboard");

  const sidebarLinks = [
    { id: "dashboard", label: "Dashboard", icon: <History className="w-5 h-5" /> },
    { id: "upload", label: "Upload", icon: <Upload className="w-5 h-5" /> },
    { id: "history", label: "History", icon: <History className="w-5 h-5" /> },
    { id: "billing", label: "Billing", icon: <CreditCard className="w-5 h-5" /> },
    { id: "api", label: "API Keys", icon: <Key className="w-5 h-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
  ];

  const recentImages = [
    { id: 1, name: "product-photo.jpg", date: "2 hours ago", status: "completed" },
    { id: 2, name: "headshot.png", date: "5 hours ago", status: "completed" },
    { id: 3, name: "team-photo.jpg", date: "1 day ago", status: "completed" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center font-bold">
              S
            </div>
            <span className="font-bold text-lg">SnapCut AI</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-2">
          {sidebarLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveNav(link.id)}
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

        {/* Sidebar Footer - Plan Info */}
        <div className="p-4 border-t border-gray-800">
          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
              <CreditCard className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Free Plan</span>
            </div>
            <p className="text-sm text-gray-400 mb-3">3 credits left</p>
            <button className="w-full py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 text-sm font-semibold shadow-lg shadow-cyan-500/20">
              Upgrade to Pro
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="px-8 py-6 border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 text-sm font-semibold shadow-lg shadow-cyan-500/25 hover:opacity-90 transition-opacity">
              <Plus className="w-4 h-4" />
              New Upload
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex items-center gap-1 text-green-400 text-xs font-semibold">
                  <TrendingUp className="w-3 h-3" />
                  +12%
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-1">124</h3>
              <p className="text-gray-400 text-sm">Images Processed</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                  <Key className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-1">3</h3>
              <p className="text-gray-400 text-sm">Credits Remaining</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-violet-400" />
                </div>
                <div className="flex items-center gap-1 text-green-400 text-xs font-semibold">
                  <TrendingUp className="w-3 h-3" />
                  +8%
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-1">45</h3>
              <p className="text-gray-400 text-sm">This Month</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex items-center gap-1 text-green-400 text-xs font-semibold">
                  <TrendingDown className="w-3 h-3" />
                  -0.5s
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-1">3.2s</h3>
              <p className="text-gray-400 text-sm">Avg. Time</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <button className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-left hover:border-cyan-500/50 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-semibold mb-1">Upload Image</h3>
                <p className="text-gray-400 text-sm">Remove background from a new image</p>
              </button>

              <button className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-left hover:border-violet-500/50 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <History className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="font-semibold mb-1">View History</h3>
                <p className="text-gray-400 text-sm">Access your recent processed images</p>
              </button>

              <button className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-left hover:border-pink-500/50 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-fuchsia-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Key className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-semibold mb-1">API Access</h3>
                <p className="text-gray-400 text-sm">Generate API keys for integration</p>
              </button>
            </div>
          </div>

          {/* Recent Images */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Recent Images</h2>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-800/50 text-gray-400">
                  <tr>
                    <th className="text-left px-6 py-3 font-medium">Image</th>
                    <th className="text-left px-6 py-3 font-medium">Date</th>
                    <th className="text-left px-6 py-3 font-medium">Status</th>
                    <th className="text-right px-6 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {recentImages.map((img) => (
                    <tr key={img.id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                            <ImageIcon className="w-4 h-4 text-gray-400" />
                          </div>
                          <span className="text-gray-300">{img.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{img.date}</td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 text-green-400 text-xs font-semibold uppercase tracking-wider">
                          <CheckCircle2 className="w-3 h-3" />
                          {img.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 text-sm font-medium ml-auto">
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
