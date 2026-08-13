import { randomUUID } from "node:crypto"
import type postgres from "postgres"
import type { BookingTransaction } from "./db"
import { getDatabase } from "./db"
import { createBookingAction, consumeBookingAction, lockBookingAction } from "./actions"
import { createMeetingDetails } from "./meeting"
import { enqueueEmailJob } from "./outbox"
import { parseJsonArray } from "./json"
import { BOOKING_TIME_ZONE, bookingDateRange } from "./policy"
import type { BookingAction, BookingInput, BookingRecord, BookingStatus, BookingSuggestion, TimeBlock } from "./types"

type DatabaseRow = Record<string, unknown>

function asDate(value: unknown) {
    return value instanceof Date ? value : new Date(String(value))
}

function asOptionalDate(value: unknown) {
    return value ? asDate(value) : null
}

function asDateOnly(value: unknown) {
    if (value instanceof Date) return value.toISOString().slice(0, 10)
    const text = String(value)
    return /^\d{4}-\d{2}-\d{2}/.exec(text)?.[0] || asDate(value).toISOString().slice(0, 10)
}

export function mapBooking(row: DatabaseRow): BookingRecord {
    return {
        id: String(row.id),
        customerName: String(row.customer_name),
        customerEmail: String(row.customer_email),
        customerPhone: row.customer_phone ? String(row.customer_phone) : null,
        customerMessage: row.customer_message ? String(row.customer_message) : null,
        bookingDate: asDateOnly(row.booking_date),
        timeBlock: String(row.time_block) as TimeBlock,
        startAt: asDate(row.start_at),
        endAt: asDate(row.end_at),
        timezone: String(row.timezone),
        status: String(row.status) as BookingStatus,
        meetingLocation: row.meeting_location ? String(row.meeting_location) : null,
        meetingProvider: row.meeting_provider ? String(row.meeting_provider) : null,
        rescheduleSuggestions: parseJsonArray<BookingSuggestion>(row.reschedule_suggestions),
        adminNotificationStatus: String(row.admin_notification_status) as BookingRecord["adminNotificationStatus"],
        confirmationEmailStatus: String(row.confirmation_email_status) as BookingRecord["confirmationEmailStatus"],
        rescheduleEmailStatus: String(row.reschedule_email_status) as BookingRecord["rescheduleEmailStatus"],
        confirmedAt: asOptionalDate(row.confirmed_at),
        confirmationEmailSentAt: asOptionalDate(row.confirmation_email_sent_at),
        cancelledAt: asOptionalDate(row.cancelled_at),
        cancelledBy: row.cancelled_by ? String(row.cancelled_by) : null,
        cancellationReason: row.cancellation_reason ? String(row.cancellation_reason) : null,
    }
}

function isUniqueViolation(error: unknown) {
    return typeof error === "object" && error !== null && "code" in error && error.code === "23505"
}

async function lockSlot(sql: BookingTransaction, startAt: Date) {
    await sql`SELECT pg_advisory_xact_lock(hashtextextended(${startAt.toISOString()}, 0))`
}

async function loadBooking(sql: BookingTransaction, id: string, forUpdate = false) {
    const rows = forUpdate
        ? await sql`SELECT * FROM bookings WHERE id = ${id} FOR UPDATE`
        : await sql`SELECT * FROM bookings WHERE id = ${id}`
    return rows[0] ? mapBooking(rows[0]) : null
}

async function slotIsReserved(sql: BookingTransaction, startAt: Date, excludeBookingId?: string) {
    const rows = excludeBookingId
        ? await sql`SELECT 1 FROM bookings WHERE start_at = ${startAt} AND status IN ('confirmed', 'reschedule_requested') AND id <> ${excludeBookingId} LIMIT 1`
        : await sql`SELECT 1 FROM bookings WHERE start_at = ${startAt} AND status IN ('confirmed', 'reschedule_requested') LIMIT 1`
    return Boolean(rows[0])
}

function snapshot(booking: BookingRecord) {
    return {
        id: booking.id,
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        bookingDate: booking.bookingDate,
        timeBlock: booking.timeBlock,
        startAt: booking.startAt.toISOString(),
        endAt: booking.endAt.toISOString(),
        timezone: booking.timezone,
        meetingLocation: booking.meetingLocation,
        meetingProvider: booking.meetingProvider,
    }
}

function cancelTokenLifetime(booking: BookingRecord) {
    const remainingHours = Math.ceil((booking.endAt.getTime() - Date.now()) / 3_600_000)
    return Math.max(24, Math.min(24 * 366, remainingHours + 24))
}

function actionUrl(baseUrl: string, path: string, token: string) {
    return `${baseUrl}${path}?token=${encodeURIComponent(token)}`
}

export class SlotUnavailableError extends Error {}
export class BookingStateError extends Error {}

export async function createBookingRequest(input: BookingInput, baseUrl: string, adminEmail: string) {
    const sql = getDatabase()
    return sql.begin(async (tx) => {
        await lockSlot(tx, input.startAt)
        if (await slotIsReserved(tx, input.startAt)) {
            throw new SlotUnavailableError("Khung giờ này đã được xác nhận. Vui lòng chọn khung giờ khác.")
        }

        const existing = await tx`
            SELECT * FROM bookings
            WHERE lower(customer_email) = lower(${input.email})
              AND start_at = ${input.startAt}
              AND status IN ('pending', 'confirmed')
            LIMIT 1
        `
        if (existing[0]) return { booking: mapBooking(existing[0]), created: false }

        try {
            const rows = await tx`
                INSERT INTO bookings (
                    id, customer_name, customer_email, customer_phone, customer_message,
                    booking_date, time_block, start_at, end_at, timezone
                ) VALUES (
                    ${randomUUID()}, ${input.name}, ${input.email}, ${input.phone}, ${input.message},
                    ${input.date}, ${input.timeBlock}, ${input.startAt}, ${input.endAt}, ${BOOKING_TIME_ZONE}
                ) RETURNING *
            `
            const booking = mapBooking(rows[0])
            const confirmToken = await createBookingAction(tx, "confirm", booking.id)
            const rescheduleToken = await createBookingAction(tx, "admin_reschedule", booking.id)
            await enqueueEmailJob(tx, {
                bookingId: booking.id,
                kind: "admin_booking_request",
                recipient: adminEmail,
                idempotencyKey: `booking-admin-${booking.id}`,
                payload: {
                    confirmUrl: actionUrl(baseUrl, "/api/booking/confirm", confirmToken),
                    rescheduleUrl: actionUrl(baseUrl, "/booking/reschedule", rescheduleToken),
                },
            })
            return { booking, created: true }
        } catch (error) {
            if (isUniqueViolation(error)) {
                throw new SlotUnavailableError("Khung giờ này vừa được người khác đặt. Vui lòng chọn khung giờ khác.")
            }
            throw error
        }
    })
}

export async function getBooking(id: string) {
    const rows = await getDatabase()`SELECT * FROM bookings WHERE id = ${id} LIMIT 1`
    return rows[0] ? mapBooking(rows[0]) : null
}

export async function listBookings(status?: BookingStatus, limit = 100) {
    const safeLimit = Math.max(1, Math.min(limit, 250))
    const rows = status
        ? await getDatabase()`SELECT * FROM bookings WHERE status = ${status} ORDER BY created_at DESC LIMIT ${safeLimit}`
        : await getDatabase()`SELECT * FROM bookings ORDER BY created_at DESC LIMIT ${safeLimit}`
    return rows.map(mapBooking)
}

export async function getUnavailableTimeBlocks(date: string) {
    const rows = await getDatabase()`
        SELECT time_block FROM bookings
        WHERE booking_date = ${date} AND status IN ('confirmed', 'reschedule_requested')
        ORDER BY start_at
    `
    return rows.map((row) => String(row.time_block) as TimeBlock)
}

export async function previewBookingAction(token: string, purpose: BookingAction) {
    return getDatabase().begin(async (tx) => {
        const action = await lockBookingAction(tx, token, purpose)
        if (!action.bookingId) throw new BookingStateError("Liên kết không gắn với lịch hẹn.")
        const booking = await loadBooking(tx, action.bookingId)
        if (!booking) throw new BookingStateError("Không tìm thấy lịch hẹn.")
        return { action, booking }
    })
}

export async function confirmBooking(token: string, baseUrl: string) {
    return getDatabase().begin(async (tx) => {
        const action = await lockBookingAction(tx, token, "confirm")
        if (!action.bookingId) throw new BookingStateError("Không tìm thấy lịch hẹn.")
        const booking = await loadBooking(tx, action.bookingId, true)
        if (!booking) throw new BookingStateError("Không tìm thấy lịch hẹn.")
        if (booking.status !== "pending") throw new BookingStateError("Lịch hẹn không còn chờ xác nhận.")

        await lockSlot(tx, booking.startAt)
        if (await slotIsReserved(tx, booking.startAt, booking.id)) {
            throw new SlotUnavailableError("Khung giờ này đã có một lịch hẹn được xác nhận.")
        }

        const meeting = booking.meetingLocation
            ? { provider: booking.meetingProvider || "manual", location: booking.meetingLocation }
            : createMeetingDetails()
        const rows = await tx`
            UPDATE bookings
            SET status = 'confirmed', confirmed_at = COALESCE(confirmed_at, now()),
                meeting_location = ${meeting.location}, meeting_provider = ${meeting.provider},
                confirmation_email_status = 'pending', updated_at = now()
            WHERE id = ${booking.id}
            RETURNING *
        `
        const confirmed = mapBooking(rows[0])
        const cancelToken = await createBookingAction(tx, "cancel", confirmed.id, {}, cancelTokenLifetime(confirmed))
        await enqueueEmailJob(tx, {
            bookingId: confirmed.id,
            kind: "customer_confirmation",
            recipient: confirmed.customerEmail,
            idempotencyKey: `booking-confirm-${confirmed.id}`,
            payload: { cancelUrl: actionUrl(baseUrl, "/booking/cancel", cancelToken) },
        })
        await consumeBookingAction(tx, action.id)
        return confirmed
    })
}

export async function createRescheduleOffer(token: string, suggestions: BookingSuggestion[], baseUrl: string) {
    return getDatabase().begin(async (tx) => {
        const action = await lockBookingAction(tx, token, "admin_reschedule")
        if (!action.bookingId) throw new BookingStateError("Không tìm thấy lịch hẹn.")
        const booking = await loadBooking(tx, action.bookingId, true)
        if (!booking || !["pending", "confirmed"].includes(booking.status)) {
            throw new BookingStateError("Lịch hẹn không còn có thể đổi lịch.")
        }

        for (const suggestion of [...suggestions].sort((a, b) => `${a.date}${a.timeBlock}`.localeCompare(`${b.date}${b.timeBlock}`))) {
            const { startAt } = bookingDateRange(suggestion.date, suggestion.timeBlock)
            await lockSlot(tx, startAt)
            if (await slotIsReserved(tx, startAt, booking.id)) {
                throw new SlotUnavailableError(`Khung giờ ${suggestion.timeBlock}, ${suggestion.date} đã được xác nhận.`)
            }
        }

        const previous = booking.status === "confirmed" ? snapshot(booking) : null
        const customerToken = await createBookingAction(tx, "customer_reschedule", booking.id, { suggestions, previous })
        await tx`
            UPDATE bookings
            SET status = 'reschedule_requested', reschedule_suggestions = ${tx.json(suggestions as unknown as postgres.JSONValue)},
                reschedule_email_status = 'pending', updated_at = now()
            WHERE id = ${booking.id}
        `
        await enqueueEmailJob(tx, {
            bookingId: booking.id,
            kind: "customer_reschedule_offer",
            recipient: booking.customerEmail,
            idempotencyKey: `booking-reschedule-${action.id}`,
            payload: {
                respondUrl: actionUrl(baseUrl, "/booking/respond", customerToken),
                previous,
                suggestions,
            },
        })
        await consumeBookingAction(tx, action.id)
        return booking
    })
}

export async function acceptReschedule(
    token: string,
    date: string,
    timeBlock: TimeBlock,
    baseUrl: string,
    adminEmail: string,
) {
    return getDatabase().begin(async (tx) => {
        const action = await lockBookingAction(tx, token, "customer_reschedule")
        if (!action.bookingId) throw new BookingStateError("Không tìm thấy lịch hẹn.")
        const suggestions = Array.isArray(action.payload.suggestions)
            ? action.payload.suggestions as BookingSuggestion[]
            : []
        if (!suggestions.some((item) => item.date === date && item.timeBlock === timeBlock)) {
            throw new BookingStateError("Khung giờ đã chọn không thuộc danh sách đề xuất.")
        }
        const booking = await loadBooking(tx, action.bookingId, true)
        if (!booking || booking.status !== "reschedule_requested") {
            throw new BookingStateError("Yêu cầu đổi lịch không còn hiệu lực.")
        }

        const { startAt, endAt } = bookingDateRange(date, timeBlock)
        await lockSlot(tx, startAt)
        if (await slotIsReserved(tx, startAt, booking.id)) {
            throw new SlotUnavailableError("Khung giờ này vừa được xác nhận. Vui lòng chọn đề xuất khác.")
        }
        const meeting = createMeetingDetails()
        const rows = await tx`
            UPDATE bookings
            SET booking_date = ${date}, time_block = ${timeBlock}, start_at = ${startAt}, end_at = ${endAt},
                status = 'confirmed', confirmed_at = now(), meeting_location = ${meeting.location},
                meeting_provider = ${meeting.provider}, reschedule_suggestions = '[]'::jsonb,
                confirmation_email_status = 'pending', updated_at = now()
            WHERE id = ${booking.id}
            RETURNING *
        `
        const updated = mapBooking(rows[0])
        const cancelToken = await createBookingAction(tx, "cancel", updated.id, {}, cancelTokenLifetime(updated))
        const payload = {
            cancelUrl: actionUrl(baseUrl, "/booking/cancel", cancelToken),
            previous: action.payload.previous,
        }
        await enqueueEmailJob(tx, {
            bookingId: updated.id,
            kind: "customer_reschedule_confirmed",
            recipient: updated.customerEmail,
            idempotencyKey: `booking-reschedule-customer-${action.id}`,
            payload,
        })
        await enqueueEmailJob(tx, {
            bookingId: updated.id,
            kind: "admin_reschedule_confirmed",
            recipient: adminEmail,
            idempotencyKey: `booking-reschedule-admin-${action.id}`,
        })
        await consumeBookingAction(tx, action.id)
        return updated
    })
}

async function cancelLockedBooking(
    tx: BookingTransaction,
    booking: BookingRecord,
    cancelledBy: "customer" | "admin",
    reason: string | null,
    adminEmail: string,
    idempotencySuffix: string,
) {
    if (booking.status === "cancelled") return booking
    const previous = snapshot(booking)
    const wasConfirmed = Boolean(booking.confirmedAt)
    const rows = await tx`
        UPDATE bookings
        SET status = 'cancelled', cancelled_at = now(), cancelled_by = ${cancelledBy},
            cancellation_reason = ${reason}, updated_at = now()
        WHERE id = ${booking.id}
        RETURNING *
    `
    const cancelled = mapBooking(rows[0])
    await enqueueEmailJob(tx, {
        bookingId: cancelled.id,
        kind: "customer_cancelled",
        recipient: cancelled.customerEmail,
        idempotencyKey: `booking-cancel-customer-${idempotencySuffix}`,
        payload: { previous, reason, wasConfirmed },
    })
    await enqueueEmailJob(tx, {
        bookingId: cancelled.id,
        kind: "admin_cancelled",
        recipient: adminEmail,
        idempotencyKey: `booking-cancel-admin-${idempotencySuffix}`,
        payload: { previous, reason, cancelledBy, wasConfirmed },
    })
    return cancelled
}

export async function cancelBookingWithToken(token: string, reason: string | null, adminEmail: string) {
    return getDatabase().begin(async (tx) => {
        const action = await lockBookingAction(tx, token, "cancel")
        if (!action.bookingId) throw new BookingStateError("Không tìm thấy lịch hẹn.")
        const booking = await loadBooking(tx, action.bookingId, true)
        if (!booking) throw new BookingStateError("Không tìm thấy lịch hẹn.")
        if (booking.status === "cancelled") throw new BookingStateError("Lịch hẹn đã được hủy trước đó.")
        const cancelled = await cancelLockedBooking(tx, booking, "customer", reason, adminEmail, action.id)
        await consumeBookingAction(tx, action.id)
        return cancelled
    })
}

export async function cancelBookingAsAdmin(id: string, reason: string | null, adminEmail: string) {
    return getDatabase().begin(async (tx) => {
        const booking = await loadBooking(tx, id, true)
        if (!booking) throw new BookingStateError("Không tìm thấy lịch hẹn.")
        return cancelLockedBooking(tx, booking, "admin", reason, adminEmail, `${booking.id}-admin`)
    })
}
