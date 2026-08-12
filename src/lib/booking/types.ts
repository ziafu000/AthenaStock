import type { TimeBlock } from "./policy"

export { BOOKING_TIME_ZONE, TIME_BLOCKS } from "./policy"
export type { TimeBlock } from "./policy"

export type BookingAction = "confirm" | "admin_reschedule" | "customer_reschedule" | "cancel" | "admin_login"
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
    meetingProvider: string | null
    rescheduleSuggestions: BookingSuggestion[]
    adminNotificationStatus: DeliveryStatus
    confirmationEmailStatus: DeliveryStatus
    rescheduleEmailStatus: DeliveryStatus
    confirmedAt: Date | null
    confirmationEmailSentAt: Date | null
    cancelledAt: Date | null
    cancelledBy: string | null
    cancellationReason: string | null
}
