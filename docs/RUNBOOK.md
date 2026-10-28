# Runbook — Casa de Milagros website

## 1. Deploy (Vercel)

1. Import the GitHub repository into Vercel. Framework: Next.js. Build command `pnpm build`.
2. Add the environment variables from `.env.example` (see sections below). The only one the site
   strictly needs to run is `NEXT_PUBLIC_SITE_URL` (the public URL, e.g. `https://www.casademilagros.org`).
3. Add the domain under Vercel → Domains. SSL is automatic.

The site works with no other configuration: it shows the built-in default content, and forms are
accepted but only logged. Each integration below switches on when its variables are set.

## 2. Database (stores submissions, donations and editable content)

Any Postgres works: Supabase (free tier), Neon, Railway, Vercel Postgres.

1. Create the database and copy the connection string into `DATABASE_URL`
   (Supabase: Connect → Session pooler, port 5432).
2. Apply the schema once from your computer:
   ```bash
   DATABASE_URL="postgres://…" pnpm db:migrate
   ```
   Re-run the same command whenever a new file appears in `db/migrations/`.

Until a database is connected, the admin dashboard shows the defaults read-only.

## 3. Admin dashboard

Set `ADMIN_PASSWORD` (a strong password) and `AUTH_SECRET` (random string, `openssl rand -hex 32`).
Sign in at `/admin/login`. Sessions last one week. There is a single shared password by design; if
more than a couple of people need access, rotate it when someone leaves.

In the dashboard:

- **Inbox** — every form submission with status (new / in progress / done / archived) and internal
  notes. Assistance requests and anything marked confidential are flagged. A testimony can be
  published to the Impact page with one click, only if the person ticked the permission box.
- **Donations** — log of Stripe payments (amount, frequency, fund, donor).
- **Settings** — contact details, which inbox receives each form, service times, texts for every
  page, funds, Letter of Need content, galleries, privacy policy. All texts have EN and ES fields.
- **Content** — events, announcements, ministries, projects, impact numbers, testimonials, stories,
  leadership, videos. Each item has a Published checkbox and a sort order.

Photos: paste an image URL (Google Drive "share" links do not work; use a direct image URL) or
set `BLOB_READ_WRITE_TOKEN` (Vercel → Storage → Blob) to enable the Upload button.

## 4. Email (notifications + automatic confirmations)

Works with any SMTP provider. Recommended: Resend (free tier) or Google Workspace.

```
SMTP_HOST=smtp.resend.com   SMTP_PORT=587   SMTP_USER=resend   SMTP_PASS=re_…
EMAIL_FROM="Casa de Milagros <no-reply@casademilagros.org>"
EMAIL_TEAM=office@casademilagros.org
```

Routing: each form goes to the inbox configured in Admin → Settings → Contact & location
(prayer, assistance, sponsorship, volunteer, general). Empty inboxes fall back to the general
inbox, then `EMAIL_TEAM`, then the public email. The person who submitted the form receives a
confirmation in their language whenever they gave an email address. Nothing is ever sent to anyone
else.

## 5. Donations (Stripe)

1. Create a Stripe account for the church. Enable Apple Pay / Google Pay / Link under Payment methods.
2. Copy the **secret key** to `STRIPE_SECRET_KEY` and the **publishable key** to
   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
3. Add a webhook endpoint: `https://<your-domain>/api/webhooks/stripe` with events
   `checkout.session.completed` and `invoice.paid`. Copy the signing secret to `STRIPE_WEBHOOK_SECRET`.
4. Receipts: Stripe emails a receipt for every one-time payment (the site passes the donor's email).
   For recurring donations, turn on "Email customers about successful payments" under
   Stripe → Settings → Emails so each renewal gets a receipt.

Frequencies: one-time, weekly, monthly. Funds are configured in Admin → Settings → Giving; the
fund id is stored in Stripe metadata and shown in the Donations log. Refunds and payouts are done
in the Stripe dashboard. Test first with Stripe test keys and card `4242 4242 4242 4242`.

## 6. Spam protection

Always on: honeypot field, minimum time-to-submit, per-IP rate limit. Optional: Cloudflare
Turnstile (free, no puzzles). Create a widget at dash.cloudflare.com → Turnstile and set
`NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`.

## 7. Analytics, maps, SEO

- Vercel Analytics is automatic on Vercel. For Google Analytics set `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- The map uses the keyless Google Maps embed with the address from Settings. For a nicer embed,
  set `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY` (Maps Embed API).
- Sitemap at `/sitemap.xml`, robots at `/robots.txt`. Submit the sitemap in Google Search Console.
- Open Graph image: `public/images/logo.jpg`. Replace with a 1200×630 photo for nicer link previews.

## 8. Content checklist before going live

In Admin → Settings:

- [ ] Street address, phone, public email, office hours
- [ ] Team inboxes for prayer, assistance, sponsorship, volunteers
- [ ] Social links, YouTube channel, livestream and Zoom links
- [ ] Service times
- [ ] Leadership names, photos and bios (Content → Leadership)
- [ ] Replace sample events, announcements, projects, stories and testimonials
- [ ] Impact numbers and the "last updated" date
- [ ] Letter of Need text, signatory and date
- [ ] Church and outreach photo galleries
- [ ] Review the privacy policy and set its date

## 9. Privacy & data handling

- Submissions live only in the database and the configured inboxes. Delete them from the Inbox
  when no longer needed.
- Assistance requests are always marked confidential. Prayer requests are confidential when the
  person ticks the box (ticked by default).
- Card data never touches the site; Stripe handles payment details.
- IP addresses are stored only as a salted hash for abuse prevention.
