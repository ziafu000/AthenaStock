BEGIN;

CREATE TABLE IF NOT EXISTS public.members (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email varchar(254) NOT NULL,
    full_name varchar(120) NOT NULL,
    phone varchar(30),
    tier varchar(16) NOT NULL DEFAULT 'normal' CHECK (tier IN ('normal', 'vip')),
    vip_started_at timestamptz,
    vip_expires_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS members_email_unique
    ON public.members (lower(email));

CREATE INDEX IF NOT EXISTS members_tier_idx
    ON public.members (tier);

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

COMMIT;
