import { createHmac } from "node:crypto"
import type { NextRequest } from "next/server"
import { getDatabase } from "./db"

export class RateLimitError extends Error {
    constructor(public readonly retryAfterSeconds: number) {
        super("Bạn thao tác quá nhanh. Vui lòng thử lại sau.")
    }
}

function getSecret() {
    const secret = process.env.BOOKING_SECRET
    if (!secret) throw new Error("Thiếu BOOKING_SECRET.")
    return secret
}

function hashIdentifier(identifier: string) {
    return createHmac("sha256", getSecret()).update(identifier.trim().toLowerCase()).digest("hex")
}

export function getClientAddress(request: NextRequest) {
    return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
        || request.headers.get("x-real-ip")?.trim()
        || "unknown"
}

export async function assertRateLimit(
    action: string,
    identifier: string,
    limit: number,
    windowSeconds: number,
) {
    const safeLimit = Math.max(1, Math.floor(limit))
    const safeWindow = Math.max(60, Math.floor(windowSeconds))
    const keyHash = hashIdentifier(identifier)
    const rows = await getDatabase()`
        INSERT INTO booking_rate_limits (
            action, key_hash, window_start, request_count, expires_at
        ) VALUES (
            ${action}, ${keyHash},
            to_timestamp(floor(extract(epoch from now()) / ${safeWindow}) * ${safeWindow}),
            1,
            to_timestamp(floor(extract(epoch from now()) / ${safeWindow}) * ${safeWindow})
                + (${safeWindow} * interval '1 second')
        )
        ON CONFLICT (action, key_hash, window_start)
        DO UPDATE SET request_count = booking_rate_limits.request_count + 1
        WHERE booking_rate_limits.request_count < ${safeLimit}
        RETURNING expires_at
    `

    if (!rows[0]) throw new RateLimitError(safeWindow)
}
