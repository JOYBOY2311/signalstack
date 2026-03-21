import { NextResponse } from "next/server";
import { createPlan, PLAN_CONFIG } from "@/lib/razorpay";

/**
 * GET /api/razorpay/setup
 * One-time: creates 6 subscription plans (3 tiers × 2 currencies).
 * Returns plan IDs → add them as Vercel env vars.
 * Auth: x-setup-secret header must match RAZORPAY_KEY_SECRET.
 */
export async function GET(request: Request) {
  const secret = request.headers.get("x-setup-secret");
  if (secret !== process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currencies = ["USD", "INR"] as const;
  const envVars: Record<string, string> = {};

  for (const [tier, config] of Object.entries(PLAN_CONFIG)) {
    for (const currency of currencies) {
      const priceConfig = config[currency];
      const plan = await createPlan({
        name: `${config.name} (${currency})`,
        amount: priceConfig.amount,
        currency,
        description: config.description,
      });

      if (plan.error) {
        return NextResponse.json(
          { error: `Failed to create ${tier} ${currency} plan`, details: plan.error },
          { status: 500 }
        );
      }

      const envKey = `RAZORPAY_${tier.toUpperCase()}_${currency}_PLAN_ID`;
      envVars[envKey] = plan.id;
    }
  }

  return NextResponse.json({
    message: "All 6 plans created! Add these as Vercel env vars, then redeploy:",
    env_vars: envVars,
  });
}
