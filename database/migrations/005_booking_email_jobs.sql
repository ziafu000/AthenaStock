BEGIN;

CREATE TABLE IF NOT EXISTS public.booking_email_jobs (
    id uuid PRIMARY KEY,
    booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
    kind varchar(64) NOT NULL,
    recipient varchar(254) NOT NULL,
    payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    idempotency_key varchar(180) NOT NULL UNIQUE,
    status varchar(16) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'sending', 'sent', 'failed', 'dead')),
    attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
    max_attempts integer NOT NULL DEFAULT 6 CHECK (max_attempts > 0),
    run_after timestamptz NOT NULL DEFAULT now(),
    claimed_at timestamptz,
    sent_at timestamptz,
    last_error text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS booking_email_jobs_dispatch_idx
    ON public.booking_email_jobs (run_after, created_at)
    WHERE status IN ('pending', 'failed');

ALTER TABLE public.booking_email_jobs ENABLE ROW LEVEL SECURITY;

COMMIT;

