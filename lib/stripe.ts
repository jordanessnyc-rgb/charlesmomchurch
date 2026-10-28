import "server-only";
import Stripe from "stripe";

export function stripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}

let client: Stripe | null = null;
export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY is not set");
  if (!client) client = new Stripe(process.env.STRIPE_SECRET_KEY);
  return client;
}

export const donationFrequencies = ["once", "weekly", "monthly"] as const;
export type DonationFrequency = (typeof donationFrequencies)[number];
