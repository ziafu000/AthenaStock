import { after, NextRequest, NextResponse } from "next/server"
import { InvalidActionTokenError } from "@/lib/booking/actions"
import {
    acceptReschedule,
    BookingStateError,
    getUnavailableTimeBlocks,
    previewBookingAction,
    SlotUnavailableError,
} from "@/lib/booking/database"
import { getAdminEmail } from "@/lib/booking/email"
import { processEmailQueue } from "@/lib/booking/email-worker"
import { assertRateLimit, getClientAddress, RateLimitError } from "@/lib/booking/rate-limit"
import { parseBookingDate, parseTimeBlock, ValidationError } from "@/lib/booking/validation"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
    try {
        const token = request.nextUrl.searchParams.get("token") || ""
        const { action, booking } = await previewBookingAction(token, "customer_reschedule")
        if (booking.status !== "reschedule_requested") {
            return NextResponse.json({ error: "Yêu cầu đổi lịch không còn hiệu lực." }, { status: 409 })
        }
        const suggestions = Array.isArray(action.payload.suggestions) ? action.payload.suggestions : []
        const unavailableByDate = Object.fromEntries(await Promise.all(
            [...new Set(suggestions.map((item) => String((item as { date?: unknown }).date || "")))]
                .filter(Boolean)
                .map(async (date) => [date, await getUnavailableTimeBlocks(date)]),
        ))

        return NextResponse.json({
            name: booking.customerName,
            current: { date: booking.bookingDate, timeBlock: booking.timeBlock },
            suggestions,
            unavailableByDate,
        }, { headers: { "Cache-Control": "no-store" } })
    } catch (error) {
        console.error("Reschedule response details failed:", error)
        if (error instanceof InvalidActionTokenError) {
            return NextResponse.json({ error: error.message }, { status: 403 })
        }
        return NextResponse.json({ error: "Không thể tải đề xuất đổi lịch." }, { status: 503 })
    }
}

export async function POST(request: NextRequest) {
    try {
        await assertRateLimit("customer_reschedule", getClientAddress(request), 12, 15 * 60)
        const body = await request.json() as Record<string, unknown>
        const token = typeof body.token === "string" ? body.token : ""
        const date = parseBookingDate(body.date)
        const timeBlock = parseTimeBlock(body.timeBlock)
        const adminEmail = getAdminEmail()
        const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin).replace(/\/$/, "")
        const booking = await acceptReschedule(token, date, timeBlock, baseUrl, adminEmail)
        after(() => processEmailQueue(5))
        return NextResponse.json({ success: true, bookingId: booking.id })
    } catch (error) {
        console.error("Reschedule response failed:", error)
        if (error instanceof ValidationError) return NextResponse.json({ error: error.message }, { status: 400 })
        if (error instanceof InvalidActionTokenError) return NextResponse.json({ error: error.message }, { status: 403 })
        if (error instanceof RateLimitError) {
            return NextResponse.json({ error: error.message }, {
                status: 429,
                headers: { "Retry-After": String(error.retryAfterSeconds) },
            })
        }
        if (error instanceof SlotUnavailableError || error instanceof BookingStateError) {
            return NextResponse.json({ error: error.message }, { status: 409 })
        }
        return NextResponse.json({ error: "Không thể xác nhận lịch mới. Vui lòng thử lại." }, { status: 503 })
    }
}
