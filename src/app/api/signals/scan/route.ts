import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase-server";
import { scanForSignals } from "@/lib/signals-engine";

/**
 * POST /api/signals/scan
 * Triggered by cron job or manual scan.
 * Scans all active products for new signals.
 *
 * Requires: Authorization header with service role key
 */
export async function POST(request: Request) {
  // Verify authorization (cron secret or service role)
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseAdmin();

  // Fetch all active products with their user profiles
  const { data: products, error: fetchError } = await supabase
    .from("products")
    .select("*, profiles!inner(tier, ai_drafts_enabled, signals_daily_limit)")
    .eq("is_active", true);

  if (fetchError || !products) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }

  let totalSignals = 0;
  let totalProducts = 0;

  for (const product of products) {
    const profile = (product as Record<string, unknown>).profiles as {
      tier: string;
      ai_drafts_enabled: boolean;
      signals_daily_limit: number;
    };

    // Check daily limit
    if (product.signals_today >= profile.signals_daily_limit) continue;

    const remainingSlots = profile.signals_daily_limit - product.signals_today;

    try {
      const signals = await scanForSignals(
        product,
        profile.ai_drafts_enabled
      );

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

      if (toInsert.length > 0) {
        // Upsert (skip duplicates by source_url)
        const { data: inserted } = await supabase
          .from("signals")
          .upsert(toInsert, { onConflict: "source_url", ignoreDuplicates: true })
          .select("id");

        const insertedCount = inserted?.length || 0;

        // Update product signal counts
        await supabase
          .from("products")
          .update({
            signals_today: product.signals_today + insertedCount,
            total_signals: product.total_signals + insertedCount,
          })
          .eq("id", product.id);

        totalSignals += insertedCount;
      }

      totalProducts++;
    } catch (err) {
      console.error(`Error scanning product ${product.id}:`, err);
    }
  }

  return NextResponse.json({
    success: true,
    products_scanned: totalProducts,
    signals_found: totalSignals,
    timestamp: new Date().toISOString(),
  });
}
