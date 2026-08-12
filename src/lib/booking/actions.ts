import { createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto"
import type { BookingTransaction } from "./db"
import type { BookingAction } from "./types"

export class InvalidActionTokenError extends Error {}

export interface BookingActionRecord {
    id: string
    bookingId: string | null
    purpose: BookingAction
    payload: Record<string, unknown>
    expiresAt: Date
    consumedAt: Date | null
}

function tokenHash(secret: string) {
    return createHash("sha256").update(secret).digest("hex")
}

function splitToken(token: string) {
    if (!token || token.length > 256) throw new InvalidActionTokenError("Liên kết không hợp lệ.")
    const [id, secret, extra] = token.split(".")
    if (!id || !secret || extra || !/^[0-9a-f-]{36}$/i.test(id)) {
        throw new InvalidActionTokenError("Liên kết không hợp lệ.")
    }
    return { id, secret }
}

export async function createBookingAction(
    sql: BookingTransaction,
    purpose: BookingAction,
    bookingId: string | null,
    payload: Record<string, unknown> = {},
    ttlHours?: number,
) {
    const id = randomUUID()
    const secret = randomBytes(32).toString("base64url")
    const configured = Number(process.env.BOOKING_ACTION_TTL_HOURS || 72)
    const hours = ttlHours ?? (Number.isFinite(configured) && configured > 0 ? Math.min(configured, 168) : 72)
    await sql`
        INSERT INTO booking_actions (id, booking_id, purpose, token_hash, payload, expires_at)
        VALUES (${id}, ${bookingId}, ${purpose}, ${tokenHash(secret)}, ${JSON.stringify(payload)}::jsonb, now() + (${hours} * interval '1 hour'))
    `
    return `${id}.${secret}`
}

export async function lockBookingAction(
    sql: BookingTransaction,
    token: string,
    purpose: BookingAction,
    allowConsumed = false,
) {
    const { id, secret } = splitToken(token)
    const rows = await sql`
        SELECT * FROM booking_actions
        WHERE id = ${id} AND purpose = ${purpose}
        FOR UPDATE
    `
    const row = rows[0]
    const provided = Buffer.from(tokenHash(secret))
    const expected = Buffer.from(row ? String(row.token_hash) : "".padEnd(64, "0"))
    if (!row || provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
        throw new InvalidActionTokenError("Liên kết không hợp lệ.")
    }
    if (new Date(String(row.expires_at)).getTime() <= Date.now()) {
        throw new InvalidActionTokenError("Liên kết đã hết hạn.")
    }
    if (row.consumed_at && !allowConsumed) {
        throw new InvalidActionTokenError("Liên kết đã được sử dụng.")
    }
    return {
        id: String(row.id),
        bookingId: row.booking_id ? String(row.booking_id) : null,
        purpose: String(row.purpose) as BookingAction,
        payload: (row.payload || {}) as Record<string, unknown>,
        expiresAt: new Date(String(row.expires_at)),
        consumedAt: row.consumed_at ? new Date(String(row.consumed_at)) : null,
    } satisfies BookingActionRecord
}

export async function consumeBookingAction(sql: BookingTransaction, id: string) {
    await sql`UPDATE booking_actions SET consumed_at = now() WHERE id = ${id} AND consumed_at IS NULL`
}
