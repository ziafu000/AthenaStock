BEGIN;

CREATE TABLE IF NOT EXISTS public.watchlists (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    ticker varchar(16) NOT NULL,
    status varchar(40) NOT NULL DEFAULT 'Đang theo dõi'
        CHECK (status IN ('Đang theo dõi', 'Chờ thêm dữ liệu', 'Đang cập nhật', 'Đã hoàn tất nghiên cứu', 'Tạm dừng theo dõi')),
    notes text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS watchlists_member_ticker_idx
    ON public.watchlists (member_id, upper(ticker));

CREATE INDEX IF NOT EXISTS watchlists_member_idx
    ON public.watchlists (member_id, updated_at DESC);

ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;

COMMIT;
