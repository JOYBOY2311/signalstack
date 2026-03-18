"use client";

import { useState } from "react";
import { getIntentColor, getSourceIcon, timeAgo } from "@/lib/utils";
import type { Signal, Product, UserProfile } from "@/types";
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

  const filteredSignals = signals.filter((s) => {
    if (filter !== "all" && s.intent_level !== filter) return false;
    if (activeProduct !== "all" && s.product_id !== activeProduct) return false;
    return true;
  });

  const highCount = signals.filter((s) => s.intent_level === "high").length;
  const mediumCount = signals.filter((s) => s.intent_level === "medium").length;
  const todayCount = signals.filter(
    (s) =>
      new Date(s.detected_at).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="v-64 border-r border-[#1e1e2e] bg-[#0c0c14] flex flex-col h-screen sticky top-0">
        <div className="p-5 border-b border-[#1e1e2e]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-xs font-bold text-white">
              S
            </div>
            <span className="font-bold">SignalStack</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
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
            </button>
          ))}
          <button
            onClick={() => setShowAddProduct(true)}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-indigo-400 hover:bg-indigo-500/10"
          >
            + Add Product
          </button>
        </nav>

        <div className="p-4 border-t border-[#1e1e2e]">
          <div className="text-xs text-slate-500 mb-1">Plan</div>
          <div className="text-sm font-medium capitalize">
            {profile?.tier || "free"} plan
          </div>
          {profile?.tier === "free" && (
            <a
              href="/dashboard/billing"
              className="text-xs text-indigo-400 hover:text-indigo-300"
            >
              Upgrade to Starter →
            </a>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-5">
            <div className="text-sm text-slate-500 mb-1">Today&apos;s Signals</div>
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
              {f} {f !== "all" && `(${signals.filter((s) => s.intent_level === f).length})`}
            </button>
          ))}
        </div>
        >
    </div>
  
 "