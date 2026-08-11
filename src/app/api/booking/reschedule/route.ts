import { NextRequest, NextResponse } from "next/server"
import { claimReschedule, finishReschedule, getBooking } from "@/lib/booking/database"
import { getEmailConfig, sendBookingEmail } from "@/lib/booking/email"
import { escapeHtml } from "@/lib/booking/html"
import { createBookingCalendar } from "@/lib/booking/ics"
import { InvalidActionTokenError, verifyActionToken } from "@/lib/booking/security"
import { formatBookingDate, parseSuggestions, ValidationError } from "@/lib/booking/validation"

export const runtime = "nodejs"

export async function GET(req: NextRequest) {
    try {
        const id = req.nextUrl.searchParams.get("id") || ""
        const token = req.nextUrl.searchParams.get("token") || ""
        verifyActionToken(token, "reschedule", id)
        const booking = await getBooking(id)
        if (!booking || !["pending", "confirmed"].includes(booking.status)) {
            return NextResponse.json({ error: "Lịch hẹn không còn khả dụng." }, { status: 404 })
        }
        return NextResponse.json({
            name: booking.customerName,
            email: booking.customerEmail,
            date: booking.bookingDate,
            timeBlock: booking.timeBlock,
        }, { headers: { "Cache-Control": "no-store" } })
    } catch (error) {
        console.error("Reschedule details failed:", error)
        const status = error instanceof InvalidActionTokenError ? 403 : 503
        return NextResponse.json({ error: status === 403 ? "Liên kết không hợp lệ hoặc đã hết hạn." : "Hệ thống đang tạm thời gián đoạn." }, { status })
    }
}

export async function POST(req: NextRequest) {
    let bookingId = ""
    let claimed = false
    try {
        const body = await req.json() as Record<string, unknown>
        const requestedBookingId = typeof body.id === "string" ? body.id : ""
        const token = typeof body.token === "string" ? body.token : ""
        const tokenPayload = verifyActionToken(token, "reschedule", requestedBookingId)
        bookingId = tokenPayload.bookingId
        const suggestions = parseSuggestions(body.suggestions)
        const booking = await claimReschedule(bookingId, suggestions)
        if (!booking) {
            return NextResponse.json({ error: "Yêu cầu đang được xử lý hoặc không còn hợp lệ." }, { status: 409 })
        }
        claimed = true

        const { adminEmail, senderEmail } = getEmailConfig()
        const suggestionHtml = suggestions.map((suggestion, index) => `
            <li style="margin-bottom:8px"><strong>Đề xuất ${index + 1}:</strong> ${escapeHtml(suggestion.timeBlock)}, ${escapeHtml(formatBookingDate(suggestion.date))}</li>
        `).join("")
        const attachments = booking.confirmationEmailSentAt ? [{
            filename: `athena-stock-cancel-${booking.bookingDate}.ics`,
            content: Buffer.from(createBookingCalendar(booking, { method: "CANCEL", adminEmail }), "utf8"),
            contentType: "text/calendar; charset=utf-8; method=CANCEL",
        }] : undefined

        await sendBookingEmail({
            from: senderEmail,
            to: booking.customerEmail,
            replyTo: adminEmail,
            subject: "Đề xuất thay đổi lịch hẹn cùng Athena Stock",
            html: `
                <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:30px;border:1px solid #eee;border-radius:12px;background:#fff">
                    <h1 style="color:#9c1850;font-family:serif;text-align:center">Athena Stock</h1>
                    <h3>Chào ${escapeHtml(booking.customerName)},</h3>
                    <p>Khung giờ <strong>${escapeHtml(booking.timeBlock)}, ${escapeHtml(formatBookingDate(booking.bookingDate))}</strong> chưa phù hợp. Chúng tôi xin đề xuất:</p>
                    <ul style="padding:18px 36px;background:#fafafa;border-left:4px solid #9c1850">${suggestionHtml}</ul>
                    <p>Vui lòng trả lời email này và cho biết lựa chọn phù hợp với bạn.</p>
                    ${attachments ? "<p>File .ics hủy lịch cũ được đính kèm để đồng bộ ứng dụng lịch của bạn.</p>" : ""}
                </div>
            `,
            attachments,
        }, `booking-reschedule-${booking.id}`)
        await finishReschedule(bookingId, true)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Booking reschedule failed:", error)
        if (claimed) await finishReschedule(bookingId, false).catch(console.error)
        if (error instanceof ValidationError || error instanceof InvalidActionTokenError) {
            return NextResponse.json({ error: error.message }, { status: error instanceof ValidationError ? 400 : 403 })
        }
        return NextResponse.json({ error: "Email chưa gửi được. Vui lòng thử lại." }, { status: 502 })
    }
}
