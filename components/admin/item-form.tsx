"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";
import type { Field } from "@/lib/admin/schemas";
import type { ActionResult } from "@/lib/admin/actions";
import { getPath, setPath } from "@/lib/admin/coerce";

type Obj = Record<string, unknown>;

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

/**
 * Generic editor: renders `fields` from a schema over a JSON `initial` object and calls `onSave`
 * with the JSON payload. Used for every content collection and every settings group.
 */
export function ItemForm({
  fields,
  initial,
  onSave,
  onDelete,
  showPublish = false,
  uploadsEnabled,
}: {
  fields: Field[];
  initial: Obj;
  onSave: (payload: string) => Promise<ActionResult>;
  onDelete?: () => Promise<ActionResult>;
  showPublish?: boolean;
  uploadsEnabled: boolean;
}) {
  const [data, setData] = useState<Obj>(() => clone(initial));
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const router = useRouter();

  const update = (path: string, value: unknown) =>
    setData((d) => {
      const next = clone(d);
      setPath(next, path, value);
      return next;
    });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    start(async () => {
      const res = await onSave(JSON.stringify(data));
      if (res.ok) {
        setMsg({ ok: true, text: "Saved." });
        if (res.id && window.location.pathname.endsWith("/new")) router.replace(window.location.pathname.replace(/\/new$/, `/${res.id}`));
        else router.refresh();
      } else setMsg({ ok: false, text: res.error });
    });
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {showPublish && (
        <div className="flex flex-wrap items-center gap-6 rounded-xl border border-line bg-navy-50 p-4">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" checked={data.published !== false} onChange={(e) => update("published", e.target.checked)} className="h-4 w-4 accent-navy-800" />
            Published (visible on the site)
          </label>
          <label className="flex items-center gap-2 text-sm">
            Sort order
            <input type="number" value={Number(data.sort ?? 0)} onChange={(e) => update("sort", Number(e.target.value))} className="input w-24 py-1.5" />
          </label>
        </div>
      )}
      {fields.map((f) => (
        <FieldInput key={f.key} field={f} value={getPath(data, f.key)} onChange={(v) => update(f.key, v)} uploadsEnabled={uploadsEnabled} />
      ))}
      {msg && (
        <p className={`rounded-lg p-3 text-sm ${msg.ok ? "border border-emerald-200 bg-emerald-50 text-emerald-800" : "border border-red-200 bg-red-50 text-red-800"}`} role="status">
          {msg.text}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className="inline-flex items-center gap-2 rounded-full bg-navy-800 px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-60">
          {pending && <Loader2 className="h-4 w-4 animate-spin" />} Save
        </button>
        {onDelete && (
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (!confirm("Delete this item? This cannot be undone.")) return;
              start(async () => {
                const res = await onDelete();
                if (res.ok) router.push(".");
                else setMsg({ ok: false, text: res.error });
              });
            }}
            className="inline-flex items-center gap-2 rounded-full border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        )}
      </div>
    </form>
  );
}

function FieldInput({ field, value, onChange, uploadsEnabled }: { field: Field; value: unknown; onChange: (v: unknown) => void; uploadsEnabled: boolean }) {
  const id = `f-${field.key.replace(/\./g, "-")}`;
  const label = (
    <label htmlFor={id} className="label">
      {field.label}
      {field.required && <span className="text-gold-700"> *</span>}
    </label>
  );
  const hint = field.hint && <p className="mt-1 text-xs text-muted">{field.hint}</p>;

  switch (field.type) {
    case "bilingual":
    case "bilingual-textarea": {
      const v = (value ?? {}) as { en?: string; es?: string };
      const Tag = field.type === "bilingual" ? "input" : "textarea";
      return (
        <div>
          {label}
          <div className="grid gap-3 md:grid-cols-2">
            {(["en", "es"] as const).map((lang) => (
              <div key={lang}>
                <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted">{lang === "en" ? "English" : "Español"}</span>
                <Tag
                  id={lang === "en" ? id : `${id}-es`}
                  className={`input ${field.type === "bilingual-textarea" ? "min-h-32" : ""}`}
                  value={v[lang] ?? ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange({ ...v, [lang]: e.target.value })}
                />
              </div>
            ))}
          </div>
          {hint}
        </div>
      );
    }
    case "textarea":
      return (
        <div>
          {label}
          <textarea id={id} className="input min-h-28" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
          {hint}
        </div>
      );
    case "bool":
      return (
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={value === true} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-navy-800" />
          {field.label}
        </label>
      );
    case "number":
      return (
        <div>
          {label}
          <div className="relative max-w-xs">
            {field.money && <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted">$</span>}
            <input
              id={id}
              type="number"
              step={field.money ? "0.01" : "1"}
              className={`input ${field.money ? "pl-7" : ""}`}
              value={field.money ? (Number(value ?? 0) / 100).toString() : String(value ?? 0)}
              onChange={(e) => onChange(field.money ? Math.round(Number(e.target.value) * 100) : Number(e.target.value))}
            />
          </div>
          {hint}
        </div>
      );
    case "select":
      return (
        <div>
          {label}
          <select id={id} className="input max-w-sm" value={String(value ?? field.options?.[0]?.value ?? "")} onChange={(e) => onChange(e.target.value)}>
            {field.options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {hint}
        </div>
      );
    case "datetime":
      return (
        <div>
          {label}
          <input id={id} type="datetime-local" className="input max-w-sm" value={toLocalInput(String(value ?? ""))} onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : "")} />
          {hint}
        </div>
      );
    case "date":
      return (
        <div>
          {label}
          <input id={id} type="date" className="input max-w-xs" value={String(value ?? "").slice(0, 10)} onChange={(e) => onChange(e.target.value)} />
          {hint}
        </div>
      );
    case "image":
      return (
        <div>
          {label}
          <ImageInput id={id} value={String(value ?? "")} onChange={(v) => onChange(v)} uploadsEnabled={uploadsEnabled} />
          {hint}
        </div>
      );
    case "list": {
      const rows = Array.isArray(value) ? (value as Obj[]) : [];
      return (
        <fieldset className="rounded-xl border border-line p-4">
          <legend className="px-1 text-sm font-semibold text-navy-800">{field.label}</legend>
          <div className="space-y-4">
            {rows.map((row, i) => (
              <div key={i} className="rounded-lg border border-line bg-cream/60 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted">#{i + 1}</span>
                  <div className="flex gap-2">
                    <button type="button" className="text-xs text-navy-800 underline disabled:opacity-40" disabled={i === 0} onClick={() => onChange(move(rows, i, -1))}>
                      Up
                    </button>
                    <button type="button" className="text-xs text-navy-800 underline disabled:opacity-40" disabled={i === rows.length - 1} onClick={() => onChange(move(rows, i, 1))}>
                      Down
                    </button>
                    <button type="button" className="text-xs text-red-700 underline" onClick={() => onChange(rows.filter((_, j) => j !== i))}>
                      Remove
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  {(field.fields ?? []).map((sub) => (
                    <FieldInput
                      key={sub.key}
                      field={{ ...sub, key: `${field.key}.${i}.${sub.key}` }}
                      value={getPath(row, sub.key)}
                      onChange={(v) => {
                        const next = clone(rows);
                        setPath(next[i], sub.key, v);
                        onChange(next);
                      }}
                      uploadsEnabled={uploadsEnabled}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => onChange([...rows, {}])} className="mt-3 inline-flex items-center gap-1 rounded-full border border-navy-800 px-4 py-1.5 text-sm font-semibold text-navy-800 hover:bg-navy-50">
            <Plus className="h-4 w-4" /> Add
          </button>
          {hint}
        </fieldset>
      );
    }
    default:
      return (
        <div>
          {label}
          <input id={id} type={field.type === "email" ? "email" : field.type === "url" ? "url" : "text"} className="input" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
          {hint}
        </div>
      );
  }
}

function move<T>(arr: T[], i: number, dir: -1 | 1): T[] {
  const next = [...arr];
  const j = i + dir;
  if (j < 0 || j >= arr.length) return next;
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

function toLocalInput(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function ImageInput({ id, value, onChange, uploadsEnabled }: { id: string; value: string; onChange: (v: string) => void; uploadsEnabled: boolean }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function upload(file: File) {
    setBusy(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = (await res.json()) as { url?: string; error?: string };
      if (json.url) onChange(json.url);
      else setErr(json.error ?? "Upload failed");
    } catch {
      setErr("Upload failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="h-20 w-28 shrink-0 rounded-lg border border-line object-cover" />
      ) : (
        <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-lg border border-dashed border-line text-xs text-muted">No image</div>
      )}
      <div className="flex-1 space-y-2">
        <input id={id} type="url" className="input" placeholder="https://…" value={value} onChange={(e) => onChange(e.target.value)} />
        <div className="flex items-center gap-3">
          <label className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${uploadsEnabled ? "border-navy-800 text-navy-800 hover:bg-navy-50" : "cursor-not-allowed border-line text-muted"}`}>
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />} Upload
            <input type="file" accept="image/*" className="hidden" disabled={!uploadsEnabled || busy} onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
          </label>
          {!uploadsEnabled && <span className="text-xs text-muted">Uploads need BLOB_READ_WRITE_TOKEN; paste a URL instead.</span>}
          {err && <span className="text-xs text-red-700">{err}</span>}
        </div>
      </div>
    </div>
  );
}
