"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getIntentColor, getSourceIcon, timeAgo } from "@/lib/utils";
import type { Signal, Product, UserProfile } from "@/types";
import { TIER_LIMITS, type SubscriptionTier } from "@/types";
import { AddProductModal } from "@/components/add-product-modal";
import { SignalCard } from "@/components/signal-card";

interface Props {
  profile: UserProfile | null;
  products: Product[];
  signals: Signal[];
}

export function DashboardClient({ profile, products, signals }: Props) {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">(
    "all"
  );
  const [activeProduct, setActiveProduct] = useState<string | "all">("all");
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [localSignals, setLocalSignals] = useState(signals);
  const router = useRouter();

  const tier = (profile?.tier || "free") as SubscriptionTier;
  const limits = TIER_LIMITS[tier];

  const filteredSignals = localSignals.filter((s) => {
    if (filter !== "all" && s.intent_level !== filter) return false;
    if (activeProduct !== "all" && s.product_id !== activeProduct) return false;
    return true;
  });

  const highCount = localSignals.filter(
    (s) => s.intent_level === "high"
  ).length;
  const mediumCount = localSignals.filter(
    (s) => s.intent_level === "medium"
  ).length;
  const todayCount = localSignals.filter(
    (s) =>
      new Date(s.detected_at).toDateString() === new Date().toDateString()
  ).length;

  const handleScan = useCallback(async () => {
    // Pick which product to scan
    const targetProduct =
      activeProduct !== "all"
        ? activeProduct
        : products.length > 0
        ? products[0].id
        : null;

    if (!targetProduct) {
      setScanResult("Add a product first to start scanning.");
      return;
    }

    setScanning(true);
    setScanResult(null);

    try {
      const res = await fetch("/api/signals/scan-manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: targetProduct }),
      });

      const data = await res.json();

      if (!res.ok) {
        setScanResult(data.error || "Scan failed");
      } else {
        setScanResult(
          `Found ${data.signals_found} signals, saved ${data.signals_saved} new. (${data.signals_today}/${data.daily_limit} today)`
        );
        // Refresh the page to show new signals
        router.refresh();
      }
    } catch {
      setScanResult("Scan failed. Please try again.");
    } finally {
      setScanning(false);
    }
  }, [activeProduct, products, router]);

  const handleAction = useCallback(
    async (signalId: string) => {
      try {
        await fetch("/api/signals/action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ signalId, action: "actioned" }),
        });
        // Update local state
        setLocalSignals((prev) =>
          prev.map((s) =>
            s.id === signalId ? { ...s, is_actioned: true, is_read: true } : s
          )
        );
      } catch {
        // Silently fail
      }
    },
    []
  );

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#1e1e2e] bg-[#0c0c14] flex flex-col h-screen sticky top-0">
        <div className="p-5 border-b border-[#1e1e2e]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-xs font-bold text-white">
              P
            </div>
            <span className="font-bold">Pulsadar</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-3 px-3">
            Products
          </div>
          <button
            onClick={() => setActiveProduct("all")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
              activeProduct === "all"
                ? "bg-indigo-500/10 text-indigo-400"
                : "text-slate-400 hover:text-white hover:bg-[#1a1a28]"
            }`}
          >
            All Products
          </button>
          {products.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveProduct(p.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm truncate ${
                activeProduct === p.id
                  ? "bg-indigo-500/10 text-indigo-400"
                  : "text-slate-400 hover:text-white hover:bg-[#1a1a28]"
              }`}
            >
              {p.name}
              <span className="text-xs text-slate-600 ml-1">
                ({p.signals_today})
              </span>
            </button>
          ))}
          {products.length < limits.products && (
            <button
              onClick={() => setShowAddProduct(true)}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-indigo-400 hover:bg-indigo-500/10"
            >
              + Add Product
            </button>
          )}
        </nav>

        <div className="p-4 border-t border-[#1e1e2e] space-y-2">
          <div className="text-xs text-slate-500">Plan</div>
          <div className="text-sm font-medium capitalize">
            {tier} plan
          </div>
          {tier === "free" && (
            <a
              href="/dashboard/pricing"
              className="block text-xs text-indigo-400 hover:text-indigo-300"
            >
              Upgrade for more signals →
            </a>
          )}
          <div className="text-xs text-slate-600 mt-1">
            {limits.products === 999999
              ? "Unlimited"
              : `${products.length}/${limits.products}`}{" "}
            products •{" "}
            {limits.signals_per_day === 999999
              ? "Unlimited"
              : `${limits.signals_per_day}/day`}
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header with Scan button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Signal Feed</h1>
            <p className="text-sm text-slate-500 mt-1">
              Buying-intent signals from across the web
            </p>
          </div>
          <button
            onClick={handleScan}
            disabled={scanning || products.length === 0}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              scanning
                ? "bg-indigo-600/50 text-indigo-300 cursor-wait"
                : "bg-indigo-600 hover:bg-indigo-500 text-white"
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {scanning ? (
              <>
                <span className="animate-spin">⟳</span>
                Scanning...
              </>
            ) : (
              <>
                <span>📡</span>
                Scan Now
              </>
            )}
          </button>
        </div>

        {/* Scan result banner */}
        {scanResult && (
          <div
            className={`mb-6 px-4 py-3 rounded-xl text-sm ${
              scanResult.includes("failed") || scanResult.includes("limit")
                ? "bg-red-500/10 border border-red-500/20 text-red-400"
                : "bg-green-500/10 border border-green-500/20 text-green-400"
            }`}
          >
            {scanResult}
            <button
              onClick={() => setScanResult(null)}
              className="float-right text-slate-500 hover:text-white"
            >
              ×
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-5">
            <div className="text-sm text-slate-500 mb-1">
              Today&apos;s Signals
            </div>
            <div className="text-3xl font-bold">{todayCount}</div>
          </div>
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-5">
            <div className="text-sm text-slate-500 mb-1">High Intent</div>
            <div className="text-3xl font-bold text-green-400">{highCount}</div>
          </div>
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-5">
            <div className="text-sm text-slate-500 mb-1">Medium Intent</div>
            <div className="text-3xl font-bold text-yellow-400">
              {mediumCount}
            </div>
          </div>
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-5">
            <div className="text-sm text-slate-500 mb-1">Products</div>
            <div className="text-3xl font-bold text-indigo-400">
              {products.length}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-sm text-slate-500">Filter:</span>
          {(["all", "high", "medium", "low"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize ${
                filter === f
                  ? f === "all"
                    ? "bg-indigo-500/20 text-indigo-400"
                    : getIntentColor(f)
                  : "text-slate-500 hover:text-slate-300 bg-[#12121a]"
              }`}
            >
              {f}{" "}
              {f !== "all" &&
                `(${localSignals.filter((s) => s.intent_level === f).length})`}
            </button>
          ))}
        </div>

        {/* Signals Feed */}
        <div className="space-y-3">
          {filteredSignals.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-4xl mb-4">📡</div>
              <h3 className="text-lg font-semibold mb-2">No signals yet</h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                {products.length === 0
                  ? "Add your first product to start scanning for buying-intent signals across the web."
                  : 'Click "Scan Now" to find buying-intent signals for your products across Reddit, Hacker News, Stack Overflow, and more.'}
              </p>
              {products.length === 0 ? (
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium"
                >
                  Add Your First Product
                </button>
              ) : (
                <button
                  onClick={handleScan}
                  disabled={scanning}
                  className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {scanning ? "Scanning..." : "Scan Now"}
                </button>
              )}
            </div>
          ) : (
            filteredSignals.map((signal) => (
              <SignalCard
                key={signal.id}
                signal={signal}
                onAction={handleAction}
              />
            ))
          )}
        </div>
      </main>

      {showAddProduct && (
        <AddProductModal onClose={() => setShowAddProduct(false)} />
      )}
    </div>
  );
}
