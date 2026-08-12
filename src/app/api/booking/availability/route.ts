import { NextRequest, NextResponse } from "next/server"
import { getUnavailableTimeBlocks } from "@/lib/booking/database"
import { TIME_BLOCKS } from "@/lib/booking/policy"
import { parseBookingDate, ValidationError } from "@/lib/booking/validation"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
    try {
        const date = parseBookingDate(request.nextUrl.searchParams.get("date"))
        const unavailable = await getUnavailableTimeBlocks(date)
        return NextResponse.json({
            date,
            timeBlocks: Object.keys(TIME_BLOCKS),
            unavailable,
        }, { headers: { "Cache-Control": "no-store" } })
    } catch (error) {
        if (error instanceof ValidationError) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }
        console.error("Booking availability failed:", error)
        return NextResponse.json({ error: "Không thể tải lịch trống." }, { status: 503 })
    }
}
