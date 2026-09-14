BEGIN;

CREATE TABLE IF NOT EXISTS public.portfolio_holdings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    ticker varchar(16) NOT NULL,
    shares numeric(15, 2) NOT NULL CHECK (shares > 0),
    cost_basis numeric(15, 2) NOT NULL CHECK (cost_basis >= 0),
    notes text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS portfolio_holdings_member_ticker_idx
    ON public.portfolio_holdings (member_id, upper(ticker));

CREATE INDEX IF NOT EXISTS portfolio_holdings_member_idx
    ON public.portfolio_holdings (member_id, updated_at DESC);

ALTER TABLE public.portfolio_holdings ENABLE ROW LEVEL SECURITY;

COMMIT;
