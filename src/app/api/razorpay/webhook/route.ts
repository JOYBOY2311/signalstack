import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { createClient } from "@supabase/supabase-js";
import { TIER_LIMITS, type SubscriptionTier } from "@/types";

function createSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * POST /api/razorpay/webhook
 * Handles subscription lifecycle events from Razorpay.
 */
export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("x-razorpay-signature") || "";

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (webhookSecret && !verifyWebhookSignature(body, signature, webhookSecret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);
  const supabase = createSupabaseAdmin();

  switch (event.event) {
    // Subscription activated (after trial or immediate)
    case "subscription.activated":
    // Recurring payment succeeded
    case "subscription.charged": {
      const sub = event.payload.subscription?.entity;
      if (!sub) break;

      const userId = sub.notes?.supabase_user_id;
      const tier = (sub.notes?.tier || "starter") as SubscriptionTier;

      if (userId && ["starter", "growth", "team"].includes(tier)) {
        const limits = TIER_LIMITS[tier];
        await supabase
          .from("profiles")
          .update({
            tier,
            razorpay_subscription_id: sub.id,
            products_limit: limits.products,
            signals_daily_limit: limits.signals_per_day,
            ai_drafts_enabled: limits.ai_drafts,
          })
          .eq("id", userId);
      }
      break;
    }

    // User is in trial — grant access immediately
    case "subscription.authenticated": {
      const sub = event.payload.subscription?.entity;
      if (!sub) break;

      const userId = sub.notes?.supabase_user_id;
      const tier = (sub.notes?.tier || "starter") as SubscriptionTier;

      if (userId && ["starter", "growth", "team"].includes(tier)) {
        const limits = TIER_LIMITS[tier];
        await supabase
          .from("profiles")
          .update({
            tier,
            razorpay_subscription_id: sub.id,
            products_limit: limits.products,
            signals_daily_limit: limits.signals_per_day,
            ai_drafts_enabled: limits.ai_drafts,
            has_used_trial: true,
          })
          .eq("id", userId);
      }
      break;
    }

    // Subscription cancelled or payment failed permanently
    case "subscription.halted":
    case "subscription.cancelled":
    case "subscription.completed": {
      const sub = event.payload.subscription?.entity;
      if (!sub) break;

      const userId = sub.notes?.supabase_user_id;
      if (userId) {
        const freeLimits = TIER_LIMITS.free;
        await supabase
          .from("profiles")
          .update({
            tier: "free",
            razorpay_subscription_id: null,
            products_limit: freeLimits.products,
            signals_daily_limit: freeLimits.signals_per_day,
            ai_drafts_enabled: freeLimits.ai_drafts,
          })
          .eq("id", userId);
      }
      break;
    }

    // Payment pending — could send reminder
    case "subscription.pending":
      break;
  }

  return NextResponse.json({ received: true });
}
