import { randomUUID } from "node:crypto"
import { getDatabase } from "./db"
import type { BookingTransaction } from "./db"

export interface EmailJobInput {
    bookingId?: string | null
    kind: string
    recipient: string
    payload?: Record<string, unknown>
    idempotencyKey: string
}

export async function enqueueEmailJob(sql: BookingTransaction, input: EmailJobInput) {
    await sql`
        INSERT INTO booking_email_jobs (
            id, booking_id, kind, recipient, payload, idempotency_key
        ) VALUES (
            ${randomUUID()}, ${input.bookingId || null}, ${input.kind}, ${input.recipient},
            ${JSON.stringify(input.payload || {})}::jsonb, ${input.idempotencyKey}
        )
        ON CONFLICT (idempotency_key) DO NOTHING
    `
}

export interface EmailJobRecord {
    id: string
    bookingId: string | null
    kind: string
    recipient: string
    payload: Record<string, unknown>
    idempotencyKey: string
    attempts: number
    maxAttempts: number
}

export async function claimNextEmailJob() {
    return getDatabase().begin(async (tx) => {
        await tx`
            UPDATE booking_email_jobs
            SET status = 'dead', updated_at = now()
            WHERE status IN ('pending', 'failed', 'sending') AND attempts >= max_attempts
        `
        const rows = await tx`
            SELECT * FROM booking_email_jobs
            WHERE attempts < max_attempts AND (
                (status IN ('pending', 'failed') AND run_after <= now()) OR
                (status = 'sending' AND claimed_at < now() - interval '10 minutes')
            )
            ORDER BY run_after, created_at
            FOR UPDATE SKIP LOCKED
            LIMIT 1
        `
        if (!rows[0]) return null
        const updated = await tx`
            UPDATE booking_email_jobs
            SET status = 'sending', attempts = attempts + 1, claimed_at = now(),
                updated_at = now(), last_error = NULL
            WHERE id = ${rows[0].id}
            RETURNING *
        `
        const row = updated[0]
        return {
            id: String(row.id),
            bookingId: row.booking_id ? String(row.booking_id) : null,
            kind: String(row.kind),
            recipient: String(row.recipient),
            payload: (row.payload || {}) as Record<string, unknown>,
            idempotencyKey: String(row.idempotency_key),
            attempts: Number(row.attempts),
            maxAttempts: Number(row.max_attempts),
        } satisfies EmailJobRecord
    })
}

export async function markEmailJobSent(job: EmailJobRecord) {
    const sql = getDatabase()
    await sql.begin(async (tx) => {
        await tx`
            UPDATE booking_email_jobs
            SET status = 'sent', sent_at = now(), updated_at = now()
            WHERE id = ${job.id}
        `
        if (!job.bookingId) return
        if (job.kind === "admin_booking_request") {
            await tx`
                UPDATE bookings SET admin_notification_status = 'sent', admin_notified_at = now(), updated_at = now()
                WHERE id = ${job.bookingId}
            `
        } else if (["customer_confirmation", "customer_reschedule_confirmed"].includes(job.kind)) {
            await tx`
                UPDATE bookings SET confirmation_email_status = 'sent', confirmation_email_sent_at = now(), updated_at = now()
                WHERE id = ${job.bookingId}
            `
        } else if (job.kind === "customer_reschedule_offer") {
            await tx`
                UPDATE bookings SET reschedule_email_status = 'sent', reschedule_email_sent_at = now(), updated_at = now()
                WHERE id = ${job.bookingId}
            `
        }
    })
}

export async function markEmailJobFailed(job: EmailJobRecord, error: unknown) {
    const sql = getDatabase()
    const dead = job.attempts >= job.maxAttempts
    const delayMinutes = Math.min(60, 2 ** Math.max(0, job.attempts - 1))
    const message = error instanceof Error ? error.message.slice(0, 2000) : String(error).slice(0, 2000)
    await sql.begin(async (tx) => {
        await tx`
            UPDATE booking_email_jobs
            SET status = ${dead ? "dead" : "failed"}, last_error = ${message},
                run_after = now() + (${delayMinutes} * interval '1 minute'), updated_at = now()
            WHERE id = ${job.id}
        `
        if (!job.bookingId) return
        if (job.kind === "admin_booking_request") {
            await tx`UPDATE bookings SET admin_notification_status = 'failed', updated_at = now() WHERE id = ${job.bookingId}`
        } else if (["customer_confirmation", "customer_reschedule_confirmed"].includes(job.kind)) {
            await tx`UPDATE bookings SET confirmation_email_status = 'failed', updated_at = now() WHERE id = ${job.bookingId}`
        } else if (job.kind === "customer_reschedule_offer") {
            await tx`UPDATE bookings SET reschedule_email_status = 'failed', updated_at = now() WHERE id = ${job.bookingId}`
        }
    })
}
