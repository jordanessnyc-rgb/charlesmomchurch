import { z } from "zod";
import type { Locale } from "@/lib/i18n/config";

/** Public form types. Each maps to a zod schema, a team inbox, and bilingual email copy. */
export const formTypes = [
  "prayer",
  "testimony",
  "assistance",
  "sponsorship",
  "visitor",
  "volunteer",
  "contact",
  "event_registration",
  "ministry_interest",
] as const;
export type FormType = (typeof formTypes)[number];

export function isFormType(value: string): value is FormType {
  return (formTypes as readonly string[]).includes(value);
}

const name = z.string().trim().min(2).max(120);
const email = z.string().trim().email().max(200);
const phone = z.string().trim().max(40).optional().or(z.literal(""));
const longText = z.string().trim().min(5).max(5000);
const shortText = z.string().trim().max(500).optional().or(z.literal(""));
const bool = z.coerce.boolean().optional().default(false);
const contactMethod = z.enum(["email", "phone", "text", "whatsapp"]).optional().default("email");

export const formSchemas = {
  prayer: z.object({
    name,
    email: email.optional().or(z.literal("")),
    phone,
    request: longText,
    confidential: bool,
    contactMe: bool,
    contactMethod,
  }),
  testimony: z.object({
    name,
    email: email.optional().or(z.literal("")),
    testimony: longText,
    allowShare: bool,
  }),
  assistance: z.object({
    name,
    email: email.optional().or(z.literal("")),
    phone: z.string().trim().min(7).max(40),
    needTypes: z.array(z.enum(["food", "clothing", "family", "resources", "spiritual", "other"])).min(1),
    householdSize: z.coerce.number().int().min(1).max(30).optional(),
    description: longText,
    urgency: z.enum(["normal", "soon", "urgent"]).default("normal"),
    contactMethod,
    address: shortText,
    language: z.enum(["en", "es"]).optional(),
  }),
  sponsorship: z.object({
    name,
    email,
    phone,
    organization: shortText,
    interest: z.enum(["sponsor", "inkind", "facility", "recurring", "other"]).default("other"),
    message: longText,
  }),
  visitor: z.object({
    name,
    email,
    phone,
    visitDate: shortText,
    firstTime: bool,
    bringingKids: bool,
    message: z.string().trim().max(2000).optional().or(z.literal("")),
  }),
  volunteer: z.object({
    name,
    email,
    phone,
    areas: z.array(z.string().max(40)).min(1).max(12),
    availability: z.array(z.string().max(20)).optional().default([]),
    skills: z.string().trim().max(2000).optional().or(z.literal("")),
    about: z.string().trim().max(2000).optional().or(z.literal("")),
  }),
  contact: z.object({
    name,
    email,
    phone,
    topic: z.enum(["general", "prayer", "assistance", "sponsorship", "media", "other"]).default("general"),
    message: longText,
  }),
  event_registration: z.object({
    name,
    email,
    phone,
    eventId: z.string().max(120),
    eventTitle: z.string().max(200),
    guests: z.coerce.number().int().min(1).max(50).default(1),
    message: z.string().trim().max(2000).optional().or(z.literal("")),
  }),
  ministry_interest: z.object({
    name,
    email,
    phone,
    ministryId: z.string().max(120),
    ministryName: z.string().max(200),
    message: z.string().trim().max(2000).optional().or(z.literal("")),
  }),
} satisfies Record<FormType, z.ZodTypeAny>;

export type FormData<T extends FormType> = z.infer<(typeof formSchemas)[T]>;

/** Which team inbox (from settings.emails) each form routes to. */
export const formInbox: Record<FormType, "general" | "prayer" | "assistance" | "sponsorship" | "volunteer"> = {
  prayer: "prayer",
  testimony: "prayer",
  assistance: "assistance",
  sponsorship: "sponsorship",
  visitor: "general",
  volunteer: "volunteer",
  contact: "general",
  event_registration: "general",
  ministry_interest: "volunteer",
};

export const formLabels: Record<FormType, { en: string; es: string }> = {
  prayer: { en: "Prayer request", es: "Petición de oración" },
  testimony: { en: "Testimony", es: "Testimonio" },
  assistance: { en: "Assistance request", es: "Solicitud de ayuda" },
  sponsorship: { en: "Sponsorship inquiry", es: "Consulta de patrocinio" },
  visitor: { en: "Visitor registration", es: "Registro de visitante" },
  volunteer: { en: "Volunteer sign-up", es: "Inscripción de voluntario" },
  contact: { en: "Contact message", es: "Mensaje de contacto" },
  event_registration: { en: "Event registration", es: "Inscripción a evento" },
  ministry_interest: { en: "Ministry interest", es: "Interés en ministerio" },
};

/** Confirmation email sent to the person who submitted the form. */
export function confirmationCopy(type: FormType, locale: Locale, firstName: string): { subject: string; text: string } {
  const hi = locale === "es" ? `Hola ${firstName},` : `Hi ${firstName},`;
  const closing =
    locale === "es"
      ? "\n\nSi necesitas algo más, responde a este correo.\n\nCon amor,\nCasa de Milagros\nCentro de Adoración e Intercesión"
      : "\n\nIf you need anything else, just reply to this email.\n\nWith love,\nCasa de Milagros\nCentro de Adoración e Intercesión";
  const copy: Record<FormType, { en: [string, string]; es: [string, string] }> = {
    prayer: {
      en: ["We received your prayer request", "Thank you for trusting us with your prayer request. Our intercession team has received it and will be praying with you. If you asked to be contacted, a member of the team will reach out soon."],
      es: ["Recibimos tu petición de oración", "Gracias por confiarnos tu petición de oración. Nuestro equipo de intercesión la ha recibido y estará orando contigo. Si pediste que te contactemos, un miembro del equipo se comunicará pronto."],
    },
    testimony: {
      en: ["Thank you for sharing your testimony", "We received your testimony and our team will read it with gratitude. We will only share it publicly if you gave us permission, and only with your first name."],
      es: ["Gracias por compartir tu testimonio", "Recibimos tu testimonio y nuestro equipo lo leerá con gratitud. Solo lo compartiremos públicamente si nos diste permiso, y solo con tu primer nombre."],
    },
    assistance: {
      en: ["We received your assistance request", "Thank you for reaching out. Your request is confidential and has been sent to our care team. Someone will contact you soon using the method you selected. If your situation is an emergency, please call 911."],
      es: ["Recibimos tu solicitud de ayuda", "Gracias por comunicarte. Tu solicitud es confidencial y ha sido enviada a nuestro equipo de cuidado. Alguien te contactará pronto por el medio que elegiste. Si tu situación es una emergencia, por favor llama al 911."],
    },
    sponsorship: {
      en: ["Thank you for your interest in partnering with us", "We received your sponsorship inquiry. A member of our leadership team will contact you shortly to talk about how we can work together."],
      es: ["Gracias por tu interés en colaborar con nosotros", "Recibimos tu consulta de patrocinio. Un miembro de nuestro equipo de liderazgo se comunicará contigo en breve para conversar sobre cómo colaborar."],
    },
    visitor: {
      en: ["We can't wait to meet you!", "Thank you for letting us know you're coming. Someone from our welcome team will be looking for you. Service and location details are on our website under Plan Your Visit."],
      es: ["¡Estamos ansiosos por conocerte!", "Gracias por avisarnos que vienes. Alguien de nuestro equipo de bienvenida te estará esperando. Los detalles del servicio y la ubicación están en nuestro sitio web, en Planifica tu visita."],
    },
    volunteer: {
      en: ["Thank you for volunteering", "We received your volunteer sign-up. Our volunteer coordinator will contact you soon with next steps and upcoming opportunities."],
      es: ["Gracias por ofrecerte como voluntario", "Recibimos tu inscripción como voluntario. Nuestro coordinador de voluntarios se comunicará contigo pronto con los próximos pasos y oportunidades."],
    },
    contact: {
      en: ["We received your message", "Thank you for contacting Casa de Milagros. We have received your message and will respond as soon as possible."],
      es: ["Recibimos tu mensaje", "Gracias por contactar a Casa de Milagros. Hemos recibido tu mensaje y responderemos lo antes posible."],
    },
    event_registration: {
      en: ["You're registered!", "Your registration has been received. We look forward to seeing you. Details and any updates will be posted on our website."],
      es: ["¡Estás inscrito!", "Hemos recibido tu inscripción. Esperamos verte pronto. Los detalles y cualquier novedad se publicarán en nuestro sitio web."],
    },
    ministry_interest: {
      en: ["Thanks for your interest in serving", "We received your interest in joining a ministry. The ministry leader will reach out to you soon."],
      es: ["Gracias por tu interés en servir", "Recibimos tu interés en unirte a un ministerio. El líder del ministerio se comunicará contigo pronto."],
    },
  };
  const [subject, body] = copy[type][locale];
  return { subject: `${subject} · Casa de Milagros`, text: `${hi}\n\n${body}${closing}` };
}

/** Team notification body: a readable dump of the submission. */
export function teamNotification(type: FormType, data: Record<string, unknown>, locale: Locale, adminUrl: string): { subject: string; text: string } {
  const label = formLabels[type].en;
  const lines = Object.entries(data)
    .filter(([k]) => !["honeypot", "startedAt", "turnstileToken"].includes(k))
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : typeof v === "boolean" ? (v ? "yes" : "no") : String(v ?? "")}`)
    .join("\n");
  const confidential = data.confidential === true ? " [CONFIDENTIAL]" : "";
  return {
    subject: `New ${label.toLowerCase()}${confidential} from ${String(data.name ?? "website")} (${locale.toUpperCase()})`,
    text: `A new ${label.toLowerCase()} was submitted on the website (${locale === "es" ? "Spanish" : "English"}).\n\n${lines}\n\nView and manage it in the admin dashboard:\n${adminUrl}`,
  };
}
