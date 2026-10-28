import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { formLabels, type FormType } from "@/lib/forms";
import { SubmissionActions } from "@/components/admin/submission-actions";

export default async function SubmissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  if (!db) notFound();
  const row = await db.query.submissions.findFirst({ where: eq(schema.submissions.id, id) });
  if (!row) notFound();
  const data = row.data as Record<string, unknown>;
  const label = formLabels[row.type as FormType]?.en ?? row.type;
  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/admin/inbox" className="text-sm text-navy-800 underline">← Inbox</Link>
      <div>
        <h1 className="text-2xl font-semibold text-navy-800">
          {label}: {String(data.name ?? "")}
        </h1>
        <p className="text-sm text-muted">
          Received {row.createdAt.toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "long", timeStyle: "short" })} · language {row.locale.toUpperCase()}
          {row.confidential && <span className="ml-2 rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-red-700">confidential</span>}
        </p>
      </div>
      <dl className="divide-y divide-line rounded-2xl border border-line bg-white shadow-card">
        {Object.entries(data).map(([k, v]) => (
          <div key={k} className="grid gap-1 px-5 py-3 sm:grid-cols-[180px_1fr]">
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{k}</dt>
            <dd className="whitespace-pre-wrap text-sm text-ink">
              {k === "email" && typeof v === "string" && v ? (
                <a href={`mailto:${v}`} className="text-navy-800 underline">{v}</a>
              ) : k === "phone" && typeof v === "string" && v ? (
                <a href={`tel:${v}`} className="text-navy-800 underline">{v}</a>
              ) : Array.isArray(v) ? (
                v.join(", ")
              ) : typeof v === "boolean" ? (
                v ? "Yes" : "No"
              ) : (
                String(v ?? "")
              )}
            </dd>
          </div>
        ))}
      </dl>
      <SubmissionActions id={row.id} type={row.type} status={row.status} notes={row.notes} allowShare={data.allowShare === true} />
    </div>
  );
}
