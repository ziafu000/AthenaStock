BEGIN;

CREATE TABLE IF NOT EXISTS public.booking_rate_limits (
    action varchar(64) NOT NULL,
    key_hash char(64) NOT NULL,
    window_start timestamptz NOT NULL,
    request_count integer NOT NULL DEFAULT 1 CHECK (request_count > 0),
    expires_at timestamptz NOT NULL,
    PRIMARY KEY (action, key_hash, window_start)
);

CREATE INDEX IF NOT EXISTS booking_rate_limits_expiry_idx
    ON public.booking_rate_limits (expires_at);

ALTER TABLE public.booking_rate_limits ENABLE ROW LEVEL SECURITY;

COMMIT;
