import {
    BOOKING_TIME_ZONE,
    bookingDateRange,
    isBookableDate,
    isValidDateOnly,
    minimumBookingDate,
    TIME_BLOCKS,
    TimeBlock,
} from "./policy"
import type { BookingInput, BookingSuggestion } from "./types"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

export function parseBookingDate(value: unknown) {
    const date = requiredString(value, "ngày hẹn", 10)
    if (!isValidDateOnly(date)) throw new ValidationError("Ngày hẹn không hợp lệ.")
    if (!isBookableDate(date)) {
        throw new ValidationError(`Ngày hẹn sớm nhất là ${minimumBookingDate()}.`)
    }
    return date
}

export function parseTimeBlock(value: unknown): TimeBlock {
    const timeBlock = requiredString(value, "khung giờ", 80)
    if (!(timeBlock in TIME_BLOCKS)) throw new ValidationError("Khung giờ không hợp lệ.")
    return timeBlock as TimeBlock
}

export function parseBookingInput(value: unknown): BookingInput {
    if (!value || typeof value !== "object") throw new ValidationError("Dữ liệu không hợp lệ.")
    const body = value as Record<string, unknown>
    const name = requiredString(body.name, "họ và tên", 120)
    const email = requiredString(body.email, "email", 254).toLowerCase()
    if (!EMAIL_PATTERN.test(email)) throw new ValidationError("Địa chỉ email không hợp lệ.")

    const phone = optionalString(body.phone, "số điện thoại", 30)
    const message = optionalString(body.message, "lời nhắn", 2000)
    const date = parseBookingDate(body.date)
    const timeBlock = parseTimeBlock(body.timeBlock)

    return { name, email, phone, message, date, timeBlock, ...bookingDateRange(date, timeBlock) }
}

export function parseSuggestions(value: unknown): BookingSuggestion[] {
    if (!Array.isArray(value) || value.length < 1 || value.length > 5) {
        throw new ValidationError("Vui lòng chọn từ 1 đến 5 khung giờ đề xuất.")
    }

    const suggestions = value.map((item) => {
        if (!item || typeof item !== "object") throw new ValidationError("Đề xuất đổi lịch không hợp lệ.")
        const record = item as Record<string, unknown>
        return { date: parseBookingDate(record.date), timeBlock: parseTimeBlock(record.timeBlock) }
    })

    const unique = new Set(suggestions.map((item) => `${item.date}|${item.timeBlock}`))
    if (unique.size !== suggestions.length) throw new ValidationError("Các khung giờ đề xuất không được trùng nhau.")
    return suggestions
}

export function parseCancellationReason(value: unknown) {
    return optionalString(value, "lý do hủy lịch", 500)
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
