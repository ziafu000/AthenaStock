import { NextRequest, NextResponse } from "next/server"
import {
    claimAdminNotification,
    createOrGetBooking,
    finishAdminNotification,
    SlotUnavailableError,
} from "@/lib/booking/database"
import { getEmailConfig, sendBookingEmail } from "@/lib/booking/email"
import { escapeHtml } from "@/lib/booking/html"
import { createActionToken } from "@/lib/booking/security"
import { formatBookingDate, parseBookingInput, ValidationError } from "@/lib/booking/validation"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
    try {
        const input = parseBookingInput(await req.json())
        const { adminEmail, senderEmail } = getEmailConfig()
        const { booking, created } = await createOrGetBooking(input)
        const claimed = await claimAdminNotification(booking.id)

        if (!claimed) {
            return NextResponse.json({ success: true, bookingId: booking.id, duplicate: !created })
        }

        try {
            const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin).replace(/\/$/, "")
            const confirmToken = createActionToken("confirm", claimed.id)
            const rescheduleToken = createActionToken("reschedule", claimed.id)
            const approveUrl = `${baseUrl}/api/booking/confirm?token=${encodeURIComponent(confirmToken)}`
            const rescheduleUrl = `${baseUrl}/booking/reschedule?id=${encodeURIComponent(claimed.id)}&token=${encodeURIComponent(rescheduleToken)}`

            await sendBookingEmail({
                from: senderEmail,
                to: adminEmail,
                replyTo: claimed.customerEmail,
                subject: `[Athena Stock] Yêu cầu lịch hẹn mới từ ${claimed.customerName}`,
                html: `
                    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #eee;border-radius:12px;background:#fafafa">
                        <h2 style="color:#9c1850;font-family:serif;border-bottom:2px solid #9c1850;padding-bottom:10px">Yêu cầu đặt lịch hẹn mới</h2>
                        <p><strong>Họ tên:</strong> ${escapeHtml(claimed.customerName)}</p>
                        <p><strong>Email:</strong> <a href="mailto:${escapeHtml(claimed.customerEmail)}">${escapeHtml(claimed.customerEmail)}</a></p>
                        <p><strong>Số điện thoại:</strong> ${escapeHtml(claimed.customerPhone || "Chưa cung cấp")}</p>
                        <p><strong>Thời gian:</strong> ${escapeHtml(claimed.timeBlock)}, ${escapeHtml(formatBookingDate(claimed.bookingDate))}</p>
                        <p><strong>Lời nhắn:</strong><br>${escapeHtml(claimed.customerMessage || "Không có lời nhắn")}</p>
                        <div style="margin-top:28px;text-align:center">
                            <a href="${escapeHtml(approveUrl)}" style="display:inline-block;padding:12px 22px;margin:5px;border-radius:30px;background:#9c1850;color:white;text-decoration:none;font-weight:bold">Xem và phê duyệt</a>
                            <a href="${escapeHtml(rescheduleUrl)}" style="display:inline-block;padding:12px 22px;margin:5px;border-radius:30px;background:#555;color:white;text-decoration:none;font-weight:bold">Đề xuất đổi lịch</a>
                        </div>
                        <p style="margin-top:20px;font-size:12px;color:#777">Các liên kết bảo mật sẽ tự hết hạn.</p>
                    </div>
                `,
            }, `booking-admin-${claimed.id}`)
            await finishAdminNotification(claimed.id, true)
        } catch (error) {
            await finishAdminNotification(claimed.id, false)
            throw error
        }

        return NextResponse.json({ success: true, bookingId: booking.id, duplicate: !created })
    } catch (error) {
        console.error("Booking request failed:", error)
        if (error instanceof ValidationError) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }
        if (error instanceof SlotUnavailableError) {
            return NextResponse.json({ error: error.message }, { status: 409 })
        }
        return NextResponse.json(
            { error: "Hệ thống đặt lịch đang tạm thời gián đoạn. Vui lòng thử lại sau." },
            { status: 503 }
        )
    }
}
