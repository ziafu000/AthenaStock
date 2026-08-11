BEGIN;

CREATE UNIQUE INDEX IF NOT EXISTS bookings_customer_active_start_at_idx
    ON bookings (lower(customer_email), start_at)
    WHERE status IN ('pending', 'confirmed');

CREATE UNIQUE INDEX IF NOT EXISTS bookings_confirmed_start_at_idx
    ON bookings (start_at)
    WHERE status = 'confirmed';

DROP INDEX IF EXISTS public.bookings_active_start_at_idx;

COMMIT;
