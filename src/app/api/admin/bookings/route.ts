import { NextRequest, NextResponse } from "next/server"
import { isAdminRequest } from "@/lib/booking/admin-auth"
import { listBookings } from "@/lib/booking/database"
import type { BookingStatus } from "@/lib/booking/types"

export const runtime = "nodejs"

const BOOKING_STATUSES = new Set<BookingStatus>(["pending", "confirmed", "reschedule_requested", "cancelled"])

export async function GET(request: NextRequest) {
    if (!isAdminRequest(request)) return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 })
    try {
        const rawStatus = request.nextUrl.searchParams.get("status")
        const status = rawStatus && BOOKING_STATUSES.has(rawStatus as BookingStatus)
            ? rawStatus as BookingStatus
            : undefined
        const bookings = await listBookings(status)
        return NextResponse.json({ bookings }, { headers: { "Cache-Control": "no-store" } })
    } catch (error) {
        console.error("Admin booking list failed:", error)
        return NextResponse.json({ error: "Không thể tải danh sách lịch hẹn." }, { status: 503 })
    }
}
