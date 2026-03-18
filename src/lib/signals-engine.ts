/**
 * SignalStack Signal Engine
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
          headers: { "User-Agent": "SignalStack/1.0" },
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
  {
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
  P