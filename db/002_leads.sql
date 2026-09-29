CREATE TABLE IF NOT EXISTS leads(
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  public_id text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  phone text NOT NULL,
  telegram text NOT NULL DEFAULT '',
  preferred_contact text NOT NULL DEFAULT 'whatsapp',
  contact_time text NOT NULL DEFAULT '',
  language text NOT NULL CHECK(language IN ('ru','kz')),
  brand text NOT NULL DEFAULT '',
  mark_type text NOT NULL DEFAULT 'unknown',
  logo_name text,
  logo_mime text,
  logo_bytes bytea CHECK(logo_bytes IS NULL OR octet_length(logo_bytes)<=5242880),
  service text NOT NULL DEFAULT 'consultation',
  stage text NOT NULL DEFAULT '',
  activity text NOT NULL DEFAULT '',
  geography text NOT NULL DEFAULT '',
  urgency text NOT NULL DEFAULT '',
  comment text NOT NULL DEFAULT '',
  website text NOT NULL DEFAULT '',
  lead_source text NOT NULL DEFAULT 'other',
  utm_source text NOT NULL DEFAULT '',
  utm_medium text NOT NULL DEFAULT '',
  utm_campaign text NOT NULL DEFAULT '',
  utm_content text NOT NULL DEFAULT '',
  utm_term text NOT NULL DEFAULT '',
  referrer text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new' CHECK(status IN ('new','contacted','in_progress','paid','completed')),
  payload jsonb NOT NULL DEFAULT '{}',
  ip_hash text NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS leads_created ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS leads_status ON leads(status,created_at DESC);
CREATE INDEX IF NOT EXISTS leads_service ON leads(service,created_at DESC);
CREATE INDEX IF NOT EXISTS leads_source ON leads(lead_source,created_at DESC);
CREATE TABLE IF NOT EXISTS limits(
  key text PRIMARY KEY,
  count integer NOT NULL,
  expires_at timestamptz NOT NULL
);
