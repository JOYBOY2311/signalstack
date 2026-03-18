export type SignalSource =
  | "reddit"
  | "hackernews"
  | "twitter"
  | "stackoverflow"
  | "github"
  | "indiehackers";

export type IntentLevel = "high" | "medium" | "low";

export type SubscriptionTier = "free" | "starter" | "growth" | "team";

export interface Signal {
  id: string;
  product_id: string;
  source: SignalSource;
  source_url: string;
  title: string;
  content: string;
  author: string;
  intent_level: IntentLevel;
  intent_score: number; // 0-100
  ai_summary: string;
  ai_draft_response: string | null;
  is_read: boolean;
  is_actioned: boolean;
  created_at: string;
  detected_at: string;
}

export interface Product {
  id: string;
  user_id: string;
  name: string;
  description: string;
  keywords: string[];
  competitor_names: string[];
  url: string | null;
  signals_today: number;
  total_signals: number;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  tier: SubscriptionTier;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  products_limit: number;
  signals_daily_limit: number;
  ai_drafts_enabled: boolean;
  created_at: string;
}

export interface DashboardStats {
  total_signals_today: number;
  high_intent_count: number;
  signals_actioned: number;
  conversion_rate: number;
  top_sources: { source: SignalSource; count: number }[];
}

export const TRERE_LIMITS: Record<SubscriptionTier, {
  products: number;
  signals_per_day: number;
  ai_drafts: boolean;
  price_monthly: number;
}> = {
  free: { products: 1, signals_per_day: 10, ai_drafts: false, price_monthly: 0 },
  starter: { products: 3, signals_per_day: 50, ai_drafts: false, price_monthly: 10 },
  growth: { products: 10, signals_per_day: 999999, ai_drafts: true, price_monthly: 29 },
  team: { products: 999999, signals_per_day: 999999, ai_drafts: true, price_monthly: 79 },
};