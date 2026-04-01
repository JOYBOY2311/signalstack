import Link from "next/link";

export const metadata = {
  title: "Data Sources & Compliance — Pulsadar",
  description:
    "How Pulsadar collects signals across Reddit, Hacker News, Twitter, Stack Overflow, GitHub, and Indie Hackers. Our approach to API compliance, rate limiting, caching, and privacy.",
};

const PLATFORMS = [
  {
    name: "Reddit",
    icon: "🔴",
    method: "Official JSON API",
    details:
      "We use Reddit's public JSON endpoints to search for relevant posts and comments. All requests respect Reddit's API rate limits and terms of service. We only access publicly visible content.",
    status: "Stable",
  },
  {
    name: "Hacker News",
    icon: "🟠",
    method: "Algolia Search API",
    details:
      "We use the official HN Algolia API (hn.algolia.com) which is publicly provided for search and data access. This is the same API used by most HN readers and tools.",
    status: "Stable",
  },
  {
    name: "Stack Overflow",
    icon: "📚",
    method: "Stack Exchange API v2.3",
    details:
      "We use the official Stack Exchange API with proper API key registration. Requests are throttled to stay well within the published rate limits. Only public Q&A content is accessed.",
    status: "Stable",
  },
  {
    name: "Twitter/X",
    icon: "🐦",
    method: "Official API v2",
    details:
      "We use Twitter's official API v2 for search queries. Due to API pricing volatility, we have built fallback mechanisms including reduced polling frequency and cached results. We prioritise Reddit and HN for reliability.",
    status: "Limited",
  },
  {
    name: "GitHub Issues",
    icon: "🐙",
    method: "GitHub REST API v3",
    details:
      "We use GitHub's official REST API to search public issues and discussions. All requests use proper authentication and respect rate limits. Only public repositories are monitored.",
    status: "Stable",
  },
  {
    name: "Indie Hackers",
    icon: "💡",
    method: "Public feed parsing",
    details:
      "We monitor Indie Hackers through publicly available RSS/feed endpoints. Content is cached to minimise requests. Only publicly visible posts and comments are included.",
    status: "Stable",
  },
];

export default function DataSourcesPage() {
  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-[#0a0a0f]/80 border-b border-[#1e1e2e]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-sm font-bold text-white">
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
              Try Pulsadar Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="text-sm text-indigo-400 hover:text-indigo-300 mb-8 inline-block"
          >
            &larr; Back to home
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Data Sources & Compliance
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed">
            Transparency is core to how we operate. Here&apos;s exactly how
            Pulsadar collects data, which APIs we use, and how we handle rate
            limiting, caching, and privacy.
          </p>
        </div>
      </section>

      {/* Principles */}
      <section className="py-16 px-6 border-y border-[#1e1e2e] bg-[#12121a]/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Our principles</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                title: "Official APIs only",
                desc: "We use documented, public APIs wherever available. No scraping of authenticated pages, no headless browsers, no terms of service violations.",
              },
              {
                title: "Rate limit compliance",
                desc: "Every API call is throttled to stay well within published rate limits. We use exponential backoff on errors and never retry aggressively.",
              },
              {
                title: "Smart caching",
                desc: "Results are cached to reduce redundant API calls. Stale-while-revalidate patterns ensure freshness without overwhelming source platforms.",
              },
              {
                title: "Public content only",
                desc: "We only monitor publicly visible posts, comments, and discussions. Private messages, DMs, and gated content are never accessed.",
              },
            ].map((p) => (
              <div
                key={p.title}
                className="bg-[#0c0c14] border border-[#1e1e2e] rounded-xl p-5"
              >
                <h3 className="font-semibold text-white mb-2">{p.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform details */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Platform-by-platform</h2>
          <div className="space-y-4">
            {PLATFORMS.map((p) => (
              <div
                key={p.name}
                className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{p.icon}</span>
                  <h3 className="font-semibold text-lg">{p.name}</h3>
                  <span
                    className={`ml-auto text-xs px-2.5 py-1 rounded-full font-medium ${
                      p.status === "Stable"
                        ? "text-green-400 bg-green-400/10 border border-green-400/20"
                        : "text-yellow-400 bg-yellow-400/10 border border-yellow-400/20"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
                <div className="text-sm text-indigo-400 font-medium mb-2">
                  Method: {p.method}
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {p.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data handling */}
      <section className="py-16 px-6 border-y border-[#1e1e2e] bg-[#12121a]/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">How we handle your data</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-white mb-2">
                What we store
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                We store your product keywords, matched signals (post title, URL,
                content snippet, author username, AI-generated summary and score),
                and your account information. Signals are retained for 90 days,
                then automatically purged.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">
                What we don&apos;t store
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                We do not store complete post histories, user profiles from source
                platforms, or any private/authenticated content. We never collect
                passwords or authentication tokens for source platforms.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">
                API volatility and fallbacks
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Platform APIs can change without notice. We actively monitor
                terms of service changes and maintain fallback mechanisms
                including RSS feed monitoring and reduced polling intervals. If a
                platform restricts API access, we adjust our approach or
                temporarily pause that source — we never circumvent
                restrictions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">
                Infrastructure
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Pulsadar runs on Vercel (serverless) with data stored in
                Supabase (Postgres). All connections are encrypted via TLS.
                Authentication is handled by Supabase Auth with bcrypt password
                hashing. We do not sell or share your data with third parties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-2">
              Questions about our data practices?
            </h2>
            <p className="text-slate-400 mb-4 text-sm">
              We&apos;re happy to answer questions about how we handle data,
              comply with platform terms, or anything else.
            </p>
            <a
              href="mailto:hello@pulsadar.com"
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              hello@pulsadar.com
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1e1e2e] py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-xs font-bold text-white">
              P
            </div>
            <span className="font-semibold">Pulsadar</span>
          </Link>
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
          </div>
          <p className="text-sm text-slate-600">
            &copy; {new Date().getFullYear()} Pulsadar. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
