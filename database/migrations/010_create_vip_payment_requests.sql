BEGIN;

CREATE TABLE IF NOT EXISTS public.vip_payment_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    package_id varchar(32) NOT NULL,
    package_months integer NOT NULL CHECK (package_months > 0),
    amount bigint NOT NULL CHECK (amount >= 0),
    transfer_code varchar(64) NOT NULL,
    bank_info jsonb NOT NULL DEFAULT '{}'::jsonb,
    status varchar(32) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'approved', 'rejected', 'more_info_needed')),
    proof_image_data text,
    notes text,
    created_at timestamptz NOT NULL DEFAULT now(),
    approved_at timestamptz,
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS vip_payment_requests_transfer_code_idx
    ON public.vip_payment_requests (transfer_code);

CREATE INDEX IF NOT EXISTS vip_payment_requests_member_idx
    ON public.vip_payment_requests (member_id, created_at DESC);

CREATE INDEX IF NOT EXISTS vip_payment_requests_status_idx
    ON public.vip_payment_requests (status, created_at DESC);

ALTER TABLE public.vip_payment_requests ENABLE ROW LEVEL SECURITY;

COMMIT;
