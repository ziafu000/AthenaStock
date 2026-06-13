import { NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"
import { Resend } from "resend"

const timeBlockMap: Record<string, { start: string; end: string }> = {
    "09:00 - 10:00 (Sáng)": { start: "09:00:00", end: "10:00:00" },
    "10:00 - 11:00 (Sáng)": { start: "10:00:00", end: "11:00:00" },
    "14:00 - 15:00 (Chiều)": { start: "14:00:00", end: "15:00:00" },
    "15:00 - 16:00 (Chiều)": { start: "15:00:00", end: "16:00:00" },
    "16:00 - 17:00 (Chiều)": { start: "16:00:00", end: "17:00:00" },
    "19:30 - 20:30 (Tối)": { start: "19:30:00", end: "20:30:00" },
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { name, email, phone, date, timeBlock, message } = body

        if (!name || !email || !date || !timeBlock) {
            return NextResponse.json(
                { error: "Vui lòng nhập đầy đủ các trường bắt buộc." },
                { status: 400 }
            )
        }

        const adminEmail = process.env.ADMIN_EMAIL || "ngocvcsc@gmail.com"
        const resendApiKey = process.env.RESEND_API_KEY
        const clientId = process.env.GOOGLE_CLIENT_ID
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET
        const refreshToken = process.env.GOOGLE_REFRESH_TOKEN

        if (!resendApiKey || !clientId || !clientSecret || !refreshToken) {
            console.error("Missing credentials in environment variables.")
            return NextResponse.json(
                { error: "Hệ thống chưa được cấu hình đầy đủ thông tin xác thực." },
                { status: 500 }
            )
        }

        // 1. Authenticate Google Calendar API
        const oauth2Client = new google.auth.OAuth2(clientId, clientSecret)
        oauth2Client.setCredentials({ refresh_token: refreshToken })
        const calendar = google.calendar({ version: "v3", auth: oauth2Client })

        // Parse date-time using Vietnam offset (+07:00)
        const block = timeBlockMap[timeBlock] || { start: "09:00:00", end: "10:00:00" }
        const startDateTime = `${date}T${block.start}+07:00`
        const endDateTime = `${date}T${block.end}+07:00`

        // 2. Create Calendar Event with Google Meet conference data
        const eventResource = {
            summary: `[Athena Stock] Đặt lịch hẹn - ${name}`,
            description: `Yêu cầu trao đổi từ độc giả website:
- Họ tên: ${name}
- Email: ${email}
- Số điện thoại: ${phone || "Chưa cung cấp"}
- Lời nhắn: ${message || "Không có lời nhắn"}`,
            status: "tentative", // Tentative indicates it's unconfirmed
            start: {
                dateTime: startDateTime,
                timeZone: "Asia/Ho_Chi_Minh",
            },
            end: {
                dateTime: endDateTime,
                timeZone: "Asia/Ho_Chi_Minh",
            },
            conferenceData: {
                createRequest: {
                    requestId: `athena-booking-${Date.now()}`,
                    conferenceSolutionKey: {
                        type: "hangoutsMeet",
                    },
                },
            },
            attendees: [{ email }],
        }

        const eventResponse = await calendar.events.insert({
            calendarId: "primary",
            requestBody: eventResource,
            conferenceDataVersion: 1,
        })

        const hangoutLink = eventResponse.data.hangoutLink

        if (!hangoutLink) {
            throw new Error("Không thể khởi tạo link Google Meet từ API.")
        }

        // 3. Generate dynamic URLs for Admin actions
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        const token = process.env.BOOKING_SECRET || "athena_secret_2026"
        const approveUrl = `${baseUrl}/api/booking/confirm?id=${eventResponse.data.id}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&date=${date}&timeBlock=${encodeURIComponent(timeBlock)}&meet=${encodeURIComponent(hangoutLink)}&token=${token}`
        const rescheduleUrl = `${baseUrl}/booking/reschedule?id=${eventResponse.data.id}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&date=${date}&timeBlock=${encodeURIComponent(timeBlock)}&token=${token}`

        // 4. Send email notification to Admin using Resend
        const resend = new Resend(resendApiKey)
        const systemSender = process.env.SENDER_EMAIL || "Athena Stock <contact@athenastock.com>"

        await resend.emails.send({
            from: systemSender.includes("onboarding@resend.dev") ? "Athena Stock <onboarding@resend.dev>" : systemSender,
            to: adminEmail,
            subject: `[Athena Stock] Yêu cầu lịch hẹn mới từ ${name}`,
            html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px; background-color: #fafafa;">
                <h2 style="color: #9c1850; font-family: serif; border-bottom: 2px solid #9c1850; padding-bottom: 10px;">Yêu cầu đặt lịch hẹn mới</h2>
                <p style="font-size: 14px; color: #444;">Bạn nhận được yêu cầu hẹn trao đổi (miễn phí) từ độc giả trên website <strong>Athena Stock</strong>:</p>
                
                <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 15px;">
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; width: 140px; color: #555;">Họ và tên:</td>
                        <td style="padding: 8px 0; color: #111;">${name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #555;">Địa chỉ Email:</td>
                        <td style="padding: 8px 0; color: #111;"><a href="mailto:${email}">${email}</a></td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #555;">Số điện thoại:</td>
                        <td style="padding: 8px 0; color: #111;">${phone || "Chưa cung cấp"}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #555;">Thời gian yêu cầu:</td>
                        <td style="padding: 8px 0; color: #9c1850; font-weight: bold;">Khung ${timeBlock} ngày ${new Date(date).toLocaleDateString("vi-VN")}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; vertical-align: top; color: #555;">Lời nhắn khách hàng:</td>
                        <td style="padding: 8px 0; color: #111; font-style: italic; white-space: pre-line;">"${message || "Không có lời nhắn"}"</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #555;">Link Meet tạm thời:</td>
                        <td style="padding: 8px 0; color: #111;"><a href="${hangoutLink}" target="_blank" style="color: #e61c5c; font-weight: bold;">${hangoutLink}</a></td>
                    </tr>
                </table>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                    <p style="font-size: 13px; color: #666; margin-bottom: 20px;">Nhấp vào các nút hành động nhanh bên dưới để phản hồi email tự động cho khách hàng:</p>
                    
                    <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                        <a href="${approveUrl}" style="display: inline-block; padding: 12px 24px; border-radius: 30px; background-color: #9c1850; color: white; text-decoration: none; font-weight: bold; font-size: 13px; margin: 5px;">
                            Phê duyệt & Gửi xác nhận cho khách
                        </a>
                        <a href="${rescheduleUrl}" style="display: inline-block; padding: 12px 24px; border-radius: 30px; background-color: #555; color: white; text-decoration: none; font-weight: bold; font-size: 13px; margin: 5px;">
                            Bận & Đề xuất đổi lịch
                        </a>
                    </div>
                </div>
            </div>
            `,
        })

        return NextResponse.json({ success: true, hangoutLink })
    } catch (error) {
        console.error("API Booking Error: ", error)
        const errorMessage = error instanceof Error ? error.message : "Đã xảy ra lỗi hệ thống khi đặt lịch."
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        )
    }
}
