CREATE TABLE IF NOT EXISTS site_settings (
  id text PRIMARY KEY,
  data jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS content_items (
  id text PRIMARY KEY,
  collection text NOT NULL,
  data jsonb NOT NULL,
  sort integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS content_items_collection_idx ON content_items (collection, sort);

CREATE TABLE IF NOT EXISTS submissions (
  id text PRIMARY KEY,
  type text NOT NULL,
  locale text NOT NULL DEFAULT 'en',
  data jsonb NOT NULL,
  status text NOT NULL DEFAULT 'new',
  confidential boolean NOT NULL DEFAULT false,
  notes text NOT NULL DEFAULT '',
  ip_hash text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS submissions_type_idx ON submissions (type, created_at DESC);
CREATE INDEX IF NOT EXISTS submissions_status_idx ON submissions (status, created_at DESC);

CREATE TABLE IF NOT EXISTS donations (
  id text PRIMARY KEY,
  stripe_session_id text,
  stripe_payment_id text UNIQUE,
  stripe_customer_id text,
  stripe_subscription_id text,
  amount_cents integer NOT NULL,
  currency text NOT NULL DEFAULT 'usd',
  frequency text NOT NULL DEFAULT 'once',
  fund text NOT NULL DEFAULT 'general',
  donor_name text,
  donor_email text,
  locale text NOT NULL DEFAULT 'en',
  status text NOT NULL DEFAULT 'paid',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS donations_created_idx ON donations (created_at DESC);

CREATE TABLE IF NOT EXISTS stripe_events (
  id text PRIMARY KEY,
  type text NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS schema_migrations (
  name text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);
