import Link from "next/link";

const SOURCES = [
  { name: "Reddit", icon: "🔴", delay: "0s" },
  { name: "Hacker News", icon: "🟠", delay: "0.1s" },
  { name: "Twitter/X", icon: "🐦", delay: "0.2s" },
  { name: "Stack Overflow", icon: "📚", delay: "0.3s" },
  { name: "GitHub Issues", icon: "🐙", delay: "0.4s" },
  { name: "Indie Hackers", icon: "💡", delay: "0.5s" },
];

const TIERS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: ["1 product", "10 signals/day", "Reddit + HN", "Email digest"],
    cta: "Start Free",
    featured: false,
  },
  {
    name: "Starter",
    price: "$10",
    period: "/month",
    features: [
      "3 products",
      "50 signals/day",
      "All 6 platforms",
      "AI intent scoring",
      "Real-time alerts",
    ],
    cta: "Start 7-Day Trial",
    featured: true,
  },
  {
    name: "Growth",
    price: "$29",
    period: "/month",
    features: [
      "10 products",
      "Unlimited signals",
      "AI response drafts",
      "Competitor tracking",
      "Priority support",
    ],
    cta: "Start 7-Day Trial",
    featured: false,
  },
  {
    name: "Team",
    price: "$79",
    period: "/month",
    features: [
      "Unlimited everything",
      "Slack & Discord",
      "REST API access",
      "Team collaboration",
      "Custom sources",
    ],
    cta: "Contact Us",
    featured: false,
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-[#0a0a0f]/80 border-b border-[#1e1e2e]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-sm font-bold text-white">
              S
            </div>
            <span className="font-bold text-lg">SignalStack</span>
          </div>
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