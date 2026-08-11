CREATE TABLE IF NOT EXISTS bookings (
    id uuid PRIMARY KEY,
    customer_name varchar(120) NOT NULL,
    customer_email varchar(254) NOT NULL,
    customer_phone varchar(30),
    customer_message text,
    booking_date date NOT NULL,
    time_block varchar(80) NOT NULL,
    start_at timestamptz NOT NULL,
    end_at timestamptz NOT NULL,
    timezone varchar(64) NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
    status varchar(32) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'confirmed', 'reschedule_requested', 'cancelled')),
    meeting_location text,
    reschedule_suggestions jsonb NOT NULL DEFAULT '[]'::jsonb,
    admin_notification_status varchar(16) NOT NULL DEFAULT 'pending'
        CHECK (admin_notification_status IN ('pending', 'sending', 'sent', 'failed')),
    confirmation_email_status varchar(16) NOT NULL DEFAULT 'pending'
        CHECK (confirmation_email_status IN ('pending', 'sending', 'sent', 'failed')),
    reschedule_email_status varchar(16) NOT NULL DEFAULT 'pending'
        CHECK (reschedule_email_status IN ('pending', 'sending', 'sent', 'failed')),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    confirmed_at timestamptz,
    admin_notified_at timestamptz,
    confirmation_email_sent_at timestamptz,
    reschedule_email_sent_at timestamptz,
    CHECK (end_at > start_at)
);

CREATE UNIQUE INDEX IF NOT EXISTS bookings_confirmed_start_at_idx
    ON bookings (start_at)
    WHERE status = 'confirmed';

CREATE UNIQUE INDEX IF NOT EXISTS bookings_customer_active_start_at_idx
    ON bookings (lower(customer_email), start_at)
    WHERE status IN ('pending', 'confirmed');

CREATE INDEX IF NOT EXISTS bookings_customer_email_idx ON bookings (lower(customer_email));
CREATE INDEX IF NOT EXISTS bookings_status_idx ON bookings (status);
