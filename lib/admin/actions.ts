"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { checkPassword, clearAdminCookie, isAdmin, setAdminCookie } from "@/lib/auth";
import { deleteItem, getItem, getSettings, saveSettings, upsertItem, type CollectionName, isCollectionName } from "@/lib/content";
import type { Collections } from "@/lib/content/types";
import { collectionSchemas, settingsGroups } from "./schemas";
import { coerceObject } from "./coerce";
import { newId, slugify } from "@/lib/utils";

export type ActionResult = { ok: true; id?: string } | { ok: false; error: string };

export async function loginAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");
  if (!checkPassword(password)) {
    await new Promise((r) => setTimeout(r, 600));
    return { ok: false, error: "Incorrect password." };
  }
  await setAdminCookie();
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction(): Promise<void> {
  await clearAdminCookie();
  redirect("/admin/login");
}

async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Unauthorized");
}

function revalidateSite() {
  revalidatePath("/", "layout");
}

export async function saveItemAction(collection: string, id: string | null, payload: string): Promise<ActionResult> {
  await requireAdmin();
  if (!isCollectionName(collection)) return { ok: false, error: "Unknown collection" };
  const def = collectionSchemas[collection];
  let input: Record<string, unknown>;
  try {
    input = JSON.parse(payload) as Record<string, unknown>;
  } catch {
    return { ok: false, error: "Invalid payload" };
  }
  try {
    const existing = id ? await getItem(collection, id) : null;
    const data = coerceObject(def.fields, input, (existing ?? {}) as Record<string, unknown>);
    if (def.hasSlug) {
      const title = (data[def.titleKey] as { en?: string } | undefined)?.en ?? "";
      if (!data.slug) data.slug = slugify(title) || newId("item");
    }
    const item = {
      ...data,
      id: id ?? newId(collection),
      sort: Number(input.sort ?? existing?.sort ?? 0) || 0,
      published: input.published === true || input.published === "true",
    } as Collections[CollectionName];
    await upsertItem(collection, item);
    revalidateSite();
    return { ok: true, id: item.id };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not save" };
  }
}

export async function deleteItemAction(collection: string, id: string): Promise<ActionResult> {
  await requireAdmin();
  if (!isCollectionName(collection)) return { ok: false, error: "Unknown collection" };
  try {
    await deleteItem(collection, id);
    revalidateSite();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not delete" };
  }
}

export async function saveSettingsAction(groupKey: string, payload: string): Promise<ActionResult> {
  await requireAdmin();
  const group = settingsGroups.find((g) => g.key === groupKey);
  if (!group) return { ok: false, error: "Unknown settings group" };
  let input: Record<string, unknown>;
  try {
    input = JSON.parse(payload) as Record<string, unknown>;
  } catch {
    return { ok: false, error: "Invalid payload" };
  }
  try {
    const current = await getSettings();
    const merged = coerceObject(group.fields, input, current as unknown as Record<string, unknown>);
    await saveSettings(merged as unknown as typeof current);
    revalidateSite();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not save" };
  }
}

export async function updateSubmissionAction(id: string, status: string, notes: string): Promise<ActionResult> {
  await requireAdmin();
  const db = getDb();
  if (!db) return { ok: false, error: "Database not configured" };
  const allowed = ["new", "in_progress", "done", "archived"];
  if (!allowed.includes(status)) return { ok: false, error: "Bad status" };
  await db.update(schema.submissions).set({ status, notes: notes.slice(0, 5000), updatedAt: new Date() }).where(eq(schema.submissions.id, id));
  revalidatePath("/admin/inbox");
  return { ok: true };
}

export async function deleteSubmissionAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  const db = getDb();
  if (!db) return { ok: false, error: "Database not configured" };
  await db.delete(schema.submissions).where(eq(schema.submissions.id, id));
  revalidatePath("/admin/inbox");
  redirect("/admin/inbox");
}

/** Turns an approved testimony submission into a published testimonial on the site. */
export async function publishTestimonyAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  const db = getDb();
  if (!db) return { ok: false, error: "Database not configured" };
  const row = await db.query.submissions.findFirst({ where: and(eq(schema.submissions.id, id), eq(schema.submissions.type, "testimony")) });
  if (!row) return { ok: false, error: "Not found" };
  const data = row.data as { name?: string; testimony?: string; allowShare?: boolean };
  if (!data.allowShare) return { ok: false, error: "The person did not give permission to share this testimony." };
  const firstName = (data.name ?? "").split(" ")[0];
  const text = data.testimony ?? "";
  await upsertItem("testimonials", {
    id: newId("testimonial"),
    sort: 99,
    published: true,
    name: firstName,
    quote: { en: text, es: text },
    context: { en: "", es: "" },
    image: "",
  });
  await db.update(schema.submissions).set({ status: "done", updatedAt: new Date() }).where(eq(schema.submissions.id, id));
  revalidateSite();
  return { ok: true };
}
