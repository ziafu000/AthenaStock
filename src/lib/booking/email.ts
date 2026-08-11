import { CreateEmailOptions, Resend } from "resend"

export function getEmailConfig() {
    const apiKey = process.env.RESEND_API_KEY
    const adminEmail = process.env.ADMIN_EMAIL
    const senderEmail = process.env.SENDER_EMAIL
    if (!apiKey || !adminEmail || !senderEmail) {
        throw new Error("Thiếu RESEND_API_KEY, ADMIN_EMAIL hoặc SENDER_EMAIL.")
    }
    return { apiKey, adminEmail, senderEmail }
}

export async function sendBookingEmail(options: CreateEmailOptions, idempotencyKey: string) {
    const { apiKey } = getEmailConfig()
    const result = await new Resend(apiKey).emails.send(options, { idempotencyKey })
    if (result.error) throw new Error(result.error.message)
    return result.data
}
