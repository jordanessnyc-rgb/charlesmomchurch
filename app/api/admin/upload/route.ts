import { NextResponse, type NextRequest } from "next/server";
import { isAdmin } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024;

/** Uploads an image from the admin dashboard to Vercel Blob and returns its public URL. */
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!process.env.BLOB_READ_WRITE_TOKEN) return NextResponse.json({ error: "uploads_not_configured" }, { status: 503 });
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "no_file" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "too_large" }, { status: 413 });
  if (!/^image\/(jpeg|png|webp|gif|avif)$/.test(file.type)) return NextResponse.json({ error: "bad_type" }, { status: 415 });
  const { put } = await import("@vercel/blob");
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const blob = await put(`uploads/${Date.now()}-${safeName}`, file, { access: "public", addRandomSuffix: false });
  return NextResponse.json({ url: blob.url });
}
