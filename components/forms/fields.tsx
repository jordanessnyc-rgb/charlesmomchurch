"use client";

import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Field({ label, htmlFor, required, optionalLabel, hint, error, children, className }: { label: string; htmlFor?: string; required?: boolean; optionalLabel?: string; hint?: string; error?: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="label">
        {label}
        {required ? <span className="text-gold-700"> *</span> : optionalLabel ? <span className="ml-1 font-normal text-muted">({optionalLabel})</span> : null}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {error && (
        <p className="mt-1 text-xs text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn("input", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn("input min-h-32", className)} {...props} />;
}

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <select className={cn("input", className)} {...props}>
      {children}
    </select>
  );
}

export function Checkbox({ label, className, ...props }: ComponentProps<"input"> & { label: ReactNode }) {
  return (
    <label className={cn("flex cursor-pointer items-start gap-3 text-sm text-ink", className)}>
      <input type="checkbox" className="mt-0.5 h-4.5 w-4.5 shrink-0 rounded border-line text-navy-800 accent-navy-800 focus:ring-gold-400" {...props} />
      <span>{label}</span>
    </label>
  );
}

export function CheckboxGroup({ name, options, legend, required }: { name: string; options: { value: string; label: string }[]; legend: string; required?: boolean }) {
  return (
    <fieldset>
      <legend className="label">
        {legend}
        {required && <span className="text-gold-700"> *</span>}
      </legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((o) => (
          <Checkbox key={o.value} name={name} value={o.value} label={o.label} />
        ))}
      </div>
    </fieldset>
  );
}

export function RadioGroup({ name, options, legend, defaultValue }: { name: string; options: { value: string; label: string }[]; legend: string; defaultValue?: string }) {
  return (
    <fieldset>
      <legend className="label">{legend}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((o) => (
          <label key={o.value} className="flex cursor-pointer items-center gap-3 rounded-lg border border-line px-3 py-2 text-sm has-[:checked]:border-gold-500 has-[:checked]:bg-gold-50">
            <input type="radio" name={name} value={o.value} defaultChecked={defaultValue === o.value} className="accent-navy-800" />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
