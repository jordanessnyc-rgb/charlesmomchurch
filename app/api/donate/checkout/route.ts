import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getSettings } from "@/lib/content";
import { isLocale } from "@/lib/i18n/config";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { siteUrl } from "@/lib/utils";

export const runtime = "nodejs";

const bodySchema = z.object({
  amount: z.coerce.number().min(1).max(100000), // dollars
  frequency: z.enum(["once", "weekly", "monthly"]),
  fund: z.string().max(40).default("general"),
  email: z.string().email().optional().or(z.literal("")),
  name: z.string().max(120).optional().or(z.literal("")),
  locale: z.string().optional(),
});

/** Creates a Stripe Checkout Session for a one-time or recurring donation. */
export async function POST(req: NextRequest) {
  if (!stripeConfigured()) return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  const parsed = bodySchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });
  const { amount, frequency, fund, email, name, locale: rawLocale } = parsed.data;
  const locale = isLocale(rawLocale) ? rawLocale : "en";

  const settings = await getSettings();
  const fundDef = settings.funds.find((f) => f.id === fund) ?? settings.funds[0];
  const fundName = fundDef ? fundDef.name[locale] : "General fund";
  const amountCents = Math.round(amount * 100);
  const base = siteUrl();

  const stripe = getStripe();
  try {
    const session = await stripe.checkout.sessions.create({
      mode: frequency === "once" ? "payment" : "subscription",
      submit_type: frequency === "once" ? "donate" : undefined,
      locale: locale === "es" ? "es" : "en",
      customer_email: email || undefined,
      customer_creation: frequency === "once" ? "always" : undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: amountCents,
            product_data: {
              name: locale === "es" ? `Donación · ${fundName}` : `Donation · ${fundName}`,
              description: "Centro de Adoración e Intercesión Casa de Milagros",
            },
            recurring: frequency === "once" ? undefined : { interval: frequency === "weekly" ? "week" : "month" },
          },
        },
      ],
      metadata: { fund: fundDef?.id ?? "general", frequency, locale, donorName: name || "" },
      payment_intent_data:
        frequency === "once"
          ? { description: `Donation · ${fundName}`, receipt_email: email || undefined, metadata: { fund: fundDef?.id ?? "general", frequency, locale } }
          : undefined,
      subscription_data: frequency !== "once" ? { description: `Recurring donation · ${fundName}`, metadata: { fund: fundDef?.id ?? "general", frequency, locale } } : undefined,
      success_url: `${base}/${locale}/give/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/${locale}/give?cancelled=1`,
    });
    return NextResponse.json({ ok: true, url: session.url });
  } catch (err) {
    console.error("stripe checkout failed", err);
    return NextResponse.json({ ok: false, error: "stripe_error" }, { status: 502 });
  }
}
