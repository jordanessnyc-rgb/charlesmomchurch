"use client";

import { useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "./fields";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

const presets = [25, 50, 100, 250, 500];

export function DonateForm({
  locale,
  g,
  f,
  funds,
  enabled,
  defaultFund = "general",
}: {
  locale: Locale;
  g: Dictionary["give"];
  f: Dictionary["form"];
  funds: { id: string; name: string; description: string }[];
  enabled: boolean;
  defaultFund?: string;
}) {
  const [frequency, setFrequency] = useState<"once" | "weekly" | "monthly">("once");
  const [amount, setAmount] = useState<number>(50);
  const [custom, setCustom] = useState<string>("");
  const [fund, setFund] = useState(defaultFund);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const effective = custom ? Number(custom) : amount;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!enabled) return;
    if (!effective || effective < 1) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/donate/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ amount: effective, frequency, fund, name, email, locale }),
      });
      const json = (await res.json()) as { ok?: boolean; url?: string; error?: string };
      if (json.ok && json.url) {
        window.location.href = json.url;
        return;
      }
      setError(json.error === "not_configured" ? g.notConfigured : g.error);
    } catch {
      setError(g.error);
    } finally {
      setBusy(false);
    }
  }

  const freqs: { key: typeof frequency; label: string }[] = [
    { key: "once", label: g.once },
    { key: "weekly", label: g.weekly },
    { key: "monthly", label: g.monthly },
  ];

  return (
    <form onSubmit={submit} className="space-y-6">
      <fieldset>
        <legend className="label">{g.frequency}</legend>
        <div className="grid grid-cols-3 gap-2 rounded-full bg-navy-50 p-1" role="radiogroup">
          {freqs.map((fr) => (
            <button
              key={fr.key}
              type="button"
              role="radio"
              aria-checked={frequency === fr.key}
              onClick={() => setFrequency(fr.key)}
              className={cn("rounded-full px-3 py-2 text-sm font-semibold transition", frequency === fr.key ? "bg-navy-800 text-white shadow-card" : "text-navy-800 hover:bg-white")}
            >
              {fr.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="label">{g.amount}</legend>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setAmount(p);
                setCustom("");
              }}
              aria-pressed={!custom && amount === p}
              className={cn(
                "rounded-xl border px-3 py-3 text-base font-semibold transition",
                !custom && amount === p ? "border-gold-500 bg-gold-50 text-navy-900" : "border-line bg-white text-navy-800 hover:border-gold-400",
              )}
            >
              ${p}
            </button>
          ))}
        </div>
        <div className="mt-3">
          <Field label={g.customAmount} htmlFor="custom">
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-muted">$</span>
              <Input id="custom" type="number" min={1} step={1} inputMode="decimal" value={custom} onChange={(e) => setCustom(e.target.value)} className="pl-8" placeholder="0" />
            </div>
          </Field>
        </div>
      </fieldset>

      <Field label={g.fund} htmlFor="fund">
        <select id="fund" className="input" value={fund} onChange={(e) => setFund(e.target.value)}>
          {funds.map((fu) => (
            <option key={fu.id} value={fu.id}>
              {fu.name}
            </option>
          ))}
        </select>
        {funds.find((x) => x.id === fund)?.description && <p className="mt-1 text-xs text-muted">{funds.find((x) => x.id === fund)?.description}</p>}
      </Field>

      <div>
        <p className="label">{g.yourInfo}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input aria-label={f.name} placeholder={f.name} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input aria-label={f.email} placeholder={f.email} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <p className="mt-2 text-xs text-muted">{g.receiptNote}</p>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">
          {error}
        </p>
      )}
      {!enabled && <p className="rounded-lg border border-gold-300 bg-gold-50 p-3 text-sm text-navy-900">{g.notConfigured}</p>}

      <Button type="submit" size="lg" className="w-full" disabled={busy || !enabled || !effective}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Lock className="h-4 w-4" aria-hidden="true" />}
        {g.button} · ${effective || 0}
        {frequency !== "once" && ` / ${frequency === "weekly" ? g.weekly.toLowerCase() : g.monthly.toLowerCase()}`}
      </Button>
      <p className="text-center text-xs text-muted">{g.secure}</p>
    </form>
  );
}
