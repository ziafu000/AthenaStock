import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { email } = body

        if (!email) {
            return NextResponse.json(
                { error: "Vui lòng cung cấp địa chỉ email." },
                { status: 400 }
            )
        }

        const resendApiKey = process.env.RESEND_API_KEY
        const adminEmail = process.env.ADMIN_EMAIL || "ngocvcsc@gmail.com"
        const systemSender = process.env.SENDER_EMAIL || "Athena Stock <contact@athenastock.com>"

        if (!resendApiKey) {
            console.error("Missing Resend API Key in environment variables.")
            return NextResponse.json(
                { error: "Hệ thống gửi thư chưa được cấu hình." },
                { status: 500 }
            )
        }

        const resend = new Resend(resendApiKey)
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        
        // 1. Send Welcome Email to Subscriber
        await resend.emails.send({
            from: systemSender.includes("onboarding@resend.dev") ? "Athena Stock <onboarding@resend.dev>" : systemSender,
            to: email,
            subject: "Chào mừng bạn đăng ký nhận bài viết mới tại Athena Stock",
            html: `
            <div style="background-color: #fafafa; padding: 40px 20px; font-family: sans-serif; min-height: 100%;">
                <div style="max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eee; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #9c1850; font-family: serif; margin: 0; font-size: 28px; font-weight: normal; letter-spacing: 1px;">Athena Stock</h1>
                        <p style="font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 2px; margin: 5px 0 0 0; font-weight: bold;">Đầu tư tỉnh thức</p>
                    </div>
                    
                    <hr style="border: 0; border-top: 2px solid #9c1850; margin-top: 10px; margin-bottom: 25px;" />
                    
                    <h3 style="font-size: 18px; color: #111; margin-bottom: 15px; font-family: serif; font-weight: normal;">Chào bạn,</h3>
                    
                    <p style="font-size: 14px; line-height: 1.6; color: #444; margin-bottom: 20px;">
                        Cảm ơn bạn đã đăng ký nhận các bài viết mới từ <strong>Athena Stock</strong>. Chúng tôi rất vui mừng khi được đồng hành cùng bạn trên hành trình xây dựng tư duy đầu tư giá trị và kiểm soát tâm lý học hành vi dài hạn.
                    </p>
                    
                    <div style="background-color: #fcfcfc; border: 1px solid #eee; border-left: 4px solid #9c1850; padding: 20px; border-radius: 4px 12px 12px 4px; margin: 25px 0;">
                        <h4 style="margin: 0 0 10px 0; color: #9c1850; font-size: 15px; font-family: serif;">Quyền lợi đăng ký của bạn:</h4>
                        <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #555; line-height: 1.6;">
                            <li style="margin-bottom: 8px;">Nhận thông báo sớm nhất mỗi khi có bài phân tích doanh nghiệp mới.</li>
                            <li style="margin-bottom: 8px;">Cập nhật các bộ khung (frameworks) định giá và checklist đầu tư chuyên sâu.</li>
                            <li style="margin-bottom: 8px;">Chia sẻ kiến thức về tâm lý tài chính giúp kiểm soát FUD và FOMO.</li>
                        </ul>
                    </div>
                    
                    <p style="font-size: 14px; line-height: 1.6; color: #444; margin-bottom: 25px;">
                        Chúng tôi cam kết không gửi thư rác và bảo mật tuyệt đối địa chỉ email của bạn. Mọi bài viết gửi đi đều được chắt lọc kỹ lưỡng để mang lại giá trị thực sự cho hành trình đầu tư của bạn.
                    </p>
                    
                    <div style="margin-top: 30px; text-align: center; margin-bottom: 25px;">
                        <a href="${baseUrl}" target="_blank" style="display: inline-block; padding: 12px 28px; border-radius: 30px; background-color: #9c1850; color: #ffffff !important; text-decoration: none; font-weight: bold; font-size: 13px; box-shadow: 0 4px 10px rgba(156, 24, 80, 0.2);">
                            Ghé thăm Website
                        </a>
                    </div>
                    
                    <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px; margin-bottom: 20px;" />
                    
                    <div style="text-align: center; font-size: 11px; color: #888;">
                        <p style="margin: 0 0 5px 0;">Email này được gửi tự động từ hệ thống bản tin của Athena Stock.</p>
                        <p style="margin: 0;">© ${new Date().getFullYear()} Athena Stock. All rights reserved.</p>
                    </div>
                </div>
            </div>
            `,
        })

        // 2. Send Notification Email to Admin
        try {
            await resend.emails.send({
                from: systemSender.includes("onboarding@resend.dev") ? "Athena Stock <onboarding@resend.dev>" : systemSender,
                to: adminEmail,
                subject: `[Athena Stock] Có độc giả mới đăng ký nhận bài viết!`,
                html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px; background-color: #fafafa;">
                    <h2 style="color: #9c1850; font-family: serif; border-bottom: 2px solid #9c1850; padding-bottom: 10px;">Đăng ký bản tin mới</h2>
                    <p style="font-size: 14px; color: #444;">Hệ thống vừa ghi nhận một độc giả mới đăng ký nhận bài viết trên website <strong>Athena Stock</strong>:</p>
                    
                    <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 15px;">
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; width: 140px; color: #555;">Địa chỉ Email:</td>
                            <td style="padding: 8px 0; color: #111; font-weight: bold;"><a href="mailto:${email}">${email}</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; color: #555;">Thời gian đăng ký:</td>
                            <td style="padding: 8px 0; color: #111;">${new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })} (Giờ Việt Nam)</td>
                        </tr>
                    </table>
                </div>
                `,
            })
        } catch (adminErr) {
            console.error("Failed to send subscription alert to admin:", adminErr)
            // Do not fail the request if only admin alert fails
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("API Subscribe Error: ", error)
        const errorMessage = error instanceof Error ? error.message : "Đã xảy ra lỗi khi đăng ký email."
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        )
    }
}
