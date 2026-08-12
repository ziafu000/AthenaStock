BEGIN;

CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
    id uuid PRIMARY KEY,
    email varchar(254) NOT NULL,
    status varchar(16) NOT NULL DEFAULT 'subscribed'
        CHECK (status IN ('subscribed', 'unsubscribed')),
    consent_source varchar(64) NOT NULL,
    consented_at timestamptz NOT NULL DEFAULT now(),
    unsubscribed_at timestamptz,
    unsubscribe_token_hash char(64) UNIQUE,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS newsletter_subscriptions_email_unique
    ON public.newsletter_subscriptions (lower(email));

CREATE INDEX IF NOT EXISTS newsletter_subscriptions_status_created_idx
    ON public.newsletter_subscriptions (status, created_at DESC);

ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

COMMIT;
