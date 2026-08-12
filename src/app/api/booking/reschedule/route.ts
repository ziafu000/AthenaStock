import { after, NextRequest, NextResponse } from "next/server"
import { InvalidActionTokenError } from "@/lib/booking/actions"
import { BookingStateError, createRescheduleOffer, previewBookingAction, SlotUnavailableError } from "@/lib/booking/database"
import { processEmailQueue } from "@/lib/booking/email-worker"
import { parseSuggestions, ValidationError } from "@/lib/booking/validation"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
    try {
        const token = request.nextUrl.searchParams.get("token") || ""
        const { booking } = await previewBookingAction(token, "admin_reschedule")
        if (!["pending", "confirmed"].includes(booking.status)) {
            return NextResponse.json({ error: "Lịch hẹn không còn khả dụng." }, { status: 409 })
        }
        return NextResponse.json({
            name: booking.customerName,
            email: booking.customerEmail,
            date: booking.bookingDate,
            timeBlock: booking.timeBlock,
        }, { headers: { "Cache-Control": "no-store" } })
    } catch (error) {
        console.error("Reschedule details failed:", error)
        const invalidToken = error instanceof InvalidActionTokenError
        const status = invalidToken ? 403 : 503
        return NextResponse.json({ error: invalidToken ? error.message : "Hệ thống đang tạm thời gián đoạn." }, { status })
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as Record<string, unknown>
        const token = typeof body.token === "string" ? body.token : ""
        const suggestions = parseSuggestions(body.suggestions)
        const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin).replace(/\/$/, "")
        await createRescheduleOffer(token, suggestions, baseUrl)
        after(() => processEmailQueue(5))
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Booking reschedule failed:", error)
        if (error instanceof ValidationError) return NextResponse.json({ error: error.message }, { status: 400 })
        if (error instanceof InvalidActionTokenError) return NextResponse.json({ error: error.message }, { status: 403 })
        if (error instanceof SlotUnavailableError || error instanceof BookingStateError) {
            return NextResponse.json({ error: error.message }, { status: 409 })
        }
        return NextResponse.json({ error: "Không thể gửi đề xuất đổi lịch. Vui lòng thử lại." }, { status: 503 })
    }
}
