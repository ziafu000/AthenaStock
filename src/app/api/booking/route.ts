import { after, NextRequest, NextResponse } from "next/server"
import { verifyBookingCaptcha, CaptchaError } from "@/lib/booking/captcha"
import { createBookingRequest, SlotUnavailableError } from "@/lib/booking/database"
import { processEmailQueue } from "@/lib/booking/email-worker"
import { getAdminEmail } from "@/lib/booking/email"
import { assertRateLimit, getClientAddress, RateLimitError } from "@/lib/booking/rate-limit"
import { parseBookingInput, ValidationError } from "@/lib/booking/validation"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as Record<string, unknown>
        const clientAddress = getClientAddress(request)
        await assertRateLimit("booking-ip", clientAddress, 8, 15 * 60)
        await verifyBookingCaptcha(body.captchaToken, clientAddress)

        const input = parseBookingInput(body)
        await assertRateLimit("booking-email", input.email, 4, 60 * 60)
        const adminEmail = getAdminEmail()
        const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin).replace(/\/$/, "")
        const { booking, created } = await createBookingRequest(input, baseUrl, adminEmail)

        after(() => processEmailQueue(5))
        return NextResponse.json({ success: true, bookingId: booking.id, duplicate: !created }, { status: created ? 201 : 200 })
    } catch (error) {
        console.error("Booking request failed:", error)
        if (error instanceof ValidationError || error instanceof CaptchaError) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }
        if (error instanceof RateLimitError) {
            return NextResponse.json(
                { error: error.message },
                { status: 429, headers: { "Retry-After": String(error.retryAfterSeconds) } },
            )
        }
        if (error instanceof SlotUnavailableError) {
            return NextResponse.json({ error: error.message }, { status: 409 })
        }
        return NextResponse.json(
            { error: "Hệ thống đặt lịch đang tạm thời gián đoạn. Vui lòng thử lại sau." },
            { status: 503 },
        )
    }
}
