/**
 * Pulsadar Signal Engine v2
 *
 * Multi-platform buying-intent scanner:
 * 1. Reddit (JSON API)
 * 2. Hacker News (Algolia API)
 * 3. Stack Overflow (API v2.3)
 * 4. Dev.to (Forem API)
 * 5. GitHub Discussions (Search API)
 *
 * Plus AI-powered intent classification via OpenAI GPT-4o-mini
 */

import { SignalSource, IntentLevel, type Product } from "@/types";

interface RawPost {
  source: SignalSource;
  source_url: string;
  title: string;
  content: string;
  author: string;
  posted_at: string;
}

export interface ClassifiedSignal extends RawPost {
  intent_level: IntentLevel;
  intent_score: number;
  ai_summary: string;
  ai_draft_response: string | null;
}

// --- Platform Fetchers ---

async function fetchRedditPosts(keywords: string[]): Promise<RawPost[]> {
  const posts: RawPost[] = [];
  // Use top 3 keywords to avoid rate limits
  for (const keyword of keywords.slice(0, 3)) {
    try {
      const res = await fetch(
        `https://www.reddit.com/search.json?q=${encodeURIComponent(keyword)}&sort=new&limit=25&t=day`,
        {
          headers: { "User-Agent": "Pulsadar/2.0 (signal-scanner)" },
          signal: AbortSignal.timeout(10000),
        }
      );
      if (!res.ok) continue;
      const data = await res.json();
      for (const child of data?.data?.children ?? []) {
        const post = child.data;
        if (!post.title) continue;
        posts.push({
          source: "reddit",
          source_url: `https://reddit.com${post.permalink}`,
          title: post.title,
          content: post.selftext?.slice(0, 2000) || "",
          author: post.author || "unknown",
          posted_at: new Date(post.created_utc * 1000).toISOString(),
        });
      }
    } catch {
      // Continue on fetch errors
    }
  }
  return posts;
}
