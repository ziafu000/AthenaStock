import type { CreateEmailOptions } from "resend"
import { getBooking } from "./database"
import { getEmailConfig, sendBookingEmail } from "./email"
import { asHttpUrl, escapeHtml } from "./html"
import { createBookingCalendar } from "./ics"
import { claimNextEmailJob, markEmailJobFailed, markEmailJobSent, type EmailJobRecord } from "./outbox"
import type { BookingRecord, BookingSuggestion } from "./types"
import { formatBookingDate } from "./validation"

function layout(content: string) {
    return `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:30px;border:1px solid #eee;border-radius:12px;background:#fff"><h1 style="color:#9c1850;font-family:serif;text-align:center">Athena Stock</h1>${content}</div>`
}

function linkButton(url: unknown, label: string) {
    const safe = typeof url === "string" ? asHttpUrl(url) : null
    return safe ? `<a href="${escapeHtml(safe)}" style="display:inline-block;padding:12px 22px;margin:5px;border-radius:30px;background:#9c1850;color:white;text-decoration:none;font-weight:bold">${escapeHtml(label)}</a>` : ""
}

function meetingHtml(booking: BookingRecord) {
    const url = asHttpUrl(booking.meetingLocation)
    return url
        ? `<a href="${escapeHtml(url)}" style="color:#9c1850;font-weight:bold">${escapeHtml(url)}</a>`
        : escapeHtml(booking.meetingLocation || "Athena Stock sẽ gửi thông tin tham gia qua email.")
}

function attachment(booking: BookingRecord, adminEmail: string, method: "REQUEST" | "CANCEL" = "REQUEST") {
    return {
        filename: `athena-stock-${method === "CANCEL" ? "cancel-" : ""}${booking.bookingDate}.ics`,
        content: Buffer.from(createBookingCalendar(booking, { method, adminEmail }), "utf8"),
        contentType: `text/calendar; charset=utf-8; method=${method}`,
    }
}

function bookingFromSnapshot(value: unknown, current: BookingRecord): BookingRecord | null {
    if (!value || typeof value !== "object") return null
    const row = value as Record<string, unknown>
    if (!row.startAt || !row.endAt || !row.bookingDate || !row.timeBlock) return null
    return {
        ...current,
        id: typeof row.id === "string" ? row.id : current.id,
        customerName: typeof row.customerName === "string" ? row.customerName : current.customerName,
        customerEmail: typeof row.customerEmail === "string" ? row.customerEmail : current.customerEmail,
        bookingDate: String(row.bookingDate),
        timeBlock: String(row.timeBlock) as BookingRecord["timeBlock"],
        startAt: new Date(String(row.startAt)),
        endAt: new Date(String(row.endAt)),
        timezone: typeof row.timezone === "string" ? row.timezone : current.timezone,
        meetingLocation: typeof row.meetingLocation === "string" ? row.meetingLocation : null,
        meetingProvider: typeof row.meetingProvider === "string" ? row.meetingProvider : null,
    }
}

function bookingDetails(booking: BookingRecord) {
    return `<div style="border-left:4px solid #9c1850;padding:16px 20px;background:#fafafa"><p><strong>Thời gian:</strong> ${escapeHtml(booking.timeBlock)}</p><p><strong>Ngày hẹn:</strong> ${escapeHtml(formatBookingDate(booking.bookingDate))}</p><p><strong>Địa điểm/phòng họp:</strong> ${meetingHtml(booking)}</p></div>`
}

function suggestionsHtml(value: unknown) {
    const suggestions = Array.isArray(value) ? value as BookingSuggestion[] : []
    return suggestions.map((item, index) => `<li style="margin-bottom:8px"><strong>Đề xuất ${index + 1}:</strong> ${escapeHtml(item.timeBlock)}, ${escapeHtml(formatBookingDate(item.date))}</li>`).join("")
}

async function buildEmail(job: EmailJobRecord): Promise<CreateEmailOptions> {
    const { adminEmail, senderEmail } = getEmailConfig()
    if (job.kind === "admin_login") {
        return {
            from: senderEmail,
            to: job.recipient,
            subject: "Đăng nhập trang quản trị Athena Stock",
            html: layout(`<p>Nhấn nút dưới đây để đăng nhập. Liên kết chỉ dùng một lần và hết hạn sau 15 phút.</p><p style="text-align:center">${linkButton(job.payload.loginUrl, "Đăng nhập quản trị")}</p>`),
        }
    }

    if (!job.bookingId) throw new Error(`Email job ${job.kind} thiếu booking_id.`)
    const booking = await getBooking(job.bookingId)
    if (!booking) throw new Error(`Không tìm thấy booking ${job.bookingId}.`)

    switch (job.kind) {
        case "admin_booking_request":
            return {
                from: senderEmail,
                to: job.recipient,
                replyTo: booking.customerEmail,
                subject: `[Athena Stock] Yêu cầu lịch hẹn mới từ ${booking.customerName}`,
                html: layout(`<h2>Yêu cầu đặt lịch hẹn mới</h2><p><strong>Họ tên:</strong> ${escapeHtml(booking.customerName)}</p><p><strong>Email:</strong> ${escapeHtml(booking.customerEmail)}</p><p><strong>Số điện thoại:</strong> ${escapeHtml(booking.customerPhone || "Chưa cung cấp")}</p><p><strong>Thời gian:</strong> ${escapeHtml(booking.timeBlock)}, ${escapeHtml(formatBookingDate(booking.bookingDate))}</p><p><strong>Lời nhắn:</strong><br>${escapeHtml(booking.customerMessage || "Không có lời nhắn")}</p><p style="text-align:center">${linkButton(job.payload.confirmUrl, "Xem và phê duyệt")}${linkButton(job.payload.rescheduleUrl, "Đề xuất đổi lịch")}</p>`),
            }
        case "customer_confirmation":
        case "customer_reschedule_confirmed": {
            const previous = bookingFromSnapshot(job.payload.previous, booking)
            const attachments = job.kind === "customer_reschedule_confirmed" && previous
                ? [attachment(previous, adminEmail, "CANCEL"), attachment(booking, adminEmail)]
                : [attachment(booking, adminEmail)]
            return {
                from: senderEmail,
                to: job.recipient,
                replyTo: adminEmail,
                subject: job.kind === "customer_confirmation" ? "Xác nhận lịch hẹn cùng Athena Stock" : "Lịch hẹn mới đã được xác nhận",
                html: layout(`<h3>Chào ${escapeHtml(booking.customerName)},</h3><p>Lịch hẹn của bạn đã được <strong>xác nhận thành công</strong>.</p>${bookingDetails(booking)}<p>File lịch .ics được đính kèm để thêm vào ứng dụng lịch.</p><p style="text-align:center">${linkButton(job.payload.cancelUrl, "Hủy lịch hẹn")}</p>`),
                attachments,
            }
        }
        case "customer_reschedule_offer": {
            return {
                from: senderEmail,
                to: job.recipient,
                replyTo: adminEmail,
                subject: "Đề xuất thay đổi lịch hẹn cùng Athena Stock",
                html: layout(`<h3>Chào ${escapeHtml(booking.customerName)},</h3><p>Athena Stock đề xuất các khung giờ mới:</p><ul style="padding:18px 36px;background:#fafafa;border-left:4px solid #9c1850">${suggestionsHtml(job.payload.suggestions)}</ul><p style="text-align:center">${linkButton(job.payload.respondUrl, "Chọn khung giờ mới")}</p>`),
            }
        }
        case "admin_reschedule_confirmed":
            return {
                from: senderEmail,
                to: job.recipient,
                replyTo: booking.customerEmail,
                subject: `[Athena Stock] ${booking.customerName} đã chọn lịch mới`,
                html: layout(`<p>Khách hàng <strong>${escapeHtml(booking.customerName)}</strong> đã xác nhận lịch mới.</p>${bookingDetails(booking)}`),
            }
        case "customer_cancelled": {
            const previous = bookingFromSnapshot(job.payload.previous, booking) || booking
            return {
                from: senderEmail,
                to: job.recipient,
                replyTo: adminEmail,
                subject: "Lịch hẹn Athena Stock đã được hủy",
                html: layout(`<p>Chào ${escapeHtml(booking.customerName)}, lịch hẹn của bạn đã được hủy.</p><p><strong>Lý do:</strong> ${escapeHtml(typeof job.payload.reason === "string" ? job.payload.reason : "Không có")}</p>`),
                attachments: job.payload.wasConfirmed === true
                    ? [attachment(previous, adminEmail, "CANCEL")]
                    : undefined,
            }
        }
        case "admin_cancelled": {
            const previous = bookingFromSnapshot(job.payload.previous, booking) || booking
            return {
                from: senderEmail,
                to: job.recipient,
                replyTo: booking.customerEmail,
                subject: `[Athena Stock] Lịch hẹn của ${booking.customerName} đã bị hủy`,
                html: layout(`<p>Lịch hẹn của <strong>${escapeHtml(booking.customerName)}</strong> đã bị hủy bởi ${escapeHtml(String(job.payload.cancelledBy || "hệ thống"))}.</p><p><strong>Lý do:</strong> ${escapeHtml(typeof job.payload.reason === "string" ? job.payload.reason : "Không có")}</p>`),
                attachments: job.payload.wasConfirmed === true
                    ? [attachment(previous, adminEmail, "CANCEL")]
                    : undefined,
            }
        }
        default:
            throw new Error(`Loại email job không được hỗ trợ: ${job.kind}`)
    }
}

export async function deliverEmailJob(job: EmailJobRecord) {
    const email = await buildEmail(job)
    return sendBookingEmail(email, job.idempotencyKey)
}

export async function processEmailQueue(maxJobs = 10) {
    const limit = Math.max(1, Math.min(Math.floor(maxJobs), 50))
    let processed = 0
    let sent = 0
    let failed = 0

    while (processed < limit) {
        const job = await claimNextEmailJob()
        if (!job) break
        processed += 1
        try {
            await deliverEmailJob(job)
            await markEmailJobSent(job)
            sent += 1
        } catch (error) {
            console.error(`Booking email job ${job.id} failed:`, error)
            await markEmailJobFailed(job, error)
            failed += 1
        }
    }

    return { processed, sent, failed }
}
