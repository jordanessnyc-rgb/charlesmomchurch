import Link from "next/link";
import { and, desc, eq, type SQL } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { formLabels, formTypes, isFormType, type FormType } from "@/lib/forms";

const statuses = ["new", "in_progress", "done", "archived"];

export default async function InboxPage({ searchParams }: { searchParams: Promise<{ type?: string; status?: string }> }) {
  const { type, status } = await searchParams;
  const db = getDb();
  if (!db) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-navy-800">Inbox</h1>
        <p className="mt-2 rounded-lg border border-gold-300 bg-gold-50 p-3 text-sm">Connect a database (DATABASE_URL) to store submissions. Until then, every form is emailed to the team only.</p>
      </div>
    );
  }
  const where: SQL[] = [];
  if (type && isFormType(type)) where.push(eq(schema.submissions.type, type));
  if (status && statuses.includes(status)) where.push(eq(schema.submissions.status, status));
  const rows = await db
    .select()
    .from(schema.submissions)
    .where(where.length ? and(...where) : undefined)
    .orderBy(desc(schema.submissions.createdAt))
    .limit(200);
  const chip = (href: string, label: string, active: boolean) => (
    <Link key={href} href={href} className={`rounded-full border px-3 py-1 text-xs font-medium ${active ? "border-navy-800 bg-navy-800 text-white" : "border-line bg-white text-navy-800 hover:bg-navy-50"}`}>
      {label}
    </Link>
  );
  const q = (t?: string, s?: string) => `/admin/inbox?${new URLSearchParams({ ...(t ? { type: t } : {}), ...(s ? { status: s } : {}) }).toString()}`;
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-navy-800">Inbox</h1>
        <p className="text-sm text-muted">Every form submission from the website. Confidential requests are marked.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {chip(q(undefined, status), "All types", !type)}
        {formTypes.map((t) => chip(q(t, status), formLabels[t].en, type === t))}
      </div>
      <div className="flex flex-wrap gap-2">
        {chip(q(type, undefined), "Any status", !status)}
        {statuses.map((s) => chip(q(type, s), s.replace("_", " "), status === s))}
      </div>
      <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-navy-50 text-left text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-2">Received</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Summary</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted">No submissions match.</td>
              </tr>
            )}
            {rows.map((r) => {
              const data = r.data as Record<string, unknown>;
              const summary = String(data.request ?? data.description ?? data.message ?? data.testimony ?? data.about ?? data.skills ?? "").slice(0, 90);
              return (
                <tr key={r.id} className="hover:bg-cream/60">
                  <td className="whitespace-nowrap px-4 py-2 text-muted">{r.createdAt.toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "medium", timeStyle: "short" })}</td>
                  <td className="px-4 py-2">
                    {formLabels[r.type as FormType]?.en ?? r.type}
                    {r.confidential && <span className="ml-1 rounded bg-red-100 px-1 text-[10px] font-semibold uppercase text-red-700">confidential</span>}
                    <span className="ml-1 text-xs text-muted">{r.locale.toUpperCase()}</span>
                  </td>
                  <td className="px-4 py-2">
                    <Link href={`/admin/inbox/${r.id}`} className="font-medium text-navy-800 underline">{String(data.name ?? "—")}</Link>
                  </td>
                  <td className="max-w-md truncate px-4 py-2 text-ink/80">{summary}</td>
                  <td className="px-4 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${r.status === "new" ? "bg-gold-100 text-gold-700" : r.status === "done" ? "bg-emerald-100 text-emerald-800" : "bg-navy-100 text-navy-800"}`}>{r.status.replace("_", " ")}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
