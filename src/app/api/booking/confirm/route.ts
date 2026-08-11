import { NextRequest, NextResponse } from "next/server"
import { claimConfirmation, finishConfirmation, getBooking } from "@/lib/booking/database"
import { getEmailConfig, sendBookingEmail } from "@/lib/booking/email"
import { asHttpUrl, escapeHtml } from "@/lib/booking/html"
import { createBookingCalendar } from "@/lib/booking/ics"
import { InvalidActionTokenError, verifyActionToken } from "@/lib/booking/security"
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
        </form>
    ` : ""

    return new NextResponse(`<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title></head>
        <body style="font-family:sans-serif;text-align:center;padding:50px 20px;background:#090d16;color:white">
            <h2 style="font-family:serif;font-size:28px;color:${status >= 400 ? "#e61c5c" : "white"}">${escapeHtml(title)}</h2>
            <p style="color:#a0a5b5;line-height:1.6">${escapeHtml(message)}</p>${formHtml}
        </body></html>`, {
        status,
        headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
    })
}

async function tokenFromPost(req: NextRequest) {
    const contentType = req.headers.get("content-type") || ""
    if (contentType.includes("application/json")) {
        const body = await req.json() as { token?: unknown }
        return typeof body.token === "string" ? body.token : ""
    }
    const form = await req.formData()
    const token = form.get("token")
    return typeof token === "string" ? token : ""
}

export async function GET(req: NextRequest) {
    try {
        const token = req.nextUrl.searchParams.get("token") || ""
        const payload = verifyActionToken(token, "confirm")
        const booking = await getBooking(payload.bookingId)
        if (!booking) return page("Không tìm thấy lịch hẹn", "Lịch hẹn không tồn tại.", 404)
        if (booking.confirmationEmailStatus === "sent") {
            return page("Lịch hẹn đã được xác nhận", "Email xác nhận đã được gửi trước đó.")
        }
        if (booking.status !== "pending" && booking.status !== "confirmed") {
            return page("Không thể phê duyệt", "Lịch hẹn này đã chuyển sang trạng thái khác.", 409)
        }

        return page("Phê duyệt lịch hẹn", "Kiểm tra thông tin trước khi gửi xác nhận cho khách hàng.", 200, {
            token,
            name: booking.customerName,
            date: booking.bookingDate,
            timeBlock: booking.timeBlock,
        })
    } catch (error) {
        console.error("Confirmation preview failed:", error)
        const status = error instanceof InvalidActionTokenError ? 403 : 503
        return page("Không thể xác thực", status === 403 ? "Liên kết không hợp lệ hoặc đã hết hạn." : "Hệ thống đang tạm thời gián đoạn.", status)
    }
}

export async function POST(req: NextRequest) {
    let bookingId = ""
    try {
        const token = await tokenFromPost(req)
        const payload = verifyActionToken(token, "confirm")
        bookingId = payload.bookingId
        const booking = await claimConfirmation(bookingId)
        if (!booking) {
            const current = await getBooking(bookingId)
            if (current?.confirmationEmailStatus === "sent") {
                return page("Lịch hẹn đã được xác nhận", "Email xác nhận đã được gửi trước đó.")
            }
            return page("Không thể phê duyệt", "Yêu cầu đang được xử lý hoặc không còn hợp lệ.", 409)
        }

        const { adminEmail, senderEmail } = getEmailConfig()
        const formattedDate = formatBookingDate(booking.bookingDate)
        const meetingUrl = asHttpUrl(booking.meetingLocation)
        const locationHtml = meetingUrl
            ? `<a href="${escapeHtml(meetingUrl)}" style="color:#e61c5c;font-weight:bold">${escapeHtml(meetingUrl)}</a>`
            : escapeHtml(booking.meetingLocation || "Athena Stock sẽ gửi thông tin tham gia qua email.")
        const calendar = createBookingCalendar(booking, { adminEmail })

        await sendBookingEmail({
            from: senderEmail,
            to: booking.customerEmail,
            replyTo: adminEmail,
            subject: "Xác nhận lịch hẹn trao đổi cùng Athena Stock",
            html: `
                <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:30px;border:1px solid #eee;border-radius:12px;background:#fff">
                    <h1 style="color:#9c1850;font-family:serif;text-align:center">Athena Stock</h1>
                    <h3>Chào ${escapeHtml(booking.customerName)},</h3>
                    <p>Yêu cầu đặt lịch của bạn đã được <strong>xác nhận thành công</strong>.</p>
                    <div style="border-left:4px solid #9c1850;padding:16px 20px;background:#fafafa">
                        <p><strong>Thời gian:</strong> ${escapeHtml(booking.timeBlock)}</p>
                        <p><strong>Ngày hẹn:</strong> ${escapeHtml(formattedDate)}</p>
                        <p><strong>Địa điểm/phòng họp:</strong> ${locationHtml}</p>
                    </div>
                    <p>File lịch <strong>.ics</strong> đã được đính kèm để bạn thêm vào ứng dụng lịch đang sử dụng.</p>
                    <p style="font-size:13px;color:#666">Nếu cần thay đổi, vui lòng trả lời email này.</p>
                </div>
            `,
            attachments: [{
                filename: `athena-stock-${booking.bookingDate}.ics`,
                content: Buffer.from(calendar, "utf8"),
                contentType: "text/calendar; charset=utf-8; method=REQUEST",
            }],
        }, `booking-confirm-${booking.id}`)
        await finishConfirmation(bookingId, true)
        return page("Phê duyệt thành công", "Email xác nhận kèm file .ics đã được gửi cho khách hàng.")
    } catch (error) {
        console.error("Booking confirmation failed:", error)
        if (bookingId) await finishConfirmation(bookingId, false).catch(console.error)
        const status = error instanceof InvalidActionTokenError ? 403 : 502
        return page("Không thể phê duyệt", status === 403 ? "Liên kết không hợp lệ hoặc đã hết hạn." : "Email chưa gửi được. Bạn có thể thử lại bằng liên kết cũ.", status)
    }
}
