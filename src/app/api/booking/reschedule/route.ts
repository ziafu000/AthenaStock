import { NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"
import { Resend } from "resend"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { id, name, email, originalDate, originalTimeBlock, token, suggestions } = body

        if (!id || !name || !email || !originalDate || !originalTimeBlock || !token || !suggestions || !Array.isArray(suggestions)) {
            return NextResponse.json(
                { error: "Vui lòng nhập đầy đủ các trường bắt buộc và danh sách đề xuất." },
                { status: 400 }
            )
        }

        const expectedToken = process.env.BOOKING_SECRET || "athena_secret_2026"
        if (token !== expectedToken) {
            return NextResponse.json(
                { error: "Mã token xác thực không chính xác hoặc đã hết hạn." },
                { status: 403 }
            )
        }

        const clientId = process.env.GOOGLE_CLIENT_ID
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET
        const refreshToken = process.env.GOOGLE_REFRESH_TOKEN
        const resendApiKey = process.env.RESEND_API_KEY
        const senderEmail = process.env.SENDER_EMAIL || "Athena Stock <contact@athenastock.com>"

        // 1. Delete Calendar Event to free up the slot
        const oauth2Client = new google.auth.OAuth2(clientId, clientSecret)
        oauth2Client.setCredentials({ refresh_token: refreshToken })
        const calendar = google.calendar({ version: "v3", auth: oauth2Client })

        await calendar.events.delete({
            calendarId: "primary",
            eventId: id,
        })

        // 2. Format suggestion list HTML
        const suggestionsHtml = suggestions.map((s: { date: string; timeBlock: string }, idx: number) => {
            const formattedDate = new Date(s.date).toLocaleDateString("vi-VN", {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
            return `
            <tr>
                <td style="padding: 10px 0; font-weight: bold; width: 110px; color: #555; vertical-align: top; border-bottom: 1px solid #eee;">Đề xuất ${idx + 1}:</td>
                <td style="padding: 10px 0; color: #111; border-bottom: 1px solid #eee;">
                    <span style="color: #9c1850; font-weight: bold; font-size: 15px;">${s.timeBlock}</span><br />
                    <span style="font-size: 12.5px; color: #666; display: inline-block; margin-top: 2px;">${formattedDate}</span>
                </td>
            </tr>
            `
        }).join('')

        // 3. Send HTML Reschedule Email to Client with suggested slots
        const resend = new Resend(resendApiKey)
        let resendWarning = ""

        try {
            await resend.emails.send({
                from: senderEmail,
                to: email,
                subject: "Đề xuất thay đổi lịch hẹn cùng Athena Stock",
                html: `
                <div style="background-color: #fafafa; padding: 40px 20px; font-family: sans-serif; min-height: 100%;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eee; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <h1 style="color: #9c1850; font-family: serif; margin: 0; font-size: 28px; font-weight: normal; letter-spacing: 1px;">Athena Stock</h1>
                            <p style="font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 2px; margin: 5px 0 0 0; font-weight: bold;">Đầu tư tỉnh thức</p>
                        </div>
                        
                        <hr style="border: 0; border-top: 2px solid #9c1850; margin-top: 10px; margin-bottom: 25px;" />
                        
                        <h3 style="font-size: 18px; color: #111; margin-bottom: 15px; font-family: serif; font-weight: normal;">Chào ${name},</h3>
                        
                        <p style="font-size: 14px; line-height: 1.6; color: #444; margin-bottom: 20px;">
                            Cảm ơn bạn đã quan tâm và đăng ký đặt lịch hẹn trao đổi với Athena Stock.
                        </p>
                        
                        <p style="font-size: 14px; line-height: 1.6; color: #444; margin-bottom: 20px;">
                            Rất tiếc, do có lịch bận đột xuất phát sinh vào khung giờ <strong>${originalTimeBlock}</strong> ngày <strong>${new Date(originalDate).toLocaleDateString("vi-VN", { year: 'numeric', month: 'long', day: 'numeric' })}</strong> mà bạn đã chọn, chúng tôi chưa thể thực hiện cuộc gặp này.
                        </p>

                        <div style="background-color: #fcfcfc; border: 1px solid #eee; border-left: 4px solid #9c1850; padding: 20px; border-radius: 4px 12px 12px 4px; margin: 25px 0;">
                            <h4 style="margin: 0 0 15px 0; color: #9c1850; font-size: 15px; font-family: serif;">Các khung giờ đề xuất thay thế:</h4>
                            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                                ${suggestionsHtml}
                            </table>
                        </div>
                        
                        <p style="font-size: 14px; line-height: 1.6; color: #333; margin-top: 20px;">
                            Bạn vui lòng <strong>liên hệ Zalo (<a href="https://zalo.me/0799989079" style="color: #9c1850; font-weight: bold; text-decoration: underline;">0799989079</a>) để chốt</strong> khung giờ phù hợp nhất với bạn trong các đề xuất trên. Chúng tôi sẽ ghi nhận và gửi lại link phòng họp Google Meet chính thức ngay sau đó.
                        </p>

                        <p style="font-size: 13px; line-height: 1.6; color: #666; font-style: italic; text-align: center; margin-top: 25px;">
                            Rất mong bạn thông cảm cho sự bất tiện ngoài ý muốn này. Athena Stock hẹn gặp lại bạn!
                        </p>
                        
                        <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px; margin-bottom: 20px;" />
                        
                        <div style="text-align: center; font-size: 11px; color: #888;">
                            <p style="margin: 0 0 5px 0;">Email này được gửi tự động từ hệ thống đặt lịch của Athena Stock.</p>
                            <p style="margin: 0;">© ${new Date().getFullYear()} Athena Stock. All rights reserved.</p>
                        </div>
                    </div>
                </div>
                `,
            })
        } catch (resendErr) {
            console.error("Resend reschedule delivery failed:", resendErr)
            const errorMsg = resendErr instanceof Error ? resendErr.message : String(resendErr)
            resendWarning = errorMsg || "Lỗi cấu hình tên miền hoặc giới hạn tài khoản thử nghiệm (Sandbox)."
        }

        return NextResponse.json({ success: true, warning: resendWarning })
    } catch (error) {
        console.error("API Booking Reschedule Error: ", error)
        const errorMsg = error instanceof Error ? error.message : String(error)
        return NextResponse.json(
            { error: errorMsg },
            { status: 500 }
        )
    }
}
