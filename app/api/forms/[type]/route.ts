import { NextResponse, type NextRequest } from "next/server";
import { getDb, schema } from "@/db";
import { getSettings } from "@/lib/content";
import { confirmationCopy, formInbox, formSchemas, isFormType, teamNotification } from "@/lib/forms";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { sendMail } from "@/lib/email";
import { hashIp, verifySpam } from "@/lib/spam";
import { newId, siteUrl } from "@/lib/utils";

export const runtime = "nodejs";

type Params = { params: Promise<{ type: string }> };

/**
 * Receives every public form. Flow: spam checks → validate → store (if DB) → email team →
 * email confirmation to the submitter. Nothing is ever sent to anyone but the team and the
 * person who submitted the form.
 */
export async function POST(req: NextRequest, { params }: Params) {
  const { type } = await params;
  if (!isFormType(type)) return NextResponse.json({ ok: false, error: "unknown_form" }, { status: 404 });

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || undefined;
  const spam = await verifySpam({
    honeypot: typeof body.honeypot === "string" ? body.honeypot : "",
    startedAt: typeof body.startedAt === "number" ? body.startedAt : undefined,
    turnstileToken: typeof body.turnstileToken === "string" ? body.turnstileToken : undefined,
    ip,
  });
  if (!spam.ok) return NextResponse.json({ ok: false, error: "spam", reason: spam.reason }, { status: 400 });

  const locale: Locale = isLocale(body.locale as string) ? (body.locale as Locale) : "en";
  const { honeypot: _h, startedAt: _s, turnstileToken: _t, locale: _l, ...fields } = body;
  const parsed = formSchemas[type].safeParse(fields);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "validation", issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })) }, { status: 422 });
  }
  const data = parsed.data as Record<string, unknown>;
  const id = newId();

  const db = getDb();
  if (db) {
    try {
      await db.insert(schema.submissions).values({
        id,
        type,
        locale,
        data,
        confidential: data.confidential === true || type === "assistance",
        ipHash: hashIp(ip),
      });
    } catch (err) {
      console.error("submission insert failed", err);
      // Keep going: the team still gets the email.
    }
  }

  const settings = await getSettings();
  const inboxKey = formInbox[type];
  const teamTo = settings.emails[inboxKey] || settings.emails.general || process.env.EMAIL_TEAM || settings.email;
  const adminUrl = `${siteUrl()}/admin/inbox/${id}`;
  const note = teamNotification(type, data, locale, adminUrl);
  const submitterEmail = typeof data.email === "string" && data.email ? data.email : undefined;
  await sendMail({ to: teamTo, subject: note.subject, text: note.text, replyTo: submitterEmail });

  if (submitterEmail) {
    const firstName = String(data.name ?? "").split(" ")[0] || "";
    const conf = confirmationCopy(type, locale, firstName);
    await sendMail({ to: submitterEmail, subject: conf.subject, text: conf.text, replyTo: teamTo });
  }

  return NextResponse.json({ ok: true, id });
}
