/**
 * Pulsadar Signal Engine
 *
 * This module handles:
 * 1. Fetching posts from multiple platforms (Reddit, HN, Twitter, SO, GitHub)
 * 2. AI-powered intent classification
 * 3. Signal scoring and prioritization
 * 4. AI response draft generation
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

interface ClassifiedSignal extends RawPost {
  intent_level: IntentLevel;
  intent_score: number;
  ai_summary: string;
  ai_draft_response: string | null;
}

// --- Platform Fetchers ---

async function fetchRedditPosts(keywords: string[]): Promise<RawPost[]> {
  const posts: RawPost[] = [];
  for (const keyword of keywords) {
    try {
      const res = await fetch(
        `https://www.reddit.com/search.json?q=${encodeURIComponent(keyword)}&sort=new&limit=25&t=day`,
        {
          headers: { "User-Agent": "Pulsadar/1.0" },
          next: { revalidate: 300 }, // cache 5 min
        }
      );
      if (!res.ok) continue;
      const data = await res.json();
      for (const child of data?.data?.children ?? []) {
        const post = child.data;
        posts.push({
          source: "reddit",
          source_url: `https://reddit.com${post.permalink}`,
          title: post.title,
          content: post.selftext?.slice(0, 2000) || "",
          author: post.author,
          posted_at: new Date(post.created_utc * 1000).toISOString(),
        });
      }
    } catch {
      // Silently continue on fetch errors
    }
  }
  return posts;
}

async function fetchHNPosts(keywords: string[]): Promise<RawPost[]> {
  const posts: RawPost[] = [];
  for (const keyword of keywords) {
    try {
      const res = await fetch(
        `https://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(keyword)}&tags=story&hitsPerPage=25`,
        { next: { revalidate: 300 } }
      );
      if (!res.ok) continue;
      const data = await res.json();
      for (const hit of data?.hits ?? []) {
        posts.push({
          source: "hackernews",
          source_url: `https://news.ycombinator.com/item?id=${hit.objectID}`,
          title: hit.title || "",
          content: hit.story_text?.slice(0, 2000) || "",
          author: hit.author || "unknown",
          posted_at: hit.created_at || new Date().toISOString(),
        });
      }
    } catch {
      // Continue
    }
  }
  return posts;
}

async function fetchStackOverflowPosts(keywords: string[]): Promise<RawPost[]> {
  const posts: RawPost[] = [];
  const tagQuery = keywords.slice(0, 5).join(";");
  try {
    const res = await fetch(
      `https://api.stackexchange.com/2.3/search?order=desc&sort=creation&intitle=${encodeURIComponent(tagQuery)}&site=stackoverflow&pagesize=25&filter=withbody`,
      { next: { revalidate: 600 } }
    );
    if (res.ok) {
      const data = await res.json();
      for (const item of data?.items ?? []) {
        posts.push({
          source: "stackoverflow",
          source_url: item.link,
          title: item.title,
          content: item.body?.replace(/<[^>]*>/g, "").slice(0, 2000) || "",
          author: item.owner?.display_name || "unknown",
          posted_at: new Date(item.creation_date * 1000).toISOString(),
        });
      }
    }
  } catch {
    // Continue
  }
  return posts;
}

// --- AI Classification ---

async function classifySignals(
  posts: RawPost[],
  product: Product,
  enableDrafts: boolean
): Promise<ClassifiedSignal[]> {
  if (!process.env.OPENAI_API_KEY || posts.length === 0) {
    return posts.map((p) => ({
      ...p,
      intent_level: "low" as IntentLevel,
      intent_score: 30,
      ai_summary: `Post about "${p.title}" detected on ${p.source}`,
      ai_draft_response: null,
    }));
  }

  const classified: ClassifiedSignal[] = [];

  // Process in batches of 5 for efficiency
  const batches = [];
  for (let i = 0; i < posts.length; i += 5) {
    batches.push(posts.slice(i, i + 5));
  }

  for (const batch of batches) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are a buying-intent classifier for "${product.name}" (${product.description}).
Keywords: ${product.keywords.join(", ")}. Competitors: ${product.competitor_names.join(", ")}.

For each post, respond with JSON array:
[{ "index": 0, "intent_level": "high|medium|low", "intent_score": 0-100, "summary": "one line summary", "draft_response": "helpful non-spammy response suggesting the product" }]

HIGH intent (70-100): User is actively seeking a tool, comparing options, or expressing frustration with a competitor.
MEDIUM intent (40-69): User discusses the problem space but isn't explicitly looking for a solution.
LOW intent (0-39): Tangentially related, no buying signal.

${enableDrafts ? "Include draft_response for HIGH and MEDIUM signals." : "Set draft_response to null."}`,
            },
            {
              role: "user",
              content: JSON.stringify(
                batch.map((p, i) => ({
                  index: i,
                  title: p.title,
                  content: p.content.slice(0, 500),
                  source: p.source,
                }))
              ),
            },
          ],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content || "[]";
        const results = JSON.parse(content);
        for (const result of results) {
          const post = batch[result.index];
          if (post) {
            classified.push({
              ...post,
              intent_level: result.intent_level || "low",
              intent_score: result.intent_score || 30,
              ai_summary: result.summary || `Signal from ${post.source}`,
              ai_draft_response: result.draft_response || null,
            });
          }
        }
      } else {
        // Fallback: add unclassified
        classified.push(
          ...batch.map((p) => ({
            ...p,
            intent_level: "low" as IntentLevel,
            intent_score: 30,
            ai_summary: `Post about "${p.title}" on ${p.source}`,
            ai_draft_response: null,
          }))
        );
      }
    } catch {
      classified.push(
        ...batch.map((p) => ({
          ...p,
          intent_level: "low" as IntentLevel,
          intent_score: 30,
          ai_summary: `Post about "${p.title}" on ${p.source}`,
          ai_draft_response: null,
        }))
      );
    }
  }

  return classified.sort((a, b) => b.intent_score - a.intent_score);
}

// --- Main Engine ---

export async function scanForSignals(
  product: Product,
  enableDrafts: boolean
): Promise<ClassifiedSignal[]> {
  const allKeywords = [
    ...product.keywords,
    product.name,
    ...product.competitor_names,
  ];

  // Fetch from all platforms in parallel
  const [redditPosts, hnPosts, soPosts] = await Promise.all([
    fetchRedditPosts(allKeywords),
    fetchHNPosts(allKeywords),
    fetchStackOverflowPosts(allKeywords),
  ]);

  const allPosts = [...redditPosts, ...hnPosts, ...soPosts];

  // Deduplicate by URL
  const seen = new Set<string>();
  const unique = allPosts.filter((p) => {
    if (seen.has(p.source_url)) return false;
    seen.add(p.source_url);
    return true;
  });

  // Classify with AI
  return classifySignals(unique, product, enableDrafts);
}
