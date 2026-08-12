import { randomBytes } from "node:crypto"

export interface MeetingDetails {
    provider: string
    location: string
}

export function createMeetingDetails(): MeetingDetails {
    const manual = process.env.BOOKING_MEETING_LOCATION?.trim()
    if (manual) return { provider: "manual", location: manual }

    const provider = (process.env.BOOKING_MEETING_PROVIDER || "jitsi").toLowerCase()
    if (provider !== "jitsi") {
        throw new Error("BOOKING_MEETING_PROVIDER hiện chỉ hỗ trợ jitsi hoặc BOOKING_MEETING_LOCATION thủ công.")
    }
    const base = (process.env.BOOKING_MEETING_URL_BASE || "https://meet.jit.si").replace(/\/$/, "")
    const room = `athena-${randomBytes(18).toString("base64url").toLowerCase()}`
    return { provider, location: `${base}/${room}` }
}
