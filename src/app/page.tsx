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
    cta: "Try Free for 7 Days",
    featured: true,
  },
  {
    name: "Growth",
    price: "$29",
    period: "/month",
    features: [
      "10 products",
      "500 signals/day",
      "AI response drafts",
      "Competitor tracking",
      "Priority support",
    ],
    cta: "Try Free for 7 Days",
    featured: false,
  },
  {
    name: "Team",
    price: "$79",
    period: "/month",
    features: [
      "25 products",
      "Slack & Discord alerts",
      "REST API access",
      "Team collaboration",
      "Custom sources",
    ],
    cta: "Contact Us",
    featured: false,
  },
];

const COMPETITORS = [
  {
    name: "Pulsadar",
    highlight: true,
    intentScoring: "AI-powered (GPT-4o)",
    platforms: "6 platforms",
    responseDrafts: true,
    realTimeAlerts: true,
    price: "From $10/mo",
    freeplan: true,
  },
  {
    name: "F5Bot",
    highlight: false,
    intentScoring: "None",
    platforms: "Reddit, HN",
    responseDrafts: false,
    realTimeAlerts: true,
    price: "Free",
    freeplan: true,
  },
  {
    name: "GummySearch",
    highlight: false,
    intentScoring: "Basic keyword",
    platforms: "Reddit only",
    responseDrafts: false,
    realTimeAlerts: true,
    price: "From $48/mo",
    freeplan: false,
  },
  {
    name: "Brand24",
    highlight: false,
    intentScoring: "Sentiment only",
    platforms: "Social + web",
    responseDrafts: false,
    realTimeAlerts: true,
    price: "From $119/mo",
    freeplan: false,
  },
];

const DEMO_SIGNALS = [
  {
    source: "Reddit",
    icon: "🔴",
    subreddit: "r/SaaS",
    title: "Looking for a tool to monitor Reddit for potential customers",
    score: 92,
    level: "high" as const,
    summary:
      "User is actively searching for a monitoring solution to find buying intent signals. Strong purchase intent with specific requirements around AI scoring.",
    timeAgo: "2h ago",
  },
  {
    source: "Hacker News",
    icon: "🟠",
    subreddit: "Show HN",
    title: "Ask HN: How do you find your first 10 customers?",
    score: 78,
    level: "high" as const,
    summary:
      "Founder asking for acquisition strategies. Multiple commenters discussing social monitoring tools. Good opportunity to demonstrate value.",
    timeAgo: "5h ago",
  },
  {
    source: "Stack Overflow",
    icon: "📚",
    subreddit: "node.js",
    title: "Best way to build a Reddit scraper for keyword monitoring?",
    score: 45,
    level: "medium" as const,
    summary:
      "Developer building their own monitoring tool. Could be converted to a paying user by showing the time savings of a managed solution.",
    timeAgo: "1d ago",
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
              P
            </div>
            <span className="font-bold text-lg">Pulsadar</span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/about"
              className="text-sm text-slate-400 hover:text-white hidden sm:inline"
            >
              About
            </Link>
            <Link
              href="/data-sources"
              className="text-sm text-slate-400 hover:text-white hidden sm:inline"
            >
              Data Sources
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-slate-400 hover:text-white hidden sm:inline"
            >
              Pricing
            </Link>
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
              Try Pulsadar Free
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
            Pulsadar monitors Reddit, Hacker News, Twitter, and 3 more platforms
            — surfaces buying-intent signals with AI scoring and response drafts.
            Not just monitoring, but prioritisation that saves you hours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/signup"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-xl font-semibold text-lg glow-brand"
            >
              Try Pulsadar Free — No Credit Card
            </Link>
            <Link
              href="#demo"
              className="w-full sm:w-auto border border-[#2d2d3f] hover:border-indigo-500/50 text-slate-300 px-8 py-3.5 rounded-xl font-medium"
            >
              See Live Scoring Demo
            </Link>
          </div>
          <p className="text-sm text-slate-500 mt-4">
            Free forever plan available. Paid plans start at $10/mo. Save 20%
            with annual billing.
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
                desc: "Enter your product name, keywords, and competitors. Pulsadar starts scanning immediately.",
              },
              {
                step: "02",
                title: "AI scores every signal",
                desc: "Our AI reads every post and scores buying intent from 0-100. High-intent signals surface first so you never miss a hot lead.",
              },
              {
                step: "03",
                title: "Respond & convert",
                desc: "Get community-friendly AI drafts that add value first — never spammy. Post in seconds, close deals in days.",
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

      {/* Live Scoring Demo */}
      <section className="py-24 px-6 border-y border-[#1e1e2e] bg-[#12121a]/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            See intent scoring in action
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-xl mx-auto">
            Real examples of how Pulsadar scores and prioritises posts from
            across the web. Higher scores mean stronger buying intent.
          </p>
          <div className="space-y-4">
            {DEMO_SIGNALS.map((signal) => (
              <div
                key={signal.title}
                className="bg-[#0c0c14] border border-[#1e1e2e] rounded-xl p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="text-2xl mt-0.5">{signal.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-semibold border ${
                          signal.level === "high"
                            ? "text-green-400 bg-green-400/10 border-green-400/20"
                            : "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
                        }`}
                      >
                        {signal.score}% intent
                      </span>
                      <span className="text-xs text-slate-500">
                        {signal.source} &middot; {signal.subreddit}
                      </span>
                      <span className="text-xs text-slate-600">
                        {signal.timeAgo}
                      </span>
                    </div>
                    <h4 className="font-medium text-sm mb-1">{signal.title}</h4>
                    <p className="text-sm text-slate-400">{signal.summary}</p>
                  </div>
                  <div
                    className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                      signal.level === "high"
                        ? "bg-green-400"
                        : "bg-yellow-400"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-center mt-8 text-sm text-slate-500">
            Posts shown are representative examples. Actual signals are
            personalised to your product keywords.
          </p>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-2xl font-semibold mb-2">
            &quot;I found a Reddit thread from 3 days ago where someone asked
            for exactly my product. 47 upvotes. Zero replies.&quot;
          </p>
          <p className="text-slate-500 text-sm">
            — Every indie founder, at least once
          </p>
          <p className="text-indigo-400 font-medium mt-4">
            Pulsadar makes sure that never happens again.
          </p>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-24 px-6 border-y border-[#1e1e2e] bg-[#12121a]/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            How Pulsadar compares
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-xl mx-auto">
            Purpose-built for technical founders who need signal prioritisation,
            not just keyword alerts.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1e1e2e]">
                  <th className="text-left py-4 px-4 text-slate-400 font-medium">
                    Feature
                  </th>
                  {COMPETITORS.map((c) => (
                    <th
                      key={c.name}
                      className={`text-center py-4 px-4 font-semibold ${
                        c.highlight ? "text-indigo-400" : "text-slate-300"
                      }`}
                    >
                      {c.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-slate-400">
                <tr className="border-b border-[#1e1e2e]/50">
                  <td className="py-3 px-4 font-medium text-slate-300">
                    Intent Scoring
                  </td>
                  {COMPETITORS.map((c) => (
                    <td
                      key={c.name}
                      className={`text-center py-3 px-4 ${
                        c.highlight ? "text-white font-medium" : ""
                      }`}
                    >
                      {c.intentScoring}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-[#1e1e2e]/50">
                  <td className="py-3 px-4 font-medium text-slate-300">
                    Platforms
                  </td>
                  {COMPETITORS.map((c) => (
                    <td
                      key={c.name}
                      className={`text-center py-3 px-4 ${
                        c.highlight ? "text-white font-medium" : ""
                      }`}
                    >
                      {c.platforms}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-[#1e1e2e]/50">
                  <td className="py-3 px-4 font-medium text-slate-300">
                    AI Response Drafts
                  </td>
                  {COMPETITORS.map((c) => (
                    <td key={c.name} className="text-center py-3 px-4">
                      {c.responseDrafts ? (
                        <span className="text-green-400">✓</span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-[#1e1e2e]/50">
                  <td className="py-3 px-4 font-medium text-slate-300">
                    Free Plan
                  </td>
                  {COMPETITORS.map((c) => (
                    <td key={c.name} className="text-center py-3 px-4">
                      {c.freeplan ? (
                        <span className="text-green-400">✓</span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-300">
                    Starting Price
                  </td>
                  {COMPETITORS.map((c) => (
                    <td
                      key={c.name}
                      className={`text-center py-3 px-4 ${
                        c.highlight ? "text-indigo-400 font-semibold" : ""
                      }`}
                    >
                      {c.price}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Simple, founder-friendly pricing
          </h2>
          <p className="text-slate-400 text-center mb-4">
            Pays for itself with a single customer conversion.
          </p>
          <p className="text-sm text-indigo-400 text-center mb-16">
            Save 20% with annual billing on all paid plans.
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
                  <span className="text-slate-500 text-sm">{tier.period}</span>
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
          <p className="text-center text-xs text-slate-600 mt-8">
            All plans subject to fair usage. Need higher volumes?{" "}
            <a href="mailto:hello@pulsadar.com" className="text-indigo-400 hover:underline">
              Contact us
            </a>{" "}
            for enterprise pricing.
          </p>
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
            Try Pulsadar Free — No Credit Card Required
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1e1e2e] py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-xs font-bold text-white">
              P
            </div>
            <span className="font-semibold">Pulsadar</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link href="/about" className="hover:text-slate-300">
              About
            </Link>
            <Link href="/data-sources" className="hover:text-slate-300">
              Data Sources
            </Link>
            <Link href="/terms" className="hover:text-slate-300">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-slate-300">
              Privacy
            </Link>
            <Link href="/refund" className="hover:text-slate-300">
              Refund Policy
            </Link>
          </div>
          <p className="text-sm text-slate-600">
            &copy; {new Date().getFullYear()} Pulsadar. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
