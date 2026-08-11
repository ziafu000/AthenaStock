import postgres from "postgres"
import { randomUUID } from "node:crypto"
import { BookingInput, BookingRecord, BookingSuggestion } from "./types"

type DatabaseRow = Record<string, unknown>

const globalForDatabase = globalThis as typeof globalThis & {
    bookingSql?: ReturnType<typeof postgres>
}

function getSql() {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) throw new Error("Thiếu DATABASE_URL.")

    if (!globalForDatabase.bookingSql) {
        globalForDatabase.bookingSql = postgres(connectionString, {
            max: process.env.NODE_ENV === "production" ? 5 : 2,
            idle_timeout: 20,
            connect_timeout: 10,
            // Supabase Transaction Pooler (port 6543) does not support
            // session-level prepared statements.
            prepare: false,
        })
    }
    return globalForDatabase.bookingSql
}

function asDate(value: unknown) {
    return value instanceof Date ? value : new Date(String(value))
}

function asOptionalDate(value: unknown) {
    return value ? asDate(value) : null
}

function asDateOnly(value: unknown) {
    if (value instanceof Date) return value.toISOString().slice(0, 10)

    const text = String(value)
    const dateOnly = /^\d{4}-\d{2}-\d{2}/.exec(text)
    return dateOnly ? dateOnly[0] : asDate(value).toISOString().slice(0, 10)
}

function mapBooking(row: DatabaseRow): BookingRecord {
    return {
        id: String(row.id),
        customerName: String(row.customer_name),
        customerEmail: String(row.customer_email),
        customerPhone: row.customer_phone ? String(row.customer_phone) : null,
        customerMessage: row.customer_message ? String(row.customer_message) : null,
        bookingDate: asDateOnly(row.booking_date),
        timeBlock: String(row.time_block) as BookingRecord["timeBlock"],
        startAt: asDate(row.start_at),
        endAt: asDate(row.end_at),
        timezone: String(row.timezone),
        status: String(row.status) as BookingRecord["status"],
        meetingLocation: row.meeting_location ? String(row.meeting_location) : null,
        rescheduleSuggestions: Array.isArray(row.reschedule_suggestions)
            ? row.reschedule_suggestions as BookingSuggestion[]
            : [],
        adminNotificationStatus: String(row.admin_notification_status) as BookingRecord["adminNotificationStatus"],
        confirmationEmailStatus: String(row.confirmation_email_status) as BookingRecord["confirmationEmailStatus"],
        rescheduleEmailStatus: String(row.reschedule_email_status) as BookingRecord["rescheduleEmailStatus"],
        confirmationEmailSentAt: asOptionalDate(row.confirmation_email_sent_at),
    }
}

export class SlotUnavailableError extends Error {}

export async function createOrGetBooking(input: BookingInput) {
    const sql = getSql()
    const id = randomUUID()
    const meetingLocation = process.env.BOOKING_MEETING_LOCATION || null
    const rows = await sql`
        INSERT INTO bookings (
            id, customer_name, customer_email, customer_phone, customer_message,
            booking_date, time_block, start_at, end_at, timezone, meeting_location
        ) VALUES (
            ${id}, ${input.name}, ${input.email}, ${input.phone}, ${input.message},
            ${input.date}, ${input.timeBlock}, ${input.startAt}, ${input.endAt},
            'Asia/Ho_Chi_Minh', ${meetingLocation}
        )
        ON CONFLICT (start_at) WHERE status IN ('pending', 'confirmed') DO NOTHING
        RETURNING *
    `

    if (rows[0]) return { booking: mapBooking(rows[0]), created: true }

    const existing = await sql`
        SELECT * FROM bookings
        WHERE start_at = ${input.startAt}
          AND status IN ('pending', 'confirmed')
        LIMIT 1
    `
    if (!existing[0] || String(existing[0].customer_email).toLowerCase() !== input.email.toLowerCase()) {
        throw new SlotUnavailableError("Khung giờ này vừa được người khác đăng ký. Vui lòng chọn khung giờ khác.")
    }

    return { booking: mapBooking(existing[0]), created: false }
}

export async function getBooking(id: string) {
    const rows = await getSql()`SELECT * FROM bookings WHERE id = ${id} LIMIT 1`
    return rows[0] ? mapBooking(rows[0]) : null
}

export async function claimAdminNotification(id: string) {
    const rows = await getSql()`
        UPDATE bookings
        SET admin_notification_status = 'sending', updated_at = now()
        WHERE id = ${id}
          AND (
              admin_notification_status IN ('pending', 'failed')
              OR (admin_notification_status = 'sending' AND updated_at < now() - interval '10 minutes')
          )
        RETURNING *
    `
    return rows[0] ? mapBooking(rows[0]) : null
}

export async function finishAdminNotification(id: string, sent: boolean) {
    await getSql()`
        UPDATE bookings
        SET admin_notification_status = ${sent ? "sent" : "failed"},
            admin_notified_at = CASE WHEN ${sent} THEN now() ELSE admin_notified_at END,
            updated_at = now()
        WHERE id = ${id}
    `
}

export async function claimConfirmation(id: string) {
    const rows = await getSql()`
        UPDATE bookings
        SET confirmation_email_status = 'sending',
            meeting_location = COALESCE(${process.env.BOOKING_MEETING_LOCATION || null}, meeting_location),
            updated_at = now()
        WHERE id = ${id}
          AND status IN ('pending', 'confirmed')
          AND (
              confirmation_email_status IN ('pending', 'failed')
              OR (confirmation_email_status = 'sending' AND updated_at < now() - interval '10 minutes')
          )
        RETURNING *
    `
    return rows[0] ? mapBooking(rows[0]) : null
}

export async function finishConfirmation(id: string, sent: boolean) {
    await getSql()`
        UPDATE bookings
        SET confirmation_email_status = ${sent ? "sent" : "failed"},
            status = CASE WHEN ${sent} THEN 'confirmed' ELSE status END,
            confirmed_at = CASE WHEN ${sent} THEN now() ELSE confirmed_at END,
            confirmation_email_sent_at = CASE WHEN ${sent} THEN now() ELSE confirmation_email_sent_at END,
            updated_at = now()
        WHERE id = ${id}
    `
}

export async function claimReschedule(id: string, suggestions: BookingSuggestion[]) {
    const sql = getSql()
    const rows = await sql`
        UPDATE bookings
        SET reschedule_email_status = 'sending',
            reschedule_suggestions = ${sql.json(suggestions.map(({ date, timeBlock }) => ({ date, timeBlock })))},
            updated_at = now()
        WHERE id = ${id}
          AND status IN ('pending', 'confirmed')
          AND (
              reschedule_email_status IN ('pending', 'failed')
              OR (reschedule_email_status = 'sending' AND updated_at < now() - interval '10 minutes')
          )
        RETURNING *
    `
    return rows[0] ? mapBooking(rows[0]) : null
}

export async function finishReschedule(id: string, sent: boolean) {
    await getSql()`
        UPDATE bookings
        SET reschedule_email_status = ${sent ? "sent" : "failed"},
            status = CASE WHEN ${sent} THEN 'reschedule_requested' ELSE status END,
            reschedule_email_sent_at = CASE WHEN ${sent} THEN now() ELSE reschedule_email_sent_at END,
            updated_at = now()
        WHERE id = ${id}
    `
}
