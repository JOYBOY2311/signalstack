/**
 * Pulsadar — Razorpay billing integration
 * Dual-currency: USD (global) + INR (India)
 * Autopay-based subscriptions with one-trial-per-account enforcement
 */

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID!;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  if (typeof window === "undefined" && process.env.NODE_ENV === "production") {
    console.warn("Razorpay keys not configured");
  }
}

const AUTH_HEADER =
  "Basic " + Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");

async function rzpFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`https://api.razorpay.com/v1${path}`, {
    ...options,
    headers: {
      Authorization: AUTH_HEADER,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  return res.json();
}

/* ─── Plan CRUD ─── */

export async function createPlan(plan: {
  name: string;
  amount: number;
  currency: string;
  description: string;
}) {
  return rzpFetch("/plans", {
    method: "POST",
    body: JSON.stringify({
      period: "monthly",
      interval: 1,
      item: {
        name: plan.name,
        amount: plan.amount,
        currency: plan.currency,
        description: plan.description,
      },
    }),
  });
}

/* ─── Subscription CRUD ─── */

export async function createSubscription(opts: {
  planId: string;
  totalCount?: number;
  notes?: Record<string, string>;
  offerTrialDays?: number;
}) {
  const body: Record<string, unknown> = {
    plan_id: opts.planId,
    total_count: opts.totalCount || 120,
    customer_notify: 1,
    notes: opts.notes || {},
  };

  // Add 7-day trial if eligible
  if (opts.offerTrialDays && opts.offerTrialDays > 0) {
    body.start_at = Math.floor(Date.now() / 1000) + opts.offerTrialDays * 86400;
  }

  return rzpFetch("/subscriptions", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function fetchSubscription(subscriptionId: string) {
  return rzpFetch(`/subscriptions/${subscriptionId}`);
}

export async function cancelSubscription(subscriptionId: string) {
  return rzpFetch(`/subscriptions/${subscriptionId}/cancel`, {
    method: "POST",
    body: JSON.stringify({ cancel_at_cycle_end: 1 }),
  });
}

/* ─── Webhook verification ─── */

export function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  const crypto = require("crypto");
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return expected === signature;
}

/* ─── Public key for client-side checkout ─── */

export const RAZORPAY_KEY_ID_PUBLIC = RAZORPAY_KEY_ID;

/* ─── Dual-currency plan config ─── */

export type PlanCurrency = "USD" | "INR";

export const PLAN_CONFIG = {
  starter: {
    name: "Starter",
    USD: { amount: 1000, display: "$10" },
    INR: { amount: 79900, display: "₹799" },
    description: "3 products, 50 signals/day, all 6 platforms, AI intent scoring, real-time alerts",
  },
  growth: {
    name: "Growth",
    USD: { amount: 2900, display: "$29" },
    INR: { amount: 239900, display: "₹2,399" },
    description: "10 products, unlimited signals, AI response drafts, competitor tracking, priority support",
  },
  team: {
    name: "Team",
    USD: { amount: 7900, display: "$79" },
    INR: { amount: 649900, display: "₹6,499" },
    description: "Unlimited everything, Slack & Discord, REST API access, team collaboration, custom sources",
  },
} as const;

export const TRIAL_DAYS = 7;
