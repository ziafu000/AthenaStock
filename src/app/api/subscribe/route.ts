import { after, NextRequest, NextResponse } from "next/server"
import { getEmailConfig } from "@/lib/booking/email"
import { processEmailQueue } from "@/lib/booking/email-worker"
import { asHttpUrl } from "@/lib/booking/html"
import { assertRateLimit, getClientAddress, RateLimitError } from "@/lib/booking/rate-limit"
import { parseSubscriptionEmail, registerSubscription, SubscriptionValidationError } from "@/lib/subscriptions"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as Record<string, unknown>
        const email = parseSubscriptionEmail(body.email)
        const address = getClientAddress(request)
        await assertRateLimit("subscribe-ip", address, 8, 15 * 60)
        await assertRateLimit("subscribe-email", email, 3, 24 * 60 * 60)

        const { adminEmail } = getEmailConfig()
        const baseUrl = asHttpUrl(process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin)
        if (!baseUrl) throw new Error("NEXT_PUBLIC_APP_URL không hợp lệ.")

        const result = await registerSubscription(email, baseUrl.replace(/\/$/, ""), adminEmail)
        after(() => processEmailQueue(5))
        return NextResponse.json(
            { success: true, duplicate: !result.created },
            { status: result.created ? 201 : 200 },
        )
    } catch (error) {
        console.error("Subscription request failed:", error)
        if (error instanceof SubscriptionValidationError) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }
        if (error instanceof RateLimitError) {
            return NextResponse.json(
                { error: error.message },
                { status: 429, headers: { "Retry-After": String(error.retryAfterSeconds) } },
            )
        }
        return NextResponse.json(
            { error: "Hệ thống đăng ký đang tạm thời gián đoạn. Vui lòng thử lại sau." },
            { status: 503 },
        )
    }
}
