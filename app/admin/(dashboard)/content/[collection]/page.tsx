import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollection, isCollectionName } from "@/lib/content";
import { hasDatabase } from "@/db";
import { collectionSchemas } from "@/lib/admin/schemas";

export default async function CollectionPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  if (!isCollectionName(collection)) notFound();
  const def = collectionSchemas[collection];
  const items = await getCollection(collection, { includeUnpublished: true });
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-navy-800">{def.label}</h1>
          <p className="text-sm text-muted">{def.description}</p>
        </div>
        <Link href={`/admin/content/${collection}/new`} className="rounded-full bg-navy-800 px-5 py-2 text-sm font-semibold text-white hover:bg-navy-700">
          + New {def.singular.toLowerCase()}
        </Link>
      </div>
      {!hasDatabase() && <p className="rounded-lg border border-gold-300 bg-gold-50 p-3 text-sm">Showing built-in default content. Connect a database (DATABASE_URL) to edit it.</p>}
      <ul className="divide-y divide-line rounded-2xl border border-line bg-white shadow-card">
        {items.length === 0 && <li className="px-5 py-6 text-center text-sm text-muted">Nothing here yet.</li>}
        {items.map((it) => {
          const raw = (it as unknown as Record<string, unknown>)[def.titleKey];
          const title = typeof raw === "string" ? raw : ((raw as { en?: string } | undefined)?.en ?? it.id);
          const sub = "startsAt" in it ? new Date(String(it.startsAt)).toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "medium", timeStyle: "short" }) : "date" in it ? String(it.date) : "";
          return (
            <li key={it.id} className="flex items-center justify-between gap-4 px-5 py-3">
              <div className="min-w-0">
                <Link href={`/admin/content/${collection}/${it.id}`} className="font-medium text-navy-800 underline">{title}</Link>
                {sub && <span className="ml-2 text-xs text-muted">{sub}</span>}
              </div>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${it.published ? "bg-emerald-100 text-emerald-800" : "bg-navy-100 text-navy-800"}`}>{it.published ? "Published" : "Draft"}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
