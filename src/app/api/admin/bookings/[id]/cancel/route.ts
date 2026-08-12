import { after, NextRequest, NextResponse } from "next/server"
import { isAdminRequest } from "@/lib/booking/admin-auth"
import { BookingStateError, cancelBookingAsAdmin } from "@/lib/booking/database"
import { getAdminEmail } from "@/lib/booking/email"
import { processEmailQueue } from "@/lib/booking/email-worker"
import { parseCancellationReason, ValidationError } from "@/lib/booking/validation"

export const runtime = "nodejs"

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    if (!isAdminRequest(request)) return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 })
    try {
        const { id } = await context.params
        const body = await request.json() as Record<string, unknown>
        const reason = parseCancellationReason(body.reason)
        const adminEmail = getAdminEmail()
        const booking = await cancelBookingAsAdmin(id, reason, adminEmail)
        after(() => processEmailQueue(5))
        return NextResponse.json({ success: true, bookingId: booking.id })
    } catch (error) {
        console.error("Admin booking cancellation failed:", error)
        if (error instanceof ValidationError) return NextResponse.json({ error: error.message }, { status: 400 })
        if (error instanceof BookingStateError) return NextResponse.json({ error: error.message }, { status: 409 })
        return NextResponse.json({ error: "Không thể hủy lịch hẹn." }, { status: 503 })
    }
}
