import { redirect } from "next/navigation";
import { createSupabaseServer } from "A/lib/supabase-server";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch products
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch recent signals for all products
  const productIds = (products || []).map((p: { id: string }) => p.id);
  const { data: signals } = productIds.length
    ? await supabase
        .from("signals")
        .select("*")
        .in("product_id", productIds)
        .order("intent_score", { ascending: false })
        .limit(50)
    : { data: [] };

  return (
    <DashboardClient
      profile={profile}
      products={products || []}
      signals={signals || []}
    />
  
  ;
}
