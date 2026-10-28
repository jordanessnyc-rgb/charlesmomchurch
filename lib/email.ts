import "server-only";
import nodemailer from "nodemailer";

export function emailConfigured(): boolean {
  return !!process.env.SMTP_HOST && !!process.env.EMAIL_FROM;
}

function transporter() {
  const port = Number(process.env.SMTP_PORT || 587);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
}

export type Mail = { to: string | string[]; subject: string; text: string; html?: string; replyTo?: string };

/** Sends an email. Returns false (and logs) instead of throwing when email is not configured. */
export async function sendMail(mail: Mail): Promise<boolean> {
  const to = Array.isArray(mail.to) ? mail.to.filter(Boolean) : mail.to;
  if (!to || (Array.isArray(to) && to.length === 0)) return false;
  if (!emailConfigured()) {
    console.info(`[email not configured] would send "${mail.subject}" to ${Array.isArray(to) ? to.join(", ") : to}`);
    return false;
  }
  try {
    await transporter().sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: mail.subject,
      text: mail.text,
      html: mail.html ?? simpleHtml(mail.text),
      replyTo: mail.replyTo,
    });
    return true;
  } catch (err) {
    console.error("sendMail failed", err);
    return false;
  }
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Minimal branded HTML wrapper around plain text. */
export function simpleHtml(text: string, title = "Casa de Milagros"): string {
  const body = escapeHtml(text)
    .split(/\n\s*\n/)
    .map((p) => `<p style="margin:0 0 14px;line-height:1.55">${p.replace(/\n/g, "<br/>")}</p>`)
    .join("");
  return `<!doctype html><html><body style="margin:0;background:#f4f5f8;font-family:Helvetica,Arial,sans-serif;color:#1a2235">
  <div style="max-width:600px;margin:24px auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e3e6ee">
    <div style="background:#0b1f3a;padding:20px 28px;color:#fff">
      <div style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#d4af37">Centro de Adoración e Intercesión</div>
      <div style="font-size:22px;font-weight:600;margin-top:4px">${escapeHtml(title)}</div>
    </div>
    <div style="padding:28px;font-size:15px">${body}</div>
    <div style="padding:16px 28px;background:#f8f9fc;font-size:12px;color:#6b7280">Casa de Milagros · New York</div>
  </div></body></html>`;
}
