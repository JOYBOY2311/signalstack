import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

export const PRICE_IDS = {
  starter: process.env.STRIPE_STARTER_PRICE_ID!,
  growth: process.env.STRIPE_GROWTH_PRICE_ID!,
  team: process.env.STRIPE_TEAM_PRICE_ID!,
} as const;
