import { Resend, type CreateEmailOptions } from "resend"

export function getAdminEmail() {
    const adminEmail = process.env.ADMIN_EMAIL
    if (!adminEmail) throw new Error("Thiếu ADMIN_EMAIL.")
    return adminEmail
}

export function getEmailConfig() {
    const apiKey = process.env.RESEND_API_KEY
    const adminEmail = getAdminEmail()
    const senderEmail = process.env.SENDER_EMAIL
    if (!apiKey || !senderEmail) {
        throw new Error("Thiếu RESEND_API_KEY hoặc SENDER_EMAIL.")
    }
    return { apiKey, adminEmail, senderEmail }
}

export async function sendBookingEmail(options: CreateEmailOptions, idempotencyKey: string) {
    const { apiKey } = getEmailConfig()
    const result = await new Resend(apiKey).emails.send(options, { idempotencyKey })
    if (result.error) throw new Error(result.error.message)
    return result.data
}
