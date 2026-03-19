"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

export function AddProductModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [competitors, setCompetitors] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createSupabaseBrowser();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("products").insert({
      user_id: user.id,
      name,
      description,
      keywords: keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean),
      competitor_names: competitors
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
      url: url || null,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
    } else {
      router.refresh();
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl w-full max-w-lg mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Add a product to monitor</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white text-xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Product name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              placeholder="e.g., StatusPing"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Short description *
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              placeholder="e.g., Simple uptime monitoring for indie developers"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Keywords (comma-separated) *
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              placeholder="e.g., uptime monitoring, website monitoring, downtime alerts"
              required
            />
            <p className="text-xs text-slate-500 mt-1">
              These keywords are used to find relevant signals across platforms
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Competitors (comma-separated)
            </label>
            <input
              type="text"
              value={competitors}
              onChange={(e) => setCompetitors(e.target.value)}
              className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              placeholder="e.g., Pingdom, UptimeRobot, BetterUptime"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Product URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              placeholder="https://yourproduct.com"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-2.5">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-medium"
            >
              {loading ? "Adding..." : "Start Monitoring"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
