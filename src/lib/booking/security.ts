import { createHmac, timingSafeEqual } from "node:crypto"
import { BookingAction } from "./types"

interface ActionTokenPayload {
    v: 1
    action: BookingAction
    bookingId: string
    expiresAt: number
}

export class InvalidActionTokenError extends Error {}

function getSecret() {
    const secret = process.env.BOOKING_SECRET
    if (!secret || secret.length < 32) {
        throw new Error("BOOKING_SECRET phải có ít nhất 32 ký tự.")
    }
    return secret
}

function signature(payload: string) {
    return createHmac("sha256", getSecret()).update(payload).digest("base64url")
}

export function createActionToken(action: BookingAction, bookingId: string) {
    const configuredTtl = Number(process.env.BOOKING_ACTION_TTL_HOURS || 72)
    const ttlHours = Number.isFinite(configuredTtl) && configuredTtl > 0 ? Math.min(configuredTtl, 168) : 72
    const payload: ActionTokenPayload = {
        v: 1,
        action,
        bookingId,
        expiresAt: Math.floor(Date.now() / 1000) + ttlHours * 60 * 60,
    }
    const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url")
    return `${encoded}.${signature(encoded)}`
}

export function verifyActionToken(token: string, action: BookingAction, bookingId?: string) {
    if (!token || token.length > 2048) throw new InvalidActionTokenError("Token không hợp lệ.")
    const [encoded, providedSignature, extra] = token.split(".")
    if (!encoded || !providedSignature || extra) throw new InvalidActionTokenError("Token không hợp lệ.")

    const expectedSignature = signature(encoded)
    const providedBuffer = Buffer.from(providedSignature)
    const expectedBuffer = Buffer.from(expectedSignature)
    if (
        providedBuffer.length !== expectedBuffer.length ||
        !timingSafeEqual(providedBuffer, expectedBuffer)
    ) {
        throw new InvalidActionTokenError("Token không hợp lệ.")
    }

    let payload: ActionTokenPayload
    try {
        payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as ActionTokenPayload
    } catch {
        throw new InvalidActionTokenError("Token không hợp lệ.")
    }

    if (
        payload.v !== 1 ||
        payload.action !== action ||
        typeof payload.bookingId !== "string" ||
        !Number.isInteger(payload.expiresAt) ||
        payload.expiresAt <= Math.floor(Date.now() / 1000) ||
        (bookingId && payload.bookingId !== bookingId)
    ) {
        throw new InvalidActionTokenError("Token không hợp lệ hoặc đã hết hạn.")
    }

    return payload
}
