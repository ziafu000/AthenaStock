import { after, NextRequest, NextResponse } from "next/server"
import { InvalidActionTokenError } from "@/lib/booking/actions"
import { BookingStateError, cancelBookingWithToken, previewBookingAction } from "@/lib/booking/database"
import { getAdminEmail } from "@/lib/booking/email"
import { processEmailQueue } from "@/lib/booking/email-worker"
import { assertRateLimit, getClientAddress, RateLimitError } from "@/lib/booking/rate-limit"
import { parseCancellationReason, ValidationError } from "@/lib/booking/validation"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
    try {
        const token = request.nextUrl.searchParams.get("token") || ""
        const { booking } = await previewBookingAction(token, "cancel")
        return NextResponse.json({
            name: booking.customerName,
            date: booking.bookingDate,
            timeBlock: booking.timeBlock,
            status: booking.status,
        }, { headers: { "Cache-Control": "no-store" } })
    } catch (error) {
        console.error("Booking cancellation details failed:", error)
        if (error instanceof InvalidActionTokenError) {
            return NextResponse.json({ error: error.message }, { status: 403 })
        }
        return NextResponse.json({ error: "Không thể tải thông tin lịch hẹn." }, { status: 503 })
    }
}

export async function POST(request: NextRequest) {
    try {
        await assertRateLimit("customer_cancel", getClientAddress(request), 12, 15 * 60)
        const body = await request.json() as Record<string, unknown>
        const token = typeof body.token === "string" ? body.token : ""
        const reason = parseCancellationReason(body.reason)
        const adminEmail = getAdminEmail()
        const booking = await cancelBookingWithToken(token, reason, adminEmail)
        after(() => processEmailQueue(5))
        return NextResponse.json({ success: true, bookingId: booking.id })
    } catch (error) {
        console.error("Booking cancellation failed:", error)
        if (error instanceof ValidationError) return NextResponse.json({ error: error.message }, { status: 400 })
        if (error instanceof InvalidActionTokenError) return NextResponse.json({ error: error.message }, { status: 403 })
        if (error instanceof RateLimitError) {
            return NextResponse.json({ error: error.message }, {
                status: 429,
                headers: { "Retry-After": String(error.retryAfterSeconds) },
            })
        }
        if (error instanceof BookingStateError) return NextResponse.json({ error: error.message }, { status: 409 })
        return NextResponse.json({ error: "Không thể hủy lịch hẹn. Vui lòng thử lại." }, { status: 503 })
    }
}
