import { NextRequest, NextResponse } from "next/server"
import { escapeHtml } from "@/lib/booking/html"
import { assertRateLimit, getClientAddress, RateLimitError } from "@/lib/booking/rate-limit"
import { InvalidUnsubscribeTokenError, previewUnsubscribe, unsubscribe } from "@/lib/subscriptions"

export const runtime = "nodejs"

function page(content: string, status = 200) {
    return new NextResponse(
        `<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Hủy đăng ký | Athena Stock</title><body style="font-family:system-ui;max-width:600px;margin:60px auto;padding:24px;color:#222">${content}</body></html>`,
        { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } },
    )
}

export async function GET(request: NextRequest) {
    try {
        const token = request.nextUrl.searchParams.get("token")
        const { email } = await previewUnsubscribe(token)
        return page(`<h1>Hủy đăng ký nhận bài viết</h1><p>Email: <strong>${escapeHtml(email)}</strong></p><form method="post"><input type="hidden" name="token" value="${escapeHtml(token)}"><button type="submit" style="padding:10px 18px">Xác nhận hủy đăng ký</button></form>`)
    } catch (error) {
        if (error instanceof InvalidUnsubscribeTokenError) return page(`<h1>Liên kết không hợp lệ</h1><p>${escapeHtml(error.message)}</p>`, 403)
        console.error("Unsubscribe preview failed:", error)
        return page("<h1>Hệ thống đang tạm thời gián đoạn</h1><p>Vui lòng thử lại sau.</p>", 503)
    }
}

export async function POST(request: NextRequest) {
    try {
        await assertRateLimit("unsubscribe-ip", getClientAddress(request), 10, 15 * 60)
        const contentType = request.headers.get("content-type") || ""
        const token = contentType.includes("application/json")
            ? (await request.json() as Record<string, unknown>).token
            : (await request.formData()).get("token")
        await unsubscribe(token)
        if (contentType.includes("application/json")) return NextResponse.json({ success: true })
        return page("<h1>Đã hủy đăng ký</h1><p>Bạn sẽ không còn nhận email bài viết mới từ Athena Stock.</p>")
    } catch (error) {
        if (error instanceof InvalidUnsubscribeTokenError) {
            return NextResponse.json({ error: error.message }, { status: 403 })
        }
        if (error instanceof RateLimitError) {
            return NextResponse.json({ error: error.message }, { status: 429, headers: { "Retry-After": String(error.retryAfterSeconds) } })
        }
        console.error("Unsubscribe failed:", error)
        return NextResponse.json({ error: "Hệ thống đang tạm thời gián đoạn." }, { status: 503 })
    }
}
