export const BOOKING_TIME_ZONE = "Asia/Ho_Chi_Minh"

export const TIME_BLOCKS = {
    "09:00 - 10:00 (Sáng)": { start: "09:00:00", end: "10:00:00" },
    "10:00 - 11:00 (Sáng)": { start: "10:00:00", end: "11:00:00" },
    "14:00 - 15:00 (Chiều)": { start: "14:00:00", end: "15:00:00" },
    "15:00 - 16:00 (Chiều)": { start: "15:00:00", end: "16:00:00" },
    "16:00 - 17:00 (Chiều)": { start: "16:00:00", end: "17:00:00" },
    "19:30 - 20:30 (Tối)": { start: "19:30:00", end: "20:30:00" },
} as const

export type TimeBlock = keyof typeof TIME_BLOCKS

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export function dateInBookingTimeZone(date = new Date()) {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: BOOKING_TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(date)
}

export function addCalendarDays(date: string, days: number) {
    const [year, month, day] = date.split("-").map(Number)
    const next = new Date(Date.UTC(year, month - 1, day + days))
    return next.toISOString().slice(0, 10)
}

export function minimumBookingDate(now = new Date()) {
    return addCalendarDays(dateInBookingTimeZone(now), 1)
}

export function isValidDateOnly(date: string) {
    if (!DATE_PATTERN.test(date)) return false
    const [year, month, day] = date.split("-").map(Number)
    const parsed = new Date(Date.UTC(year, month - 1, day))
    return parsed.getUTCFullYear() === year
        && parsed.getUTCMonth() === month - 1
        && parsed.getUTCDate() === day
}

export function isBookableDate(date: string, now = new Date()) {
    return isValidDateOnly(date) && date >= minimumBookingDate(now)
}

export function bookingDateRange(date: string, timeBlock: TimeBlock) {
    const block = TIME_BLOCKS[timeBlock]
    return {
        startAt: new Date(`${date}T${block.start}+07:00`),
        endAt: new Date(`${date}T${block.end}+07:00`),
    }
}

