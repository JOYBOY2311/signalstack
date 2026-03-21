import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import {
  createSubscription,
  RAZORPAY_KEY_ID_PUBLIC,
  TRIAL_DAYS,
} from "@/lib/razorpay";
import type { SubscriptionTier } from "@/types";

/**
 * POST /api/razorpay/checkout
 * Body: { tier: "starter" | "growth" | "team", currency: "USD" | "INR" }
 *
 * Creates a Razorpay subscription with autopay.
 * Adds 7-day trial if user has never trialed before (one per account).
 */

// Plan IDs per tier per currency (set via env)
const PLAN_IDS: Record<string, Record<string, string | undefined>> = {
  starter: {
    USD: process.env.RAZORPAY_STARTER_USD_PLAN_ID,
    INR: process.env.RAZORPAY_STARTER_INR_PLAN_ID,
  },
  growth: {
    USD: process.env.RAZORPAY_GROWTH_USD_PLAN_ID,
    INR: process.env.RAZORPAY_GROWTH_INR_PLAN_ID,
  },
  team: {
    USD: process.env.RAZORPAY_TEAM_USD_PLAN_ID,
    INR: process.env.RAZORPAY_TEAM_INR_PLAN_ID,
  },
};

export async function POST(request: Request) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const tier = body.tier as SubscriptionTier;
  const currency = (body.currency === "INR" ? "INR" : "USD") as string;

  if (!tier || !["starter", "growth", "team"].includes(tier)) {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
  }

  const planId = PLAN_IDS[tier]?.[currency];
  if (!planId) {
    return NextResponse.json(
      { error: `Plan not configured: ${tier}/${currency}. Run /api/razorpay/setup first.` },
      { status: 500 }
    );
  }

  // Check if user already used a free trial (one per account)
  const { data: profile } = await supabase
    .from("profiles")
    .select("has_used_trial, razorpay_subscription_id")
    .eq("id", user.id)
    .single();

  // If user already has an active subscription, block
  if (profile?.razorpay_subscription_id) {
    return NextResponse.json(
      { error: "You already have an active subscription. Cancel it first to switch plans." },
      { status: 400 }
    );
  }

  const trialDays = profile?.has_used_trial ? 0 : TRIAL_DAYS;

  // Create Razorpay subscription with autopay
  const subscription = await createSubscription({
    planId,
    offerTrialDays: trialDays,
    notes: {
      supabase_user_id: user.id,
      tier,
      currency,
      email: user.email || "",
    },
  });

  if (subscription.error) {
    return NextResponse.json(
      { error: "Failed to create subscription", details: subscription.error },
      { status: 500 }
    );
  }

  // Mark trial as used (even if subscription not yet activated — prevents abuse)
  if (!profile?.has_used_trial) {
    await supabase
      .from("profiles")
      .update({ has_used_trial: true })
      .eq("id", user.id);
  }

  return NextResponse.json({
    subscription_id: subscription.id,
    razorpay_key: RAZORPAY_KEY_ID_PUBLIC,
    currency,
    trial_days: trialDays,
    name: "Pulsadar",
    description: `Pulsadar ${tier.charAt(0).toUpperCase() + tier.slice(1)} — ${trialDays > 0 ? `${trialDays}-day free trial, then autopay` : "autopay"}`,
    prefill: {
      email: user.email,
      name: user.user_metadata?.full_name || "",
    },
  });
}
