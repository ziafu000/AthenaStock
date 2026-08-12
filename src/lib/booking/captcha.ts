export class CaptchaError extends Error {}

interface TurnstileResponse {
    success?: boolean
    "error-codes"?: string[]
}

export async function verifyBookingCaptcha(token: unknown, remoteIp?: string) {
    const secret = process.env.TURNSTILE_SECRET_KEY
    const disabled = process.env.BOOKING_CAPTCHA_DISABLED === "true"

    if (!secret) {
        if (process.env.NODE_ENV !== "production" && disabled) return
        throw new Error("Thiếu TURNSTILE_SECRET_KEY.")
    }
    if (typeof token !== "string" || !token.trim()) {
        throw new CaptchaError("Vui lòng hoàn tất bước xác minh chống spam.")
    }

    const body = new URLSearchParams({ secret, response: token.trim() })
    if (remoteIp && remoteIp !== "unknown") body.set("remoteip", remoteIp)

    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        body,
        cache: "no-store",
        signal: AbortSignal.timeout(8_000),
    })
    if (!response.ok) throw new Error("Không thể kết nối dịch vụ xác minh chống spam.")
    const result = await response.json() as TurnstileResponse
    if (!result.success) {
        console.warn("Turnstile rejected booking request:", result["error-codes"] || [])
        throw new CaptchaError("Xác minh chống spam không hợp lệ hoặc đã hết hạn.")
    }
}
