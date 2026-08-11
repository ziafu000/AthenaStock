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
export type BookingAction = "confirm" | "reschedule"
export type BookingStatus = "pending" | "confirmed" | "reschedule_requested" | "cancelled"
export type DeliveryStatus = "pending" | "sending" | "sent" | "failed"

export interface BookingInput {
    name: string
    email: string
    phone: string | null
    date: string
    timeBlock: TimeBlock
    message: string | null
    startAt: Date
    endAt: Date
}

export interface BookingSuggestion {
    date: string
    timeBlock: TimeBlock
}

export interface BookingRecord {
    id: string
    customerName: string
    customerEmail: string
    customerPhone: string | null
    customerMessage: string | null
    bookingDate: string
    timeBlock: TimeBlock
    startAt: Date
    endAt: Date
    timezone: string
    status: BookingStatus
    meetingLocation: string | null
    rescheduleSuggestions: BookingSuggestion[]
    adminNotificationStatus: DeliveryStatus
    confirmationEmailStatus: DeliveryStatus
    rescheduleEmailStatus: DeliveryStatus
    confirmationEmailSentAt: Date | null
}
