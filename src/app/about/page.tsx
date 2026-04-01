import Link from "next/link";

export const metadata = {
  title: "About Pulsadar — Our Story",
  description:
    "Pulsadar was built by a solo founder who got tired of missing buying-intent conversations online. Learn our story, mission, and how we help technical founders find customers.",
};

export default function AboutPage() {
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
            Built by a founder, for founders
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed">
            Pulsadar exists because finding customers shouldn&apos;t require
            spending hours scrolling Reddit, Hacker News, and Twitter hoping to
            stumble on the right conversation at the right time.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">The problem</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              Every day, hundreds of people post on Reddit, Hacker News, Stack
              Overflow, and Twitter asking for recommendations, comparing
              products, or describing a pain point that your product solves. Most
              of those conversations go unanswered because you simply
              didn&apos;t see them in time.
            </p>
            <p className="text-slate-400 leading-relaxed">
              Free tools like F5Bot send you keyword alerts, but they flood you
              with noise — every mention, regardless of whether the person is
              actually looking to buy. Enterprise monitoring tools like Brand24
              cost $100+/mo and are designed for brand reputation, not customer
              acquisition.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Our approach</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              Pulsadar is different because we focus on one thing:{" "}
              <span className="text-white font-medium">
                buying intent, not just mentions
              </span>
              . Our AI reads every post and scores it from 0-100 based on how
              likely the author is to become a paying customer. A post saying
              &quot;looking for a tool that does X&quot; scores much higher than
              a casual mention of a keyword.
            </p>
            <p className="text-slate-400 leading-relaxed">
              We also draft community-friendly responses for you — designed to
              add value first and sell second. Because the best way to convert
              someone online is to genuinely help them, not drop a link and
              disappear.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Who we build for</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              Pulsadar is purpose-built for technical founders, indie hackers,
              and small dev teams selling developer tools, SaaS products, and
              technical services. The platforms we monitor — Reddit, Hacker News,
              Stack Overflow, GitHub Issues — are where your customers hang out.
            </p>
            <p className="text-slate-400 leading-relaxed">
              We believe that the best products are discovered through authentic
              conversations, not ads. If you&apos;re building something people
              want, we help you find the people who want it.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Our commitment</h2>
            <div className="space-y-3">
              {[
                {
                  title: "Transparency",
                  desc: "We use official APIs and respect rate limits. We publish our data sources and compliance practices openly.",
                },
                {
                  title: "Community-first",
                  desc: "Our AI drafts are designed to add value, not spam. We include guidelines to help you engage authentically.",
                },
                {
                  title: "Privacy",
                  desc: "We only monitor public posts. We never scrape private messages, DMs, or gated content. Your keywords and products stay private.",
                },
                {
                  title: "Fair pricing",
                  desc: "We keep prices founder-friendly because we are founders too. Free plan forever, paid plans that pay for themselves.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-5"
                >
                  <h3 className="font-semibold text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-8 text-center">
            <p className="text-slate-400 mb-4">
              Have questions, feedback, or just want to chat?
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
