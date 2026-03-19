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

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium">
            AI-Powered Buying Intent Radar
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Stop missing customers who are already looking for you
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            SignalStack monitors Reddit, Hacker News, Twitter, and 3 more
            platforms — surfaces buying-intent signals with AI scoring and
            response drafts. Find your next 100 customers for $10/mo.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/signup"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-xl font-semibold text-lg glow-brand"
            >
              Start Free — No Credit Card
            </Link>
            <Link
              href="#demo"
              className="w-full sm:w-auto border border-[#2d2d3f] hover:border-indigo-500/50 text-slate-300 px-8 py-3.5 rounded-xl font-medium"
            >
              See How It Works
            </Link>
          </div>
          <p className="text-sm text-slate-500 mt-4">
            Free forever plan available. Paid plans start at $10/mo.
          </p>
        </div>
      </section>

      {/* Sources */}
      <section className="py-16 px-6 border-y border-[#1e1e2e] bg-[#12121a]/50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-slate-500 uppercase tracking-wider mb-8 font-medium">
            Monitors 6 platforms in real-time
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {SOURCES.map((s) => (
              <div
                key={s.name}
                className="flex items-center gap-2 bg-[#1a1a28] px-5 py-3 rounded-xl border border-[#1e1e2e]"
              >
                <span className="text-lg">{s.icon}</span>
                <span className="text-sm font-medium text-slate-300">
                  {s.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="demo" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            How it works
          </h2>
          <p className="text-slate-400 text-center mb-16 max-w-xl mx-auto">
            Three steps. Five minutes. Start finding customers today.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Describe your product",
                desc: "Enter your product name, keywords, and competitors. SignalStack starts scanning immediately.",
              },
              {
                step: "02",
                title: "AI scores every signal",
                desc: "Our AI reads every post and scores buying intent from 0–100. High-intent signals surface first.",
              },
              {
                step: "03",
                title: "Respond & convert",
                desc: "Get AI-drafted responses that are helpful, not spammy. Post in seconds, close deals in days.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-8"
              >
                <div className="text-indigo-500 font-mono text-sm mb-4 font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-16 px-6 bg-[#12121a]/50 border-y border-[#1e1e2e]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-2xl font-semibold mb-2">
            &quot;I found a Reddit thread from 3 days ago where someone asked for
            exactly my product. 47 upvotes. Zero replies.&quot;
          </p>
          <p className="text-slate-500 text-sm">
            — Every indie founder, at least once
          </p>
          <p className="text-indigo-400 font-medium mt-4">
            SignalStack makes sure that never happens again.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Simple, founder-friendly pricing
          </h2>
          <p className="text-slate-400 text-center mb-16">
            Pays for itself with a single customer conversion.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`bg-[#12121a] border rounded-2xl p-6 flex flex-col ${
                  tier.featured
                    ? "border-indigo-500/50 glow-brand"
                    : "border-[#1e1e2e]"
                }`}
              >
                {tier.featured && (
                  <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-semibold">{tier.name}</h3>
                <div className="mt-3 mb-4">
                  <span className="text-4xl font-extrabold">{tier.price}</span>
                  <span className="text-slate-500 text-sm">
                    {tier.period}
                  </span>
                </div>
                <ul className="flex-1 space-y-2.5 mb-6">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-slate-400"
                    >
                      <span className="text-green-400">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/signup"
                  className={`block text-center py-2.5 rounded-lg font-medium text-sm ${
                    tier.featured
                      ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                      : "bg-[#1a1a28] hover:bg-[#22222f] text-slate-300 border border-[#2d2d3f]"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">
            Every customer starts as a signal
          </h2>
          <p className="text-xl text-slate-400 mb-8">
            Catch them first. Start free today.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-xl font-semibold text-lg glow-brand"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1e1e2e] py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-xs font-bold text-white">
              S
            </div>
            <span className="font-semibold">SignalStack</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link href="/terms" className="hover:text-slate-300">Terms</Link>
            <Link href="/privacy" className="hover:text-slate-300">Privacy</Link>
            <Link href="/refund" className="hover:text-slate-300">Refund Policy</Link>
          </div>
          <p className="text-sm text-slate-600">
            © {new Date().getFullYear()} SignalStack. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
