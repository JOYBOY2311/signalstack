import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { cancelSubscription, fetchSubscription } from "@/lib/razorpay";

/**
 * POST /api/razorpay/cancel
 * Body: { confirm: true }
 *
 * Cancels the user's active subscription at end of billing cycle.
 * Requires explicit confirmation to prevent accidental cancellation.
 */
export async function POST(request: Request) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Require explicit double-confirmation
  if (body.confirm !== true) {
    return NextResponse.json(
      { error: "Please confirm cancellation by sending { confirm: true }" },
      { status: 400 }
    );
  }

  // Get user's subscription ID
  const { data: profile } = await supabase
    .from("profiles")
    .select("razorpay_subscription_id")
    .eq("id", user.id)
    .single();

  if (!profile?.razorpay_subscription_id) {
    return NextResponse.json(
      { error: "No active subscription to cancel" },
      { status: 400 }
    );
  }

  // Verify subscription exists in Razorpay
  const sub = await fetchSubscription(profile.razorpay_subscription_id);
  if (sub.error) {
    return NextResponse.json(
      { error: "Could not fetch subscription details" },
      { status: 500 }
    );
  }

  // Cancel at end of billing cycle (not immediately)
  const result = await cancelSubscription(profile.razorpay_subscription_id);
  if (result.error) {
    return NextResponse.json(
      { error: "Failed to cancel subscription", details: result.error },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Subscription will be cancelled at the end of the current billing cycle. You'll retain access until then.",
    ends_at: sub.current_end ? new Date(sub.current_end * 1000).toISOString() : null,
  });
}
