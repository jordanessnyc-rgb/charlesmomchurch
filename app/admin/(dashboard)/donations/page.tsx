import { desc } from "drizzle-orm";
import { getDb, schema } from "@/db";

export default async function DonationsPage() {
  const db = getDb();
  const rows = db ? await db.select().from(schema.donations).orderBy(desc(schema.donations.createdAt)).limit(300) : [];
  const money = (c: number, cur = "usd") => (c / 100).toLocaleString("en-US", { style: "currency", currency: cur.toUpperCase() });
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-navy-800">Donations</h1>
        <p className="text-sm text-muted">Recorded from Stripe webhooks. Refunds, payouts and full donor details live in the Stripe dashboard.</p>
      </div>
      {!db && <p className="rounded-lg border border-gold-300 bg-gold-50 p-3 text-sm">Connect a database to keep a donation log here.</p>}
      <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-navy-50 text-left text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Donor</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Frequency</th>
              <th className="px-4 py-2">Fund</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted">No donations recorded yet.</td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="whitespace-nowrap px-4 py-2 text-muted">{r.createdAt.toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "medium", timeStyle: "short" })}</td>
                <td className="px-4 py-2">
                  {r.donorName || "Anonymous"}
                  {r.donorEmail && <span className="block text-xs text-muted">{r.donorEmail}</span>}
                </td>
                <td className="px-4 py-2 font-medium">{money(r.amountCents, r.currency)}</td>
                <td className="px-4 py-2">{r.frequency}</td>
                <td className="px-4 py-2">{r.fund}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
