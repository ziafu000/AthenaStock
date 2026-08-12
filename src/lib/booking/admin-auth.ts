import { createHmac, timingSafeEqual } from "node:crypto"
import type { NextRequest } from "next/server"
import type { BookingTransaction } from "./db"
import { getDatabase } from "./db"
import { createBookingAction, consumeBookingAction, InvalidActionTokenError, lockBookingAction } from "./actions"
import { enqueueEmailJob } from "./outbox"

export const ADMIN_SESSION_COOKIE = "athena_admin_session"

interface AdminSessionPayload {
    version: 1
    email: string
    expiresAt: number
}

function secret() {
    const value = process.env.ADMIN_SESSION_SECRET
    if (!value) throw new Error("Thiếu ADMIN_SESSION_SECRET.")
    return value
}

function signature(payload: string) {
    return createHmac("sha256", secret()).update(payload).digest("base64url")
}

export function createAdminSession(email: string) {
    const payload: AdminSessionPayload = {
        version: 1,
        email: email.toLowerCase(),
        expiresAt: Date.now() + 12 * 60 * 60 * 1000,
    }
    const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url")
    return `${encoded}.${signature(encoded)}`
}

export function verifyAdminSession(value: string | undefined) {
    if (!value) return false
    const [encoded, supplied, extra] = value.split(".")
    if (!encoded || !supplied || extra) return false
    const expected = signature(encoded)
    const expectedBuffer = Buffer.from(expected)
    const suppliedBuffer = Buffer.from(supplied)
    if (expectedBuffer.length !== suppliedBuffer.length || !timingSafeEqual(expectedBuffer, suppliedBuffer)) return false

    try {
        const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as AdminSessionPayload
        return payload.version === 1
            && payload.expiresAt > Date.now()
            && payload.email === process.env.ADMIN_EMAIL?.trim().toLowerCase()
    } catch {
        return false
    }
}

export function isAdminRequest(request: NextRequest) {
    return verifyAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value)
}

function actionUrl(baseUrl: string, token: string) {
    return `${baseUrl}/api/admin/auth/verify?token=${encodeURIComponent(token)}`
}

export async function requestAdminLogin(email: string, baseUrl: string, adminEmail: string) {
    if (email.trim().toLowerCase() !== adminEmail.trim().toLowerCase()) return false
    await getDatabase().begin(async (tx: BookingTransaction) => {
        const token = await createBookingAction(tx, "admin_login", null, { email: adminEmail.toLowerCase() }, 0.25)
        await enqueueEmailJob(tx, {
            kind: "admin_login",
            recipient: adminEmail,
            idempotencyKey: `admin-login-${token.split(".")[0]}`,
            payload: { loginUrl: actionUrl(baseUrl, token) },
        })
    })
    return true
}

export async function consumeAdminLogin(token: string, adminEmail: string) {
    return getDatabase().begin(async (tx: BookingTransaction) => {
        const action = await lockBookingAction(tx, token, "admin_login")
        const email = typeof action.payload.email === "string" ? action.payload.email.toLowerCase() : ""
        if (!email || email !== adminEmail.trim().toLowerCase()) {
            throw new InvalidActionTokenError("Liên kết đăng nhập không hợp lệ.")
        }
        await consumeBookingAction(tx, action.id)
        return createAdminSession(email)
    })
}
