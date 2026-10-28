"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n/config";
import type { FormType } from "@/lib/forms";

type Labels = { submit: string; sending: string; errorGeneric: string; errorValidation: string; errorSpam: string; confirmationNote: string };

declare global {
  interface Window {
    turnstile?: { render: (el: HTMLElement, opts: Record<string, unknown>) => string; reset: (id?: string) => void };
  }
}

/**
 * Wraps every public form: collects fields, adds spam protection (honeypot, timing, optional
 * Turnstile), POSTs JSON to /api/forms/[type], and shows success or error states.
 * Array fields: name a checkbox group with the same name for every option.
 */
export function FormShell({
  type,
  locale,
  labels,
  successMessage,
  children,
  hidden = {},
  arrayFields = [],
  submitLabel,
}: {
  type: FormType;
  locale: Locale;
  labels: Labels;
  successMessage: string;
  children: ReactNode;
  hidden?: Record<string, string>;
  arrayFields?: string[];
  submitLabel?: string;
}) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const startedAt = useRef<number>(0);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileToken = useRef<string>("");
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    startedAt.current = Date.now();
    if (!siteKey || !turnstileRef.current) return;
    const render = () => {
      if (window.turnstile && turnstileRef.current && !turnstileRef.current.hasChildNodes()) {
        window.turnstile.render(turnstileRef.current, {
          sitekey: siteKey,
          language: locale,
          callback: (token: string) => (turnstileToken.current = token),
          "expired-callback": () => (turnstileToken.current = ""),
        });
      }
    };
    if (window.turnstile) render();
    else {
      const s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      s.async = true;
      s.onload = render;
      document.head.appendChild(s);
    }
  }, [siteKey, locale]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const payload: Record<string, unknown> = { ...hidden, locale, startedAt: startedAt.current, turnstileToken: turnstileToken.current };
    for (const a of arrayFields) payload[a] = [];
    for (const el of Array.from(form.elements)) {
      if (!(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement)) continue;
      if (!el.name || el.name in hidden) continue;
      if (el instanceof HTMLInputElement && el.type === "checkbox") {
        if (arrayFields.includes(el.name)) {
          if (el.checked) (payload[el.name] as string[]).push(el.value);
        } else payload[el.name] = el.checked;
      } else if (el instanceof HTMLInputElement && el.type === "radio") {
        if (el.checked) payload[el.name] = el.value;
      } else payload[el.name] = el.value;
    }

    setState("sending");
    setError("");
    setFieldErrors({});
    try {
      const res = await fetch(`/api/forms/${type}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; issues?: { path: string; message: string }[] };
      if (res.ok && json.ok) {
        setState("done");
        form.reset();
        return;
      }
      if (json.error === "validation") {
        const fe: Record<string, string> = {};
        for (const i of json.issues ?? []) fe[i.path] = i.message;
        setFieldErrors(fe);
        setError(labels.errorValidation);
      } else if (json.error === "spam") setError(labels.errorSpam);
      else setError(labels.errorGeneric);
      setState("error");
    } catch {
      setError(labels.errorGeneric);
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl border border-gold-300 bg-gold-50 p-6 text-navy-900" role="status">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-gold-700" aria-hidden="true" />
          <div>
            <p className="font-semibold">{successMessage}</p>
            <p className="mt-1 text-sm text-navy-800/80">{labels.confirmationNote}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate={false}>
      {children}
      {/* Honeypot: hidden from people, filled by bots. */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label>
          Website
          <input type="text" name="honeypot" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {siteKey && <div ref={turnstileRef} className="min-h-16" />}
      {Object.keys(fieldErrors).length > 0 && (
        <ul className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">
          {Object.entries(fieldErrors).map(([k, v]) => (
            <li key={k}>
              <span className="font-medium">{k}</span>: {v}
            </li>
          ))}
        </ul>
      )}
      {error && Object.keys(fieldErrors).length === 0 && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">
          {error}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" disabled={state === "sending"}>
          {state === "sending" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {state === "sending" ? labels.sending : (submitLabel ?? labels.submit)}
        </Button>
        <p className="text-xs text-muted">{labels.confirmationNote}</p>
      </div>
    </form>
  );
}
