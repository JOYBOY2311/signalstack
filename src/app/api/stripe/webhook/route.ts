import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createSupabaseAdmin } from "@/lib/supabase-server";
import { TIER_LIMITS, type SubscriptionTier } from "@/types";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  const supabase = createSupabaseAdmin();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.supabase_user_id;
      const tier = (session.metadata?.tier || "starter") as SubscriptionTier;
      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id;

      if (userId) {
        const limits = TIER_LIMITS[tier];
        await supabase
          .from("profiles")
          .update({
            tier,
            stripe_subscription_id: subscriptionId,
            products_limit: limits.products,
            signals_daily_limit: limits.signals_per_day,
            ai_drafts_enabled: limits.ai_drafts,
          })
          .eq("id", userId);
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const status = subscription.status;

      if (status === "active" || status === "trialing") {
        // Subscription is active, no changes needed
      } else if (status === "past_due" || status === "unpaid") {
        // Could send warning email here
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.id;

      // Downgrade to free
      const freeLimits = TIER_LIMITS.free;
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("stripe_customer_id", customerId)
        .single();

      if (profile) {
        await supabase
          .from("profiles")
          .update({
            tier: "free",
            stripe_subscription_id: null,
            products_limit: freeLimits.products,
            signals_daily_limit: freeLimits.signals_per_day,
            ai_drafts_enabled: freeLimits.ai_drafts,
          })
          .eq("id", profile.id);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
