BEGIN;

DROP INDEX IF EXISTS public.bookings_confirmed_start_at_idx;

CREATE UNIQUE INDEX IF NOT EXISTS bookings_reserved_start_at_idx
    ON public.bookings (start_at)
    WHERE status IN ('confirmed', 'reschedule_requested');

COMMIT;
