import { after, NextRequest, NextResponse } from "next/server"
import { InvalidActionTokenError } from "@/lib/booking/actions"
import { BookingStateError, confirmBooking, previewBookingAction, SlotUnavailableError } from "@/lib/booking/database"
import { processEmailQueue } from "@/lib/booking/email-worker"
import { escapeHtml } from "@/lib/booking/html"
import { formatBookingDate } from "@/lib/booking/validation"

export const runtime = "nodejs"

function page(title: string, message: string, status = 200, form?: { token: string; name: string; date: string; timeBlock: string }) {
    const formHtml = form ? `
        <div style="margin:24px auto;padding:18px;max-width:420px;border:1px solid #ffffff18;border-radius:16px;background:#ffffff08;text-align:left">
            <p><strong>Khách hàng:</strong> ${escapeHtml(form.name)}</p>
            <p><strong>Thời gian:</strong> ${escapeHtml(form.timeBlock)}, ${escapeHtml(formatBookingDate(form.date))}</p>
        </div>
        <form method="post">
            <input type="hidden" name="token" value="${escapeHtml(form.token)}">
            <button type="submit" style="border:0;border-radius:999px;padding:13px 28px;background:#9c1850;color:white;font-weight:700;cursor:pointer">Xác nhận và gửi email</button>
        </form>` : ""

    return new NextResponse(`<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title></head><body style="font-family:sans-serif;text-align:center;padding:50px 20px;background:#090d16;color:white"><h2 style="font-family:serif;font-size:28px;color:${status >= 400 ? "#e61c5c" : "white"}">${escapeHtml(title)}</h2><p style="color:#a0a5b5;line-height:1.6">${escapeHtml(message)}</p>${formHtml}</body></html>`, {
        status,
        headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
    })
}

async function tokenFromPost(request: NextRequest) {
    const contentType = request.headers.get("content-type") || ""
    if (contentType.includes("application/json")) {
        const body = await request.json() as { token?: unknown }
        return typeof body.token === "string" ? body.token : ""
    }
    const token = (await request.formData()).get("token")
    return typeof token === "string" ? token : ""
}

export async function GET(request: NextRequest) {
    try {
        const token = request.nextUrl.searchParams.get("token") || ""
        const { booking } = await previewBookingAction(token, "confirm")
        if (booking.status !== "pending") return page("Không thể phê duyệt", "Lịch hẹn không còn chờ xác nhận.", 409)
        return page("Phê duyệt lịch hẹn", "Kiểm tra thông tin trước khi xác nhận cho khách hàng.", 200, {
            token,
            name: booking.customerName,
            date: booking.bookingDate,
            timeBlock: booking.timeBlock,
        })
    } catch (error) {
        console.error("Confirmation preview failed:", error)
        const invalidToken = error instanceof InvalidActionTokenError
        const status = invalidToken ? 403 : 503
        return page("Không thể xác thực", invalidToken ? error.message : "Hệ thống đang tạm thời gián đoạn.", status)
    }
}

export async function POST(request: NextRequest) {
    try {
        const token = await tokenFromPost(request)
        const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin).replace(/\/$/, "")
        await confirmBooking(token, baseUrl)
        after(() => processEmailQueue(5))
        return page("Phê duyệt thành công", "Lịch hẹn đã được xác nhận. Email kèm file .ics đang được gửi cho khách hàng.")
    } catch (error) {
        console.error("Booking confirmation failed:", error)
        if (error instanceof SlotUnavailableError) return page("Khung giờ đã được xác nhận", error.message, 409)
        if (error instanceof InvalidActionTokenError) return page("Không thể phê duyệt", error.message, 403)
        if (error instanceof BookingStateError) return page("Không thể phê duyệt", error.message, 409)
        return page("Không thể phê duyệt", "Hệ thống đang tạm thời gián đoạn. Vui lòng thử lại.", 503)
    }
}
