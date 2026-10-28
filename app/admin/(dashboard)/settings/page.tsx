import { getSettings } from "@/lib/content";
import { hasDatabase } from "@/db";
import { saveSettingsAction } from "@/lib/admin/actions";
import { settingsGroups } from "@/lib/admin/schemas";
import { getPath } from "@/lib/admin/coerce";
import { ItemForm } from "@/components/admin/item-form";

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ group?: string }> }) {
  const { group: groupKey } = await searchParams;
  const settings = await getSettings();
  const group = settingsGroups.find((g) => g.key === groupKey) ?? settingsGroups[0];
  const initial: Record<string, unknown> = {};
  for (const f of group.fields) {
    const v = getPath(settings as unknown as Record<string, unknown>, f.key);
    // Build a nested object so dotted keys (address.line1) round-trip.
    const keys = f.key.split(".");
    let cur = initial;
    for (let i = 0; i < keys.length - 1; i++) cur = (cur[keys[i]] ??= {}) as Record<string, unknown>;
    cur[keys[keys.length - 1]] = v;
  }
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-navy-800">Settings</h1>
        <p className="text-sm text-muted">Contact details, schedules, texts, and galleries. Every text has an English and a Spanish version.</p>
      </div>
      {!hasDatabase() && <p className="rounded-lg border border-gold-300 bg-gold-50 p-3 text-sm">Settings are read-only until a database is connected (DATABASE_URL).</p>}
      <div className="flex flex-wrap gap-2">
        {settingsGroups.map((g) => (
          <a key={g.key} href={`/admin/settings?group=${g.key}`} className={`rounded-full border px-3 py-1 text-xs font-medium ${g.key === group.key ? "border-navy-800 bg-navy-800 text-white" : "border-line bg-white text-navy-800 hover:bg-navy-50"}`}>
            {g.label}
          </a>
        ))}
      </div>
      <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
        <h2 className="text-lg font-semibold text-navy-800">{group.label}</h2>
        <p className="mb-6 text-sm text-muted">{group.description}</p>
        <ItemForm key={group.key} fields={group.fields} initial={initial} onSave={saveSettingsAction.bind(null, group.key)} uploadsEnabled={!!process.env.BLOB_READ_WRITE_TOKEN} />
      </div>
    </div>
  );
}
