import Link from "next/link";
import { count, desc, eq, sql } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { emailConfigured } from "@/lib/email";
import { stripeConfigured } from "@/lib/stripe";
import { turnstileEnabled } from "@/lib/spam";
import { formLabels, type FormType } from "@/lib/forms";

export default async function AdminHome() {
  const db = getDb();
  let newByType: { type: string; n: number }[] = [];
  let recentDonations: { amountCents: number; donorName: string | null; createdAt: Date; frequency: string }[] = [];
  let totalCents = 0;
  if (db) {
    newByType = (await db.select({ type: schema.submissions.type, n: count() }).from(schema.submissions).where(eq(schema.submissions.status, "new")).groupBy(schema.submissions.type)).map((r) => ({ type: r.type, n: Number(r.n) }));
    recentDonations = await db.select({ amountCents: schema.donations.amountCents, donorName: schema.donations.donorName, createdAt: schema.donations.createdAt, frequency: schema.donations.frequency }).from(schema.donations).orderBy(desc(schema.donations.createdAt)).limit(5);
    const [sum] = await db.select({ total: sql<number>`coalesce(sum(${schema.donations.amountCents}), 0)` }).from(schema.donations).where(sql`${schema.donations.createdAt} > now() - interval '30 days'`);
    totalCents = Number(sum?.total ?? 0);
  }
  const checks = [
    { label: "Database", ok: !!db, note: db ? "Connected" : "Set DATABASE_URL and run migrations. Content falls back to defaults; submissions are only emailed." },
    { label: "Email (SMTP)", ok: emailConfigured(), note: emailConfigured() ? "Configured" : "Set SMTP_* and EMAIL_FROM to send notifications and confirmations." },
    { label: "Donations (Stripe)", ok: stripeConfigured(), note: stripeConfigured() ? "Configured" : "Set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET." },
    { label: "Spam protection (Turnstile)", ok: turnstileEnabled(), note: turnstileEnabled() ? "Enabled" : "Optional. Honeypot + timing checks are always on." },
    { label: "Photo uploads", ok: !!process.env.BLOB_READ_WRITE_TOKEN, note: process.env.BLOB_READ_WRITE_TOKEN ? "Vercel Blob connected" : "Optional. Paste image URLs instead." },
  ];
  const money = (c: number) => (c / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-navy-800">Overview</h1>
        <p className="text-sm text-muted">What needs your attention, and the state of the site&apos;s integrations.</p>
      </div>
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
          <h2 className="font-semibold text-navy-800">New submissions</h2>
          {!db ? (
            <p className="mt-2 text-sm text-muted">Connect a database to store and manage submissions here.</p>
          ) : newByType.length === 0 ? (
            <p className="mt-2 text-sm text-muted">Inbox zero. Nothing new.</p>
          ) : (
            <ul className="mt-3 space-y-1 text-sm">
              {newByType.map((r) => (
                <li key={r.type} className="flex justify-between">
                  <Link href={`/admin/inbox?type=${r.type}&status=new`} className="text-navy-800 underline">
                    {formLabels[r.type as FormType]?.en ?? r.type}
                  </Link>
                  <span className="rounded-full bg-gold-100 px-2 text-xs font-semibold text-gold-700">{r.n}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
          <h2 className="font-semibold text-navy-800">Donations · last 30 days</h2>
          <p className="mt-1 text-3xl font-semibold text-navy-800">{money(totalCents)}</p>
          <ul className="mt-3 space-y-1 text-sm text-ink/80">
            {recentDonations.map((d, i) => (
              <li key={i} className="flex justify-between">
                <span>
                  {d.donorName || "Anonymous"} · {d.frequency}
                </span>
                <span>{money(d.amountCents)}</span>
              </li>
            ))}
          </ul>
          <Link href="/admin/donations" className="mt-3 inline-block text-sm text-navy-800 underline">All donations</Link>
        </div>
      </section>
      <section className="rounded-2xl border border-line bg-white p-5 shadow-card">
        <h2 className="font-semibold text-navy-800">Integrations</h2>
        <ul className="mt-3 divide-y divide-line text-sm">
          {checks.map((c) => (
            <li key={c.label} className="flex items-start gap-3 py-2">
              <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${c.ok ? "bg-emerald-500" : "bg-gold-500"}`} aria-hidden="true" />
              <div>
                <p className="font-medium">{c.label}</p>
                <p className="text-muted">{c.note}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
