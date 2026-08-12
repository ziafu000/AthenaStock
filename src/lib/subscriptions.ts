import { createHash, randomBytes, randomUUID } from "node:crypto"
import { getDatabase, type BookingTransaction } from "./booking/db"
import { enqueueEmailJob } from "./booking/outbox"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/

export class SubscriptionValidationError extends Error {}
export class InvalidUnsubscribeTokenError extends Error {}

export function parseSubscriptionEmail(value: unknown) {
    if (typeof value !== "string") throw new SubscriptionValidationError("Vui lòng nhập địa chỉ email hợp lệ.")
    const email = value.trim().toLowerCase()
    if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
        throw new SubscriptionValidationError("Vui lòng nhập địa chỉ email hợp lệ.")
    }
    return email
}

function parseToken(value: unknown) {
    if (typeof value !== "string" || !TOKEN_PATTERN.test(value)) {
        throw new InvalidUnsubscribeTokenError("Liên kết hủy đăng ký không hợp lệ.")
    }
    return value
}

function hashToken(token: string) {
    return createHash("sha256").update(token).digest("hex")
}

function createToken() {
    return randomBytes(32).toString("base64url")
}

function unsubscribeUrl(baseUrl: string, token: string) {
    return `${baseUrl}/api/subscribe/unsubscribe?token=${encodeURIComponent(token)}`
}

export async function registerSubscription(email: string, baseUrl: string, adminEmail: string) {
    return getDatabase().begin(async (tx: BookingTransaction) => {
        await tx`SELECT pg_advisory_xact_lock(hashtext(${`newsletter:${email}`}))`
        const rows = await tx`
            SELECT id, status FROM newsletter_subscriptions
            WHERE lower(email) = ${email}
            FOR UPDATE
        `

        if (rows[0]?.status === "subscribed") return { created: false }

        const id = rows[0]?.id ? String(rows[0].id) : randomUUID()
        const token = createToken()
        const tokenHash = hashToken(token)

        if (rows[0]) {
            await tx`
                UPDATE newsletter_subscriptions
                SET status = 'subscribed', consent_source = 'article_related_form',
                    consented_at = now(), unsubscribed_at = NULL,
                    unsubscribe_token_hash = ${tokenHash}, updated_at = now()
                WHERE id = ${id}
            `
        } else {
            await tx`
                INSERT INTO newsletter_subscriptions (
                    id, email, status, consent_source, unsubscribe_token_hash
                ) VALUES (
                    ${id}, ${email}, 'subscribed', 'article_related_form', ${tokenHash}
                )
            `
        }

        const eventId = randomUUID()
        await enqueueEmailJob(tx, {
            kind: "newsletter_welcome",
            recipient: email,
            idempotencyKey: `newsletter-welcome-${eventId}`,
            payload: { homeUrl: baseUrl, unsubscribeUrl: unsubscribeUrl(baseUrl, token) },
        })
        await enqueueEmailJob(tx, {
            kind: "newsletter_admin",
            recipient: adminEmail,
            idempotencyKey: `newsletter-admin-${eventId}`,
            payload: { subscriberEmail: email },
        })

        return { created: true }
    })
}

export async function previewUnsubscribe(value: unknown) {
    const token = parseToken(value)
    const rows = await getDatabase()`
        SELECT email FROM newsletter_subscriptions
        WHERE unsubscribe_token_hash = ${hashToken(token)} AND status = 'subscribed'
        LIMIT 1
    `
    if (!rows[0]) throw new InvalidUnsubscribeTokenError("Liên kết hủy đăng ký không hợp lệ hoặc đã được sử dụng.")
    return { email: String(rows[0].email) }
}

export async function unsubscribe(value: unknown) {
    const token = parseToken(value)
    return getDatabase().begin(async (tx: BookingTransaction) => {
        const rows = await tx`
            SELECT id, email FROM newsletter_subscriptions
            WHERE unsubscribe_token_hash = ${hashToken(token)} AND status = 'subscribed'
            FOR UPDATE
        `
        if (!rows[0]) throw new InvalidUnsubscribeTokenError("Liên kết hủy đăng ký không hợp lệ hoặc đã được sử dụng.")
        await tx`
            UPDATE newsletter_subscriptions
            SET status = 'unsubscribed', unsubscribed_at = now(),
                unsubscribe_token_hash = NULL, updated_at = now()
            WHERE id = ${rows[0].id}
        `
        return { email: String(rows[0].email) }
    })
}
