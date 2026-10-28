# Casa de Milagros — church website

Bilingual (English / Spanish) website for **Centro de Adoración e Intercesión Casa de Milagros**,
built with Next.js 16, Tailwind 4, Postgres (Drizzle) and Stripe.

What is included:

| Area | Where |
| --- | --- |
| Homepage with hero, mission/vision, service times, events & announcements, help cards, outreach, impact numbers, gallery | `/en`, `/es` |
| About (history, mission, vision, beliefs, leadership, ministries) | `/about` |
| Prayer Request Center (confidential requests, contact-me option, testimonies) | `/prayer` |
| Love in Action (who we serve, projects with progress bars, stories, testimonials, volunteer & contribute) | `/love-in-action` |
| Confidential assistance request form | `/assistance` |
| Donations: one-time / weekly / monthly, per-fund, Stripe Checkout, automatic receipts | `/give` |
| Letter of Need & Sponsorship (generated PDF in EN/ES, needs, future facility, corporate, donor form) | `/sponsorship`, `/api/letter-of-need` |
| Our Impact (numbers, stories, testimonials, media) | `/impact` |
| Ministries (7 ministries, each with its own page and sign-up form) | `/ministries`, `/ministries/[slug]` |
| Services & Events (weekly schedule, calendar, special services, registration, Zoom/livestream links) | `/events`, `/events/[slug]` |
| Sermons & Media (live embed, sermons, teachings, inspirational, social links) | `/media` |
| Plan Your Visit (Google Maps, service times, parking, what to expect, visitor form) | `/visit` |
| Volunteer & Get Involved form | `/volunteer` |
| Contact (general form, per-team inboxes, directions, social) | `/contact` |
| Privacy policy | `/privacy` |
| Admin dashboard: inbox for every form, donations log, settings, and editors for events, announcements, ministries, projects, impact numbers, testimonials, stories, leadership and videos | `/admin` |

Technical: responsive design, EN/ES switch on every page with `hreflang` alternates, SEO metadata,
sitemap and robots, JSON-LD for the church and events, Vercel Analytics + optional GA4, honeypot +
timing + optional Cloudflare Turnstile spam protection, automated confirmation emails, accessible
markup (skip link, labels, focus styles, reduced reliance on color).

## Run locally

```bash
pnpm install
cp .env.example .env   # fill in what you have; everything is optional for a first look
pnpm dev
```

Without a database the site renders the built-in default content and forms are only emailed (or
logged when SMTP is not configured either). See `docs/RUNBOOK.md` for production setup: database,
email, Stripe, admin password, uploads, analytics and going live.

## Scripts

```bash
pnpm dev         # local dev server
pnpm build       # production build
pnpm lint        # eslint
pnpm typecheck   # next typegen + tsc
pnpm test        # vitest (dictionaries, form validation, auth, admin coercion)
pnpm db:migrate  # apply db/migrations/*.sql to DATABASE_URL
```

## Repo layout

```
app/[lang]/            public pages (en, es)
app/admin/             admin dashboard (password protected)
app/api/forms/[type]   form submissions → db + team email + confirmation email
app/api/donate/        Stripe Checkout session
app/api/webhooks/      Stripe webhook (idempotent)
app/api/letter-of-need Letter of Need PDF
components/            site, forms, admin and ui components
lib/i18n/              dictionaries (en.ts, es.ts) and helpers
lib/content/           content types, defaults, database access
lib/admin/             field schemas, coercion, server actions
db/                    drizzle schema, migrations, migrate script
docs/RUNBOOK.md        setup and operations
```
