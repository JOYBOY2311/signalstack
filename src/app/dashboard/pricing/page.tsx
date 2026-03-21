"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const plans = [
  {
    tier: "free",
    name: "Free",
    priceUSD: "$0",
    priceINR: "₹0",
    period: "forever",
    description: "Get started with basic signal monitoring",
    features: [
      "1 product",
      "10 signals/day",
      "3 platforms (Reddit, HN, SO)",
      "Keyword-based scoring",
      "Email support",
    ],
    cta: "Current Plan",
    highlighted: false,
  },
  {
    tier: "starter",
    name: "Starter",
    priceUSD: "$10",
    priceINR: "₹799",
    period: "/month",
    description: "For indie hackers getting serious about leads",
    features: [
      "3 products",
      "50 signals/day",
      "All 5 platforms",
      "AI intent scoring",
      "Real-time alerts",
      "7-day free trial",
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    tier: "growth",
    name: "Growth",
    priceUSD: "$29",
    priceINR: "₹2,399",
    period: "/month",
    description: "AI-powered response drafts and unlimited signals",
    features: [
      "10 products",
      "Unlimited signals",
      "AI response drafts",
      "Competitor tracking",
      "Priority support",
      "7-day free trial",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    tier: "team",
    name: "Team",
    priceUSD: "$79",
    priceINR: "₹6,499",
    period: "/month",
    description: "For teams scaling their outbound engine",
    features: [
      "Unlimited products",
      "Unlimited signals",
      "AI response drafts",
      "REST API access",
      "Team collaboration",
      "7-day free trial",
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isINR, setIsINR] = useState(false);
  const router = useRouter();

  async function handleCheckout(tier: string) {
    if (tier === "free") {
      router.push("/auth/signup");
      return;
    }

    setLoading(tier);
    setError("");

    try {
      const res = await fetch("/api/razorpay/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier,
          currency: isINR ? "INR" : "USD",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create checkout");
        setLoading(null);
        return;
      }

      // Load Razorpay checkout modal
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        const options = {
          key: data.razorpay_key,
          subscription_id: data.subscription_id,
          name: "Pulsadar",
          description: `${tier.charAt(0).toUpperCase() + tier.slice(1)} Plan - AI Buying Intent Radar`,
          theme: { color: "#6366f1" },
          handler: function () {
            // Payment successful — redirect to dashboard
            router.push("/dashboard?upgraded=true");
          },
          modal: {
            ondismiss: function () {
              setLoading(null);
            },
          },
        };
        const rzp = new (window as Record<string, unknown> & { Razorpay: new (opts: unknown) => { open: () => void } }).Razorpay(options);
        rzp.open();
      };
      document.body.appendChild(script);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#0c0c14] text-white">
      {/* Nav */}
      <nav className="border-b border-[#1e1e2e] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-xs font-bold">
              P
            </div>
            <span className="font-bold text-lg">Pulsadar</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-sm text-slate-400 hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Start free. Upgrade when you need more signals, more products, or
            AI-powered response drafts.
          </p>

          {/* Currency toggle */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <span
              className={`text-sm ${!isINR ? "text-white font-medium" : "text-slate-500"}`}
            >
              USD
            </span>
            <button
              onClick={() => setIsINR(!isINR)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                isINR ? "bg-indigo-600" : "bg-[#2d2d3f]"
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                  isINR ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </button>
            <span
              className={`text-sm ${isINR ? "text-white font-medium" : "text-slate-500"}`}
            >
              INR
            </span>
          </div>
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-8 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3 text-center">
            {error}
          </div>
        )}

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.tier}
              className={`relative rounded-2xl p-6 flex flex-col ${
                plan.highlighted
                  ? "bg-gradient-to-b from-indigo-500/10 to-[#12121a] border-2 border-indigo-500/40"
                  : "bg-[#12121a] border border-[#1e1e2e]"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="text-sm text-slate-400 mt-1">
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold">
                  {isINR ? plan.priceINR : plan.priceUSD}
                </span>
                <span className="text-slate-500 text-sm">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-slate-300"
                  >
                    <span className="text-indigo-400 mt-0.5">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(plan.tier)}
                disabled={loading !== null}
                className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                  plan.tier === "free"
                    ? "bg-[#1e1e2e] text-slate-300 hover:bg-[#2d2d3f]"
                    : plan.highlighted
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                    : "bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600/20 border border-indigo-500/20"
                } ${loading === plan.tier ? "opacity-50 cursor-wait" : ""}`}
              >
                {loading === plan.tier ? "Loading..." : plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ / Trust */}
        <div className="mt-16 text-center">
          <p className="text-sm text-slate-500">
            All paid plans include a 7-day free trial. Cancel anytime. No
            questions asked.
          </p>
        </div>
      </div>
    </div>
  );
}
