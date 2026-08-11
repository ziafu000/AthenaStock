import { BookingRecord } from "./types"

function escapeIcs(value: string) {
    return value
        .replaceAll("\\", "\\\\")
        .replaceAll("\r\n", "\\n")
        .replaceAll("\n", "\\n")
        .replaceAll(",", "\\,")
        .replaceAll(";", "\\;")
}

function formatUtc(date: Date) {
    return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")
}

function foldLine(line: string) {
    const parts: string[] = []
    let current = ""
    for (const character of line) {
        const prefixBytes = parts.length > 0 ? 1 : 0
        if (Buffer.byteLength(current + character, "utf8") + prefixBytes > 75) {
            parts.push(current)
            current = character
        } else {
            current += character
        }
    }
    parts.push(current)
    return parts.map((part, index) => index === 0 ? part : ` ${part}`).join("\r\n")
}

interface CalendarOptions {
    method?: "REQUEST" | "CANCEL"
    adminEmail: string
}

export function createBookingCalendar(booking: BookingRecord, options: CalendarOptions) {
    const method = options.method || "REQUEST"
    const cancelled = method === "CANCEL"
    const location = booking.meetingLocation || "Thông tin tham gia sẽ được gửi qua email"
    const lines = [
        "BEGIN:VCALENDAR",
        "PRODID:-//Athena Stock//Booking//VI",
        "VERSION:2.0",
        "CALSCALE:GREGORIAN",
        `METHOD:${method}`,
        "BEGIN:VEVENT",
        `UID:${booking.id}@athenastock.com`,
        `DTSTAMP:${formatUtc(new Date())}`,
        `DTSTART:${formatUtc(booking.startAt)}`,
        `DTEND:${formatUtc(booking.endAt)}`,
        `SEQUENCE:${cancelled ? 1 : 0}`,
        `STATUS:${cancelled ? "CANCELLED" : "CONFIRMED"}`,
        `SUMMARY:${escapeIcs("Trao đổi cùng Athena Stock")}`,
        `DESCRIPTION:${escapeIcs(cancelled ? "Lịch hẹn này cần được thay đổi. Vui lòng xem email từ Athena Stock." : "Lịch hẹn đã được Athena Stock xác nhận.")}`,
        `LOCATION:${escapeIcs(location)}`,
        `ORGANIZER;CN=${escapeIcs("Athena Stock")}:mailto:${options.adminEmail}`,
        `ATTENDEE;CN=${escapeIcs(booking.customerName)};RSVP=TRUE:mailto:${booking.customerEmail}`,
        "END:VEVENT",
        "END:VCALENDAR",
    ]
    return lines.map(foldLine).join("\r\n") + "\r\n"
}
