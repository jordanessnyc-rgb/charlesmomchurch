"use client";

import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import { FormShell } from "./form-shell";
import { Checkbox, CheckboxGroup, Field, Input, RadioGroup, Select, Textarea } from "./fields";

type Common = { locale: Locale; d: Pick<Dictionary, "form" | "cta"> };

function shellLabels(d: Common["d"]) {
  return {
    submit: d.cta.submit,
    sending: d.cta.sending,
    errorGeneric: d.form.errorGeneric,
    errorValidation: d.form.errorValidation,
    errorSpam: d.form.errorSpam,
    confirmationNote: d.form.confirmationNote,
  };
}

function NameEmailPhone({ d, emailRequired = true, phoneRequired = false }: { d: Common["d"]; emailRequired?: boolean; phoneRequired?: boolean }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label={d.form.name} htmlFor="name" required className="sm:col-span-2">
        <Input id="name" name="name" required autoComplete="name" />
      </Field>
      <Field label={d.form.email} htmlFor="email" required={emailRequired} optionalLabel={emailRequired ? undefined : d.form.optional}>
        <Input id="email" name="email" type="email" required={emailRequired} autoComplete="email" inputMode="email" />
      </Field>
      <Field label={d.form.phone} htmlFor="phone" required={phoneRequired} optionalLabel={phoneRequired ? undefined : d.form.optional}>
        <Input id="phone" name="phone" type="tel" required={phoneRequired} autoComplete="tel" inputMode="tel" />
      </Field>
    </div>
  );
}

function ContactMethod({ d, name = "contactMethod" }: { d: Common["d"]; name?: string }) {
  return (
    <Select id={name} name={name} defaultValue="email">
      {Object.entries(d.form.contactMethod).map(([k, v]) => (
        <option key={k} value={k}>
          {v}
        </option>
      ))}
    </Select>
  );
}

export function PrayerForm({ locale, d, p }: Common & { p: Dictionary["prayer"] }) {
  return (
    <FormShell type="prayer" locale={locale} labels={shellLabels(d)} successMessage={p.success} submitLabel={d.cta.prayer}>
      <NameEmailPhone d={d} emailRequired={false} />
      <Field label={p.request} htmlFor="request" required>
        <Textarea id="request" name="request" required minLength={5} />
      </Field>
      <div className="space-y-3">
        <Checkbox name="confidential" label={p.confidential} defaultChecked />
        <Checkbox name="contactMe" label={p.contactMe} />
      </div>
      <Field label={d.form.preferredContact} htmlFor="contactMethod">
        <ContactMethod d={d} />
      </Field>
    </FormShell>
  );
}

export function TestimonyForm({ locale, d, p }: Common & { p: Dictionary["prayer"] }) {
  return (
    <FormShell type="testimony" locale={locale} labels={shellLabels(d)} successMessage={p.testimonySuccess}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={d.form.name} htmlFor="t-name" required>
          <Input id="t-name" name="name" required autoComplete="name" />
        </Field>
        <Field label={d.form.email} htmlFor="t-email" optionalLabel={d.form.optional}>
          <Input id="t-email" name="email" type="email" autoComplete="email" />
        </Field>
      </div>
      <Field label={p.testimony} htmlFor="testimony" required>
        <Textarea id="testimony" name="testimony" required minLength={5} />
      </Field>
      <Checkbox name="allowShare" label={p.allowShare} />
    </FormShell>
  );
}

export function AssistanceForm({ locale, d, a }: Common & { a: Dictionary["assistance"] }) {
  return (
    <FormShell type="assistance" locale={locale} labels={shellLabels(d)} successMessage={a.success} arrayFields={["needTypes"]} submitLabel={d.cta.assistance}>
      <NameEmailPhone d={d} emailRequired={false} phoneRequired />
      <CheckboxGroup name="needTypes" legend={a.needTypes} required options={Object.entries(a.types).map(([value, label]) => ({ value, label }))} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={a.householdSize} htmlFor="householdSize" optionalLabel={d.form.optional}>
          <Input id="householdSize" name="householdSize" type="number" min={1} max={30} inputMode="numeric" />
        </Field>
        <Field label={a.preferredContact} htmlFor="contactMethod">
          <ContactMethod d={d} />
        </Field>
      </div>
      <RadioGroup name="urgency" legend={a.urgency} defaultValue="normal" options={Object.entries(a.urgencies).map(([value, label]) => ({ value, label }))} />
      <Field label={a.describe} htmlFor="description" required>
        <Textarea id="description" name="description" required minLength={5} />
      </Field>
      <Field label={d.form.languagePreference} htmlFor="language">
        <Select id="language" name="language" defaultValue={locale}>
          <option value="en">English</option>
          <option value="es">Español</option>
        </Select>
      </Field>
      <p className="text-sm text-muted">{a.confidentialNote}</p>
    </FormShell>
  );
}

export function SponsorshipForm({ locale, d, s }: Common & { s: Dictionary["sponsorship"] }) {
  return (
    <FormShell type="sponsorship" locale={locale} labels={shellLabels(d)} successMessage={s.success}>
      <NameEmailPhone d={d} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={s.organization} htmlFor="organization" optionalLabel={d.form.optional}>
          <Input id="organization" name="organization" autoComplete="organization" />
        </Field>
        <Field label={s.interest} htmlFor="interest">
          <Select id="interest" name="interest" defaultValue="sponsor">
            {Object.entries(s.interests).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Field label={d.form.message} htmlFor="message" required>
        <Textarea id="message" name="message" required minLength={5} />
      </Field>
    </FormShell>
  );
}

export function VisitorForm({ locale, d, v }: Common & { v: Dictionary["visit"] }) {
  return (
    <FormShell type="visitor" locale={locale} labels={shellLabels(d)} successMessage={v.success}>
      <NameEmailPhone d={d} />
      <Field label={v.visitDate} htmlFor="visitDate" optionalLabel={d.form.optional}>
        <Input id="visitDate" name="visitDate" type="date" />
      </Field>
      <div className="space-y-3">
        <Checkbox name="firstTime" label={v.firstTime} defaultChecked />
        <Checkbox name="bringingKids" label={v.bringingKids} />
      </div>
      <Field label={d.form.message} htmlFor="v-message" optionalLabel={d.form.optional}>
        <Textarea id="v-message" name="message" className="min-h-24" />
      </Field>
    </FormShell>
  );
}

export function VolunteerForm({ locale, d, v }: Common & { v: Dictionary["volunteer"] }) {
  return (
    <FormShell type="volunteer" locale={locale} labels={shellLabels(d)} successMessage={v.success} arrayFields={["areas", "availability"]} submitLabel={d.cta.volunteer}>
      <NameEmailPhone d={d} />
      <CheckboxGroup name="areas" legend={v.areas} required options={Object.entries(v.areaOptions).map(([value, label]) => ({ value, label }))} />
      <CheckboxGroup name="availability" legend={v.availability} options={Object.entries(v.availabilityOptions).map(([value, label]) => ({ value, label }))} />
      <Field label={v.skills} htmlFor="skills" optionalLabel={d.form.optional}>
        <Textarea id="skills" name="skills" className="min-h-24" />
      </Field>
      <Field label={v.about} htmlFor="about" optionalLabel={d.form.optional}>
        <Textarea id="about" name="about" className="min-h-24" />
      </Field>
    </FormShell>
  );
}

export function ContactForm({ locale, d, c, defaultTopic = "general" }: Common & { c: Dictionary["contact"]; defaultTopic?: string }) {
  return (
    <FormShell type="contact" locale={locale} labels={shellLabels(d)} successMessage={c.success} submitLabel={d.cta.send}>
      <NameEmailPhone d={d} />
      <Field label={c.topic} htmlFor="topic">
        <Select id="topic" name="topic" defaultValue={defaultTopic}>
          {Object.entries(c.topics).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </Select>
      </Field>
      <Field label={d.form.message} htmlFor="c-message" required>
        <Textarea id="c-message" name="message" required minLength={5} />
      </Field>
    </FormShell>
  );
}

export function EventRegistrationForm({ locale, d, e, eventId, eventTitle }: Common & { e: Dictionary["events"]; eventId: string; eventTitle: string }) {
  return (
    <FormShell type="event_registration" locale={locale} labels={shellLabels(d)} successMessage={e.success} hidden={{ eventId, eventTitle }} submitLabel={d.cta.register}>
      <NameEmailPhone d={d} />
      <Field label={e.guests} htmlFor="guests">
        <Input id="guests" name="guests" type="number" min={1} max={50} defaultValue={1} inputMode="numeric" />
      </Field>
      <Field label={d.form.message} htmlFor="e-message" optionalLabel={d.form.optional}>
        <Textarea id="e-message" name="message" className="min-h-24" />
      </Field>
    </FormShell>
  );
}

export function MinistryInterestForm({ locale, d, m, ministryId, ministryName }: Common & { m: Dictionary["ministries"]; ministryId: string; ministryName: string }) {
  return (
    <FormShell type="ministry_interest" locale={locale} labels={shellLabels(d)} successMessage={m.success} hidden={{ ministryId, ministryName }}>
      <NameEmailPhone d={d} />
      <Field label={d.form.message} htmlFor="m-message" optionalLabel={d.form.optional}>
        <Textarea id="m-message" name="message" className="min-h-24" />
      </Field>
    </FormShell>
  );
}
