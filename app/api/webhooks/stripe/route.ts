import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { getDb, schema } from "@/db";
import { getSettings } from "@/lib/content";
import { sendMail } from "@/lib/email";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { newId } from "@/lib/utils";

export const runtime = "nodejs";

/**
 * Stripe webhook. Verifies the signature, dedupes on event.id, and records donations.
 * Events handled:
 *  - checkout.session.completed (one-time payments, and the first payment of a subscription)
 *  - invoice.paid (every renewal of a recurring donation)
 * Stripe itself emails the payment receipt (receipt_email / customer emails setting).
 */
export async function POST(req: NextRequest) {
  if (!stripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  const payload = await req.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("stripe signature verification failed", err);
    return NextResponse.json({ error: "bad_signature" }, { status: 400 });
  }

  const db = getDb();
  if (db) {
    // Idempotency: ignore an event we have already processed.
    const inserted = await db.insert(schema.stripeEvents).values({ id: event.id, type: event.type }).onConflictDoNothing().returning({ id: schema.stripeEvents.id });
    if (inserted.length === 0) return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        if (session.payment_status !== "paid" && session.mode !== "subscription") break;
        await recordDonation({
          stripeSessionId: session.id,
          stripePaymentId: typeof session.payment_intent === "string" ? session.payment_intent : session.mode === "subscription" ? `sub-first-${session.id}` : session.id,
          stripeCustomerId: typeof session.customer === "string" ? session.customer : null,
          stripeSubscriptionId: typeof session.subscription === "string" ? session.subscription : null,
          amountCents: session.amount_total ?? 0,
          currency: session.currency ?? "usd",
          frequency: session.metadata?.frequency ?? (session.mode === "subscription" ? "monthly" : "once"),
          fund: session.metadata?.fund ?? "general",
          donorName: session.customer_details?.name ?? session.metadata?.donorName ?? null,
          donorEmail: session.customer_details?.email ?? session.customer_email ?? null,
          locale: session.metadata?.locale ?? "en",
          notify: true,
        });
        break;
      }
      case "invoice.paid": {
        const invoice = event.data.object;
        if (invoice.billing_reason === "subscription_create") break; // already recorded via checkout.session.completed
        const subId = extractSubscriptionId(invoice);
        const md = (invoice.lines?.data?.[0]?.metadata ?? {}) as Record<string, string>;
        await recordDonation({
          stripeSessionId: null,
          stripePaymentId: invoice.id ?? `invoice-${event.id}`,
          stripeCustomerId: typeof invoice.customer === "string" ? invoice.customer : null,
          stripeSubscriptionId: subId,
          amountCents: invoice.amount_paid ?? 0,
          currency: invoice.currency ?? "usd",
          frequency: md.frequency ?? "monthly",
          fund: md.fund ?? "general",
          donorName: invoice.customer_name ?? null,
          donorEmail: invoice.customer_email ?? null,
          locale: md.locale ?? "en",
          notify: false,
        });
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error(`stripe webhook handler failed for ${event.type}`, err);
    return NextResponse.json({ error: "handler_failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

function extractSubscriptionId(invoice: Stripe.Invoice): string | null {
  const parent = (invoice as unknown as { parent?: { subscription_details?: { subscription?: string | { id: string } } } }).parent;
  const sub = parent?.subscription_details?.subscription;
  if (typeof sub === "string") return sub;
  if (sub && typeof sub === "object") return sub.id;
  const legacy = (invoice as unknown as { subscription?: string | { id: string } }).subscription;
  if (typeof legacy === "string") return legacy;
  if (legacy && typeof legacy === "object") return legacy.id;
  return null;
}

type DonationInput = {
  stripeSessionId: string | null;
  stripePaymentId: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  amountCents: number;
  currency: string;
  frequency: string;
  fund: string;
  donorName: string | null;
  donorEmail: string | null;
  locale: string;
  notify: boolean;
};

async function recordDonation(input: DonationInput) {
  const db = getDb();
  if (db) {
    const { notify: _n, ...row } = input;
    await db.insert(schema.donations).values({ id: newId("don"), ...row, status: "paid" }).onConflictDoNothing({ target: schema.donations.stripePaymentId });
  }
  if (input.notify) {
    const settings = await getSettings();
    const to = settings.emails.sponsorship || settings.emails.general || process.env.EMAIL_TEAM || settings.email;
    const amount = (input.amountCents / 100).toLocaleString("en-US", { style: "currency", currency: input.currency.toUpperCase() });
    await sendMail({
      to,
      subject: `New ${input.frequency === "once" ? "one-time" : input.frequency} donation: ${amount} (${input.fund})`,
      text: `A donation was received through the website.\n\nAmount: ${amount}\nFrequency: ${input.frequency}\nFund: ${input.fund}\nDonor: ${input.donorName ?? "—"} <${input.donorEmail ?? "—"}>\n\nStripe sends the receipt to the donor automatically. Full details are in the Stripe dashboard and under Admin → Donations.`,
    });
  }
}
