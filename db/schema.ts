import { boolean, integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

/** Single-row table holding the SiteSettings JSON (id is always "site"). */
export const siteSettings = pgTable("site_settings", {
  id: text("id").primaryKey(),
  data: jsonb("data").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Editable content collections (events, ministries, projects...). One row per item. */
export const contentItems = pgTable("content_items", {
  id: text("id").primaryKey(),
  collection: text("collection").notNull(),
  data: jsonb("data").notNull(),
  sort: integer("sort").notNull().default(0),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Every public form submission (prayer, assistance, visitor, volunteer, contact...). */
export const submissions = pgTable("submissions", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  locale: text("locale").notNull().default("en"),
  data: jsonb("data").notNull(),
  status: text("status").notNull().default("new"), // new | in_progress | done | archived
  confidential: boolean("confidential").notNull().default(false),
  notes: text("notes").notNull().default(""),
  ipHash: text("ip_hash"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Donations recorded from Stripe webhooks. */
export const donations = pgTable("donations", {
  id: text("id").primaryKey(),
  stripeSessionId: text("stripe_session_id"),
  stripePaymentId: text("stripe_payment_id").unique(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  amountCents: integer("amount_cents").notNull(),
  currency: text("currency").notNull().default("usd"),
  frequency: text("frequency").notNull().default("once"), // once | weekly | monthly
  fund: text("fund").notNull().default("general"),
  donorName: text("donor_name"),
  donorEmail: text("donor_email"),
  locale: text("locale").notNull().default("en"),
  status: text("status").notNull().default("paid"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Processed Stripe event IDs, for idempotent webhooks. */
export const stripeEvents = pgTable("stripe_events", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  receivedAt: timestamp("received_at", { withTimezone: true }).notNull().defaultNow(),
});
