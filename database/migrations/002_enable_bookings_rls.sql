-- Supabase exposes tables in the public schema through its Data API.
-- No policy is created: browsers using anon/authenticated keys cannot read or
-- mutate booking PII. The Next.js server continues to use DATABASE_URL.
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
