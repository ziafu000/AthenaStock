BEGIN;

ALTER TABLE public.bookings
    ADD COLUMN IF NOT EXISTS meeting_provider varchar(32),
    ADD COLUMN IF NOT EXISTS cancelled_at timestamptz,
    ADD COLUMN IF NOT EXISTS cancelled_by varchar(32),
    ADD COLUMN IF NOT EXISTS cancellation_reason text;

CREATE TABLE IF NOT EXISTS public.booking_actions (
    id uuid PRIMARY KEY,
    booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE,
    purpose varchar(32) NOT NULL CHECK (purpose IN (
        'confirm', 'admin_reschedule', 'customer_reschedule', 'cancel', 'admin_login'
    )),
    token_hash char(64) NOT NULL,
    payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    expires_at timestamptz NOT NULL,
    consumed_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS booking_actions_token_hash_idx
    ON public.booking_actions (token_hash);
CREATE INDEX IF NOT EXISTS booking_actions_booking_idx
    ON public.booking_actions (booking_id, purpose, created_at DESC);
CREATE INDEX IF NOT EXISTS booking_actions_expiry_idx
    ON public.booking_actions (expires_at)
    WHERE consumed_at IS NULL;

ALTER TABLE public.booking_actions ENABLE ROW LEVEL SECURITY;

COMMIT;

