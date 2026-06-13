import { NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"
import { Resend } from "resend"

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")
        const name = searchParams.get("name")
        const email = searchParams.get("email")
        const date = searchParams.get("date")
        const timeBlock = searchParams.get("timeBlock")
        const meet = searchParams.get("meet")
        const token = searchParams.get("token")

        if (!id || !name || !email || !date || !timeBlock || !meet || !token) {
            return new NextResponse(
                `<html>
                    <body style="font-family: sans-serif; text-align: center; padding: 50px; background-color: #090d16; color: white;">
                        <h2 style="color: #e61c5c;">Yêu cầu không hợp lệ</h2>
                        <p style="color: #a0a5b5;">Thiếu thông tin phê duyệt lịch hẹn.</p>
                    </body>
                </html>`,
                { headers: { "Content-Type": "text/html; charset=utf-8" }, status: 400 }
            )
        }

        const expectedToken = process.env.BOOKING_SECRET || "athena_secret_2026"
        if (token !== expectedToken) {
            return new NextResponse(
                `<html>
                    <body style="font-family: sans-serif; text-align: center; padding: 50px; background-color: #090d16; color: white;">
                        <h2 style="color: #e61c5c;">Xác thực thất bại</h2>
                        <p style="color: #a0a5b5;">Mã token phê duyệt không chính xác hoặc đã hết hạn.</p>
                    </body>
                </html>`,
                { headers: { "Content-Type": "text/html; charset=utf-8" }, status: 403 }
            )
        }

        const clientId = process.env.GOOGLE_CLIENT_ID
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET
        const refreshToken = process.env.GOOGLE_REFRESH_TOKEN
        const resendApiKey = process.env.RESEND_API_KEY
        const senderEmail = process.env.SENDER_EMAIL || "Athena Stock <contact@athenastock.com>"

        // 1. Update Calendar Event Status to Confirmed
        const oauth2Client = new google.auth.OAuth2(clientId, clientSecret)
        oauth2Client.setCredentials({ refresh_token: refreshToken })
        const calendar = google.calendar({ version: "v3", auth: oauth2Client })

        await calendar.events.patch({
            calendarId: "primary",
            eventId: id,
            requestBody: {
                status: "confirmed",
            },
        })

        // 2. Send HTML Confirmation Email to Client
        const resend = new Resend(resendApiKey)
        let emailSentStatus = "success"
        let resendWarning = ""

        const formattedDate = new Date(date).toLocaleDateString("vi-VN", {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })

        try {
            await resend.emails.send({
                from: senderEmail,
                to: email,
                subject: "Xác nhận lịch hẹn trao đổi cùng Athena Stock",
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
                            Yêu cầu đặt lịch hẹn trao đổi của bạn đã được <strong>phê duyệt và xác nhận thành công</strong>. Chúng tôi rất mong chờ buổi gặp gỡ để cùng thảo luận và chia sẻ tư duy đầu tư dài hạn với bạn.
                        </p>
                        
                        <div style="background-color: #fcfcfc; border: 1px solid #eee; border-left: 4px solid #9c1850; padding: 20px; border-radius: 4px 12px 12px 4px; margin: 25px 0;">
                            <h4 style="margin: 0 0 15px 0; color: #9c1850; font-size: 15px; font-family: serif;">Thông tin cuộc họp chi tiết:</h4>
                            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold; width: 130px; color: #555;">Họ và tên:</td>
                                    <td style="padding: 8px 0; color: #111;">${name}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Thời gian:</td>
                                    <td style="padding: 8px 0; color: #9c1850; font-weight: bold;">${timeBlock}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Ngày hẹn:</td>
                                    <td style="padding: 8px 0; color: #111;">${formattedDate}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Hình thức:</td>
                                    <td style="padding: 8px 0; color: #111;">Họp trực tuyến qua Google Meet</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold; color: #555; vertical-align: top;">Phòng họp:</td>
                                    <td style="padding: 8px 0; color: #111;"><a href="${meet}" style="color: #e61c5c; font-weight: bold; text-decoration: underline;">${meet}</a></td>
                                </tr>
                            </table>
                        </div>
                        
                        <div style="margin-top: 30px; text-align: center; margin-bottom: 25px;">
                            <a href="${meet}" target="_blank" style="display: inline-block; padding: 12px 28px; border-radius: 30px; background-color: #9c1850; color: #ffffff !important; text-decoration: none; font-weight: bold; font-size: 13px; box-shadow: 0 4px 10px rgba(156, 24, 80, 0.2);">
                                Tham gia Google Meet
                            </a>
                        </div>
                        
                        <p style="font-size: 13px; line-height: 1.6; color: #666; font-style: italic; text-align: center;">
                            Bạn vui lòng nhấp vào nút trên hoặc sử dụng đường dẫn Google Meet đúng giờ để tham gia buổi trao đổi trực tuyến. Nếu có bất kỳ thay đổi nào về lịch trình, xin vui lòng phản hồi lại email này.
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
            console.error("Resend delivery failed inside confirmation route:", resendErr)
            emailSentStatus = "failed"
            const errorMsg = resendErr instanceof Error ? resendErr.message : String(resendErr)
            resendWarning = errorMsg || "Lỗi cấu hình tên miền hoặc giới hạn tài khoản thử nghiệm (Sandbox)."
        }

        // 3. Render HTML success status page back to Admin browser
        const isSandboxWarning = emailSentStatus === "failed" || senderEmail.includes("onboarding@resend.dev")

        return new NextResponse(
            `<html>
                <body style="font-family: sans-serif; text-align: center; padding: 50px; background-color: #090d16; color: white;">
                    <div style="display: inline-block; width: 80px; height: 80px; line-height: 85px; border-radius: 50%; background-color: rgba(16, 185, 129, 0.1); color: #10b981; font-size: 40px; font-weight: bold; margin-bottom: 25px; border: 2px solid rgba(16, 185, 129, 0.2);">✓</div>
                    <h2 style="font-family: serif; font-size: 28px; margin: 0 0 10px 0;">Phê duyệt thành công!</h2>
                    <p style="color: #a0a5b5; max-w-md mx-auto; font-size: 15px; line-height: 1.6; margin-bottom: 30px;">
                        Lịch hẹn trao đổi với <strong>${name}</strong> vào ngày <strong>${new Date(date).toLocaleDateString("vi-VN")}</strong> (${timeBlock}) đã được cập nhật thành công trên Google Calendar.
                    </p>
                    
                    ${isSandboxWarning ? `
                    <div style="max-width: 480px; margin: 0 auto; background-color: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 12px; padding: 15px; text-align: left; margin-bottom: 30px;">
                        <h4 style="color: #f59e0b; margin: 0 0 8px 0; font-size: 14px;">⚠️ Lưu ý về gửi Email phản hồi</h4>
                        <p style="color: #d1d5db; font-size: 12px; line-height: 1.6; margin: 0;">
                            Lịch hẹn trên Google Calendar đã được cập nhật thành công, tuy nhiên email phản hồi HTML chưa thể gửi trực tiếp tới email khách hàng (<strong>${email}</strong>) do Resend đang ở chế độ thử nghiệm (Sandbox).
                        </p>
                        ${resendWarning ? `
                        <p style="color: #f59e0b; font-size: 11px; line-height: 1.6; margin: 8px 0; font-family: monospace; background: rgba(0,0,0,0.2); padding: 8px; border-radius: 6px; word-break: break-all;">
                            <strong>Chi tiết lỗi Resend:</strong> ${resendWarning}
                        </p>
                        ` : ''}
                        <p style="color: #a1a1aa; font-size: 11px; line-height: 1.6; margin-top: 8px; margin-bottom: 0;">
                            <strong>Giải pháp test:</strong> Hãy verify tên miền của bạn trên Resend hoặc đổi cấu hình gửi/nhận trùng với email đăng ký Resend để hoàn tất kiểm thử gửi email.
                        </p>
                    </div>
                    ` : `
                    <p style="color: #10b981; font-size: 13px; font-weight: bold;">✓ Email xác nhận HTML đẹp mắt đã được gửi tự động tới khách hàng từ địa chỉ ${senderEmail}!</p>
                    `}
                    
                    <div style="margin-top: 30px;">
                        <a href="https://calendar.google.com" target="_blank" style="display: inline-block; padding: 10px 24px; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.1); color: #fff; text-decoration: none; font-size: 13px; font-weight: bold; background-color: rgba(255,255,255,0.02); transition: all 0.3s;">
                            Mở Google Calendar
                        </a>
                    </div>
                </body>
            </html>`,
            { headers: { "Content-Type": "text/html; charset=utf-8" }, status: 200 }
        )
    } catch (error) {
        console.error("API Booking Confirm Error: ", error)
        const errorMsg = error instanceof Error ? error.message : String(error)
        return new NextResponse(
            `<html>
                <body style="font-family: sans-serif; text-align: center; padding: 50px; background-color: #090d16; color: white;">
                    <h2 style="color: #e61c5c;">Lỗi hệ thống</h2>
                    <p style="color: #a0a5b5; font-size: 14px;">Đã xảy ra lỗi khi xác nhận cuộc hẹn trên Google Calendar.</p>
                    <p style="color: #71717a; font-size: 12px; margin-top: 10px;">Chi tiết lỗi: ${errorMsg}</p>
                </body>
            </html>`,
            { headers: { "Content-Type": "text/html; charset=utf-8" }, status: 500 }
        )
    }
}
