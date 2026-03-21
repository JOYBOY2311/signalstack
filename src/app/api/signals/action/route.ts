import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

/**
 * POST /api/signals/action
 * Mark a signal as actioned or read.
 *
 * Body: { signalId: string, action: "actioned" | "read" }
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
    const { signalId, action } = body;

    if (!signalId || !["actioned", "read"].includes(action)) {
      return NextResponse.json(
        { error: "signalId and action (actioned|read) required" },
        { status: 400 }
      );
    }

    // Verify the signal belongs to one of the user's products
    const { data: signal } = await supabase
      .from("signals")
      .select("id, product_id, products!inner(user_id)")
      .eq("id", signalId)
      .single();

    if (!signal) {
      return NextResponse.json(
        { error: "Signal not found" },
        { status: 404 }
      );
    }

    const updateData =
      action === "actioned"
        ? { is_actioned: true, is_read: true }
        : { is_read: true };

    const { error: updateError } = await supabase
      .from("signals")
      .update(updateData)
      .eq("id", signalId);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update signal" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
