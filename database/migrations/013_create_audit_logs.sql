BEGIN;

CREATE TABLE IF NOT EXISTS public.membership_audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_type varchar(32) NOT NULL CHECK (actor_type IN ('admin', 'member', 'system')),
    actor_id varchar(128) NOT NULL,
    action varchar(64) NOT NULL,
    target_type varchar(64) NOT NULL,
    target_id varchar(128) NOT NULL,
    details jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS membership_audit_logs_actor_idx
    ON public.membership_audit_logs (actor_type, actor_id, created_at DESC);

CREATE INDEX IF NOT EXISTS membership_audit_logs_target_idx
    ON public.membership_audit_logs (target_type, target_id, created_at DESC);

ALTER TABLE public.membership_audit_logs ENABLE ROW LEVEL SECURITY;

COMMIT;
