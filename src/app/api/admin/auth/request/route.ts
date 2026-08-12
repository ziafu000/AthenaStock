import { after, NextRequest, NextResponse } from "next/server"
import { requestAdminLogin } from "@/lib/booking/admin-auth"
import { getAdminEmail } from "@/lib/booking/email"
import { processEmailQueue } from "@/lib/booking/email-worker"
import { assertRateLimit, getClientAddress, RateLimitError } from "@/lib/booking/rate-limit"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
    try {
        await assertRateLimit("admin-login-ip", getClientAddress(request), 5, 15 * 60)
        const body = await request.json() as Record<string, unknown>
        const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
        const adminEmail = getAdminEmail()
        const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin).replace(/\/$/, "")
        const queued = email ? await requestAdminLogin(email, baseUrl, adminEmail) : false
        if (queued) after(() => processEmailQueue(2))

        return NextResponse.json({
            success: true,
            message: "Nếu email hợp lệ, liên kết đăng nhập sẽ được gửi trong ít phút.",
        })
    } catch (error) {
        console.error("Admin login request failed:", error)
        if (error instanceof RateLimitError) {
            return NextResponse.json(
                { error: error.message },
                { status: 429, headers: { "Retry-After": String(error.retryAfterSeconds) } },
            )
        }
        return NextResponse.json({ error: "Không thể gửi liên kết đăng nhập." }, { status: 503 })
    }
}
