import {
    BOOKING_TIME_ZONE,
    BookingInput,
    BookingSuggestion,
    TIME_BLOCKS,
    TimeBlock,
} from "./types"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export class ValidationError extends Error {}

function requiredString(value: unknown, label: string, maxLength: number) {
    if (typeof value !== "string" || !value.trim()) {
        throw new ValidationError(`Vui lòng nhập ${label}.`)
    }

    const normalized = value.trim()
    if (normalized.length > maxLength) {
        throw new ValidationError(`${label} vượt quá độ dài cho phép.`)
    }
    return normalized
}

function optionalString(value: unknown, label: string, maxLength: number) {
    if (value === undefined || value === null || value === "") return null
    return requiredString(value, label, maxLength)
}

function parseDate(value: unknown) {
    const date = requiredString(value, "ngày hẹn", 10)
    if (!DATE_PATTERN.test(date)) throw new ValidationError("Ngày hẹn không hợp lệ.")

    const [year, month, day] = date.split("-").map(Number)
    const parsed = new Date(Date.UTC(year, month - 1, day))
    if (
        parsed.getUTCFullYear() !== year ||
        parsed.getUTCMonth() !== month - 1 ||
        parsed.getUTCDate() !== day
    ) {
        throw new ValidationError("Ngày hẹn không hợp lệ.")
    }

    const today = new Intl.DateTimeFormat("en-CA", {
        timeZone: BOOKING_TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(new Date())

    if (date < today) throw new ValidationError("Ngày hẹn không thể nằm trong quá khứ.")
    return date
}

function parseTimeBlock(value: unknown): TimeBlock {
    const timeBlock = requiredString(value, "khung giờ", 80)
    if (!(timeBlock in TIME_BLOCKS)) throw new ValidationError("Khung giờ không hợp lệ.")
    return timeBlock as TimeBlock
}

function toDateRange(date: string, timeBlock: TimeBlock) {
    const block = TIME_BLOCKS[timeBlock]
    return {
        startAt: new Date(`${date}T${block.start}+07:00`),
        endAt: new Date(`${date}T${block.end}+07:00`),
    }
}

export function parseBookingInput(value: unknown): BookingInput {
    if (!value || typeof value !== "object") throw new ValidationError("Dữ liệu không hợp lệ.")
    const body = value as Record<string, unknown>
    const name = requiredString(body.name, "họ và tên", 120)
    const email = requiredString(body.email, "email", 254).toLowerCase()
    if (!EMAIL_PATTERN.test(email)) throw new ValidationError("Địa chỉ email không hợp lệ.")

    const phone = optionalString(body.phone, "số điện thoại", 30)
    const message = optionalString(body.message, "lời nhắn", 2000)
    const date = parseDate(body.date)
    const timeBlock = parseTimeBlock(body.timeBlock)

    return { name, email, phone, message, date, timeBlock, ...toDateRange(date, timeBlock) }
}

export function parseSuggestions(value: unknown): BookingSuggestion[] {
    if (!Array.isArray(value) || value.length < 1 || value.length > 5) {
        throw new ValidationError("Vui lòng chọn từ 1 đến 5 khung giờ đề xuất.")
    }

    const suggestions = value.map((item) => {
        if (!item || typeof item !== "object") throw new ValidationError("Đề xuất đổi lịch không hợp lệ.")
        const record = item as Record<string, unknown>
        return { date: parseDate(record.date), timeBlock: parseTimeBlock(record.timeBlock) }
    })

    const unique = new Set(suggestions.map((item) => `${item.date}|${item.timeBlock}`))
    if (unique.size !== suggestions.length) throw new ValidationError("Các khung giờ đề xuất không được trùng nhau.")
    return suggestions
}

export function formatBookingDate(date: string) {
    return new Intl.DateTimeFormat("vi-VN", {
        timeZone: BOOKING_TIME_ZONE,
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(new Date(`${date}T12:00:00+07:00`))
}
