import { NextResponse } from "next/server";
import { createSupabaseServer, createSupabaseAdmin } from "@/lib/supabase-server";
import { scanForSignals } from "@/lib/signals-engine";
import { TIER_LIMITS, type SubscriptionTier } from "@/types";

/**
 * POST /api/signals/scan-manual
 * User-triggered scan for a specific product.
 * Requires authentication. Respects tier limits.
 *
 * Body: { productId: string }
 */
export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 }
      );
    }

    // Fetch product (RLS ensures user owns it)
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .eq("user_id", user.id)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Fetch profile for tier limits
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const tier = (profile?.tier || "free") as SubscriptionTier;
    const limits = TIER_LIMITS[tier];
    const dailyLimit = limits.signals_per_day;

    // Check daily limit
    if (product.signals_today >= dailyLimit) {
      return NextResponse.json(
        {
          error: "Daily signal limit reached",
          limit: dailyLimit,
          used: product.signals_today,
        },
        { status: 429 }
      );
    }

    const remainingSlots = dailyLimit - product.signals_today;
    const enableDrafts = limits.ai_drafts;

    // Run the scan
    const signals = await scanForSignals(product, enableDrafts);

    // Take only up to remaining daily limit
    const toInsert = signals.slice(0, remainingSlots).map((s) => ({
      product_id: product.id,
      source: s.source,
      source_url: s.source_url,
      title: s.title,
      content: s.content,
      author: s.author,
      intent_level: s.intent_level,
      intent_score: s.intent_score,
      ai_summary: s.ai_summary,
      ai_draft_response: s.ai_draft_response,
    }));

    let insertedCount = 0;

    if (toInsert.length > 0) {
      // Use admin client for upsert (bypasses RLS for insert)
      const admin = createSupabaseAdmin();
      const { data: inserted } = await admin
        .from("signals")
        .upsert(toInsert, {
          onConflict: "source_url",
          ignoreDuplicates: true,
        })
        .select("id");

      insertedCount = inserted?.length || 0;

      // Update product signal counts
      if (insertedCount > 0) {
        await admin
          .from("products")
          .update({
            signals_today: product.signals_today + insertedCount,
            total_signals: product.total_signals + insertedCount,
          })
          .eq("id", product.id);
      }
    }

    return NextResponse.json({
      success: true,
      signals_found: signals.length,
      signals_saved: insertedCount,
      signals_today: product.signals_today + insertedCount,
      daily_limit: dailyLimit,
    });
  } catch (err) {
    console.error("Manual scan error:", err);
    return NextResponse.json(
      { error: "Scan failed. Please try again." },
      { status: 500 }
    );
  }
}
